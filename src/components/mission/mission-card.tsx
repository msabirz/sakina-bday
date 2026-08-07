"use client";

import { motion } from "framer-motion";
import { Check, Lock, ArrowUpRight } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { LockedBadge } from "@/components/shared/locked-badge";
import { useChapterUnlock } from "@/hooks/use-chapter-unlock";
import { getIcon } from "@/lib/icon-map";
import { toast } from "sonner";
import type { ChapterConfig } from "@/types";
import { staggerItem } from "@/lib/motion";
import { chapters } from "@/lib/config";

export function MissionCard({ chapter, onSelect }: { chapter: ChapterConfig; onSelect: () => void }) {
  const { isUnlocked, isCompleted, isTimeReached, isSequenceReady, effectiveUnlockAt, countdown } =
    useChapterUnlock(chapter);
  const previousChapter = chapters.find((c) => c.order === chapter.order - 1);
  // getIcon looks up a stable reference in a frozen, module-level icon map.
  const Icon = getIcon(chapter.icon);

  function handleClick() {
    if (isUnlocked) {
      onSelect();
      return;
    }
    if (!isSequenceReady) {
      toast("Finish the mission before this one first.");
    } else if (!isTimeReached) {
      toast("Patience, Agent. This one isn't ready yet.");
    }
  }

  return (
    <motion.button
      type="button"
      variants={staggerItem}
      onClick={handleClick}
      whileHover={isUnlocked ? { y: -4 } : undefined}
      whileTap={isUnlocked ? { scale: 0.98 } : undefined}
      className="text-left"
    >
      <GlassPanel
        strong
        glow={isCompleted ? "gold" : "none"}
        className={`relative flex h-full flex-col gap-4 overflow-hidden p-6 transition-colors ${
          isUnlocked ? "cursor-pointer hover:border-gold/30" : "cursor-not-allowed opacity-70"
        }`}
      >
        <div className="flex items-start justify-between">
          <div
            className="flex size-11 items-center justify-center rounded-2xl"
            style={{
              background: isCompleted ? "rgba(212,175,55,0.16)" : "rgba(255,255,255,0.04)",
              color: isCompleted ? "#D4AF37" : "#A0A0A0",
            }}
          >
            {isUnlocked ? (
              // eslint-disable-next-line react-hooks/static-components -- stable lookup in a frozen icon map
              <Icon className="size-5" />
            ) : (
              <Lock className="size-4.5" />
            )}
          </div>
          {isCompleted && (
            <span className="flex size-6 items-center justify-center rounded-full bg-gold text-gold-contrast">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold/80">
            {chapter.missionLabel}
          </p>
          <h3 className="font-display text-xl text-foreground">{chapter.title}</h3>
          <p className="text-sm text-text-secondary">{chapter.subtitle}</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          {isUnlocked ? (
            <span className="text-xs text-text-secondary">
              {isCompleted ? "Completed" : `${chapter.estMinutes} min · +${chapter.xpReward} XP`}
            </span>
          ) : !isSequenceReady ? (
            <div className="flex items-center gap-2 text-text-secondary">
              <ArrowUpRight className="size-3.5" />
              <span className="text-xs tracking-wide">
                Complete {previousChapter?.missionLabel ?? "the previous mission"} first
              </span>
            </div>
          ) : (
            <LockedBadge countdown={countdown} unlockAt={effectiveUnlockAt} />
          )}
        </div>
      </GlassPanel>
    </motion.button>
  );
}
