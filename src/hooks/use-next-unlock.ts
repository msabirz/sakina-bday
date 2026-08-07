"use client";

import { useEffect, useMemo, useState } from "react";
import { useMissionStore } from "@/store/mission-store";
import { chapters } from "@/lib/config";
import type { ChapterConfig } from "@/types";

export interface NextUnlockInfo {
  chapter: ChapterConfig | null;
  unlockAt: Date | null;
  allUnlocked: boolean;
}

/** Finds the soonest chapter that isn't unlocked yet, for the big home countdown. */
export function useNextUnlock(): NextUnlockInfo {
  const overrides = useMissionStore((s) => s.adminOverrides);
  const completedChapterIds = useMissionStore((s) => s.completedChapterIds);

  // Ticks once a second so a chapter flips from "locked" to "unlocked" the
  // moment its time arrives, without reading the clock during render.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    if (overrides.forceUnlockAll) return { chapter: null, unlockAt: null, allUnlocked: true };

    const candidates = chapters
      .map((chapter) => {
        const iso = overrides.chapterUnlockOverrides[chapter.id] ?? chapter.unlockAt;
        const unlockAt = new Date(iso);
        const previous = chapters.find((c) => c.order === chapter.order - 1);
        const sequenceReady = !previous || completedChapterIds.includes(previous.id);
        const timeReady = unlockAt.getTime() <= now;
        return { chapter, unlockAt, isUnlocked: sequenceReady && timeReady };
      })
      .filter((c) => !c.isUnlocked)
      .sort((a, b) => a.unlockAt.getTime() - b.unlockAt.getTime());

    if (candidates.length === 0) return { chapter: null, unlockAt: null, allUnlocked: true };
    return { chapter: candidates[0].chapter, unlockAt: candidates[0].unlockAt, allUnlocked: false };
  }, [overrides, completedChapterIds, now]);
}
