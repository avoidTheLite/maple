import type { SongData } from '@maple/types';
import { ChordDiagram } from '../music/ChordDiagram.tsx';

const DIAGRAM_X_START = 52;
const DIAGRAM_SPACING = 48;
const DIAGRAMS_Y = 78;

interface BandHeaderProps {
  song: SongData;
}

export const BandHeader = ({ song }: BandHeaderProps): React.JSX.Element => {
  const {
    title,
    artist,
    album,
    year,
    key,
    tempo,
    timeSig,
    tuning,
    capo,
    mode,
    chords,
    structureLines,
  } = song;

  return (
    <>
      <text x="48" y="20" className="ttl">
        {title}
      </text>
      <text x="48" y="33" className="sub">
        {artist} · {album} ({year})
      </text>
      <text x="490" y="20" className="met">
        Key: {key} · Tempo: {tempo} · {timeSig}
      </text>
      <text x="490" y="32" className="met">
        Tuning: {tuning} · {capo}
      </text>
      <text x="490" y="44" className="met">
        Mode: {mode}
      </text>
      <line x1="48" y1="38" x2="475" y2="38" stroke="#A07828" strokeWidth="0.5" opacity="0.4" />
      <line x1="48" y1="50" x2="740" y2="50" stroke="#A07828" strokeWidth="0.5" opacity="0.4" />

      <text x="48" y="62" className="sec">
        CHORDS USED
      </text>
      <text x="260" y="62" className="sec">
        STRUCTURE
      </text>

      {chords.slice(0, 5).map((chord, i) => (
        <g
          key={chord.name}
          transform={`translate(${DIAGRAM_X_START + i * DIAGRAM_SPACING}, ${DIAGRAMS_Y})`}
        >
          <ChordDiagram chord={chord} />
        </g>
      ))}

      <rect x="258" y={DIAGRAMS_Y} width="476" height="46" className="cbox" rx="3" />
      {structureLines.map((line, i) => (
        <text key={i} x="268" y={91 + i * 13} className="met">
          {line}
        </text>
      ))}

      <line x1="48" y1="138" x2="740" y2="138" className="div" />
    </>
  );
};
