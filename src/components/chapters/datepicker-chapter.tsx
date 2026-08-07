"use client";

import { GlassPanel } from "@/components/shared/glass-panel";
import { DatePickerGame } from "@/components/games/date-picker-game";

export function DatePickerChapter({ onComplete, xpReward }: { onComplete: () => void; xpReward: number }) {
  return (
    <div className="space-y-8">
      <p className="max-w-xl text-sm text-text-secondary sm:text-base">
        Three quick picks — just for fun. Build your ideal night, one choice at a time.
      </p>

      <GlassPanel strong className="p-8 sm:p-10">
        <DatePickerGame onSolved={onComplete} xpReward={xpReward} />
      </GlassPanel>
    </div>
  );
}
