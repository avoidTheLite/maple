import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const MAPLE_RENDERER_SUFFIX = `

---

You are generating structured data for the Maple React renderer. When asked to generate a sheet for a song, call the generate_maple_sheet tool with a fully populated SongData object.

Coordinate reference (memorise these):
- Safe area: x=48 to x=740 (692px wide)
- Two 4/4 measures per lyric row. Measure 1: x=52–394. Measure 2: x=398–740.
- Each measure is 346px wide. Beat 1 of each measure: measure_start + 4. Beat 3: measure_start + 177.
- Chord label x = position where that chord is first played in the measure.
- Lyric fragment x = x position of the chord it sits under.
- Chord diagrams: first at x=52, spacing=48px. Provide chord names only — frets are resolved automatically for standard open-position chords.
- Intro riff: tab lines at y=230,242,254,266,278,290. Bar dividers evenly space three measures across x=44–740.`;

export function buildSystemPrompt(): string {
  const instructionsPath = join(
    __dirname,
    '../../../../..',
    'reference',
    'maple_project_instructions.md',
  );
  const instructions = readFileSync(instructionsPath, 'utf-8');
  return `${instructions}${MAPLE_RENDERER_SUFFIX}`;
}
