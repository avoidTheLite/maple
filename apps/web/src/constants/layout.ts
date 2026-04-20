export const A4_WIDTH = 794;
export const A4_HEIGHT = 1122;
export const SAFE_X_START = 48;
export const SAFE_X_END = 740;
export const HEADER_DIVIDER_Y = 192;

/**
 * Slot heights — the vertical space each section occupies in the stack,
 * including the 2px gap before the next section's content begins.
 * Used by App.tsx to compute Y offsets and by the future LayoutEngine.
 */
export const BAND_HEADER_HEIGHT = 192;
export const BAND_INTRO_RIFF_HEIGHT = 143; // 141 content + 2 gap
export const BAND_VERSE_HEIGHT = 140; // 138 content + 2 gap
export const BAND_CHORUS_HEIGHT = 141; // 139 content + 2 gap
export const BAND_HARMONIC_MAP_HEIGHT = 140; // 138 content + 2 gap
// BandNotes fills the remaining page — no fixed height.

export const COLORS = {
  parchment: '#FDF6E8',
  bindingOuter: '#C17F2A',
  bindingInner: '#D4942F',
  textPrimary: '#2A1A00',
  textAccent: '#4A2800',
  divider: '#A07828',
  staff: '#8B6914',
  chordBox: '#FFF8EE',
  chordStroke: '#B08030',
};

export const CHORD_SIZES = {
  lg: { width: 38, height: 46 },
  md: { width: 32, height: 40 },
  sm: { width: 28, height: 36 },
};
