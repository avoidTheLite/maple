/**
 * Record a real LLM response into the file cache (dev dir or committed goldens).
 *
 * Usage:
 *   pnpm --filter @maple/api exec tsx scripts/record-llm-fixture.ts "Title" "Artist"
 *   pnpm --filter @maple/api exec tsx scripts/record-llm-fixture.ts --golden "Title" "Artist"
 *
 * Requires ANTHROPIC_API_KEY. Sets MAPLE_LLM_CACHE=readwrite and cache dir unless already set.
 */
import '../src/loadEnv.ts';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGenerateDeps } from '../src/generate/createGenerateDeps.ts';
import { generateSheet } from '../src/generate/generateService.ts';
import { computeLlmCacheKey } from '../src/generate/llm/cacheKey.ts';
import { computePromptFingerprint } from '../src/generate/prompts/version.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, '..');

const argv = process.argv.slice(2);
const golden = argv.includes('--golden');
const pos = argv.filter(a => a !== '--golden');
const title = pos[0];
const artist = pos[1];

if (!title || !artist) {
  console.error('Usage: tsx scripts/record-llm-fixture.ts [--golden] "<title>" "<artist>"');
  process.exit(1);
}

if (golden) {
  process.env.MAPLE_LLM_CACHE = 'readwrite';
  process.env.MAPLE_LLM_CACHE_DIR = join(apiRoot, 'fixtures', 'llm');
}

if (!process.env.MAPLE_LLM_CACHE || process.env.MAPLE_LLM_CACHE === 'off') {
  process.env.MAPLE_LLM_CACHE = 'readwrite';
}
if (!process.env.MAPLE_LLM_CACHE_DIR) {
  process.env.MAPLE_LLM_CACHE_DIR = join(apiRoot, '.llm-cache');
}

const deps = createGenerateDeps();
const fp = computePromptFingerprint();
const cacheKey = computeLlmCacheKey(fp, deps.model, title, artist);

console.log('promptFingerprint:', fp);
console.log('cacheKey:', cacheKey);
console.log('cacheDir:', deps.cacheDir);

await generateSheet({ title, artist }, deps);
console.log('Recorded:', join(deps.cacheDir ?? '', `${cacheKey}.json`));
