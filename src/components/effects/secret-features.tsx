"use client";

import { useCallback, useEffect, useRef } from "react";
import { useKonamiCode } from "@/hooks/use-konami-code";
import { useShake } from "@/hooks/use-shake";
import { useMissionStore } from "@/store/mission-store";
import { achievements } from "@/lib/config";
import { showAchievementToast } from "@/lib/toast";
import { fireCelebration } from "@/lib/confetti";
import { toast } from "sonner";

/**
 * Invisible component: wires up the Konami code, shake-to-unlock, and a
 * watcher that toasts any newly unlocked achievement no matter where it
 * came from. Mount once, near the root, after the intro completes.
 */
export function SecretFeatures() {
  const unlockAchievement = useMissionStore((s) => s.unlockAchievement);
  const unlockedIds = useMissionStore((s) => s.unlockedAchievementIds);
  const previousIds = useRef<string[]>([]);

  const handleKonami = useCallback(() => {
    if (unlockedIds.includes("konami")) {
      toast("You already found this one, Agent.");
      return;
    }
    unlockAchievement("konami");
    fireCelebration();
  }, [unlockAchievement, unlockedIds]);

  const handleShake = useCallback(() => {
    if (unlockedIds.includes("shaken")) return;
    unlockAchievement("shaken");
    fireCelebration();
  }, [unlockAchievement, unlockedIds]);

  useKonamiCode(handleKonami);
  useShake(handleShake);

  useEffect(() => {
    const newlyUnlocked = unlockedIds.filter((id) => !previousIds.current.includes(id));
    for (const id of newlyUnlocked) {
      const achievement = achievements.find((a) => a.id === id);
      if (achievement) showAchievementToast(achievement);
    }
    previousIds.current = unlockedIds;
  }, [unlockedIds]);

  return null;
}
