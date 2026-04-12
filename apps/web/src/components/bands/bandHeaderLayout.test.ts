import { describe, expect, it } from 'vitest';
import {
  DIAGRAM_HEIGHT,
  DIAGRAM_ROW_GAP,
  DIAGRAM_WIDTH,
  DIAGRAM_X_START,
  DIAGRAMS_Y,
  FORM_CHAR_WIDTH_EST,
  FORM_H_PAD,
  MAX_FORM_WIDTH,
  SECTION_GAP,
  computeFormLayout,
} from './bandHeaderLayout.ts';
import { SAFE_X_END } from '../../constants/layout.ts';

const SHORT_LINES = ['Intro → V1 → Ch → V2 → Outro'];
const LONG_LINES = ['x'.repeat(300)]; // guaranteed to exceed 50% cap

describe('computeFormLayout — form width', () => {
  it('grows to fit content when lines are short', () => {
    const { formWidth } = computeFormLayout(SHORT_LINES);
    const expectedMin = Math.ceil(SHORT_LINES[0].length * FORM_CHAR_WIDTH_EST) + 2 * FORM_H_PAD;
    expect(formWidth).toBe(Math.min(expectedMin, MAX_FORM_WIDTH));
  });

  it('caps at 50% of page width for very long lines', () => {
    const { formWidth } = computeFormLayout(LONG_LINES);
    expect(formWidth).toBe(MAX_FORM_WIDTH);
  });

  it('uses the longest line to determine width when multiple lines differ', () => {
    const { formWidth: narrow } = computeFormLayout(['V1', 'Ch']);
    const { formWidth: wider } = computeFormLayout(['Intro → V1 → Ch → V2 → Outro', 'Ch']);
    expect(wider).toBeGreaterThan(narrow);
  });
});

describe('computeFormLayout — page boundary', () => {
  it('form right edge equals the safe page boundary for short content', () => {
    const { formWidth, formStartX } = computeFormLayout(SHORT_LINES);
    expect(formStartX + formWidth).toBe(SAFE_X_END);
  });

  it('form right edge equals the safe page boundary when capped at 50%', () => {
    const { formWidth, formStartX } = computeFormLayout(LONG_LINES);
    expect(formStartX + formWidth).toBe(SAFE_X_END);
  });
});

describe('computeFormLayout — no overlap with chord zone', () => {
  it('chord zone end is always left of form start', () => {
    for (const lines of [SHORT_LINES, LONG_LINES, [['Ch']]].flat()) {
      const { formStartX, chordZoneEndX } = computeFormLayout([String(lines)]);
      expect(chordZoneEndX).toBeLessThan(formStartX);
    }
  });

  it('gap between chord zone and form is exactly SECTION_GAP', () => {
    const { formStartX, chordZoneEndX } = computeFormLayout(SHORT_LINES);
    expect(formStartX - chordZoneEndX).toBe(SECTION_GAP);
  });

  it('chords per row decreases when form is wider', () => {
    const { chordsPerRow: small } = computeFormLayout(['V1 Ch']);
    const { chordsPerRow: large } = computeFormLayout(LONG_LINES);
    expect(large).toBeLessThan(small);
  });

  it('chords per row is always at least 1', () => {
    const { chordsPerRow } = computeFormLayout(LONG_LINES);
    expect(chordsPerRow).toBeGreaterThanOrEqual(1);
  });
});

describe('BandHeader layout — chord row height', () => {
  it('second chord row bottom stays within the header divider at y=192', () => {
    const secondRowBottom = DIAGRAMS_Y + (DIAGRAM_HEIGHT + DIAGRAM_ROW_GAP) + DIAGRAM_HEIGHT;
    expect(secondRowBottom).toBeLessThanOrEqual(192);
  });

  it('last chord diagram right edge fits within the computed chord zone', () => {
    const { chordsPerRow, chordZoneEndX } = computeFormLayout(SHORT_LINES);
    const lastChordRight =
      DIAGRAM_X_START + (chordsPerRow - 1) * (DIAGRAM_WIDTH + 10) + DIAGRAM_WIDTH;
    expect(lastChordRight).toBeLessThanOrEqual(chordZoneEndX);
  });
});
