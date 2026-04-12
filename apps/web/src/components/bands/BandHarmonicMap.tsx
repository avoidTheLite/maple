import type { HarmonicCol } from '@maple/types';

const LABEL_Y = 629;
const BOX_Y = 636;
const BOX_H = 108;
const COL_DIVIDERS_X = [221, 394, 567];
const COL_X = [60, 232, 406, 578];
const ROW_Y = [654, 668, 682, 694, 708, 720, 734];

interface BandHarmonicMapProps {
  cols: HarmonicCol[];
}

export const BandHarmonicMap = ({ cols }: BandHarmonicMapProps): React.JSX.Element => (
  <>
    <text x="48" y={LABEL_Y} className="sec">
      HARMONIC MAP
    </text>
    <rect x="48" y={BOX_Y} width="692" height={BOX_H} className="cbox" rx="3" />

    {COL_DIVIDERS_X.map((x) => (
      <line
        key={x}
        x1={x}
        y1={BOX_Y + 4}
        x2={x}
        y2={BOX_Y + BOX_H - 4}
        stroke="#C09040"
        strokeWidth="0.5"
        opacity="0.4"
      />
    ))}

    {cols.map((col, ci) => {
      const x = COL_X[ci];
      return (
        <g key={ci}>
          <text x={x} y={ROW_Y[0]} className="met" style={{ fontWeight: 'bold' }}>
            {col.title}
          </text>
          <text x={x} y={ROW_Y[1]} className="met">
            {col.chords}
          </text>
          <text x={x} y={ROW_Y[2]} className="hl">
            {col.mode}
          </text>
          <text x={x} y={ROW_Y[3]} className="hl">
            {col.modeDetail}
          </text>
          <text
            x={x}
            y={ROW_Y[4]}
            className="met"
            style={{ fontSize: '8px', ...(col.row5Warning ? { fill: '#8B2000' } : {}) }}
          >
            {col.row5}
          </text>
          <text x={x} y={ROW_Y[5]} className="met" style={{ fontSize: '8px' }}>
            {col.row6}
          </text>
          {col.pageRef && (
            <text x={x} y={ROW_Y[6]} className="hl">
              {col.pageRef}
            </text>
          )}
        </g>
      );
    })}

    <line x1="48" y1="754" x2="740" y2="754" className="div" />
  </>
);
