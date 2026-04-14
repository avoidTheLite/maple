import { createLogger } from '@maple/util';
import type { LlmMessage } from '../../types.ts';

const logger = createLogger({ module: 'maple/api:llm', level: 'debug' });

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
  logger.debug(
    { key: shortKey(args.cacheKey), mode: args.cacheMode, title: args.title, artist: args.artist },
    'LLM cache HIT',
  );
}

export function logLlmCacheMiss(args: {
  title: string;
  artist: string;
  cacheKey: string;
  cacheMode: LlmCacheModeLog;
}): void {
  if (!shouldLogLlmDev()) return;
  logger.debug(
    { key: shortKey(args.cacheKey), mode: args.cacheMode, title: args.title, artist: args.artist },
    'LLM cache MISS',
  );
}

/** Log token counts after a live Anthropic response (not used on cache hits). */
export function logLlmUsage(message: LlmMessage): void {
  if (!shouldLogLlmDev()) return;
  const u = message.usage;
  if (!u || typeof u !== 'object') {
    logger.debug('LLM usage: (no usage object on message)');
    return;
  }
  logger.debug({ usage: u }, 'LLM usage');
}
