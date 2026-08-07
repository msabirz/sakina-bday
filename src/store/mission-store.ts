"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { EndingMode } from "@/types";
import { achievements, chapters, letterFragmentsConfig } from "@/lib/config";

const XP_PER_LEVEL = 250;

interface AdminOverrides {
  /** chapterId -> ISO datetime override for unlockAt */
  chapterUnlockOverrides: Record<string, string>;
  endingModeOverride: EndingMode | null;
  shippingStepOverride: number | null;
  forceUnlockAll: boolean;
}

interface MissionState {
  hasBegun: boolean;
  xp: number;
  completedChapterIds: string[];
  completedGameIds: string[];
  huntStarsFound: number;
  unlockedAchievementIds: string[];
  adminOverrides: AdminOverrides;
  adminAuthed: boolean;
  /** Fragment ids in shuffled display order — generated once so reveals never sit in phrase order. */
  fragmentSlotOrder: string[];
  phraseSolved: boolean;

  begin: () => void;
  completeChapter: (id: string, xpReward: number) => void;
  completeGame: (gameId: string) => void;
  addHuntStar: () => void;
  unlockAchievement: (id: string) => void;
  setChapterUnlockOverride: (chapterId: string, iso: string | null) => void;
  setEndingModeOverride: (mode: EndingMode | null) => void;
  setShippingStepOverride: (step: number | null) => void;
  setForceUnlockAll: (value: boolean) => void;
  setAdminAuthed: (value: boolean) => void;
  resetProgress: () => void;
  setChapterCompleted: (id: string, completed: boolean) => void;
  setXp: (value: number) => void;
  ensureFragmentOrder: () => void;
  setPhraseSolved: (value: boolean) => void;
}

const initialAdminOverrides: AdminOverrides = {
  chapterUnlockOverrides: {},
  endingModeOverride: null,
  shippingStepOverride: null,
  forceUnlockAll: false,
};

function safeStorage() {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return window.localStorage;
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      hasBegun: false,
      xp: 0,
      completedChapterIds: [],
      completedGameIds: [],
      huntStarsFound: 0,
      unlockedAchievementIds: [],
      adminOverrides: initialAdminOverrides,
      adminAuthed: false,
      fragmentSlotOrder: [],
      phraseSolved: false,

      begin: () => {
        if (get().hasBegun) return;
        set({ hasBegun: true });
        get().unlockAchievement("first-step");
        get().ensureFragmentOrder();
      },

      completeChapter: (id, xpReward) => {
        if (get().completedChapterIds.includes(id)) return;
        set((state) => ({
          completedChapterIds: [...state.completedChapterIds, id],
          xp: state.xp + xpReward,
        }));

        const map: Record<string, string> = {
          letter: "letter-read",
          vault: "vault-opened",
          voice: "voice-heard",
        };
        if (map[id]) get().unlockAchievement(map[id]);

        if (get().completedChapterIds.length === chapters.length) {
          get().unlockAchievement("mission-complete");
        }
      },

      completeGame: (gameId) => {
        if (get().completedGameIds.includes(gameId)) return;
        set((state) => ({
          completedGameIds: [...state.completedGameIds, gameId],
          xp: state.xp + 40,
        }));
        if (get().completedGameIds.length === 6) {
          get().unlockAchievement("games-complete");
        }
      },

      addHuntStar: () => {
        set((state) => ({ huntStarsFound: state.huntStarsFound + 1 }));
        if (get().huntStarsFound >= 3) {
          get().unlockAchievement("star-finder");
        }
      },

      unlockAchievement: (id) => {
        if (get().unlockedAchievementIds.includes(id)) return;
        const achievement = achievements.find((a) => a.id === id);
        set((state) => ({
          unlockedAchievementIds: [...state.unlockedAchievementIds, id],
          xp: state.xp + (achievement?.xp ?? 0),
        }));
      },

      setChapterUnlockOverride: (chapterId, iso) => {
        set((state) => {
          const next = { ...state.adminOverrides.chapterUnlockOverrides };
          if (iso) next[chapterId] = iso;
          else delete next[chapterId];
          return { adminOverrides: { ...state.adminOverrides, chapterUnlockOverrides: next } };
        });
      },

      setEndingModeOverride: (mode) =>
        set((state) => ({ adminOverrides: { ...state.adminOverrides, endingModeOverride: mode } })),

      setShippingStepOverride: (step) =>
        set((state) => ({ adminOverrides: { ...state.adminOverrides, shippingStepOverride: step } })),

      setForceUnlockAll: (value) =>
        set((state) => ({ adminOverrides: { ...state.adminOverrides, forceUnlockAll: value } })),

      setAdminAuthed: (value) => set({ adminAuthed: value }),

      resetProgress: () =>
        set({
          hasBegun: false,
          xp: 0,
          completedChapterIds: [],
          completedGameIds: [],
          huntStarsFound: 0,
          unlockedAchievementIds: [],
          fragmentSlotOrder: [],
          phraseSolved: false,
        }),

      setChapterCompleted: (id, completed) =>
        set((state) => ({
          completedChapterIds: completed
            ? state.completedChapterIds.includes(id)
              ? state.completedChapterIds
              : [...state.completedChapterIds, id]
            : state.completedChapterIds.filter((c) => c !== id),
        })),

      setXp: (value) => set({ xp: Math.max(0, Math.round(value)) }),

      ensureFragmentOrder: () => {
        if (get().fragmentSlotOrder.length > 0) return;
        const ids = letterFragmentsConfig.fragments.map((f) => f.id);
        for (let i = ids.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [ids[i], ids[j]] = [ids[j], ids[i]];
        }
        set({ fragmentSlotOrder: ids });
      },

      setPhraseSolved: (value) => set({ phraseSolved: value }),
    }),
    {
      name: "ofy-mission-state",
      storage: createJSONStorage(safeStorage),
      partialize: (state) => ({
        hasBegun: state.hasBegun,
        xp: state.xp,
        completedChapterIds: state.completedChapterIds,
        completedGameIds: state.completedGameIds,
        huntStarsFound: state.huntStarsFound,
        unlockedAchievementIds: state.unlockedAchievementIds,
        adminOverrides: state.adminOverrides,
        fragmentSlotOrder: state.fragmentSlotOrder,
        phraseSolved: state.phraseSolved,
      }),
      skipHydration: true,
    }
  )
);

export function xpToLevel(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpProgressWithinLevel(xp: number) {
  const intoLevel = xp % XP_PER_LEVEL;
  return { current: intoLevel, target: XP_PER_LEVEL, percent: (intoLevel / XP_PER_LEVEL) * 100 };
}

export function missionProgressPercent(completedChapterIds: string[]) {
  return Math.round((completedChapterIds.length / chapters.length) * 100);
}
