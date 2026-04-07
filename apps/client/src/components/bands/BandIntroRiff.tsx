import type { IntroRiffData } from '@maple/types';

const TAB_LINE_Y = [176, 188, 200, 212, 224, 236];
const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E'];

interface BandIntroRiffProps {
  data: IntroRiffData;
}

const BandIntroRiff = ({ data }: BandIntroRiffProps) => {
  const { annotation, chordLabels, barLines, doubleBarX, cols, extraAnnotations } = data;

  return (
    <>
      <text x="48" y="153" className="sec">INTRO RIFF  </text>
      <text x="118" y="153" className="hl">{annotation}</text>

      {chordLabels.map(cl => (
        <text key={cl.text} x={cl.x} y="165" className="chn">{cl.text}</text>
      ))}

      {STRING_LABELS.map((label, i) => (
        <text key={label} x="42" y={TAB_LINE_Y[i] + 3} textAnchor="end" className="sl">{label}</text>
      ))}

      {TAB_LINE_Y.map(y => (
        <line key={y} x1="44" y1={y} x2="740" y2={y} className="tline" />
      ))}

      {barLines.map(x => (
        <line key={x} x1={x} y1={TAB_LINE_Y[0]} x2={x} y2={TAB_LINE_Y[5]} className="bar" />
      ))}
      <line x1={doubleBarX} y1={TAB_LINE_Y[0]} x2={doubleBarX} y2={TAB_LINE_Y[5]} className="bar2" />

      {cols.map((col, ci) =>
        col.strings.map((val, si) =>
          val !== '' ? (
            <text key={`${ci}-${si}`} x={col.x} y={TAB_LINE_Y[si] + 3} className="tn">
              {String(val)}
            </text>
          ) : null
        )
      )}

      {extraAnnotations?.map((ann, i) => (
        <text key={i} x={ann.x} y={ann.y} className="hl" style={ann.small ? { fontSize: '7px' } : undefined}>
          {ann.text}
        </text>
      ))}

      <line x1="48" y1="279" x2="740" y2="279" className="div" />
    </>
  );
};

export default BandIntroRiff;
