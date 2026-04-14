import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createGenerateDeps } from './createGenerateDeps.ts';
import {
  assertValidSongSlug,
  generateSheet,
  loadSheetFromRepo,
  LlmSheetError,
  parseSongData,
  SheetLoadError,
} from './generateService.ts';
import { writeLlmCacheFile } from './llm/fileCache.ts';
import type { LlmMessage } from '../types.ts';
import { computeLlmCacheKey } from './llm/cacheKey.ts';
import { computePromptFingerprint, PROMPT_VERSION } from './prompts/version.ts';

const minimalToolInput = {
  title: 'T',
  artist: 'A',
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
    {
      title: 'I',
      chords: 'C',
      mode: 'Major',
      modeDetail: '',
      row5: '',
      row6: '',
    },
  ],
};

function minimalCachedMessage(): LlmMessage {
  return {
    id: 'msg_test',
    type: 'message',
    role: 'assistant',
    model: 'claude-opus-4-6',
    stop_reason: 'tool_use',
    stop_sequence: null,
    usage: { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 },
    content: [
      {
        type: 'tool_use',
        id: 'tool_test',
        name: 'generate_maple_sheet',
        input: minimalToolInput,
      },
    ],
  };
}

describe('parseSongData', () => {
  it('accepts valid minimal SongData', () => {
    const s = parseSongData(minimalToolInput);
    expect(s.title).toBe('T');
  });

  it('rejects invalid payloads', () => {
    expect(() => parseSongData({})).toThrow(SheetLoadError);
  });
});

describe('generateSheet', () => {
  it('returns SongData from a cache hit without calling the LLM', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'maple-llm-'));
    try {
      const fp = computePromptFingerprint();
      const model = 'claude-opus-4-6';
      const title = 'Cache Hit';
      const artist = 'No Api';
      const key = computeLlmCacheKey(fp, model, title, artist);
      await writeLlmCacheFile(dir, key, {
        promptFingerprint: fp,
        promptVersion: PROMPT_VERSION,
        model,
        message: minimalCachedMessage(),
      });

      let called = false;
      const deps = {
        ...createGenerateDeps(),
        model,
        maxTokens: 8096,
        cacheMode: 'read' as const,
        cacheDir: dir,
        llm: {
          createMessage: async () => {
            called = true;
            throw new Error('LLM should not be invoked');
          },
        },
      };

      const song = await generateSheet({ title, artist }, deps);
      expect(song.title).toBe('T');
      expect(called).toBe(false);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('persists to cache in readwrite mode on miss', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'maple-llm-'));
    try {
      const fp = computePromptFingerprint();
      const model = 'claude-opus-4-6';
      const title = 'Write Back';
      const artist = 'Test';
      const key = computeLlmCacheKey(fp, model, title, artist);

      let called = false;
      const deps = {
        ...createGenerateDeps(),
        model,
        maxTokens: 8096,
        cacheMode: 'readwrite' as const,
        cacheDir: dir,
        llm: {
          createMessage: async () => {
            called = true;
            return minimalCachedMessage();
          },
        },
      };

      const song = await generateSheet({ title, artist }, deps);
      expect(called).toBe(true);
      expect(song.title).toBe('T');

      const files = await readdir(dir);
      expect(files).toContain(`${key}.json`);

      const depsRead = {
        ...deps,
        cacheMode: 'read' as const,
        llm: {
          createMessage: async () => {
            throw new Error('LLM should not run on second call');
          },
        },
      };
      const song2 = await generateSheet({ title, artist }, depsRead);
      expect(song2.title).toBe('T');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('throws when the model omits tool_use', async () => {
    const emptyMessage: LlmMessage = {
      id: 'msg_empty',
      type: 'message',
      role: 'assistant',
      model: 'claude-opus-4-6',
      stop_reason: 'end_turn',
      stop_sequence: null,
      usage: { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 },
      content: [{ type: 'text', text: 'nope' }],
    };

    const dir = await mkdtemp(join(tmpdir(), 'maple-llm-'));
    try {
      const fp = computePromptFingerprint();
      const model = 'claude-opus-4-6';
      const title = 'Bad Msg';
      const artist = 'Test';
      const key = computeLlmCacheKey(fp, model, title, artist);
      await writeLlmCacheFile(dir, key, {
        promptFingerprint: fp,
        promptVersion: PROMPT_VERSION,
        model,
        message: emptyMessage,
      });

      const deps = {
        ...createGenerateDeps(),
        model,
        maxTokens: 8096,
        cacheMode: 'read' as const,
        cacheDir: dir,
        llm: { createMessage: async () => emptyMessage },
      };

      await expect(generateSheet({ title, artist }, deps)).rejects.toThrow(LlmSheetError);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('read mode on miss does not write cache files', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'maple-llm-'));
    try {
      const model = 'claude-opus-4-6';
      const title = 'Read Only Miss';
      const artist = 'No Write';

      const deps = {
        ...createGenerateDeps(),
        model,
        maxTokens: 8096,
        cacheMode: 'read' as const,
        cacheDir: dir,
        llm: {
          createMessage: async () => minimalCachedMessage(),
        },
      };

      await generateSheet({ title, artist }, deps);
      expect(await readdir(dir)).toEqual([]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('off mode skips disk cache even when a file exists', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'maple-llm-'));
    try {
      const fp = computePromptFingerprint();
      const model = 'claude-opus-4-6';
      const title = 'Off Mode';
      const artist = 'Cached';
      const key = computeLlmCacheKey(fp, model, title, artist);
      await writeLlmCacheFile(dir, key, {
        promptFingerprint: fp,
        promptVersion: PROMPT_VERSION,
        model,
        message: minimalCachedMessage(),
      });

      let called = false;
      const deps = {
        ...createGenerateDeps(),
        model,
        maxTokens: 8096,
        cacheMode: 'off' as const,
        cacheDir: null,
        llm: {
          createMessage: async () => {
            called = true;
            return minimalCachedMessage();
          },
        },
      };

      await generateSheet({ title, artist }, deps);
      expect(called).toBe(true);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe('loadSheetFromRepo', () => {
  it('loads demo-song.json', async () => {
    const deps = createGenerateDeps();
    const song = await loadSheetFromRepo('demo-song', deps);
    expect(song.title).toBe('Demo');
    expect(song.artist).toBe('Fixture');
  });

  it('rejects invalid slugs', () => {
    expect(() => assertValidSongSlug('../etc/passwd')).toThrow(SheetLoadError);
  });

  it('throws NOT_FOUND for missing slug', async () => {
    const deps = createGenerateDeps();
    await expect(loadSheetFromRepo('no-such-song-slug-xyz', deps)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });
});
