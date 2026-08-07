"use client";

import { GlassPanel } from "@/components/shared/glass-panel";
import { ImageJigsawGame } from "@/components/games/image-jigsaw-game";

export function JigsawChapter({ onComplete, xpReward }: { onComplete: () => void; xpReward: number }) {
  return (
    <div className="space-y-8">
      <p className="max-w-xl text-sm text-text-secondary sm:text-base">
        A picture, scrambled into pieces. No preview, no hint at what it becomes — put it back together and see
        for yourself.
      </p>

      <GlassPanel strong className="p-8 sm:p-10">
        <ImageJigsawGame onSolved={onComplete} xpReward={xpReward} />
      </GlassPanel>
    </div>
  );
}
