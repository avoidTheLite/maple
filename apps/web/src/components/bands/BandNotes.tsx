import { A4_HEIGHT } from '../../constants/layout.ts';

const LABEL_OFFSET = 13;
const FIRST_LINE_OFFSET = 26;
const LINE_SPACING = 22;
const FOOTER_LINE_Y = A4_HEIGHT - 19; // 1103
const FOOTER_TEXT_Y = A4_HEIGHT - 7; // 1115

interface BandNotesProps {
  title: string;
  artist: string;
  pageNumber?: number;
  y: number;
}

export const BandNotes = ({
  title,
  artist,
  pageNumber = 1,
  y,
}: BandNotesProps): React.JSX.Element => {
  const firstLineY = y + FIRST_LINE_OFFSET;
  const available = FOOTER_LINE_Y - firstLineY;
  const lineCount = Math.max(1, Math.floor(available / LINE_SPACING));
  const lines = Array.from({ length: lineCount }, (_, i) => firstLineY + i * LINE_SPACING);

  return (
    <>
      <text x="48" y={y + LABEL_OFFSET} className="sec">
        NOTES
      </text>

      {lines.map((ly) => (
        <line
          key={ly}
          x1="48"
          y1={ly}
          x2="740"
          y2={ly}
          stroke="#8B6914"
          strokeWidth="0.4"
          opacity="0.22"
        />
      ))}

      <line
        x1="48"
        y1={FOOTER_LINE_Y}
        x2="740"
        y2={FOOTER_LINE_Y}
        stroke="#A07828"
        strokeWidth="0.4"
        opacity="0.35"
      />
      <text x="48" y={FOOTER_TEXT_Y} className="pf">
        maple
      </text>
      <text x="394" y={FOOTER_TEXT_Y} textAnchor="middle" className="pf">
        {title.toLowerCase()} · {artist.toLowerCase()}
      </text>
      <text x="740" y={FOOTER_TEXT_Y} textAnchor="end" className="pf">
        {pageNumber}
      </text>
    </>
  );
};
