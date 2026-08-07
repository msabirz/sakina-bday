import { toast } from "sonner";
import { randomMysteryPhrase } from "./mystery-phrases";
import type { AchievementConfig } from "@/types";

export function showAchievementToast(achievement: AchievementConfig) {
  toast(`Achievement unlocked — ${achievement.title}`, {
    description: `${achievement.description} · +${achievement.xp} XP`,
    duration: 4200,
  });
}

export function showMysteryToast() {
  toast(randomMysteryPhrase(), { duration: 2600 });
}
