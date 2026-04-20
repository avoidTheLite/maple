import type { Chord } from '@maple/types';
import { VOICING_DICTIONARY } from './voicingDictionary.ts';

/** Frets used when a chord name is unknown and the LLM provided no voicing. */
const FALLBACK_FRETS: readonly number[] = [0, 0, 0, 0, 0, 0];

/**
 * Resolves a list of chord name+optional-frets objects into full Chord objects.
 *
 * Priority:
 *   1. Dictionary voicing (authoritative, consistent)
 *   2. LLM-provided frets (for chords not in the dictionary)
 *   3. Fallback open-string placeholder
 */
export function resolveVoicings(
  chords: Array<{ name: string; frets?: number[] | readonly number[] }>,
): Chord[] {
  return chords.map((chord) => ({
    name: chord.name,
    frets: [...(VOICING_DICTIONARY[chord.name] ?? chord.frets ?? FALLBACK_FRETS)] as number[],
  }));
}

/** Returns true if the chord name has a known dictionary voicing. */
export function hasKnownVoicing(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(VOICING_DICTIONARY, name);
}
