import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  SheetLayoutConfig,
  SheetLayoutItemConfig,
  SheetLayoutSectionConfig,
  SongData,
} from '@maple/types';
import { MapleCanvas } from './components/MapleCanvas.tsx';
import { BandHeader } from './components/bands/BandHeader.tsx';
import { BandIntroRiff } from './components/bands/BandIntroRiff.tsx';
import { BandVerse } from './components/bands/BandVerse.tsx';
import { BandChorus } from './components/bands/BandChorus.tsx';
import { BandHarmonicMap } from './components/bands/BandHarmonicMap.tsx';
import { BandNotes } from './components/bands/BandNotes.tsx';
import { SongSearch } from './components/SongSearch.tsx';
import {
  PAGE_HEIGHT,
  PAGE_WIDTH,
  applyAutoFill,
  buildDefaultLayoutConfig,
  mergeWithDefaults,
  toSongSlug,
} from './layout/layoutConfig.ts';
import { ApiError, generateSongData, loadLayoutConfig, saveLayoutConfig } from './api/client.ts';

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
    extraAnnotations: [{ text: '↑ bend to pitch', x: 540, y: 114, small: true }],
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

export const App = (): React.JSX.Element => {
  const VERSE_ROW_TOP_OFFSET = 23;
  const CHORUS_ROW_TOP_OFFSET = 23;
  const ROW_HEIGHT = 34;
  const ITEM_SNAP_DISTANCE = 16;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [song, setSong] = useState<SongData>(BlueOnBlack);
  const defaultLayout = useMemo(() => buildDefaultLayoutConfig(song), [song]);
  const [layoutConfig, setLayoutConfig] = useState<SheetLayoutConfig>(() =>
    buildDefaultLayoutConfig(BlueOnBlack),
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<
    | {
        kind: 'section';
        sectionId: string;
        startX: number;
        startY: number;
        originX: number;
        originY: number;
        originWidth: number;
        originHeight: number;
        mode: 'move' | 'resize';
      }
    | {
        kind: 'item';
        itemIds: string[];
        startX: number;
        startY: number;
        mode: 'move' | 'resize';
        origins: Record<string, { x: number; y: number; width: number; height: number }>;
      }
    | null
  >(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const songSlug = toSongSlug(song);
  const templateId = 'standard';
  const layoutQueryKey = ['layout', songSlug, templateId] as const;
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ title, artist }: { title: string; artist: string }) =>
      generateSongData(title, artist),
    onSuccess: (data) => setSong(data),
  });
  const { data: savedLayout } = useQuery({
    queryKey: layoutQueryKey,
    queryFn: () => loadLayoutConfig(songSlug, templateId),
    retry: false,
  });
  const saveLayoutMutation = useMutation({
    mutationFn: (layout: SheetLayoutConfig) => saveLayoutConfig(songSlug, templateId, layout),
    onSuccess: (saved) => {
      setLayoutConfig(saved);
      setSaveStatus('Saved layout.');
      queryClient.setQueryData(layoutQueryKey, saved);
    },
    onError: (mutationError) => {
      const message =
        mutationError instanceof Error ? mutationError.message : 'Failed to save layout.';
      setSaveStatus(message);
    },
  });

  const errorMessage = error instanceof ApiError || error instanceof Error ? error.message : null;

  useEffect(() => {
    setLayoutConfig(defaultLayout);
    setSelectedSectionId(null);
    setSelectedItemId(null);
    setDragState(null);
  }, [defaultLayout, songSlug]);
  useEffect(() => {
    if (!savedLayout) {
      return;
    }
    setLayoutConfig(mergeWithDefaults(defaultLayout, savedLayout));
  }, [defaultLayout, savedLayout]);

  useEffect(() => {
    if (mode !== 'edit') return;
    const onKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }
      const step = event.shiftKey ? 10 : 1;
      let dx = 0;
      let dy = 0;
      if (event.key === 'ArrowLeft') dx = -step;
      if (event.key === 'ArrowRight') dx = step;
      if (event.key === 'ArrowUp') dy = -step;
      if (event.key === 'ArrowDown') dy = step;
      if (!dx && !dy) return;
      event.preventDefault();

      setLayoutConfig((prev) => {
        if (selectedSectionId) {
          return {
            ...prev,
            sections: prev.sections.map((section) =>
              section.id === selectedSectionId
                ? { ...section, x: section.x + dx, y: section.y + dy, autoFill: false }
                : section,
            ),
            items: prev.items.map((item) => {
              const parent = prev.sections.find((section) => section.id === selectedSectionId);
              if (!parent || item.sectionId !== selectedSectionId) return item;
              return { ...item, x: item.x + dx, y: item.y + dy, autoFill: false };
            }),
          };
        }
        if (selectedItemId) {
          const merged = prev.mergeGroups.find(
            (group) => group.merged && group.memberItemIds.includes(selectedItemId),
          );
          const movingIds = merged ? merged.memberItemIds : [selectedItemId];
          return {
            ...prev,
            items: prev.items.map((item) =>
              movingIds.includes(item.id)
                ? { ...item, x: item.x + dx, y: item.y + dy, autoFill: false }
                : item,
            ),
          };
        }
        return prev;
      });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, selectedItemId, selectedSectionId]);

  const activeSections = useMemo(
    () =>
      [...layoutConfig.sections]
        .filter((section) => !section.parked)
        .sort((a, b) => a.order - b.order),
    [layoutConfig.sections],
  );

  const parkedSections = useMemo(
    () =>
      [...layoutConfig.sections]
        .filter((section) => section.parked)
        .sort((a, b) => a.order - b.order),
    [layoutConfig.sections],
  );

  const activeItems = useMemo(
    () => [...layoutConfig.items].filter((item) => !item.parked).sort((a, b) => a.index - b.index),
    [layoutConfig.items],
  );

  const parkedItems = useMemo(
    () => [...layoutConfig.items].filter((item) => item.parked).sort((a, b) => a.index - b.index),
    [layoutConfig.items],
  );

  const mergedItemIds = useMemo(() => {
    const ids = new Set<string>();
    for (const group of layoutConfig.mergeGroups) {
      if (!group.merged) continue;
      for (const id of group.memberItemIds) ids.add(id);
    }
    return ids;
  }, [layoutConfig.mergeGroups]);

  const mergedItemCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const group of layoutConfig.mergeGroups) {
      if (!group.merged) continue;
      for (const id of group.memberItemIds) {
        counts.set(id, group.memberItemIds.length);
      }
    }
    return counts;
  }, [layoutConfig.mergeGroups]);

  const toSvgPoint = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      return {
        x: ((clientX - rect.left) * PAGE_WIDTH) / rect.width,
        y: ((clientY - rect.top) * PAGE_HEIGHT) / rect.height,
      };
    },
    [],
  );

  const getMergedDragIds = useCallback(
    (itemId: string): string[] => {
      const group = layoutConfig.mergeGroups.find(
        (g) => g.merged && g.memberItemIds.includes(itemId),
      );
      return group ? [...group.memberItemIds] : [itemId];
    },
    [layoutConfig.mergeGroups],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (!dragState) return;
      const point = toSvgPoint(event.clientX, event.clientY);
      if (!point) return;

      const dx = point.x - dragState.startX;
      const dy = point.y - dragState.startY;
      setLayoutConfig((prev) => {
        if (dragState.kind === 'section') {
          let sectionDx = 0;
          let sectionDy = 0;
          const sections = prev.sections.map((section) => {
            if (section.id !== dragState.sectionId) return section;
            if (dragState.mode === 'resize') {
              return {
                ...section,
                width: Math.max(220, dragState.originWidth + dx),
                height: Math.max(56, dragState.originHeight + dy),
                autoFill: false,
              };
            }
            sectionDx = dragState.originX + dx - dragState.originX;
            sectionDy = dragState.originY + dy - dragState.originY;
            return {
              ...section,
              x: dragState.originX + dx,
              y: dragState.originY + dy,
              autoFill: false,
            };
          });
          if (dragState.mode === 'resize') {
            return { ...prev, sections };
          }
          return {
            ...prev,
            sections,
            items: prev.items.map((item) =>
              item.sectionId === dragState.sectionId
                ? { ...item, x: item.x + sectionDx, y: item.y + sectionDy, autoFill: false }
                : item,
            ),
          };
        }

        const items = prev.items.map((item) => {
          if (!dragState.itemIds.includes(item.id)) return item;
          const origin = dragState.origins[item.id];
          if (!origin) return item;
          if (dragState.mode === 'resize') {
            return {
              ...item,
              width: Math.max(12, origin.width + dx),
              height: Math.max(10, origin.height + dy),
              autoFill: false,
            };
          }
          return {
            ...item,
            x: origin.x + dx,
            y: origin.y + dy,
            autoFill: false,
          };
        });
        return { ...prev, items };
      });
    },
    [dragState, toSvgPoint],
  );

  const handlePointerUp = useCallback(() => {
    if (!dragState) return;
    setLayoutConfig((prev) => {
      if (dragState.kind === 'section') {
        const moved = prev.sections.find((section) => section.id === dragState.sectionId);
        if (!moved) return prev;

        const sections = prev.sections.map((section) => {
          if (section.id !== moved.id) return section;
          const isParked = section.x > PAGE_WIDTH - 20 || section.y > PAGE_HEIGHT - 20;

          let snappedY = section.y;
          for (const other of prev.sections) {
            if (other.id === section.id || other.parked) continue;
            if (Math.abs(section.y - (other.y + other.height)) < 12) {
              snappedY = other.y + other.height;
            }
            if (Math.abs(section.y + section.height - other.y) < 12) {
              snappedY = other.y - section.height;
            }
          }

          return {
            ...section,
            y: snappedY,
            parked: isParked,
          };
        });

        const parkedIds = sections.filter((section) => section.parked).map((section) => section.id);
        return {
          ...prev,
          sections,
          parkingLot: {
            ...prev.parkingLot,
            sectionIds: parkedIds,
          },
        };
      }

      const primaryId = dragState.itemIds[0];
      const primary = prev.items.find((item) => item.id === primaryId);
      if (!primary) return prev;

      let items = prev.items.map((item) => {
        if (!dragState.itemIds.includes(item.id)) return item;
        const isParked = item.x > PAGE_WIDTH - 20 || item.y > PAGE_HEIGHT - 20;
        return { ...item, parked: isParked };
      });

      const primaryAfterParking = items.find((item) => item.id === primaryId);
      let mergeGroups = prev.mergeGroups;

      if (primaryAfterParking && !primaryAfterParking.parked) {
        const primaryCx = primaryAfterParking.x + primaryAfterParking.width / 2;
        const primaryCy = primaryAfterParking.y + primaryAfterParking.height / 2;
        const candidate = items.find((item) => {
          if (dragState.itemIds.includes(item.id) || item.parked) return false;
          if (item.type !== primaryAfterParking.type) return false;
          const cx = item.x + item.width / 2;
          const cy = item.y + item.height / 2;
          return Math.hypot(primaryCx - cx, primaryCy - cy) <= ITEM_SNAP_DISTANCE;
        });

        if (candidate) {
          items = items.map((item) =>
            dragState.itemIds.includes(item.id)
              ? { ...item, x: candidate.x, y: candidate.y }
              : item,
          );

          const newMembers = Array.from(new Set([...dragState.itemIds, candidate.id]));
          mergeGroups = [
            ...prev.mergeGroups.filter(
              (group) => !group.memberItemIds.some((id) => newMembers.includes(id)),
            ),
            {
              id: `merge-${Date.now()}`,
              type: candidate.type,
              memberItemIds: newMembers,
              merged: true,
            },
          ];
        }
      }

      const parkedItemIds = items.filter((item) => item.parked).map((item) => item.id);
      return {
        ...prev,
        items,
        mergeGroups,
        parkingLot: {
          ...prev.parkingLot,
          itemIds: parkedItemIds,
        },
      };
    });
    setDragState(null);
  }, [dragState, ITEM_SNAP_DISTANCE]);

  const startSectionDrag = (
    event: React.PointerEvent<SVGElement>,
    section: SheetLayoutSectionConfig,
    dragMode: 'move' | 'resize',
  ): void => {
    if (mode !== 'edit') return;
    event.stopPropagation();
    setSelectedItemId(null);
    setSelectedSectionId(section.id);
    const point = toSvgPoint(event.clientX, event.clientY);
    if (!point) return;
    setDragState({
      kind: 'section',
      sectionId: section.id,
      startX: point.x,
      startY: point.y,
      originX: section.x,
      originY: section.y,
      originWidth: section.width,
      originHeight: section.height,
      mode: dragMode,
    });
  };

  const startItemDrag = (
    event: React.PointerEvent<SVGElement>,
    item: SheetLayoutItemConfig,
    dragMode: 'move' | 'resize',
  ): void => {
    if (mode !== 'edit') return;
    event.stopPropagation();
    setSelectedSectionId(null);
    setSelectedItemId(item.id);
    const point = toSvgPoint(event.clientX, event.clientY);
    if (!point) return;
    const itemIds = getMergedDragIds(item.id);
    const origins: Record<string, { x: number; y: number; width: number; height: number }> = {};
    for (const id of itemIds) {
      const source = layoutConfig.items.find((row) => row.id === id);
      if (!source) continue;
      origins[id] = {
        x: source.x,
        y: source.y,
        width: source.width,
        height: source.height,
      };
    }
    setDragState({
      kind: 'item',
      itemIds,
      startX: point.x,
      startY: point.y,
      mode: dragMode,
      origins,
    });
  };

  const saveLayout = async (): Promise<void> => {
    setSaveStatus(null);
    await saveLayoutMutation.mutateAsync(layoutConfig);
  };

  const exportSvg = (): void => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const raw = serializer.serializeToString(svgRef.current);
    const withMeta = raw.replace(
      '<svg',
      `<svg data-maple-layout-template="${layoutConfig.templateId}" data-maple-layout-version="${layoutConfig.schemaVersion}"`,
    );
    const blob = new Blob([withMeta], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${songSlug}-${layoutConfig.templateId}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedMergeGroup = useMemo(
    () =>
      layoutConfig.mergeGroups.find(
        (group) =>
          selectedItemId !== null && group.merged && group.memberItemIds.includes(selectedItemId),
      ) ?? null,
    [layoutConfig.mergeGroups, selectedItemId],
  );

  const snapGuides = useMemo(() => {
    if (!dragState || dragState.mode === 'resize') return [];
    const guides: Array<{ axis: 'x' | 'y'; value: number }> = [];
    const pushGuide = (axis: 'x' | 'y', value: number): void => {
      if (!guides.some((g) => g.axis === axis && Math.abs(g.value - value) < 0.5)) {
        guides.push({ axis, value });
      }
    };

    if (dragState.kind === 'section') {
      const moving = layoutConfig.sections.find((s) => s.id === dragState.sectionId);
      if (!moving) return guides;
      for (const other of layoutConfig.sections) {
        if (other.id === moving.id || other.parked) continue;
        if (Math.abs(moving.y - other.y) < 12) pushGuide('y', other.y);
        if (Math.abs(moving.y + moving.height - (other.y + other.height)) < 12) {
          pushGuide('y', other.y + other.height);
        }
        if (Math.abs(moving.x - other.x) < 12) pushGuide('x', other.x);
        if (Math.abs(moving.x + moving.width - (other.x + other.width)) < 12) {
          pushGuide('x', other.x + other.width);
        }
      }
      return guides;
    }

    const movingId = dragState.itemIds[0];
    const moving = layoutConfig.items.find((item) => item.id === movingId);
    if (!moving) return guides;
    for (const other of layoutConfig.items) {
      if (dragState.itemIds.includes(other.id) || other.parked || other.type !== moving.type)
        continue;
      const movingCx = moving.x + moving.width / 2;
      const movingCy = moving.y + moving.height / 2;
      const otherCx = other.x + other.width / 2;
      const otherCy = other.y + other.height / 2;
      if (Math.abs(movingCx - otherCx) < ITEM_SNAP_DISTANCE) pushGuide('x', otherCx);
      if (Math.abs(movingCy - otherCy) < ITEM_SNAP_DISTANCE) pushGuide('y', otherCy);
    }
    return guides;
  }, [dragState, layoutConfig.items, layoutConfig.sections, ITEM_SNAP_DISTANCE]);

  const splitSelectedMergeGroup = (): void => {
    if (!selectedMergeGroup) return;
    setLayoutConfig((prev) => ({
      ...prev,
      mergeGroups: prev.mergeGroups.filter((g) => g.id !== selectedMergeGroup.id),
    }));
  };

  const resetSelectedToAutoFill = (): void => {
    if (selectedSectionId) {
      const base = defaultLayout.sections.find((section) => section.id === selectedSectionId);
      if (!base) return;
      setLayoutConfig((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === selectedSectionId ? { ...base, parked: false, autoFill: true } : section,
        ),
        items: prev.items.map((item) => {
          if (item.sectionId !== selectedSectionId) return item;
          const baseItem = defaultLayout.items.find((row) => row.id === item.id);
          return baseItem ? { ...baseItem, parked: false, autoFill: true } : item;
        }),
      }));
      return;
    }
    if (selectedItemId) {
      const base = defaultLayout.items.find((item) => item.id === selectedItemId);
      if (!base) return;
      setLayoutConfig((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === selectedItemId ? { ...base, parked: false, autoFill: true } : item,
        ),
        mergeGroups: prev.mergeGroups.filter(
          (group) => !group.memberItemIds.includes(selectedItemId),
        ),
      }));
    }
  };

  const renderSection = (section: SheetLayoutSectionConfig): React.JSX.Element | null => {
    const sectionItems = activeItems.filter((item) => item.sectionId === section.id);
    const introMeasures = sectionItems
      .filter((item) => item.type === 'introMeasure')
      .sort((a, b) => a.index - b.index);
    const introTabs = sectionItems
      .filter((item) => item.type === 'introTabColumn')
      .sort((a, b) => a.index - b.index);
    const verseRows = sectionItems
      .filter((item) => item.type === 'verseRow')
      .sort((a, b) => a.index - b.index);
    const chorusRows = sectionItems
      .filter((item) => item.type === 'chorusRow')
      .sort((a, b) => a.index - b.index);
    const harmonicCols = sectionItems
      .filter((item) => item.type === 'harmonicColumn')
      .sort((a, b) => a.index - b.index);

    switch (section.type) {
      case 'header':
        return <BandHeader song={song} y={section.y} />;
      case 'introRiff':
        return (
          <BandIntroRiff
            data={song.introRiff}
            y={section.y}
            barLineOverrides={
              introMeasures.length > 0
                ? [
                    ...introMeasures.map((item) => item.x),
                    introMeasures[introMeasures.length - 1].x +
                      introMeasures[introMeasures.length - 1].width,
                  ]
                : undefined
            }
            colXOverrides={introTabs.length > 0 ? introTabs.map((item) => item.x + 5) : undefined}
          />
        );
      case 'verse':
        return (
          <BandVerse
            annotation={song.verseAnnotation}
            annotationX={song.verseAnnotationX}
            rows={song.verseRows}
            y={section.y}
            rowYOffsets={verseRows.map(
              (item, i) => item.y - (section.y + VERSE_ROW_TOP_OFFSET + i * ROW_HEIGHT),
            )}
          />
        );
      case 'chorus':
        return (
          <BandChorus
            annotation={song.chorusAnnotation}
            annotationX={song.chorusAnnotationX}
            rows={song.chorusRows}
            y={section.y}
            rowYOffsets={chorusRows.map(
              (item, i) => item.y - (section.y + CHORUS_ROW_TOP_OFFSET + i * ROW_HEIGHT),
            )}
          />
        );
      case 'harmonicMap':
        return (
          <BandHarmonicMap
            cols={song.harmonicCols}
            y={section.y}
            colXOverrides={harmonicCols.length > 0 ? harmonicCols.map((item) => item.x) : undefined}
          />
        );
      case 'notes':
        return <BandNotes title={song.title} artist={song.artist} pageNumber={1} y={section.y} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#222] p-5">
      <SongSearch
        onGenerate={(title, artist) => mutate({ title, artist })}
        loading={isPending}
        error={errorMessage}
      />
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#ddd]">
        <button
          type="button"
          className={`rounded px-3 py-1 ${mode === 'view' ? 'bg-[#825f20] text-white' : 'bg-[#333]'}`}
          onClick={() => setMode('view')}
        >
          View
        </button>
        <button
          type="button"
          className={`rounded px-3 py-1 ${mode === 'edit' ? 'bg-[#825f20] text-white' : 'bg-[#333]'}`}
          onClick={() => setMode('edit')}
        >
          Edit Layout
        </button>
        {mode === 'edit' && (
          <>
            <button
              type="button"
              className="rounded bg-[#334] px-3 py-1"
              onClick={() => setLayoutConfig((prev) => applyAutoFill(prev))}
            >
              Auto Fill All
            </button>
            <button type="button" className="rounded bg-[#2a3f6c] px-3 py-1" onClick={exportSvg}>
              Export SVG
            </button>
            <button
              type="button"
              className="rounded bg-[#1f4a2a] px-3 py-1 disabled:opacity-60"
              onClick={() => void saveLayout()}
              disabled={saveLayoutMutation.isPending}
            >
              {saveLayoutMutation.isPending ? 'Saving…' : 'Save Layout'}
            </button>
            {(selectedSectionId || selectedItemId) && (
              <button
                type="button"
                className="rounded bg-[#374151] px-3 py-1"
                onClick={resetSelectedToAutoFill}
              >
                Reset Selected To Auto Fill
              </button>
            )}
            {selectedMergeGroup && (
              <button
                type="button"
                className="rounded bg-[#6a2d2d] px-3 py-1"
                onClick={splitSelectedMergeGroup}
              >
                Split Merged Items
              </button>
            )}
          </>
        )}
        {saveStatus && <span className="text-[#bcd]">{saveStatus}</span>}
        {mode === 'edit' && (
          <span className="text-[#9fb0c9]">
            Arrow keys nudge selection, Shift+Arrow nudges by 10.
          </span>
        )}
      </div>
      <div className="mt-5 inline-block">
        {isPending ? (
          <div className="px-10 py-10 font-serif text-sm text-[#aaa]">
            Generating sheet for {song.title}…
          </div>
        ) : (
          <MapleCanvas
            svgRef={svgRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <>
              {activeSections.map((section) => (
                <g key={section.id} transform={`translate(${section.x - 48}, 0)`}>
                  {renderSection(section)}
                </g>
              ))}
              {mode === 'edit' && (
                <g onPointerLeave={handlePointerUp}>
                  {activeSections.map((section) => {
                    const isSelected = selectedSectionId === section.id;
                    return (
                      <g key={`${section.id}-overlay`}>
                        <rect
                          x={section.x}
                          y={section.y}
                          width={section.width}
                          height={section.height}
                          fill={isSelected ? 'rgba(80,130,255,0.14)' : 'rgba(40,70,130,0.08)'}
                          stroke={isSelected ? '#6ea0ff' : '#4b628f'}
                          strokeWidth={isSelected ? 1.4 : 0.9}
                          style={{ cursor: 'move' }}
                          onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(event.pointerId);
                            startSectionDrag(event, section, 'move');
                          }}
                        />
                        <rect
                          x={section.x + section.width - 8}
                          y={section.y + section.height - 8}
                          width={8}
                          height={8}
                          fill="#ffd98a"
                          stroke="#8B6914"
                          strokeWidth={0.8}
                          style={{ cursor: 'nwse-resize' }}
                          onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(event.pointerId);
                            startSectionDrag(event, section, 'resize');
                          }}
                        />
                        <text x={section.x + 4} y={section.y + 13} className="hl">
                          {section.order + 1}. {section.label}
                          {section.autoFill ? ' (auto)' : ' (manual)'}
                        </text>
                      </g>
                    );
                  })}
                  {activeItems.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    const isMerged = mergedItemIds.has(item.id);
                    const mergedCount = mergedItemCounts.get(item.id);
                    return (
                      <g key={`${item.id}-overlay`}>
                        <rect
                          x={item.x}
                          y={item.y}
                          width={item.width}
                          height={item.height}
                          fill={isSelected ? 'rgba(255,190,90,0.16)' : 'rgba(160,200,90,0.08)'}
                          stroke={isMerged ? '#f97316' : isSelected ? '#fbbf24' : '#8ca07a'}
                          strokeDasharray={isMerged ? '3 2' : '2 2'}
                          strokeWidth={isSelected ? 1.4 : 1}
                          style={{ cursor: isMerged ? 'grab' : 'move' }}
                          onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(event.pointerId);
                            startItemDrag(event, item, 'move');
                          }}
                        />
                        <rect
                          x={item.x + item.width - 6}
                          y={item.y + item.height - 6}
                          width={6}
                          height={6}
                          fill="#ffefc4"
                          stroke="#8B6914"
                          strokeWidth={0.8}
                          style={{ cursor: 'nwse-resize' }}
                          onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(event.pointerId);
                            startItemDrag(event, item, 'resize');
                          }}
                        />
                        <text x={item.x + 3} y={item.y + 11} className="hl">
                          {item.index + 1}. {item.type}
                        </text>
                        {isMerged && mergedCount && (
                          <>
                            <rect
                              x={item.x + item.width - 46}
                              y={item.y + 2}
                              width={42}
                              height={10}
                              rx={2}
                              fill="#f97316"
                              opacity={0.9}
                            />
                            <text
                              x={item.x + item.width - 43}
                              y={item.y + 10}
                              className="hl"
                              fill="#1f2937"
                            >
                              merged x{mergedCount}
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}
                  {snapGuides.map((guide, index) =>
                    guide.axis === 'x' ? (
                      <line
                        key={`snap-x-${index}`}
                        x1={guide.value}
                        x2={guide.value}
                        y1={0}
                        y2={PAGE_HEIGHT}
                        stroke="#38bdf8"
                        strokeWidth={0.9}
                        strokeDasharray="4 3"
                        opacity={0.85}
                      />
                    ) : (
                      <line
                        key={`snap-y-${index}`}
                        x1={0}
                        x2={PAGE_WIDTH}
                        y1={guide.value}
                        y2={guide.value}
                        stroke="#38bdf8"
                        strokeWidth={0.9}
                        strokeDasharray="4 3"
                        opacity={0.85}
                      />
                    ),
                  )}
                </g>
              )}
            </>
          </MapleCanvas>
        )}
      </div>
      {mode === 'edit' && (
        <div className="mt-3 w-[794px] rounded bg-[#2d2d2d] p-3 text-xs text-[#ddd]">
          <div className="mb-2 font-semibold text-[#f0d9ad]">Parking Lot</div>
          {parkedSections.length === 0 && parkedItems.length === 0 ? (
            <div className="text-[#aaa]">
              Drag sections or items off the page (bottom-right) to park them.
            </div>
          ) : (
            <>
              {parkedSections.map((section, i) => (
                <div
                  key={section.id}
                  className="mb-1 flex items-center justify-between rounded bg-[#383838] px-2 py-1"
                >
                  <span>
                    #{i + 1} [section] {section.label}
                  </span>
                  <button
                    type="button"
                    className="rounded bg-[#4b628f] px-2 py-1 text-[11px]"
                    onClick={() =>
                      setLayoutConfig((prev) => ({
                        ...prev,
                        sections: prev.sections.map((s) =>
                          s.id === section.id
                            ? ({
                                ...defaultLayout.sections.find((base) => base.id === section.id),
                                parked: false,
                                autoFill: true,
                              } as SheetLayoutSectionConfig)
                            : s,
                        ),
                        parkingLot: {
                          ...prev.parkingLot,
                          sectionIds: prev.parkingLot.sectionIds.filter((id) => id !== section.id),
                        },
                        items: prev.items.map((item) => {
                          if (item.sectionId !== section.id) return item;
                          const baseItem = defaultLayout.items.find((base) => base.id === item.id);
                          return baseItem ? { ...baseItem, parked: false, autoFill: true } : item;
                        }),
                      }))
                    }
                  >
                    Return To Page
                  </button>
                </div>
              ))}
              {parkedItems.map((item, i) => (
                <div
                  key={item.id}
                  className="mb-1 flex items-center justify-between rounded bg-[#3a3430] px-2 py-1"
                >
                  <span>
                    #{i + 1} [item] {item.type} ({item.sectionId})
                  </span>
                  <button
                    type="button"
                    className="rounded bg-[#7a5d2e] px-2 py-1 text-[11px]"
                    onClick={() =>
                      setLayoutConfig((prev) => ({
                        ...prev,
                        items: prev.items.map((x) =>
                          x.id === item.id
                            ? {
                                ...(defaultLayout.items.find((base) => base.id === item.id) ?? x),
                                parked: false,
                                autoFill: true,
                              }
                            : x,
                        ),
                        parkingLot: {
                          ...prev.parkingLot,
                          itemIds: prev.parkingLot.itemIds.filter((id) => id !== item.id),
                        },
                        mergeGroups: prev.mergeGroups.filter(
                          (group) => !group.memberItemIds.includes(item.id),
                        ),
                      }))
                    }
                  >
                    Return To Page
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
