const LABEL_Y = 715;
const FIRST_LINE_Y = 728;
const LINE_SPACING = 24;
const LINE_COUNT = 16;

interface BandNotesProps {
  title: string;
  artist: string;
  pageNumber?: number;
}

export const BandNotes = ({ title, artist, pageNumber = 1 }: BandNotesProps): React.JSX.Element => {
  const lines = Array.from({ length: LINE_COUNT }, (_, i) => FIRST_LINE_Y + i * LINE_SPACING);

  return (
    <>
      <text x="48" y={LABEL_Y} className="sec">
        NOTES
      </text>

      {lines.map((y) => (
        <line
          key={y}
          x1="48"
          y1={y}
          x2="740"
          y2={y}
          stroke="#8B6914"
          strokeWidth="0.4"
          opacity="0.22"
        />
      ))}

      <line
        x1="48"
        y1="1103"
        x2="740"
        y2="1103"
        stroke="#A07828"
        strokeWidth="0.4"
        opacity="0.35"
      />
      <text x="48" y="1115" className="pf">
        maple
      </text>
      <text x="394" y="1115" textAnchor="middle" className="pf">
        {title.toLowerCase()} · {artist.toLowerCase()}
      </text>
      <text x="740" y="1115" textAnchor="end" className="pf">
        {pageNumber}
      </text>
    </>
  );
};
