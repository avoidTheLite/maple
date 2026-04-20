import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger } from '@maple/util';
import { createAnthropicLlmClient } from './llm/anthropicAdapter.ts';
import type { GenerateDeps, LlmCacheMode } from '../types.ts';

const logger = createLogger({ module: 'maple/api:generateDeps' });

const __dirname = dirname(fileURLToPath(import.meta.url));
/** Package root `apps/api` (this file lives in `src/generate/`). */
const apiRoot = join(__dirname, '..', '..');

function parseCacheMode(raw: string | undefined, nodeEnv: string | undefined): LlmCacheMode {
  const fallback = nodeEnv === 'production' ? 'off' : 'readwrite';
  const v = (raw ?? fallback).toLowerCase();
  if (v === 'off') return 'off';
  if (v === 'read') return 'read';
  return 'readwrite';
}

export function createGenerateDeps(): GenerateDeps {
  const cacheMode = parseCacheMode(process.env.MAPLE_LLM_CACHE, process.env.NODE_ENV);
  const defaultCacheDir = join(apiRoot, '.llm-cache');
  const cacheDir =
    cacheMode === 'off' ? null : (process.env.MAPLE_LLM_CACHE_DIR ?? defaultCacheDir);
  const songsDir = process.env.MAPLE_SONGS_DIR ?? join(apiRoot, 'songs');
  const layoutsDir = process.env.MAPLE_LAYOUTS_DIR ?? join(apiRoot, 'layouts');
  const model = process.env.MAPLE_LLM_MODEL ?? 'claude-opus-4-6';
  const maxTokens = Number(process.env.MAPLE_LLM_MAX_TOKENS ?? 8096) || 8096;

  return {
    llm: createAnthropicLlmClient(),
    model,
    maxTokens,
    cacheMode,
    cacheDir,
    songsDir,
    layoutsDir,
  };
}

/** Single process-wide deps for HTTP routes (env read once per module load). */
export const mapleGenerateDeps = createGenerateDeps();

if (process.env.NODE_ENV !== 'production' && !process.env.VITEST) {
  logger.debug(
    { cacheMode: mapleGenerateDeps.cacheMode, cacheDir: mapleGenerateDeps.cacheDir ?? '(none)' },
    'LLM file cache config',
  );
}
