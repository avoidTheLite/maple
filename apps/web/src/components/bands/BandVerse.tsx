import type { LyricRow } from '@maple/types';

const BAND_TOP = 281;
const LABEL_Y = BAND_TOP + 13;
const CONTENT_Y = LABEL_Y + 16;
const ROW_HEIGHT = 34;

interface BandVerseProps {
  annotation: string;
  annotationX: number;
  rows: LyricRow[];
}

export const BandVerse = ({ annotation, annotationX, rows }: BandVerseProps): React.JSX.Element => (
  <>
    <text x="48" y={LABEL_Y} className="sec">
      VERSE{' '}
    </text>
    <text x={annotationX} y={LABEL_Y} className="hl">
      {annotation}
    </text>

    {rows.map((row, ri) => {
      const chordY = CONTENT_Y + ri * ROW_HEIGHT;
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

    <line x1="48" y1="419" x2="740" y2="419" className="div" />
  </>
);
