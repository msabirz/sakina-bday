"use client";

import { useMemo } from "react";
import { useCountdown } from "./use-countdown";
import { useMissionStore } from "@/store/mission-store";
import { chapters } from "@/lib/config";
import type { ChapterConfig } from "@/types";

export interface ChapterUnlockInfo {
  effectiveUnlockAt: Date;
  isTimeReached: boolean;
  isSequenceReady: boolean;
  isUnlocked: boolean;
  isCompleted: boolean;
  countdown: ReturnType<typeof useCountdown>;
}

export function useChapterUnlock(chapter: ChapterConfig): ChapterUnlockInfo {
  const overrides = useMissionStore((s) => s.adminOverrides);
  const completedChapterIds = useMissionStore((s) => s.completedChapterIds);

  const effectiveUnlockAt = useMemo(() => {
    const iso = overrides.chapterUnlockOverrides[chapter.id] ?? chapter.unlockAt;
    return new Date(iso);
  }, [overrides.chapterUnlockOverrides, chapter.id, chapter.unlockAt]);

  const countdown = useCountdown(effectiveUnlockAt);
  const isTimeReached = overrides.forceUnlockAll || (countdown?.isPast ?? false);

  const isSequenceReady = useMemo(() => {
    if (overrides.forceUnlockAll) return true;
    const previous = chapters.find((c) => c.order === chapter.order - 1);
    if (!previous) return true;
    return completedChapterIds.includes(previous.id);
  }, [overrides.forceUnlockAll, chapter.order, completedChapterIds]);

  const isCompleted = completedChapterIds.includes(chapter.id);
  const isUnlocked = isTimeReached && isSequenceReady;

  return { effectiveUnlockAt, isTimeReached, isSequenceReady, isUnlocked, isCompleted, countdown };
}
