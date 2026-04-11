/**
 * Smoke-check: mock LLM + readwrite writes JSON; second request hits cache (no LLM).
 * Run: pnpm --filter @maple/api exec tsx scripts/verify-llm-cache-smoke.ts
 */
import '../src/loadEnv.ts';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createGenerateDeps } from '../src/generate/createGenerateDeps.ts';
import { generateSheet } from '../src/generate/generateService.ts';
import { computeLlmCacheKey } from '../src/generate/llm/cacheKey.ts';
import { computePromptFingerprint } from '../src/generate/prompts/version.ts';
import type { LlmMessage } from '../src/types.ts';

const toolInput = {
  title: 'Smoke',
  artist: 'Test',
  album: 'Al',
  year: '2000',
  key: 'C',
  tempo: '♩=120',
  timeSig: '4/4',
  tuning: 'Standard',
  capo: 'No capo',
  mode: 'Major',
  chords: [{ name: 'C', frets: [-1, 3, 2, 0, 1, 0] }],
  structureLines: ['I'],
  introRiff: {
    annotation: '× 1',
    chordLabels: [{ text: 'C', x: 52 }],
    barLines: [44, 738],
    doubleBarX: 740,
    cols: [{ x: 52, strings: ['', '', '', '', '', ''] }],
  },
  verseAnnotation: 'VERSE',
  verseAnnotationX: 92,
  verseRows: [{ chords: [{ name: 'C', x: 52 }], lyrics: [{ text: 'La', x: 52 }] }],
  chorusAnnotation: 'CHORUS',
  chorusAnnotationX: 100,
  chorusRows: [{ chords: [{ name: 'C', x: 52 }], lyrics: [{ text: 'Na', x: 52 }] }],
  harmonicCols: [{ title: 'I', chords: 'C', mode: 'Major', modeDetail: '', row5: '', row6: '' }],
};

function mockMessage(): LlmMessage {
  return {
    id: 'msg_smoke',
    type: 'message',
    role: 'assistant',
    model: 'claude-opus-4-6',
    stop_reason: 'tool_use',
    stop_sequence: null,
    usage: { input_tokens: 1, output_tokens: 1 },
    content: [
      {
        type: 'tool_use',
        id: 'tool_smoke',
        name: 'generate_maple_sheet',
        input: toolInput,
      },
    ],
  };
}

const dir = await mkdtemp(join(tmpdir(), 'maple-cache-smoke-'));
try {
  const fp = computePromptFingerprint();
  const model = 'claude-opus-4-6';
  const title = 'Smoke Title';
  const artist = 'Smoke Artist';
  const key = computeLlmCacheKey(fp, model, title, artist);

  let llmCalls = 0;
  const base = createGenerateDeps();
  const depsRw = {
    ...base,
    model,
    maxTokens: 8096,
    cacheMode: 'readwrite' as const,
    cacheDir: dir,
    llm: {
      createMessage: async () => {
        llmCalls += 1;
        return mockMessage();
      },
    },
  };

  const song1 = await generateSheet({ title, artist }, depsRw);
  if (song1.title !== 'Smoke') throw new Error('unexpected song1 title');
  if (llmCalls !== 1) throw new Error(`expected 1 LLM call, got ${llmCalls}`);

  const files = await readdir(dir);
  if (!files.includes(`${key}.json`)) {
    throw new Error(`missing cache file ${key}.json, got: ${files.join(', ')}`);
  }

  const depsRead = {
    ...depsRw,
    cacheMode: 'read' as const,
    llm: {
      createMessage: async () => {
        throw new Error('LLM must not run on cache hit');
      },
    },
  };

  const song2 = await generateSheet({ title, artist }, depsRead);
  if (song2.title !== 'Smoke') throw new Error('unexpected song2 title');
  if (llmCalls !== 1) throw new Error(`expected still 1 LLM call after hit, got ${llmCalls}`);

  console.log('verify-llm-cache-smoke: OK (write + hit)');
} finally {
  await rm(dir, { recursive: true, force: true });
}
