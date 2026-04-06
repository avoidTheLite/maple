import React from "react";
import { Chord } from "../../types/music";

// String x positions (left=low E, right=high e)
const STRING_X = [4, 10, 16, 22, 28, 34];
const FRET_LINES_Y = [15, 23, 31, 39];
const NUT_Y = 7;
const STRINGS_BOTTOM_Y = 43;

// Dot centre y for a given fret (1-indexed)
const fretDotY = (fret: number) => 3 + fret * 8;

interface Props {
  chord: Chord;
  width?: number;
  height?: number;
}

export const ChordDiagram: React.FC<Props> = ({ chord, width = 38, height = 46 }) => {
  const midX = width / 2;
  const right = width - 4;
  const nameFontSize = chord.name.length > 4 ? "8.5px" : "10px";

  return (
    <g>
      <rect width={width} height={height} rx="2" className="cbox" />

      <text x={midX} y="-3" textAnchor="middle" className="chn" style={{ fontSize: nameFontSize }}>
        {chord.name}
      </text>

      {/* Nut */}
      <line x1="4" y1={NUT_Y} x2={right} y2={NUT_Y} className="nut" />

      {/* Fret lines */}
      {FRET_LINES_Y.map(y => (
        <line key={y} x1="4" y1={y} x2={right} y2={y} className="fl" />
      ))}

      {/* String lines */}
      {STRING_X.map(x => (
        <line key={x} x1={x} y1={NUT_Y} x2={x} y2={STRINGS_BOTTOM_Y} className="fl" />
      ))}

      {/* Markers: x = muted, o = open, dot = fretted */}
      {chord.frets.map((fret, i) => {
        const cx = STRING_X[i];
        if (fret === -1) {
          return <text key={i} x={cx} y="5" textAnchor="middle" className="csub">x</text>;
        }
        if (fret === 0) {
          return <text key={i} x={cx} y="5" textAnchor="middle" className="csub">o</text>;
        }
        return <circle key={i} cx={cx} cy={fretDotY(fret)} r="3" className="cdot" />;
      })}
    </g>
  );
};
