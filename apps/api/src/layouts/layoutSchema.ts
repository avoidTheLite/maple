import { z } from 'zod';

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

const SheetLayoutSectionConfigSchema = z.object({
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
});

const SheetLayoutItemConfigSchema = z.object({
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
});

const SheetLayoutMergeGroupSchema = z.object({
  id: z.string().min(1),
  type: LayoutItemTypeSchema,
  memberItemIds: z.array(z.string().min(1)),
  merged: z.boolean(),
});

const SheetLayoutParkingLotSchema = z.object({
  itemIds: z.array(z.string().min(1)),
  sectionIds: z.array(z.string().min(1)),
});

export const SheetLayoutConfigSchema = z.object({
  schemaVersion: z.string().min(1),
  templateId: z.string().min(1),
  songSlug: z.string().min(1),
  sections: z.array(SheetLayoutSectionConfigSchema),
  items: z.array(SheetLayoutItemConfigSchema),
  mergeGroups: z.array(SheetLayoutMergeGroupSchema),
  parkingLot: SheetLayoutParkingLotSchema,
});
