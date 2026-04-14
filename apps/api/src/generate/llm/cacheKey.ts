import { createHash } from 'node:crypto';

/** Normalize title/artist for cache keys only: trim, collapse internal whitespace, lowercase. */
export function normalizeSongKeyPart(s: string): string {
  return s.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function computeLlmCacheKey(
  promptFingerprint: string,
  model: string,
  title: string,
  artist: string,
): string {
  const body = [
    promptFingerprint,
    model,
    normalizeSongKeyPart(title),
    normalizeSongKeyPart(artist),
  ].join('|');
  return createHash('sha256').update(body, 'utf8').digest('hex');
}
