import { MapleCanvas } from "./components/MapleCanvas";
import { BandHeader } from "./components/bands/BandHeader";
import { BandIntroRiff } from "./components/bands/BandIntroRiff";
import { BandVerse } from "./components/bands/BandVerse";
import { BandChorus } from "./components/bands/BandChorus";
import { BandHarmonicMap } from "./components/bands/BandHarmonicMap";
import { BandNotes } from "./components/bands/BandNotes";
import { SongData } from "./types/music";

const BlueOnBlack: SongData = {
  title: "Blue on Black",
  artist: "Kenny Wayne Shepherd",
  album: "Trouble Is...",
  year: "1997",
  key: "D",
  tempo: "♩=78",
  timeSig: "4/4",
  tuning: "Standard",
  capo: "No capo",
  mode: "D pent. minor / D mixolydian",

  chords: [
    { name: "D",     frets: [-1, -1, 0, 2, 3, 2] },
    { name: "Cadd9", frets: [-1, 3, 2, 0, 3, 3] },
    { name: "G",     frets: [3, 2, 0, 0, 3, 3] },
    { name: "A",     frets: [-1, 0, 2, 2, 2, 0] },
  ],

  structureLines: [
    "Intro  →  Verse 1  →  Chorus  →  Verse 2  →  Chorus  →  Solo  →  Outro",
    "Main riff:  D – Cadd9 – G  ( × 4 per verse )",
    "Chorus:  D – C – G  then  A – G  ( V pivot ) → D",
  ],

  introRiff: {
    annotation: "× 2  — same pattern as verse backbone",
    chordLabels: [
      { text: "D",     x: 72  },
      { text: "Cadd9", x: 245 },
      { text: "G",     x: 435 },
    ],
    barLines: [44, 233, 423, 738],
    doubleBarX: 740,
    cols: [
      { x: 58,  strings: ["2", "3", "2", "0", "0", "–"] },
      { x: 88,  strings: ["2", "3", "0", "0", "0", "–"] },
      { x: 247, strings: ["3", "3", "0", "2", "3", "–"] },
      { x: 437, strings: ["3", "3", "0", "0", "2", "3"] },
      { x: 485, strings: ["",  "",  "",  "",  "0h2", ""] },
      { x: 540, strings: ["",  "",  "",  "",  "",  "3b"] },
    ],
    extraAnnotations: [
      { text: "↑ bend to pitch", x: 540, y: 252, small: true },
    ],
  },

  verseAnnotation: "D – Cadd9 – G  ( × 4 )",
  verseAnnotationX: 92,
  verseRows: [
    {
      chords: [
        { name: "D",     x: 52  }, { name: "Cadd9", x: 192 }, { name: "G", x: 316 },
        { name: "D",     x: 374 }, { name: "Cadd9", x: 514 }, { name: "G", x: 638 },
      ],
      lyrics: [
        { text: "Night falls,", x: 52  }, { text: "and I'm", x: 198 },
        { text: "a-",           x: 320 }, { text: "lone",   x: 378 },
      ],
    },
    {
      chords: [
        { name: "D",     x: 52  }, { name: "Cadd9", x: 192 }, { name: "G", x: 316 },
        { name: "D",     x: 374 }, { name: "Cadd9", x: 514 }, { name: "G", x: 638 },
      ],
      lyrics: [
        { text: "Skin, yeah,",  x: 52  }, { text: "chilled me", x: 198 },
        { text: "to the",       x: 320 }, { text: "bone",       x: 378 },
      ],
    },
    {
      chords: [
        { name: "D",     x: 52  }, { name: "Cadd9", x: 192 }, { name: "G", x: 316 },
        { name: "D",     x: 374 }, { name: "Cadd9", x: 514 }, { name: "G", x: 638 },
      ],
      lyrics: [
        { text: "You turned",        x: 52  }, { text: "and you ran,", x: 198 },
        { text: "oh yeah",           x: 378 },
      ],
    },
    {
      chords: [
        { name: "D",     x: 52  }, { name: "Cadd9", x: 192 }, { name: "G", x: 316 },
        { name: "D",     x: 374 }, { name: "Cadd9", x: 514 }, { name: "G", x: 638 },
      ],
      lyrics: [
        { text: "Oh, slipped right from my hand", x: 52 },
      ],
    },
  ],

  chorusAnnotation: "A pivot on \"won't bring you back\"",
  chorusAnnotationX: 100,
  chorusRows: [
    {
      chords: [
        { name: "D", x: 52 }, { name: "C", x: 270 }, { name: "G", x: 446 },
      ],
      lyrics: [
        { text: "Blue on black,  tears on a river,", x: 52  },
        { text: "push on a shove,",                  x: 276 },
        { text: "don't mean much",                   x: 452 },
      ],
    },
    {
      chords: [
        { name: "D", x: 52 }, { name: "C", x: 270 }, { name: "G", x: 446 },
      ],
      lyrics: [
        { text: "Joker on jack,  match on a fire,", x: 52  },
        { text: "cold on ice,",                     x: 276 },
        { text: "a dead man's touch",               x: 452 },
      ],
    },
    {
      chords: [
        { name: "D", x: 52 }, { name: "C", x: 270 }, { name: "G", x: 446 },
      ],
      lyrics: [
        { text: "Whisper on a scream,",       x: 52  },
        { text: "doesn't change a thing.",    x: 276 },
      ],
    },
    {
      chords: [
        { name: "D", x: 52  }, { name: "C", x: 270 }, { name: "G", x: 446 },
        { name: "A", x: 586, pivot: true }, { name: "G", x: 630 },
      ],
      lyrics: [
        { text: "Won't bring you back —  Blue on black", x: 52 },
      ],
      pivotAnnotation: { text: "← V pivot", x: 589 },
    },
  ],

  harmonicCols: [
    {
      title:      "Verse / Intro",
      chords:     "D – Cadd9 – G",
      mode:       "D mixolydian",
      modeDetail: "D pent. minor",
      row5:       "Safe: D E F# G A C",
      row6:       "Avoid: C# (diatonic major)",
      pageRef:    "→ p.2 for fretboard map",
    },
    {
      title:      "Chorus",
      chords:     "D – C – G",
      mode:       "Same palette",
      modeDetail: "denser rhythm feel",
      row5:       "C natural = ♭7",
      row6:       "Strong mixolydian colour",
    },
    {
      title:      "Chorus pivot",
      chords:     "A – G  (bar 3)",
      mode:       "V chord tension",
      modeDetail: "resolves back to D",
      row5:       "A = V of D (dominant)",
      row6:       "Creates lift before resolve",
    },
    {
      title:      "Solo",
      chords:     "D pent. minor",
      mode:       "D F G A C",
      modeDetail: "no E, no B",
      row5:       "⚠ not diatonic minor",
      row5Warning: true,
      row6:       "F# clashes here",
      pageRef:    "→ solo tab on p.2",
    },
  ],
};

const App = () => (
  <div style={{ background: "#333", padding: "20px", display: "inline-block" }}>
    <MapleCanvas>
      <BandHeader song={BlueOnBlack} />
      <BandIntroRiff data={BlueOnBlack.introRiff} />
      <BandVerse
        annotation={BlueOnBlack.verseAnnotation}
        annotationX={BlueOnBlack.verseAnnotationX}
        rows={BlueOnBlack.verseRows}
      />
      <BandChorus
        annotation={BlueOnBlack.chorusAnnotation}
        annotationX={BlueOnBlack.chorusAnnotationX}
        rows={BlueOnBlack.chorusRows}
      />
      <BandHarmonicMap cols={BlueOnBlack.harmonicCols} />
      <BandNotes
        title={BlueOnBlack.title}
        artist={BlueOnBlack.artist}
        pageNumber={1}
      />
    </MapleCanvas>
  </div>
);

export default App;
