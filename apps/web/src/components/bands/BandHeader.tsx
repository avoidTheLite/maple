import type { SongData } from '@maple/types';
import { ChordDiagram } from '../music/ChordDiagram.tsx';
import {
  DIAGRAM_HEIGHT,
  DIAGRAM_ROW_GAP,
  DIAGRAM_SPACING,
  DIAGRAM_WIDTH,
  DIAGRAM_X_START,
  DIAGRAMS_Y,
  FORM_FONT_SIZE,
  computeFormLayout,
} from './bandHeaderLayout.ts';

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

  const { formWidth, formStartX, formTextX, chordsPerRow } = computeFormLayout(structureLines);

  const shownChords = chords.slice(0, chordsPerRow * 2);
  const chordRows: (typeof chords)[] = [];
  for (let i = 0; i < shownChords.length; i += chordsPerRow) {
    chordRows.push(shownChords.slice(i, i + chordsPerRow));
  }

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
      <text x={formStartX + 2} y="62" className="sec">
        FORM
      </text>

      {chordRows.map((rowChords, rowIdx) =>
        rowChords.map((chord, i) => (
          <g
            key={`${rowIdx}-${chord.name}-${i}`}
            transform={`translate(${DIAGRAM_X_START + i * DIAGRAM_SPACING}, ${DIAGRAMS_Y + rowIdx * (DIAGRAM_HEIGHT + DIAGRAM_ROW_GAP)})`}
          >
            <ChordDiagram chord={chord} />
          </g>
        )),
      )}

      <clipPath id="form-clip">
        <rect x={formStartX} y={DIAGRAMS_Y} width={formWidth} height="46" />
      </clipPath>
      <rect x={formStartX} y={DIAGRAMS_Y} width={formWidth} height="46" className="cbox" rx="3" />
      <g clipPath="url(#form-clip)">
        {structureLines.map((line, i) => (
          <text
            key={i}
            x={formTextX}
            y={91 + i * 13}
            className="met"
            style={{ fontSize: `${FORM_FONT_SIZE}px` }}
          >
            {line}
          </text>
        ))}
      </g>

      <line x1="48" y1="192" x2="740" y2="192" className="div" />
    </>
  );
};
