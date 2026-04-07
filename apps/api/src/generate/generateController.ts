import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Request, Response } from 'express';
import type { SongData } from '@maple/types';
import { GenerateRequestSchema } from './generateSchema.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INSTRUCTIONS = readFileSync(
  join(__dirname, '../../../../reference/maple_project_instructions.md'),
  'utf-8'
);

const SYSTEM_PROMPT = `${INSTRUCTIONS}

---

You are generating structured data for the Maple React renderer. When asked to generate a sheet for a song, call the generate_maple_sheet tool with a fully populated SongData object.

Coordinate reference (memorise these):
- Safe area: x=48 to x=740 (692px wide)
- Two 4/4 measures per lyric row. Measure 1: x=52–394. Measure 2: x=398–740.
- Each measure is 346px wide. Beat 1 of each measure: measure_start + 4. Beat 3: measure_start + 177.
- Chord label x = position where that chord is first played in the measure.
- Lyric fragment x = x position of the chord it sits under.
- First chord diagram at x=52, spacing=48px (max 5 diagrams).
- Intro riff: tab lines at y=176,188,200,212,224,236. Bar dividers evenly space three measures across x=44–740.`;

const SONG_DATA_TOOL: Anthropic.Tool = {
  name: 'generate_maple_sheet',
  description: 'Returns a complete, renderer-ready SongData object for the Maple sheet system.',
  input_schema: {
    type: 'object',
    properties: {
      title:   { type: 'string' },
      artist:  { type: 'string' },
      album:   { type: 'string' },
      year:    { type: 'string' },
      key:     { type: 'string', description: "e.g. 'Am', 'D', 'Bb'" },
      tempo:   { type: 'string', description: "e.g. '♩=120'" },
      timeSig: { type: 'string', description: "e.g. '4/4'" },
      tuning:  { type: 'string', description: "e.g. 'Standard', 'Drop D'" },
      capo:    { type: 'string', description: "e.g. 'No capo', 'Capo 2'" },
      mode:    { type: 'string', description: "e.g. 'A natural minor / A pentatonic minor'" },
      chords: {
        type: 'array', maxItems: 5,
        description: 'frets: [E, A, D, G, B, e] low→high. -1=muted, 0=open, 1-4=fret number.',
        items: {
          type: 'object',
          properties: {
            name:  { type: 'string' },
            frets: { type: 'array', items: { type: 'number' }, minItems: 6, maxItems: 6 },
          },
          required: ['name', 'frets'],
        },
      },
      structureLines: {
        type: 'array', maxItems: 3,
        description: 'Line 1: full section sequence. Line 2: main riff/chord pattern. Line 3: chorus/pivot pattern.',
        items: { type: 'string' },
      },
      introRiff: {
        type: 'object',
        properties: {
          annotation:   { type: 'string', description: "e.g. '× 2 — theme riff'" },
          chordLabels:  { type: 'array', items: { type: 'object', properties: { text: { type: 'string' }, x: { type: 'number' } }, required: ['text', 'x'] } },
          barLines:     { type: 'array', items: { type: 'number' }, description: 'Always start with 44, end with 738' },
          doubleBarX:   { type: 'number', description: 'Always 740' },
          cols: {
            type: 'array',
            description: 'Tab columns. strings: [e, B, G, D, A, E] top→bottom. Use empty string to skip.',
            items: {
              type: 'object',
              properties: {
                x:       { type: 'number' },
                strings: { type: 'array', items: { type: 'string' }, minItems: 6, maxItems: 6 },
              },
              required: ['x', 'strings'],
            },
          },
          extraAnnotations: {
            type: 'array',
            items: { type: 'object', properties: { text: { type: 'string' }, x: { type: 'number' }, y: { type: 'number' }, small: { type: 'boolean' } }, required: ['text', 'x', 'y'] },
          },
        },
        required: ['annotation', 'chordLabels', 'barLines', 'doubleBarX', 'cols'],
      },
      verseAnnotation:  { type: 'string' },
      verseAnnotationX: { type: 'number', description: 'x position immediately after the VERSE label. Typically 92.' },
      verseRows: {
        type: 'array', maxItems: 4,
        items: {
          type: 'object',
          properties: {
            chords: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, x: { type: 'number' }, pivot: { type: 'boolean' } }, required: ['name', 'x'] } },
            lyrics: { type: 'array', items: { type: 'object', properties: { text: { type: 'string' }, x: { type: 'number' } }, required: ['text', 'x'] } },
            pivotAnnotation: { type: 'object', properties: { text: { type: 'string' }, x: { type: 'number' } } },
          },
          required: ['chords', 'lyrics'],
        },
      },
      chorusAnnotation:  { type: 'string' },
      chorusAnnotationX: { type: 'number', description: 'x position immediately after the CHORUS label. Typically 100.' },
      chorusRows: {
        type: 'array', maxItems: 4,
        items: {
          type: 'object',
          properties: {
            chords: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, x: { type: 'number' }, pivot: { type: 'boolean' } }, required: ['name', 'x'] } },
            lyrics: { type: 'array', items: { type: 'object', properties: { text: { type: 'string' }, x: { type: 'number' } }, required: ['text', 'x'] } },
            pivotAnnotation: { type: 'object', properties: { text: { type: 'string' }, x: { type: 'number' } } },
          },
          required: ['chords', 'lyrics'],
        },
      },
      harmonicCols: {
        type: 'array', maxItems: 4,
        items: {
          type: 'object',
          properties: {
            title:       { type: 'string' },
            chords:      { type: 'string' },
            mode:        { type: 'string' },
            modeDetail:  { type: 'string' },
            row5:        { type: 'string', description: 'Safe notes or warning text' },
            row5Warning: { type: 'boolean', description: 'true = render row5 in red' },
            row6:        { type: 'string', description: 'Avoid notes or additional info' },
            pageRef:     { type: 'string', description: "Optional, e.g. '→ p.2 for fretboard map'" },
          },
          required: ['title', 'chords', 'mode', 'modeDetail', 'row5', 'row6'],
        },
      },
    },
    required: [
      'title', 'artist', 'album', 'year', 'key', 'tempo', 'timeSig', 'tuning', 'capo', 'mode',
      'chords', 'structureLines', 'introRiff',
      'verseAnnotation', 'verseAnnotationX', 'verseRows',
      'chorusAnnotation', 'chorusAnnotationX', 'chorusRows',
      'harmonicCols',
    ],
  },
};

export const generateController = () => {
  const client = new Anthropic();

  const generate = async (req: Request, res: Response): Promise<void> => {
    const parsed = GenerateRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { title, artist } = parsed.data;

    try {
      const message = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 8096,
        system: SYSTEM_PROMPT,
        tools: [SONG_DATA_TOOL],
        tool_choice: { type: 'any' },
        messages: [
          {
            role: 'user',
            content: `Generate a complete Maple sheet for "${title}" by ${artist}. Use your knowledge of the song to fill in accurate chord voicings (standard tuning unless otherwise noted), the main intro riff tab, verse lyrics with chord positions, chorus lyrics with chord positions, and a four-column harmonic analysis. Follow the coordinate system in the instructions exactly.`,
          },
        ],
      });

      const toolUse = message.content.find(b => b.type === 'tool_use');
      if (!toolUse || toolUse.type !== 'tool_use') {
        res.status(502).json({ error: 'Model did not return structured sheet data.' });
        return;
      }

      res.json(toolUse.input as SongData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate sheet.' });
    }
  };

  return { generate };
};
