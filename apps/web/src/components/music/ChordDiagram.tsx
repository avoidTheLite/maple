import type { Chord } from '@maple/types';

const STRING_X = [4, 10, 16, 22, 28, 34];
const FRET_LINES_Y = [15, 23, 31, 39];
const NUT_Y = 7;
const STRINGS_BOTTOM_Y = 43;

const fretDotY = (fret: number): number => 3 + fret * 8;

interface ChordDiagramProps {
  chord: Chord;
  width?: number;
  height?: number;
}

export const ChordDiagram = ({
  chord,
  width = 38,
  height = 46,
}: ChordDiagramProps): React.JSX.Element => {
  const midX = width / 2;
  const right = width - 4;
  const nameFontSize = chord.name.length > 4 ? '8.5px' : '10px';

  return (
    <g>
      <rect width={width} height={height} rx="2" className="cbox" />
      <text x={midX} y="-3" textAnchor="middle" className="chn" style={{ fontSize: nameFontSize }}>
        {chord.name}
      </text>
      <line x1="4" y1={NUT_Y} x2={right} y2={NUT_Y} className="nut" />
      {FRET_LINES_Y.map((y) => (
        <line key={y} x1="4" y1={y} x2={right} y2={y} className="fl" />
      ))}
      {STRING_X.map((x) => (
        <line key={x} x1={x} y1={NUT_Y} x2={x} y2={STRINGS_BOTTOM_Y} className="fl" />
      ))}
      {chord.frets.map((fret, i) => {
        const cx = STRING_X[i];
        if (fret === -1)
          return (
            <text key={i} x={cx} y="5" textAnchor="middle" className="csub">
              x
            </text>
          );
        if (fret === 0)
          return (
            <text key={i} x={cx} y="5" textAnchor="middle" className="csub">
              o
            </text>
          );
        return <circle key={i} cx={cx} cy={fretDotY(fret)} r="3" className="cdot" />;
      })}
    </g>
  );
};
