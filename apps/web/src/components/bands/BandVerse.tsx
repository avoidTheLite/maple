import type { LyricRow } from '@maple/types';

const LABEL_OFFSET = 13;
const CONTENT_OFFSET = 29;
const ROW_HEIGHT = 34;
const DIVIDER_OFFSET = 138;

interface BandVerseProps {
  annotation: string;
  annotationX: number;
  rows: LyricRow[];
  y: number;
  rowYOffsets?: number[];
}

export const BandVerse = ({
  annotation,
  annotationX,
  rows,
  y,
  rowYOffsets,
}: BandVerseProps): React.JSX.Element => (
  <>
    <text x="48" y={y + LABEL_OFFSET} className="sec">
      VERSE{' '}
    </text>
    <text x={annotationX} y={y + LABEL_OFFSET} className="hl">
      {annotation}
    </text>

    {rows.map((row, ri) => {
      const rowYOffset = rowYOffsets?.[ri] ?? 0;
      const chordY = y + CONTENT_OFFSET + ri * ROW_HEIGHT + rowYOffset;
      const lyricY = chordY + 14;
      const sepY = chordY + 18;

      return (
        <g key={ri}>
          {row.chords.map((c) => (
            <text key={c.name + c.x} x={c.x} y={chordY} className="chn">
              {c.name}
            </text>
          ))}
          {row.lyrics.map((l, li) => (
            <text key={li} x={l.x} y={lyricY} className="lyr">
              {l.text}
            </text>
          ))}
          {ri < rows.length - 1 && <line x1="48" y1={sepY} x2="740" y2={sepY} className="rowsep" />}
        </g>
      );
    })}

    <line x1="48" y1={y + DIVIDER_OFFSET} x2="740" y2={y + DIVIDER_OFFSET} className="div" />
  </>
);
