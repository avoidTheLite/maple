import { describe, expect, it } from 'vitest';
import { normalizeSongData } from '@maple/types';
import type { SongData, SongSection } from '@maple/types';

// Minimal SongData with all required flat fields.
function makeSong(overrides: Partial<SongData> = {}): SongData {
  return {
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    year: '2000',
    key: 'G',
    tempo: '♩=120',
    timeSig: '4/4',
    tuning: 'Standard',
    capo: 'No capo',
    mode: 'G major',
    chords: [{ name: 'G', frets: [3, 2, 0, 0, 3, 3] }],
    structureLines: ['V1 → Ch → Outro'],
    introRiff: {
      annotation: '× 1',
      chordLabels: [{ text: 'G', x: 52 }],
      barLines: [44, 738],
      doubleBarX: 740,
      cols: [{ x: 52, strings: ['', '', '', '', '', ''] }],
    },
    verseAnnotation: 'G  ( × 4 )',
    verseAnnotationX: 92,
    verseRows: [{ chords: [{ name: 'G', x: 52 }], lyrics: [{ text: 'La la', x: 52 }] }],
    chorusAnnotation: 'Big chorus',
    chorusAnnotationX: 100,
    chorusRows: [{ chords: [{ name: 'G', x: 52 }], lyrics: [{ text: 'Na na', x: 52 }] }],
    harmonicCols: [{ title: 'I', chords: 'G', mode: 'Major', modeDetail: '', row5: '', row6: '' }],
    ...overrides,
  };
}

describe('normalizeSongData — sections already present', () => {
  it('returns the song unchanged when sections is non-empty', () => {
    const existingSections: SongSection[] = [{ type: 'notes' }];
    const song = makeSong({ sections: existingSections });
    const result = normalizeSongData(song);
    expect(result.sections).toBe(existingSections); // same reference
  });

  it('does not rebuild sections when they are already there', () => {
    const song = makeSong({ sections: [{ type: 'notes' }] });
    const result = normalizeSongData(song);
    expect(result.sections).toHaveLength(1);
  });
});

describe('normalizeSongData — deriving from flat fields', () => {
  it('produces 5 sections for a standard song', () => {
    const result = normalizeSongData(makeSong());
    expect(result.sections).toHaveLength(5);
  });

  it('sections follow standard template order', () => {
    const result = normalizeSongData(makeSong());
    const types = result.sections.map((s) => s.type);
    expect(types).toEqual(['introRiff', 'verse', 'chorus', 'harmonicMap', 'notes']);
  });

  it('introRiff section carries the correct data reference', () => {
    const song = makeSong();
    const result = normalizeSongData(song);
    const introSection = result.sections.find((s) => s.type === 'introRiff');
    expect(introSection).toBeDefined();
    if (introSection?.type === 'introRiff') {
      expect(introSection.data).toBe(song.introRiff);
    }
  });

  it('verse section carries annotation and rows', () => {
    const result = normalizeSongData(makeSong());
    const verse = result.sections.find((s) => s.type === 'verse');
    expect(verse?.type).toBe('verse');
    if (verse?.type === 'verse') {
      expect(verse.annotation).toBe('G  ( × 4 )');
      expect(verse.annotationX).toBe(92);
      expect(verse.rows).toHaveLength(1);
    }
  });

  it('chorus section carries annotation and rows', () => {
    const result = normalizeSongData(makeSong());
    const chorus = result.sections.find((s) => s.type === 'chorus');
    expect(chorus?.type).toBe('chorus');
    if (chorus?.type === 'chorus') {
      expect(chorus.annotation).toBe('Big chorus');
      expect(chorus.annotationX).toBe(100);
    }
  });

  it('harmonicMap section carries cols', () => {
    const result = normalizeSongData(makeSong());
    const hm = result.sections.find((s) => s.type === 'harmonicMap');
    expect(hm?.type).toBe('harmonicMap');
    if (hm?.type === 'harmonicMap') {
      expect(hm.cols).toHaveLength(1);
    }
  });

  it('notes section is always last', () => {
    const result = normalizeSongData(makeSong());
    expect(result.sections.at(-1)?.type).toBe('notes');
  });

  it('all original flat fields are preserved on the returned object', () => {
    const song = makeSong();
    const result = normalizeSongData(song);
    expect(result.verseAnnotation).toBe(song.verseAnnotation);
    expect(result.introRiff).toBe(song.introRiff);
    expect(result.harmonicCols).toBe(song.harmonicCols);
  });
});
