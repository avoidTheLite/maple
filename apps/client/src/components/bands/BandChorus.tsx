import type { LyricRow } from '@maple/types';

const BAND_TOP = 421;
const LABEL_Y = BAND_TOP + 13;
const CONTENT_Y = LABEL_Y + 16;
const ROW_HEIGHT = 34;

interface BandChorusProps {
  annotation: string;
  annotationX: number;
  rows: LyricRow[];
}

const BandChorus = ({ annotation, annotationX, rows }: BandChorusProps) => (
  <>
    <text x="48" y={LABEL_Y} className="sec">CHORUS  </text>
    <text x={annotationX} y={LABEL_Y} className="hl">{annotation}</text>

    {rows.map((row, ri) => {
      const chordY = CONTENT_Y + ri * ROW_HEIGHT;
      const lyricY = chordY + 14;
      const sepY = chordY + 18;
      const pivotChords = row.chords.filter(c => c.pivot);

      return (
        <g key={ri}>
          {pivotChords.map(pc => (
            <rect key={pc.name + 'rect'} x={pc.x - 3} y={chordY - 9} width="24" height="13"
              className="pv" rx="2" />
          ))}
          {row.chords.map(c => (
            <text key={c.name + c.x} x={c.x} y={chordY} className="chn">{c.name}</text>
          ))}
          {row.pivotAnnotation && (
            <text x={row.pivotAnnotation.x} y={chordY - 1} className="hl">
              {row.pivotAnnotation.text}
            </text>
          )}
          {row.lyrics.map((l, li) => (
            <text key={li} x={l.x} y={lyricY} className="lyr">{l.text}</text>
          ))}
          {ri < rows.length - 1 && (
            <line x1="48" y1={sepY} x2="740" y2={sepY} className="rowsep" />
          )}
        </g>
      );
    })}

    <line x1="48" y1="560" x2="740" y2="560" className="div" />
  </>
);

export default BandChorus;
