import type { LyricRow } from '@maple/types';

const LABEL_OFFSET = 13;
const CONTENT_OFFSET = 29;
const ROW_HEIGHT = 34;
const DIVIDER_OFFSET = 139;

interface BandChorusProps {
  annotation: string;
  annotationX: number;
  rows: LyricRow[];
  y: number;
}

export const BandChorus = ({
  annotation,
  annotationX,
  rows,
  y,
}: BandChorusProps): React.JSX.Element => (
  <>
    <text x="48" y={y + LABEL_OFFSET} className="sec">
      CHORUS{' '}
    </text>
    <text x={annotationX} y={y + LABEL_OFFSET} className="hl">
      {annotation}
    </text>

    {rows.map((row, ri) => {
      const chordY = y + CONTENT_OFFSET + ri * ROW_HEIGHT;
      const lyricY = chordY + 14;
      const sepY = chordY + 18;
      const pivotChords = row.chords.filter((c) => c.pivot);

      return (
        <g key={ri}>
          {pivotChords.map((pc) => (
            <rect
              key={pc.name + 'rect'}
              x={pc.x - 3}
              y={chordY - 9}
              width="24"
              height="13"
              className="pv"
              rx="2"
            />
          ))}
          {row.chords.map((c) => (
            <text key={c.name + c.x} x={c.x} y={chordY} className="chn">
              {c.name}
            </text>
          ))}
          {row.pivotAnnotation && (
            <text x={row.pivotAnnotation.x} y={chordY - 1} className="hl">
              {row.pivotAnnotation.text}
            </text>
          )}
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
