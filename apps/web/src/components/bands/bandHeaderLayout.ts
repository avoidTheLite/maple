import { A4_WIDTH, SAFE_X_END } from '../../constants/layout.ts';

export const DIAGRAM_X_START = 52;
export const DIAGRAM_SPACING = 48;
export const DIAGRAM_WIDTH = 38;
export const DIAGRAM_HEIGHT = 46;
export const DIAGRAM_ROW_GAP = 10;
export const DIAGRAMS_Y = 78;

export const FORM_FONT_SIZE = 7.5;
// Estimated px per character at FORM_FONT_SIZE in Georgia (proportional font).
// Slight overestimate so content rarely clips.
export const FORM_CHAR_WIDTH_EST = 4.8;
export const FORM_H_PAD = 8;
export const SECTION_GAP = 12;
export const MAX_FORM_WIDTH = Math.round(A4_WIDTH * 0.5); // 397px

export interface FormLayout {
  formWidth: number;
  formStartX: number;
  formTextX: number;
  chordZoneEndX: number;
  chordsPerRow: number;
}

export function computeFormLayout(structureLines: string[]): FormLayout {
  const longestLen = structureLines.reduce((max, l) => Math.max(max, l.length), 0);
  const rawWidth = Math.ceil(longestLen * FORM_CHAR_WIDTH_EST) + 2 * FORM_H_PAD;
  const formWidth = Math.min(rawWidth, MAX_FORM_WIDTH);
  const formStartX = SAFE_X_END - formWidth;
  const formTextX = formStartX + FORM_H_PAD;
  const chordZoneEndX = formStartX - SECTION_GAP;
  const chordsPerRow = Math.max(
    1,
    Math.floor((chordZoneEndX - DIAGRAM_X_START - DIAGRAM_WIDTH) / DIAGRAM_SPACING) + 1,
  );
  return { formWidth, formStartX, formTextX, chordZoneEndX, chordsPerRow };
}
