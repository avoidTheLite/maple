import type { IntroRiffData } from '@maple/types';

// Offsets relative to the section's own top (y prop).
const LABEL_OFFSET = 15;
const CHORD_LABEL_OFFSET = 27;
// extraAnnotations.y values are relative to this section's top.
const TAB_LINE_OFFSETS = [38, 50, 62, 74, 86, 98] as const;
const DIVIDER_OFFSET = 141;

const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E'] as const;

interface BandIntroRiffProps {
  data: IntroRiffData;
  y: number;
  barLineOverrides?: number[];
  colXOverrides?: number[];
}

export const BandIntroRiff = ({
  data,
  y,
  barLineOverrides,
  colXOverrides,
}: BandIntroRiffProps): React.JSX.Element => {
  const { annotation, chordLabels, barLines, doubleBarX, cols, extraAnnotations } = data;
  const effectiveBarLines = barLineOverrides ?? barLines;
  const effectiveCols = cols.map((col, i) => ({ ...col, x: colXOverrides?.[i] ?? col.x }));

  const tabY = TAB_LINE_OFFSETS.map((o) => y + o);

  return (
    <>
      <text x="48" y={y + LABEL_OFFSET} className="sec">
        INTRO RIFF{' '}
      </text>
      <text x="118" y={y + LABEL_OFFSET} className="hl">
        {annotation}
      </text>

      {chordLabels.map((cl) => (
        <text key={cl.text} x={cl.x} y={y + CHORD_LABEL_OFFSET} className="chn">
          {cl.text}
        </text>
      ))}

      {STRING_LABELS.map((label, i) => (
        <text key={label} x="42" y={tabY[i] + 3} textAnchor="end" className="sl">
          {label}
        </text>
      ))}

      {tabY.map((ty) => (
        <line key={ty} x1="44" y1={ty} x2="740" y2={ty} className="tline" />
      ))}

      {effectiveBarLines.map((x) => (
        <line key={x} x1={x} y1={tabY[0]} x2={x} y2={tabY[5]} className="bar" />
      ))}
      <line x1={doubleBarX} y1={tabY[0]} x2={doubleBarX} y2={tabY[5]} className="bar2" />

      {effectiveCols.map((col, ci) =>
        col.strings.map((val, si) =>
          val !== '' ? (
            <text key={`${ci}-${si}`} x={col.x} y={tabY[si] + 3} className="tn">
              {String(val)}
            </text>
          ) : null,
        ),
      )}

      {extraAnnotations?.map((ann, i) => (
        <text
          key={i}
          x={ann.x}
          y={y + ann.y}
          className="hl"
          style={ann.small ? { fontSize: '7px' } : undefined}
        >
          {ann.text}
        </text>
      ))}

      <line x1="48" y1={y + DIVIDER_OFFSET} x2="740" y2={y + DIVIDER_OFFSET} className="div" />
    </>
  );
};
