import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from './app.ts';
import { createGenerateDeps } from './generate/createGenerateDeps.ts';
import type { GenerateDeps } from './generate/generateService.ts';
import type { LlmMessage } from './generate/llm/types.ts';

/** Matches POST body for stable LLM cache key in tests. */
const integrationTitle = 'Integration';
const integrationArtist = 'HTTP Test';

const toolInput = {
  title: integrationTitle,
  artist: integrationArtist,
  album: 'Al',
  year: '2000',
  key: 'C',
  tempo: '♩=120',
  timeSig: '4/4',
  tuning: 'Standard',
  capo: 'No capo',
  mode: 'Major',
  chords: [{ name: 'C', frets: [-1, 3, 2, 0, 1, 0] }],
  structureLines: ['I', 'V', 'I'],
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
  harmonicCols: [
    { title: 'I', chords: 'C', mode: 'Major', modeDetail: '', row5: '', row6: '' },
  ],
};

function integrationLlmMessage(): LlmMessage {
  return {
    id: 'msg_integration',
    type: 'message',
    role: 'assistant',
    model: 'claude-opus-4-6',
    stop_reason: 'tool_use',
    stop_sequence: null,
    usage: { input_tokens: 10, output_tokens: 20 },
    content: [
      {
        type: 'tool_use',
        id: 'tool_integration',
        name: 'generate_maple_sheet',
        input: toolInput,
      },
    ],
  };
}

describe('HTTP integration (supertest)', () => {
  let cacheDir: string;
  let llmCalls: number;
  let mockLlm: GenerateDeps['llm'];
  let getDeps: () => GenerateDeps;

  beforeEach(async () => {
    cacheDir = await mkdtemp(join(tmpdir(), 'maple-http-'));
    llmCalls = 0;
    mockLlm = {
      createMessage: async () => {
        llmCalls += 1;
        return integrationLlmMessage();
      },
    };
    const base = createGenerateDeps();
    getDeps = (): GenerateDeps => ({
      ...base,
      model: 'claude-opus-4-6',
      maxTokens: 8096,
      cacheMode: 'readwrite',
      cacheDir,
      llm: mockLlm,
    });
  });

  afterEach(async () => {
    await rm(cacheDir, { recursive: true, force: true });
  });

  it('POST /api/generate returns 200 and calls LLM once on cache miss', async () => {
    const app = createApp(getDeps);
    const res = await request(app)
      .post('/api/generate')
      .send({ title: integrationTitle, artist: integrationArtist })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(integrationTitle);
    expect(llmCalls).toBe(1);
  });

  it('POST /api/generate hits file cache on second identical request', async () => {
    const app = createApp(getDeps);

    const res1 = await request(app)
      .post('/api/generate')
      .send({ title: integrationTitle, artist: integrationArtist })
      .set('Content-Type', 'application/json');
    expect(res1.status).toBe(200);

    const res2 = await request(app)
      .post('/api/generate')
      .send({ title: integrationTitle, artist: integrationArtist })
      .set('Content-Type', 'application/json');
    expect(res2.status).toBe(200);
    expect(res2.body.title).toBe(integrationTitle);
    expect(llmCalls).toBe(1);
  });

  it('GET /api/sheets/demo-song returns committed SongData', async () => {
    const app = createApp(() => createGenerateDeps());
    const res = await request(app).get('/api/sheets/demo-song');

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Demo');
    expect(res.body.artist).toBe('Fixture');
  });
});
