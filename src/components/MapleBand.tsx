import React from "react";
import { BAND_TOPS, SAFE_X_START } from "../constants/layout";

export const MapleBand: React.FC<{ index: number; title: string; children: React.ReactNode }> = ({
  index,
  title,
  children,
}) => (
  <g transform={`translate(${SAFE_X_START}, ${BAND_TOPS[index]})`}>
    <text y="14" fontSize="10px" fontFamily="Georgia" fill="#6B4C0A" opacity="0.75" letterSpacing="1.8px">
      {title.toUpperCase()}
    </text>
    <g transform="translate(0, 20)">{children}</g>
  </g>
);
