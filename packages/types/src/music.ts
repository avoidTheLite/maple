export interface Chord {
  name: string;
  frets: number[]; // [E, A, D, G, B, e] low→high: -1=muted, 0=open, 1-4=fret
}

export interface ChordLabel {
  name: string;
  x: number;
  pivot?: boolean;
}

export interface LyricLabel {
  text: string;
  x: number;
}

export interface LyricRow {
  chords: ChordLabel[];
  lyrics: LyricLabel[];
  pivotAnnotation?: { text: string; x: number };
}

export interface TabCol {
  x: number;
  strings: (string | number)[]; // [e, B, G, D, A, E] top→bottom; "" = skip
}

export interface IntroRiffData {
  annotation: string;
  chordLabels: { text: string; x: number }[];
  barLines: number[];
  doubleBarX: number;
  cols: TabCol[];
  /** y values are relative to the IntroRiff section's own top (not page-absolute). */
  extraAnnotations?: { text: string; x: number; y: number; small?: boolean }[];
}

export interface HarmonicCol {
  title: string;
  chords: string;
  mode: string;
  modeDetail: string;
  row5: string;
  row5Warning?: boolean;
  row6: string;
  pageRef?: string;
}

// ---------------------------------------------------------------------------
// Song sections — discriminated union for template-driven layout
// ---------------------------------------------------------------------------

export type SongSection =
  | { type: 'introRiff';   data: IntroRiffData }
  | { type: 'verse';       annotation: string; annotationX?: number; rows: LyricRow[] }
  | { type: 'chorus';      annotation: string; annotationX?: number; rows: LyricRow[] }
  | { type: 'bridge';      annotation: string; annotationX?: number; rows: LyricRow[] }
  | { type: 'harmonicMap'; cols: HarmonicCol[] }
  | { type: 'notes' };

// ---------------------------------------------------------------------------
// SongData
// ---------------------------------------------------------------------------

export interface SongData {
  title: string;
  artist: string;
  album: string;
  year: string;
  key: string;
  tempo: string;
  timeSig: string;
  tuning: string;
  capo: string;
  mode: string;
  chords: Chord[];
  structureLines: string[];

  /** Which layout template this sheet was generated for. e.g. 'standard', 'minimal'. */
  layoutTemplateId?: string;
  songSchemaVersion?: string | number;

  /**
   * Ordered section payload. When present this is the authoritative source
   * for the layout engine. Use normalizeSongData() to populate from flat
   * fields when absent (legacy LLM responses).
   */
  sections?: SongSection[];

  // ── Flat fields — used by legacy responses and the standard template ─────
  // These will become optional and then removed as sections[] adoption grows.
  introRiff: IntroRiffData;
  verseAnnotation: string;
  verseAnnotationX: number;
  verseRows: LyricRow[];
  chorusAnnotation: string;
  chorusAnnotationX: number;
  chorusRows: LyricRow[];
  harmonicCols: HarmonicCol[];
}

// ---------------------------------------------------------------------------
// Normalisation — ensures sections[] is always populated
// ---------------------------------------------------------------------------

/**
 * Returns a SongData with sections[] guaranteed to be present.
 * If the song already has sections[], it is returned unchanged.
 * Otherwise, sections[] is derived from the flat fields in standard template order:
 *   introRiff → verse → chorus → harmonicMap → notes
 */
export function normalizeSongData(song: SongData): SongData & { sections: SongSection[] } {
  if (song.sections && song.sections.length > 0) {
    return song as SongData & { sections: SongSection[] };
  }

  const sections: SongSection[] = [
    { type: 'introRiff', data: song.introRiff },
    {
      type: 'verse',
      annotation: song.verseAnnotation,
      annotationX: song.verseAnnotationX,
      rows: song.verseRows,
    },
    {
      type: 'chorus',
      annotation: song.chorusAnnotation,
      annotationX: song.chorusAnnotationX,
      rows: song.chorusRows,
    },
    { type: 'harmonicMap', cols: song.harmonicCols },
    { type: 'notes' },
  ];

  return { ...song, sections };
}
