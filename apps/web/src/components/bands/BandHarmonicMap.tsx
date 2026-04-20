import type { HarmonicCol } from '@maple/types';

const LABEL_OFFSET = 13;
const BOX_OFFSET = 20;
const BOX_H = 108;
const COL_DIVIDERS_X = [221, 394, 567];
const COL_X = [60, 232, 406, 578];
const ROW_OFFSETS = [38, 52, 66, 78, 92, 104, 118] as const;
const DIVIDER_OFFSET = 138;

interface BandHarmonicMapProps {
  cols: HarmonicCol[];
  y: number;
  colXOverrides?: number[];
}

export const BandHarmonicMap = ({
  cols,
  y,
  colXOverrides,
}: BandHarmonicMapProps): React.JSX.Element => {
  const boxY = y + BOX_OFFSET;
  const rowY = ROW_OFFSETS.map((o) => y + o);

  return (
    <>
      <text x="48" y={y + LABEL_OFFSET} className="sec">
        HARMONIC MAP
      </text>
      <rect x="48" y={boxY} width="692" height={BOX_H} className="cbox" rx="3" />

      {COL_DIVIDERS_X.map((x) => (
        <line
          key={x}
          x1={x}
          y1={boxY + 4}
          x2={x}
          y2={boxY + BOX_H - 4}
          stroke="#C09040"
          strokeWidth="0.5"
          opacity="0.4"
        />
      ))}

      {cols.map((col, ci) => {
        const x = colXOverrides?.[ci] ?? COL_X[ci];
        return (
          <g key={ci}>
            <text x={x} y={rowY[0]} className="met" style={{ fontWeight: 'bold' }}>
              {col.title}
            </text>
            <text x={x} y={rowY[1]} className="met">
              {col.chords}
            </text>
            <text x={x} y={rowY[2]} className="hl">
              {col.mode}
            </text>
            <text x={x} y={rowY[3]} className="hl">
              {col.modeDetail}
            </text>
            <text
              x={x}
              y={rowY[4]}
              className="met"
              style={{ fontSize: '8px', ...(col.row5Warning ? { fill: '#8B2000' } : {}) }}
            >
              {col.row5}
            </text>
            <text x={x} y={rowY[5]} className="met" style={{ fontSize: '8px' }}>
              {col.row6}
            </text>
            {col.pageRef && (
              <text x={x} y={rowY[6]} className="hl">
                {col.pageRef}
              </text>
            )}
          </g>
        );
      })}

      <line x1="48" y1={y + DIVIDER_OFFSET} x2="740" y2={y + DIVIDER_OFFSET} className="div" />
    </>
  );
};
