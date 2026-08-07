"use client";

import { useEffect, useMemo } from "react";
import { useMissionStore } from "@/store/mission-store";
import { letterFragmentsConfig } from "@/lib/config";

export interface FragmentSlot {
  id: string;
  char: string;
  collected: boolean;
}

/**
 * Derives the 13 letter-fragment slots from things the player has already
 * done (starting the mission, finishing chapters, solving mini-games) — no
 * separate "which letters collected" state to keep in sync. Slot *order* is
 * shuffled once per playthrough (persisted) so partially-revealed letters
 * never read as a partial word.
 */
export function useLetterFragments() {
  const hasBegun = useMissionStore((s) => s.hasBegun);
  const completedChapterIds = useMissionStore((s) => s.completedChapterIds);
  const completedGameIds = useMissionStore((s) => s.completedGameIds);
  const fragmentSlotOrder = useMissionStore((s) => s.fragmentSlotOrder);
  const ensureFragmentOrder = useMissionStore((s) => s.ensureFragmentOrder);

  useEffect(() => {
    if (hasBegun) ensureFragmentOrder();
  }, [hasBegun, ensureFragmentOrder]);

  const collectedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const fragment of letterFragmentsConfig.fragments) {
      if (fragment.source === "begin") {
        map[fragment.id] = hasBegun;
      } else if (fragment.source.startsWith("chapter:")) {
        map[fragment.id] = completedChapterIds.includes(fragment.source.slice("chapter:".length));
      } else if (fragment.source.startsWith("game:")) {
        map[fragment.id] = completedGameIds.includes(fragment.source.slice("game:".length));
      } else {
        map[fragment.id] = false;
      }
    }
    return map;
  }, [hasBegun, completedChapterIds, completedGameIds]);

  const slots: FragmentSlot[] = useMemo(() => {
    const order = fragmentSlotOrder.length > 0 ? fragmentSlotOrder : letterFragmentsConfig.fragments.map((f) => f.id);
    return order
      .map((id) => letterFragmentsConfig.fragments.find((f) => f.id === id))
      .filter((f): f is (typeof letterFragmentsConfig.fragments)[number] => Boolean(f))
      .map((fragment) => ({ id: fragment.id, char: fragment.char, collected: collectedMap[fragment.id] ?? false }));
  }, [fragmentSlotOrder, collectedMap]);

  const collectedCount = slots.filter((s) => s.collected).length;
  const total = slots.length;

  return {
    slots,
    collectedCount,
    total,
    allCollected: total > 0 && collectedCount === total,
    targetPhrase: letterFragmentsConfig.targetPhrase,
  };
}
