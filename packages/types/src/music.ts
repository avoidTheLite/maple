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
  introRiff: IntroRiffData;
  verseAnnotation: string;
  verseAnnotationX: number;
  verseRows: LyricRow[];
  chorusAnnotation: string;
  chorusAnnotationX: number;
  chorusRows: LyricRow[];
  harmonicCols: HarmonicCol[];
}
