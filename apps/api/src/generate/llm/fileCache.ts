import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { LlmMessage } from './types.ts';

export type LlmCacheEnvelope = {
  promptFingerprint: string;
  promptVersion: string;
  model: string;
  message: LlmMessage;
};

export async function readLlmCacheFile(cacheDir: string, cacheKey: string): Promise<LlmMessage | null> {
  const path = join(cacheDir, `${cacheKey}.json`);
  try {
    const raw = await readFile(path, 'utf-8');
    const parsed = JSON.parse(raw) as LlmCacheEnvelope;
    return parsed.message ?? null;
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') return null;
    throw e;
  }
}

export async function writeLlmCacheFile(
  cacheDir: string,
  cacheKey: string,
  envelope: LlmCacheEnvelope
): Promise<string> {
  await mkdir(cacheDir, { recursive: true });
  const path = join(cacheDir, `${cacheKey}.json`);
  await writeFile(path, JSON.stringify(envelope, null, 2), 'utf-8');
  return path;
}
