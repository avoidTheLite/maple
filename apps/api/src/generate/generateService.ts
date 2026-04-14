import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { SongData } from '@maple/types';
import { createLogger } from '@maple/util';
import { SONG_DATA_TOOL } from './mapleSheetTool.ts';
import { buildGenerateUserMessage } from './prompts/userMessage.ts';
import { buildSystemPrompt } from './prompts/system.ts';
import { computePromptFingerprint, PROMPT_VERSION } from './prompts/version.ts';
import { computeLlmCacheKey } from './llm/cacheKey.ts';
import { logLlmCacheHit, logLlmCacheMiss, logLlmUsage } from './llm/devLlmLog.ts';
import { readLlmCacheFile, writeLlmCacheFile } from './llm/fileCache.ts';
import type { CreateMessageParams, GenerateDeps, LlmMessage } from '../types.ts';
import { LlmSongDataSchema, SongDataSchema } from './songDataSchema.ts';
import { resolveVoicings } from './chords/voicingResolver.ts';

const logger = createLogger({ module: 'maple/api:generateService' });

export type { GenerateDeps, LlmCacheMode } from '../types.ts';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function assertValidSongSlug(slug: string): void {
  if (!SLUG_RE.test(slug)) {
    throw new SheetLoadError('Invalid slug.', 'INVALID_SLUG');
  }
}

export class SheetLoadError extends Error {
  constructor(
    message: string,
    public readonly code: 'INVALID_SLUG' | 'NOT_FOUND' | 'INVALID_JSON' | 'VALIDATION',
  ) {
    super(message);
    this.name = 'SheetLoadError';
  }
}

export class LlmSheetError extends Error {
  constructor(
    message: string,
    public readonly code: 'NO_TOOL_USE' | 'VALIDATION' | 'UPSTREAM',
  ) {
    super(message);
    this.name = 'LlmSheetError';
  }
}

export function parseSongData(raw: unknown): SongData {
  const parsed = SongDataSchema.safeParse(raw);
  if (!parsed.success) {
    throw new SheetLoadError('Song data failed validation.', 'VALIDATION');
  }
  return parsed.data as SongData;
}

function extractSongDataFromMessage(message: LlmMessage): SongData {
  const toolUse = message.content.find((b) => b.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new LlmSheetError('Model did not return structured sheet data.', 'NO_TOOL_USE');
  }
  // Parse with the lenient LLM schema (chords.frets optional).
  const llmParsed = LlmSongDataSchema.safeParse(toolUse.input);
  if (!llmParsed.success) {
    throw new LlmSheetError('Model returned invalid sheet data.', 'VALIDATION');
  }
  // Resolve chord voicings: dictionary takes priority, LLM frets are the fallback.
  const enriched = {
    ...llmParsed.data,
    chords: resolveVoicings(llmParsed.data.chords),
  };
  // Final strict validation now that all chords have frets.
  try {
    return parseSongData(enriched);
  } catch (e) {
    if (e instanceof SheetLoadError && e.code === 'VALIDATION') {
      throw new LlmSheetError(e.message, 'VALIDATION');
    }
    throw e;
  }
}

function buildCreateMessageParams(
  title: string,
  artist: string,
  model: string,
  maxTokens: number,
): CreateMessageParams {
  return {
    model,
    max_tokens: maxTokens,
    system: buildSystemPrompt(),
    tools: [SONG_DATA_TOOL],
    tool_choice: { type: 'any' },
    messages: [
      {
        role: 'user',
        content: buildGenerateUserMessage(title, artist),
      },
    ],
  };
}

export async function generateSheet(
  { title, artist }: { title: string; artist: string },
  deps: GenerateDeps,
): Promise<SongData> {
  const promptFingerprint = computePromptFingerprint();
  const cacheKey = computeLlmCacheKey(promptFingerprint, deps.model, title, artist);

  let message: LlmMessage | null = null;
  if (deps.cacheMode !== 'off' && deps.cacheDir) {
    message = await readLlmCacheFile(deps.cacheDir, cacheKey);
  }

  if (message) {
    logLlmCacheHit({ title, artist, cacheKey, cacheMode: deps.cacheMode });
  }

  if (!message) {
    logLlmCacheMiss({ title, artist, cacheKey, cacheMode: deps.cacheMode });
    const params = buildCreateMessageParams(title, artist, deps.model, deps.maxTokens);
    try {
      message = await deps.llm.createMessage(params);
    } catch (e) {
      logger.error({ err: e }, 'LLM request failed');
      throw new LlmSheetError('Failed to generate sheet.', 'UPSTREAM');
    }

    logLlmUsage(message);

    if (deps.cacheMode === 'readwrite' && deps.cacheDir) {
      await writeLlmCacheFile(deps.cacheDir, cacheKey, {
        promptFingerprint,
        promptVersion: PROMPT_VERSION,
        model: deps.model,
        message,
      });
    }
  }

  return extractSongDataFromMessage(message);
}

export async function loadSheetFromRepo(
  slug: string,
  deps: Pick<GenerateDeps, 'songsDir'>,
): Promise<SongData> {
  assertValidSongSlug(slug);
  const path = join(deps.songsDir, `${slug}.json`);
  let rawText: string;
  try {
    rawText = await readFile(path, 'utf-8');
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      throw new SheetLoadError('Song not found.', 'NOT_FOUND');
    }
    throw e;
  }
  let json: unknown;
  try {
    json = JSON.parse(rawText) as unknown;
  } catch {
    throw new SheetLoadError('Invalid JSON.', 'INVALID_JSON');
  }
  try {
    return parseSongData(json);
  } catch (e) {
    if (e instanceof SheetLoadError) throw e;
    throw e;
  }
}
