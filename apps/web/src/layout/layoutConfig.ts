import type { SheetLayoutConfig, SheetLayoutItemConfig, SheetLayoutSectionConfig, SongData } from '@maple/types';
import {
  BAND_CHORUS_HEIGHT,
  BAND_HARMONIC_MAP_HEIGHT,
  BAND_HEADER_HEIGHT,
  BAND_INTRO_RIFF_HEIGHT,
  BAND_VERSE_HEIGHT,
} from '../constants/layout.ts';

const CONTENT_X = 48;
const CONTENT_WIDTH = 692;
const TEMPLATE_ID = 'standard';
const SCHEMA_VERSION = '1';

export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1122;

const MIN_SECTION_HEIGHT = 56;

const INTRO_TAB_TOP_OFFSET = 38;
const INTRO_TAB_HEIGHT = 60;
const VERSE_ROW_TOP_OFFSET = 23;
const VERSE_ROW_HEIGHT = 30;
const CHORUS_ROW_TOP_OFFSET = 23;
const CHORUS_ROW_HEIGHT = 30;
const HARMONIC_COL_TOP_OFFSET = 20;
const HARMONIC_COL_HEIGHT = 108;
const HARMONIC_COL_X = [60, 232, 406, 578] as const;

function createSection(
  id: string,
  type: SheetLayoutSectionConfig['type'],
  label: string,
  order: number,
  y: number,
  height: number,
): SheetLayoutSectionConfig {
  return {
    id,
    type,
    label,
    order,
    x: CONTENT_X,
    y,
    width: CONTENT_WIDTH,
    height,
    autoFill: true,
    parked: false,
  };
}

export function toSongSlug(song: SongData): string {
  const raw = `${song.title}-${song.artist}`.toLowerCase();
  const slug = raw
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
  return slug || 'untitled-song';
}

export function buildDefaultSections(): SheetLayoutSectionConfig[] {
  const yHeader = 0;
  const yIntro = yHeader + BAND_HEADER_HEIGHT;
  const yVerse = yIntro + BAND_INTRO_RIFF_HEIGHT;
  const yChorus = yVerse + BAND_VERSE_HEIGHT;
  const yHarmonic = yChorus + BAND_CHORUS_HEIGHT;
  const yNotes = yHarmonic + BAND_HARMONIC_MAP_HEIGHT;

  return [
    createSection('header', 'header', 'Header', 0, yHeader, BAND_HEADER_HEIGHT),
    createSection('intro', 'introRiff', 'Intro Riff', 1, yIntro, BAND_INTRO_RIFF_HEIGHT),
    createSection('verse', 'verse', 'Verse', 2, yVerse, BAND_VERSE_HEIGHT),
    createSection('chorus', 'chorus', 'Chorus', 3, yChorus, BAND_CHORUS_HEIGHT),
    createSection('harmonic', 'harmonicMap', 'Harmonic Map', 4, yHarmonic, BAND_HARMONIC_MAP_HEIGHT),
    createSection('notes', 'notes', 'Notes', 5, yNotes, PAGE_HEIGHT - yNotes),
  ];
}

function getSectionY(sections: SheetLayoutSectionConfig[], sectionId: string): number {
  const section = sections.find((s) => s.id === sectionId);
  return section?.y ?? 0;
}

export function buildDefaultItems(song: SongData, sections: SheetLayoutSectionConfig[]): SheetLayoutItemConfig[] {
  const items: SheetLayoutItemConfig[] = [];

  const introY = getSectionY(sections, 'intro');
  const barLines = song.introRiff.barLines;
  for (let i = 0; i < barLines.length - 1; i += 1) {
    const x = barLines[i];
    const width = Math.max(20, barLines[i + 1] - barLines[i]);
    items.push({
      id: `intro-measure-${i}`,
      sectionId: 'intro',
      type: 'introMeasure',
      index: i,
      x,
      y: introY + INTRO_TAB_TOP_OFFSET - 2,
      width,
      height: INTRO_TAB_HEIGHT + 4,
      autoFill: true,
      parked: false,
    });
  }

  song.introRiff.cols.forEach((col, i) => {
    items.push({
      id: `intro-tab-col-${i}`,
      sectionId: 'intro',
      type: 'introTabColumn',
      index: i,
      x: col.x - 5,
      y: introY + INTRO_TAB_TOP_OFFSET - 2,
      width: 18,
      height: INTRO_TAB_HEIGHT + 4,
      autoFill: true,
      parked: false,
    });
  });

  const verseY = getSectionY(sections, 'verse');
  song.verseRows.forEach((_, i) => {
    items.push({
      id: `verse-row-${i}`,
      sectionId: 'verse',
      type: 'verseRow',
      index: i,
      x: 48,
      y: verseY + VERSE_ROW_TOP_OFFSET + i * 34,
      width: 692,
      height: VERSE_ROW_HEIGHT,
      autoFill: true,
      parked: false,
    });
  });

  const chorusY = getSectionY(sections, 'chorus');
  song.chorusRows.forEach((_, i) => {
    items.push({
      id: `chorus-row-${i}`,
      sectionId: 'chorus',
      type: 'chorusRow',
      index: i,
      x: 48,
      y: chorusY + CHORUS_ROW_TOP_OFFSET + i * 34,
      width: 692,
      height: CHORUS_ROW_HEIGHT,
      autoFill: true,
      parked: false,
    });
  });

  const harmonicY = getSectionY(sections, 'harmonic');
  song.harmonicCols.forEach((_, i) => {
    const x = HARMONIC_COL_X[i] ?? (HARMONIC_COL_X[HARMONIC_COL_X.length - 1] + 172 * (i - HARMONIC_COL_X.length + 1));
    items.push({
      id: `harmonic-col-${i}`,
      sectionId: 'harmonic',
      type: 'harmonicColumn',
      index: i,
      x,
      y: harmonicY + HARMONIC_COL_TOP_OFFSET,
      width: 160,
      height: HARMONIC_COL_HEIGHT,
      autoFill: true,
      parked: false,
    });
  });

  const notesY = getSectionY(sections, 'notes');
  items.push({
    id: 'notes-block-0',
    sectionId: 'notes',
    type: 'notesBlock',
    index: 0,
    x: 48,
    y: notesY + 22,
    width: 692,
    height: Math.max(120, PAGE_HEIGHT - (notesY + 40)),
    autoFill: true,
    parked: false,
  });

  return items;
}

export function buildDefaultLayoutConfig(song: SongData): SheetLayoutConfig {
  const sections = buildDefaultSections();
  return {
    schemaVersion: SCHEMA_VERSION,
    templateId: TEMPLATE_ID,
    songSlug: toSongSlug(song),
    sections,
    items: buildDefaultItems(song, sections),
    mergeGroups: [],
    parkingLot: { itemIds: [], sectionIds: [] },
  };
}

export function mergeWithDefaults(
  defaults: SheetLayoutConfig,
  saved: SheetLayoutConfig | null,
): SheetLayoutConfig {
  if (!saved) {
    return defaults;
  }
  const savedById = new Map(saved.sections.map((s) => [s.id, s]));
  const mergedSections = defaults.sections.map((base) => {
    const fromSaved = savedById.get(base.id);
    return fromSaved ? { ...base, ...fromSaved } : base;
  });

  return {
    ...defaults,
    ...saved,
    sections: mergedSections,
    items: saved.items.length > 0 ? saved.items : defaults.items,
  };
}

export function applyAutoFill(layout: SheetLayoutConfig): SheetLayoutConfig {
  const sorted = [...layout.sections].sort((a, b) => a.order - b.order);
  let cursorY = 0;

  const updated = sorted.map((section) => {
    if (section.parked) {
      return section;
    }

    if (!section.autoFill) {
      cursorY = Math.max(cursorY, section.y + section.height);
      return section;
    }

    const next = { ...section, x: CONTENT_X, y: cursorY };
    cursorY += Math.max(MIN_SECTION_HEIGHT, section.height);
    return next;
  });

  return {
    ...layout,
    sections: updated,
    items: layout.items.map((item) => {
      if (!item.autoFill) return item;
      const section = updated.find((s) => s.id === item.sectionId);
      if (!section) return item;
      // Keep item's section-relative offset while the parent section auto-fills.
      const oldSection = layout.sections.find((s) => s.id === item.sectionId);
      if (!oldSection) return item;
      return {
        ...item,
        x: item.x + (section.x - oldSection.x),
        y: item.y + (section.y - oldSection.y),
      };
    }),
  };
}
