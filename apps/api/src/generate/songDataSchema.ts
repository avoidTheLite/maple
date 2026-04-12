import { z } from 'zod';

const ChordSchema = z.object({
  name: z.string(),
  frets: z.array(z.number()).length(6),
});

const ChordLabelSchema = z.object({
  name: z.string(),
  x: z.number(),
  pivot: z.boolean().optional(),
});

const LyricLabelSchema = z.object({
  text: z.string(),
  x: z.number(),
});

const LyricRowSchema = z.object({
  chords: z.array(ChordLabelSchema),
  lyrics: z.array(LyricLabelSchema),
  pivotAnnotation: z.object({ text: z.string(), x: z.number() }).optional(),
});

const TabColSchema = z.object({
  x: z.number(),
  strings: z.array(z.union([z.string(), z.number()])).length(6),
});

const IntroRiffSchema = z.object({
  annotation: z.string(),
  chordLabels: z.array(z.object({ text: z.string(), x: z.number() })),
  barLines: z.array(z.number()),
  doubleBarX: z.number(),
  cols: z.array(TabColSchema),
  extraAnnotations: z
    .array(
      z.object({
        text: z.string(),
        x: z.number(),
        y: z.number(),
        small: z.boolean().optional(),
      }),
    )
    .optional(),
});

const HarmonicColSchema = z.object({
  title: z.string(),
  chords: z.string(),
  mode: z.string(),
  modeDetail: z.string(),
  row5: z.string(),
  row5Warning: z.boolean().optional(),
  row6: z.string(),
  pageRef: z.string().optional(),
});

/**
 * Lenient schema for raw LLM output — chord frets are optional because the
 * voicing resolver fills them in from the dictionary after extraction.
 */
const LlmChordSchema = z.object({
  name: z.string(),
  frets: z.array(z.number()).length(6).optional(),
});

export const LlmSongDataSchema = z
  .object({
    title: z.string(),
    artist: z.string(),
    album: z.string(),
    year: z.string(),
    key: z.string(),
    tempo: z.string(),
    timeSig: z.string(),
    tuning: z.string(),
    capo: z.string(),
    mode: z.string(),
    chords: z.array(LlmChordSchema),
    structureLines: z.array(z.string()),
    introRiff: IntroRiffSchema,
    verseAnnotation: z.string(),
    verseAnnotationX: z.number(),
    verseRows: z.array(LyricRowSchema),
    chorusAnnotation: z.string(),
    chorusAnnotationX: z.number(),
    chorusRows: z.array(LyricRowSchema),
    harmonicCols: z.array(HarmonicColSchema),
    layoutTemplateId: z.string().optional(),
    songSchemaVersion: z.union([z.string(), z.number()]).optional(),
  })
  .passthrough();

export type LlmSongDataInput = z.infer<typeof LlmSongDataSchema>;

export const SongDataSchema = z.object({
  title: z.string(),
  artist: z.string(),
  album: z.string(),
  year: z.string(),
  key: z.string(),
  tempo: z.string(),
  timeSig: z.string(),
  tuning: z.string(),
  capo: z.string(),
  mode: z.string(),
  chords: z.array(ChordSchema),
  structureLines: z.array(z.string()),
  introRiff: IntroRiffSchema,
  verseAnnotation: z.string(),
  verseAnnotationX: z.number(),
  verseRows: z.array(LyricRowSchema),
  chorusAnnotation: z.string(),
  chorusAnnotationX: z.number(),
  chorusRows: z.array(LyricRowSchema),
  harmonicCols: z.array(HarmonicColSchema),
  /** Forward-compatible optional fields (see AGENTS.md — multi-template). */
  layoutTemplateId: z.string().optional(),
  songSchemaVersion: z.union([z.string(), z.number()]).optional(),
});

export type SongDataParsed = z.infer<typeof SongDataSchema>;
