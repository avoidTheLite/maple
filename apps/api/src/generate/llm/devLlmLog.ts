import type { LlmMessage } from './types.ts';

type LlmCacheModeLog = 'off' | 'read' | 'readwrite';

export function shouldLogLlmDev(): boolean {
  return process.env.NODE_ENV !== 'production' && !process.env.VITEST;
}

function shortKey(cacheKey: string): string {
  return cacheKey.slice(0, 8);
}

export function logLlmCacheHit(args: {
  title: string;
  artist: string;
  cacheKey: string;
  cacheMode: LlmCacheModeLog;
}): void {
  if (!shouldLogLlmDev()) return;
  console.log(
    `[maple/api] LLM cache HIT key=${shortKey(args.cacheKey)}… mode=${args.cacheMode} title=${JSON.stringify(args.title)} artist=${JSON.stringify(args.artist)}`
  );
}

export function logLlmCacheMiss(args: {
  title: string;
  artist: string;
  cacheKey: string;
  cacheMode: LlmCacheModeLog;
}): void {
  if (!shouldLogLlmDev()) return;
  console.log(
    `[maple/api] LLM cache MISS key=${shortKey(args.cacheKey)}… mode=${args.cacheMode} title=${JSON.stringify(args.title)} artist=${JSON.stringify(args.artist)}`
  );
}

/** Log token counts after a live Anthropic response (not used on cache hits). */
export function logLlmUsage(message: LlmMessage): void {
  if (!shouldLogLlmDev()) return;
  const u = message.usage;
  if (!u || typeof u !== 'object') {
    console.log('[maple/api] LLM usage: (no usage object on message)');
    return;
  }
  const rec = u as Record<string, unknown>;
  const parts: string[] = [];
  for (const k of Object.keys(rec)) {
    const v = rec[k];
    if (typeof v === 'number') {
      parts.push(`${k}=${v}`);
    }
  }
  if (parts.length === 0) {
    console.log('[maple/api] LLM usage:', JSON.stringify(u));
  } else {
    console.log(`[maple/api] LLM usage: ${parts.join(' ')}`);
  }
}
