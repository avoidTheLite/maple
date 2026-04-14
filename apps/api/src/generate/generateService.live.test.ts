/**
 * Live integration test — hits the real Anthropic API.
 * Skipped automatically when ANTHROPIC_API_KEY is not set so CI stays fast.
 * Run manually: ANTHROPIC_API_KEY=sk-... pnpm --filter @maple/api test
 */
import { describe, expect, it } from 'vitest';
import { createGenerateDeps } from './createGenerateDeps.ts';
import { generateSheet } from './generateService.ts';

const hasKey = !!process.env.ANTHROPIC_API_KEY;

describe('generateSheet — live API', () => {
  it.skipIf(!hasKey)(
    'returns valid SongData for a well-known song',
    async () => {
      const deps = {
        ...createGenerateDeps(),
        // Force a real call — don't use any local disk cache for this test.
        cacheMode: 'off' as const,
        cacheDir: null,
      };

      const song = await generateSheet(
        { title: 'Blue on Black', artist: 'Kenny Wayne Shepherd' },
        deps,
      );

      // Basic shape checks — the LLM produced parseable, schema-valid SongData.
      expect(song.title).toBeTruthy();
      expect(song.artist).toBeTruthy();
      expect(song.key).toBeTruthy();
      expect(song.chords.length).toBeGreaterThan(0);

      // Every chord must have frets resolved (either from dictionary or LLM).
      for (const chord of song.chords) {
        expect(chord.frets, `${chord.name} has frets`).toHaveLength(6);
      }

      // Verse and chorus rows must have content.
      expect(song.verseRows.length).toBeGreaterThan(0);
      expect(song.chorusRows.length).toBeGreaterThan(0);
    },
    60_000, // 60s timeout — real network call
  );
});
