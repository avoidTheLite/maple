import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { SongData } from '@maple/types';
import { MapleCanvas } from './components/MapleCanvas.tsx';
import { BandHeader } from './components/bands/BandHeader.tsx';
import { BandIntroRiff } from './components/bands/BandIntroRiff.tsx';
import { BandVerse } from './components/bands/BandVerse.tsx';
import { BandChorus } from './components/bands/BandChorus.tsx';
import { BandHarmonicMap } from './components/bands/BandHarmonicMap.tsx';
import { BandNotes } from './components/bands/BandNotes.tsx';
import { SongSearch } from './components/SongSearch.tsx';

const BlueOnBlack: SongData = {
  title: 'Blue on Black',
  artist: 'Kenny Wayne Shepherd',
  album: 'Trouble Is...',
  year: '1997',
  key: 'D',
  tempo: '♩=78',
  timeSig: '4/4',
  tuning: 'Standard',
  capo: 'No capo',
  mode: 'D pent. minor / D mixolydian',
  chords: [
    { name: 'D', frets: [-1, -1, 0, 2, 3, 2] },
    { name: 'Cadd9', frets: [-1, 3, 2, 0, 3, 3] },
    { name: 'G', frets: [3, 2, 0, 0, 3, 3] },
    { name: 'A', frets: [-1, 0, 2, 2, 2, 0] },
  ],
  structureLines: [
    'Intro → V1 → Ch → V2 → Ch → Solo → Outro',
    'Riff: D – Cadd9 – G',
    'Ch: D – C – G  ·  A–G→D',
  ],
  introRiff: {
    annotation: '× 2  — same pattern as verse backbone',
    chordLabels: [
      { text: 'D', x: 72 },
      { text: 'Cadd9', x: 245 },
      { text: 'G', x: 435 },
    ],
    barLines: [44, 233, 423, 738],
    doubleBarX: 740,
    cols: [
      { x: 58, strings: ['2', '3', '2', '0', '0', '–'] },
      { x: 88, strings: ['2', '3', '0', '0', '0', '–'] },
      { x: 247, strings: ['3', '3', '0', '2', '3', '–'] },
      { x: 437, strings: ['3', '3', '0', '0', '2', '3'] },
      { x: 485, strings: ['', '', '', '', '0h2', ''] },
      { x: 540, strings: ['', '', '', '', '', '3b'] },
    ],
    extraAnnotations: [{ text: '↑ bend to pitch', x: 540, y: 306, small: true }],
  },
  verseAnnotation: 'D – Cadd9 – G  ( × 4 )',
  verseAnnotationX: 92,
  verseRows: [
    {
      chords: [
        { name: 'D', x: 52 },
        { name: 'Cadd9', x: 192 },
        { name: 'G', x: 316 },
        { name: 'D', x: 374 },
        { name: 'Cadd9', x: 514 },
        { name: 'G', x: 638 },
      ],
      lyrics: [
        { text: 'Night falls,', x: 52 },
        { text: "and I'm", x: 198 },
        { text: 'a-', x: 320 },
        { text: 'lone', x: 378 },
      ],
    },
    {
      chords: [
        { name: 'D', x: 52 },
        { name: 'Cadd9', x: 192 },
        { name: 'G', x: 316 },
        { name: 'D', x: 374 },
        { name: 'Cadd9', x: 514 },
        { name: 'G', x: 638 },
      ],
      lyrics: [
        { text: 'Skin, yeah,', x: 52 },
        { text: 'chilled me', x: 198 },
        { text: 'to the', x: 320 },
        { text: 'bone', x: 378 },
      ],
    },
    {
      chords: [
        { name: 'D', x: 52 },
        { name: 'Cadd9', x: 192 },
        { name: 'G', x: 316 },
        { name: 'D', x: 374 },
        { name: 'Cadd9', x: 514 },
        { name: 'G', x: 638 },
      ],
      lyrics: [
        { text: 'You turned', x: 52 },
        { text: 'and you ran,', x: 198 },
        { text: 'oh yeah', x: 378 },
      ],
    },
    {
      chords: [
        { name: 'D', x: 52 },
        { name: 'Cadd9', x: 192 },
        { name: 'G', x: 316 },
        { name: 'D', x: 374 },
        { name: 'Cadd9', x: 514 },
        { name: 'G', x: 638 },
      ],
      lyrics: [{ text: 'Oh, slipped right from my hand', x: 52 }],
    },
  ],
  chorusAnnotation: 'A pivot on "won\'t bring you back"',
  chorusAnnotationX: 100,
  chorusRows: [
    {
      chords: [
        { name: 'D', x: 52 },
        { name: 'C', x: 270 },
        { name: 'G', x: 446 },
      ],
      lyrics: [
        { text: 'Blue on black,  tears on a river,', x: 52 },
        { text: 'push on a shove,', x: 276 },
        { text: "don't mean much", x: 452 },
      ],
    },
    {
      chords: [
        { name: 'D', x: 52 },
        { name: 'C', x: 270 },
        { name: 'G', x: 446 },
      ],
      lyrics: [
        { text: 'Joker on jack,  match on a fire,', x: 52 },
        { text: 'cold on ice,', x: 276 },
        { text: "a dead man's touch", x: 452 },
      ],
    },
    {
      chords: [
        { name: 'D', x: 52 },
        { name: 'C', x: 270 },
        { name: 'G', x: 446 },
      ],
      lyrics: [
        { text: 'Whisper on a scream,', x: 52 },
        { text: "doesn't change a thing.", x: 276 },
      ],
    },
    {
      chords: [
        { name: 'D', x: 52 },
        { name: 'C', x: 270 },
        { name: 'G', x: 446 },
        { name: 'A', x: 586, pivot: true },
        { name: 'G', x: 630 },
      ],
      lyrics: [{ text: "Won't bring you back —  Blue on black", x: 52 }],
      pivotAnnotation: { text: '← V pivot', x: 589 },
    },
  ],
  harmonicCols: [
    {
      title: 'Verse / Intro',
      chords: 'D – Cadd9 – G',
      mode: 'D mixolydian',
      modeDetail: 'D pent. minor',
      row5: 'Safe: D E F# G A C',
      row6: 'Avoid: C# (diatonic major)',
      pageRef: '→ p.2 for fretboard map',
    },
    {
      title: 'Chorus',
      chords: 'D – C – G',
      mode: 'Same palette',
      modeDetail: 'denser rhythm feel',
      row5: 'C natural = ♭7',
      row6: 'Strong mixolydian colour',
    },
    {
      title: 'Chorus pivot',
      chords: 'A – G  (bar 3)',
      mode: 'V chord tension',
      modeDetail: 'resolves back to D',
      row5: 'A = V of D (dominant)',
      row6: 'Creates lift before resolve',
    },
    {
      title: 'Solo',
      chords: 'D pent. minor',
      mode: 'D F G A C',
      modeDetail: 'no E, no B',
      row5: '⚠ not diatonic minor',
      row5Warning: true,
      row6: 'F# clashes here',
      pageRef: '→ solo tab on p.2',
    },
  ],
};

async function generateSongData(title: string, artist: string): Promise<SongData> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, artist }),
  });
  if (!res.ok) {
    const body = (await res.json()) as { error?: string };
    throw new Error(body.error ?? `Server error ${res.status}`);
  }
  return res.json() as Promise<SongData>;
}

export const App = (): React.JSX.Element => {
  const [song, setSong] = useState<SongData>(BlueOnBlack);

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ title, artist }: { title: string; artist: string }) =>
      generateSongData(title, artist),
    onSuccess: (data) => setSong(data),
  });

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className="min-h-screen bg-[#222] p-5">
      <SongSearch
        onGenerate={(title, artist) => mutate({ title, artist })}
        loading={isPending}
        error={errorMessage}
      />
      <div className="mt-5 inline-block">
        {isPending ? (
          <div className="px-10 py-10 font-serif text-sm text-[#aaa]">
            Generating sheet for {song.title}…
          </div>
        ) : (
          <MapleCanvas>
            <BandHeader song={song} />
            <BandIntroRiff data={song.introRiff} />
            <BandVerse
              annotation={song.verseAnnotation}
              annotationX={song.verseAnnotationX}
              rows={song.verseRows}
            />
            <BandChorus
              annotation={song.chorusAnnotation}
              annotationX={song.chorusAnnotationX}
              rows={song.chorusRows}
            />
            <BandHarmonicMap cols={song.harmonicCols} />
            <BandNotes title={song.title} artist={song.artist} pageNumber={1} />
          </MapleCanvas>
        )}
      </div>
    </div>
  );
};
