import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { SheetLayoutConfig } from '@maple/types';
import { SheetLayoutConfigSchema } from './layoutSchema.ts';

const SONG_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TEMPLATE_ID_RE = /^[a-z0-9][a-z0-9_-]*$/i;

export class LayoutError extends Error {
  constructor(
    message: string,
    public readonly code: 'INVALID_SLUG' | 'INVALID_TEMPLATE' | 'NOT_FOUND' | 'INVALID_JSON' | 'VALIDATION',
  ) {
    super(message);
    this.name = 'LayoutError';
  }
}

export function assertValidLayoutSlug(slug: string): void {
  if (!SONG_SLUG_RE.test(slug)) {
    throw new LayoutError('Invalid song slug.', 'INVALID_SLUG');
  }
}

export function assertValidTemplateId(templateId: string): void {
  if (!TEMPLATE_ID_RE.test(templateId)) {
    throw new LayoutError('Invalid template id.', 'INVALID_TEMPLATE');
  }
}

export function parseLayoutConfig(raw: unknown): SheetLayoutConfig {
  const parsed = SheetLayoutConfigSchema.safeParse(raw);
  if (!parsed.success) {
    throw new LayoutError('Layout config failed validation.', 'VALIDATION');
  }
  return parsed.data;
}

function getLayoutPath(layoutsDir: string, songSlug: string, templateId: string): string {
  return join(layoutsDir, `${songSlug}__${templateId}.json`);
}

export async function loadLayoutConfig(
  layoutsDir: string,
  songSlug: string,
  templateId: string,
): Promise<SheetLayoutConfig> {
  assertValidLayoutSlug(songSlug);
  assertValidTemplateId(templateId);

  const path = getLayoutPath(layoutsDir, songSlug, templateId);
  let raw: string;
  try {
    raw = await readFile(path, 'utf-8');
  } catch (err) {
    const fsErr = err as NodeJS.ErrnoException;
    if (fsErr.code === 'ENOENT') {
      throw new LayoutError('Layout not found.', 'NOT_FOUND');
    }
    throw err;
  }

  let json: unknown;
  try {
    json = JSON.parse(raw) as unknown;
  } catch {
    throw new LayoutError('Layout file contains invalid JSON.', 'INVALID_JSON');
  }
  return parseLayoutConfig(json);
}

export async function saveLayoutConfig(
  layoutsDir: string,
  songSlug: string,
  templateId: string,
  layout: unknown,
): Promise<SheetLayoutConfig> {
  assertValidLayoutSlug(songSlug);
  assertValidTemplateId(templateId);

  const parsed = parseLayoutConfig(layout);
  if (parsed.songSlug !== songSlug) {
    throw new LayoutError('songSlug in payload must match route slug.', 'VALIDATION');
  }
  if (parsed.templateId !== templateId) {
    throw new LayoutError('templateId in payload must match template query.', 'VALIDATION');
  }

  const path = getLayoutPath(layoutsDir, songSlug, templateId);
  await mkdir(layoutsDir, { recursive: true });
  await writeFile(path, `${JSON.stringify(parsed, null, 2)}\n`, 'utf-8');
  return parsed;
}
