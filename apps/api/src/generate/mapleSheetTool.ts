import type Anthropic from '@anthropic-ai/sdk';

export const SONG_DATA_TOOL: Anthropic.Tool = {
  name: 'generate_maple_sheet',
  description: 'Returns a complete, renderer-ready SongData object for the Maple sheet system.',
  input_schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      artist: { type: 'string' },
      album: { type: 'string' },
      year: { type: 'string' },
      key: { type: 'string', description: "e.g. 'Am', 'D', 'Bb'" },
      tempo: { type: 'string', description: "e.g. '♩=120'" },
      timeSig: { type: 'string', description: "e.g. '4/4'" },
      tuning: { type: 'string', description: "e.g. 'Standard', 'Drop D'" },
      capo: { type: 'string', description: "e.g. 'No capo', 'Capo 2'" },
      mode: { type: 'string', description: "e.g. 'A natural minor / A pentatonic minor'" },
      chords: {
        type: 'array',
        description:
          'Chords used in the song. Provide the name only — voicings for common chords are resolved automatically. Only include frets for unusual chords not found in a standard open-position dictionary.',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: "e.g. 'D', 'Cadd9', 'F#m'" },
            frets: {
              type: 'array',
              items: { type: 'number' },
              minItems: 6,
              maxItems: 6,
              description: 'Optional. [E, A, D, G, B, e] low→high. -1=muted, 0=open.',
            },
          },
          required: ['name'],
        },
      },
      structureLines: {
        type: 'array',
        maxItems: 3,
        description:
          'Line 1: full section sequence. Line 2: main riff/chord pattern. Line 3: chorus/pivot pattern.',
        items: { type: 'string' },
      },
      introRiff: {
        type: 'object',
        properties: {
          annotation: { type: 'string', description: "e.g. '× 2 — theme riff'" },
          chordLabels: {
            type: 'array',
            items: {
              type: 'object',
              properties: { text: { type: 'string' }, x: { type: 'number' } },
              required: ['text', 'x'],
            },
          },
          barLines: {
            type: 'array',
            items: { type: 'number' },
            description: 'Always start with 44, end with 738',
          },
          doubleBarX: { type: 'number', description: 'Always 740' },
          cols: {
            type: 'array',
            description:
              'Tab columns. strings: [e, B, G, D, A, E] top→bottom. Use empty string to skip.',
            items: {
              type: 'object',
              properties: {
                x: { type: 'number' },
                strings: { type: 'array', items: { type: 'string' }, minItems: 6, maxItems: 6 },
              },
              required: ['x', 'strings'],
            },
          },
          extraAnnotations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                x: { type: 'number' },
                y: { type: 'number' },
                small: { type: 'boolean' },
              },
              required: ['text', 'x', 'y'],
            },
          },
        },
        required: ['annotation', 'chordLabels', 'barLines', 'doubleBarX', 'cols'],
      },
      verseAnnotation: { type: 'string' },
      verseAnnotationX: {
        type: 'number',
        description: 'x position immediately after the VERSE label. Typically 92.',
      },
      verseRows: {
        type: 'array',
        maxItems: 4,
        items: {
          type: 'object',
          properties: {
            chords: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  x: { type: 'number' },
                  pivot: { type: 'boolean' },
                },
                required: ['name', 'x'],
              },
            },
            lyrics: {
              type: 'array',
              items: {
                type: 'object',
                properties: { text: { type: 'string' }, x: { type: 'number' } },
                required: ['text', 'x'],
              },
            },
            pivotAnnotation: {
              type: 'object',
              properties: { text: { type: 'string' }, x: { type: 'number' } },
            },
          },
          required: ['chords', 'lyrics'],
        },
      },
      chorusAnnotation: { type: 'string' },
      chorusAnnotationX: {
        type: 'number',
        description: 'x position immediately after the CHORUS label. Typically 100.',
      },
      chorusRows: {
        type: 'array',
        maxItems: 4,
        items: {
          type: 'object',
          properties: {
            chords: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  x: { type: 'number' },
                  pivot: { type: 'boolean' },
                },
                required: ['name', 'x'],
              },
            },
            lyrics: {
              type: 'array',
              items: {
                type: 'object',
                properties: { text: { type: 'string' }, x: { type: 'number' } },
                required: ['text', 'x'],
              },
            },
            pivotAnnotation: {
              type: 'object',
              properties: { text: { type: 'string' }, x: { type: 'number' } },
            },
          },
          required: ['chords', 'lyrics'],
        },
      },
      harmonicCols: {
        type: 'array',
        maxItems: 4,
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            chords: { type: 'string' },
            mode: { type: 'string' },
            modeDetail: { type: 'string' },
            row5: { type: 'string', description: 'Safe notes or warning text' },
            row5Warning: { type: 'boolean', description: 'true = render row5 in red' },
            row6: { type: 'string', description: 'Avoid notes or additional info' },
            pageRef: { type: 'string', description: "Optional, e.g. '→ p.2 for fretboard map'" },
          },
          required: ['title', 'chords', 'mode', 'modeDetail', 'row5', 'row6'],
        },
      },
    },
    required: [
      'title',
      'artist',
      'album',
      'year',
      'key',
      'tempo',
      'timeSig',
      'tuning',
      'capo',
      'mode',
      'chords',
      'structureLines',
      'introRiff',
      'verseAnnotation',
      'verseAnnotationX',
      'verseRows',
      'chorusAnnotation',
      'chorusAnnotationX',
      'chorusRows',
      'harmonicCols',
    ],
  },
};
