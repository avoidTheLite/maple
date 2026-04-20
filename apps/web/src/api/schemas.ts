import { z } from 'zod';

const ChordSchema = z.object({
  name: z.string().min(1),
  frets: z.array(z.number()),
});

const ChordLabelSchema = z.object({
  name: z.string().min(1),
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
  pivotAnnotation: z
    .object({
      text: z.string(),
      x: z.number(),
    })
    .optional(),
});

const IntroRiffSchema = z.object({
  annotation: z.string(),
  chordLabels: z.array(
    z.object({
      text: z.string(),
      x: z.number(),
    }),
  ),
  barLines: z.array(z.number()),
  doubleBarX: z.number(),
  cols: z.array(
    z.object({
      x: z.number(),
      strings: z.array(z.union([z.string(), z.number()])),
    }),
  ),
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

export const SongDataSchema = z.object({
  title: z.string().min(1),
  artist: z.string().min(1),
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
  layoutTemplateId: z.string().optional(),
  songSchemaVersion: z.union([z.string(), z.number()]).optional(),
  introRiff: IntroRiffSchema,
  verseAnnotation: z.string(),
  verseAnnotationX: z.number(),
  verseRows: z.array(LyricRowSchema),
  chorusAnnotation: z.string(),
  chorusAnnotationX: z.number(),
  chorusRows: z.array(LyricRowSchema),
  harmonicCols: z.array(HarmonicColSchema),
});

const LayoutSectionTypeSchema = z.enum([
  'header',
  'introRiff',
  'verse',
  'chorus',
  'bridge',
  'harmonicMap',
  'notes',
]);

const LayoutItemTypeSchema = z.enum([
  'introMeasure',
  'introTabColumn',
  'verseRow',
  'chorusRow',
  'harmonicColumn',
  'notesBlock',
]);

export const SheetLayoutConfigSchema = z.object({
  schemaVersion: z.string().min(1),
  templateId: z.string().min(1),
  songSlug: z.string().min(1),
  sections: z.array(
    z.object({
      id: z.string().min(1),
      type: LayoutSectionTypeSchema,
      label: z.string().min(1),
      order: z.number().int().min(0),
      x: z.number(),
      y: z.number(),
      width: z.number().positive(),
      height: z.number().positive(),
      autoFill: z.boolean(),
      parked: z.boolean(),
    }),
  ),
  items: z.array(
    z.object({
      id: z.string().min(1),
      sectionId: z.string().min(1),
      type: LayoutItemTypeSchema,
      index: z.number().int().min(0),
      x: z.number(),
      y: z.number(),
      width: z.number().positive(),
      height: z.number().positive(),
      autoFill: z.boolean(),
      parked: z.boolean(),
    }),
  ),
  mergeGroups: z.array(
    z.object({
      id: z.string().min(1),
      type: LayoutItemTypeSchema,
      memberItemIds: z.array(z.string().min(1)),
      merged: z.boolean(),
    }),
  ),
  parkingLot: z.object({
    itemIds: z.array(z.string().min(1)),
    sectionIds: z.array(z.string().min(1)),
  }),
});
