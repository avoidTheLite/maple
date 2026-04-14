import { describe, expect, it } from 'vitest';
import { VOICING_DICTIONARY } from './voicingDictionary.ts';
import { hasKnownVoicing, resolveVoicings } from './voicingResolver.ts';

describe('resolveVoicings — dictionary priority', () => {
  it('uses the dictionary voicing for a known chord', () => {
    const result = resolveVoicings([{ name: 'D' }]);
    expect(result[0].frets).toEqual([...VOICING_DICTIONARY['D']!]);
  });

  it('dictionary voicing overrides LLM-provided frets for known chords', () => {
    const llmFrets = [9, 9, 9, 9, 9, 9];
    const result = resolveVoicings([{ name: 'G', frets: llmFrets }]);
    expect(result[0].frets).toEqual([...VOICING_DICTIONARY['G']!]);
    expect(result[0].frets).not.toEqual(llmFrets);
  });

  it('falls back to LLM frets for a chord not in the dictionary', () => {
    const llmFrets = [3, 5, 5, 4, 3, 3];
    const result = resolveVoicings([{ name: 'Cm7b5', frets: llmFrets }]);
    expect(result[0].frets).toEqual(llmFrets);
  });

  it('uses all-zero placeholder when chord is unknown and LLM provided no frets', () => {
    const result = resolveVoicings([{ name: 'Xunknown' }]);
    expect(result[0].frets).toEqual([0, 0, 0, 0, 0, 0]);
  });
});

describe('resolveVoicings — output shape', () => {
  it('always returns frets of length 6', () => {
    const chords = [{ name: 'Am' }, { name: 'Cadd9' }, { name: 'ZZZ' }];
    for (const chord of resolveVoicings(chords)) {
      expect(chord.frets).toHaveLength(6);
    }
  });

  it('preserves chord name exactly', () => {
    const result = resolveVoicings([{ name: 'F#m' }]);
    expect(result[0].name).toBe('F#m');
  });

  it('handles an empty array', () => {
    expect(resolveVoicings([])).toEqual([]);
  });

  it('handles multiple chords in one call', () => {
    const result = resolveVoicings([{ name: 'D' }, { name: 'Cadd9' }, { name: 'G' }, { name: 'A' }]);
    expect(result).toHaveLength(4);
    expect(result[0].frets).toEqual([...VOICING_DICTIONARY['D']!]);
    expect(result[1].frets).toEqual([...VOICING_DICTIONARY['Cadd9']!]);
  });
});

describe('hasKnownVoicing', () => {
  it('returns true for a chord in the dictionary', () => {
    expect(hasKnownVoicing('Em')).toBe(true);
  });

  it('returns false for a chord not in the dictionary', () => {
    expect(hasKnownVoicing('Xunknown')).toBe(false);
  });
});

describe('voicingDictionary integrity', () => {
  it('every entry has exactly 6 fret values', () => {
    for (const [name, frets] of Object.entries(VOICING_DICTIONARY)) {
      expect(frets, `${name} fret count`).toHaveLength(6);
    }
  });

  it('every fret value is either -1 (mute) or a non-negative integer', () => {
    for (const [name, frets] of Object.entries(VOICING_DICTIONARY)) {
      for (const fret of frets) {
        expect(fret, `${name} fret value`).toBeGreaterThanOrEqual(-1);
        expect(Number.isInteger(fret), `${name} is integer`).toBe(true);
      }
    }
  });
});
