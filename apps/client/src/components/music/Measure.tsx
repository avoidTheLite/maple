import React from "react";
import { COLORS } from "../../constants/layout";

interface MeasureData {
  chords: { chord: string; beat: number }[];
  lyrics?: string;
}

interface Props {
  measure: MeasureData;
  width: number;
  height: number;
}

export const MeasureComponent: React.FC<Props> = ({ measure, width, height }) => (
  <g>
    <line x1="0" y1="0" x2="0" y2={height} stroke={COLORS.staff} strokeWidth="1" opacity="0.4" />
    {measure.chords.map((m, i) => (
      <text
        key={i}
        x={((m.beat - 1) / 4) * width + 4}
        y="10"
        fontSize="10px"
        fontWeight="bold"
        fontFamily="Georgia"
        fill={COLORS.textAccent}
      >
        {m.chord}
      </text>
    ))}
    {measure.lyrics && (
      <text x="4" y="26" fontSize="10px" fontFamily="Georgia" fill={COLORS.textPrimary}>
        {measure.lyrics}
      </text>
    )}
  </g>
);
