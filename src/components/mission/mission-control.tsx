"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Flame, Target } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { ProgressRing } from "@/components/shared/progress-ring";
import { StatTile } from "@/components/mission/stat-tile";
import { MissionCard } from "@/components/mission/mission-card";
import { GiftIllustration } from "@/components/mission/gift-illustration";
import { FragmentStrip } from "@/components/mission/fragment-strip";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ShareSnapButton } from "@/components/mission/share-snap-button";
import { useMissionStore, xpToLevel, xpProgressWithinLevel, missionProgressPercent } from "@/store/mission-store";
import { useNextUnlock } from "@/hooks/use-next-unlock";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { chapters, missionConfig, achievements } from "@/lib/config";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function MissionControl({ onSelectChapter }: { onSelectChapter: (id: string) => void }) {
  const xp = useMissionStore((s) => s.xp);
  const completedChapterIds = useMissionStore((s) => s.completedChapterIds);
  const unlockedAchievementIds = useMissionStore((s) => s.unlockedAchievementIds);

  const level = xpToLevel(xp);
  const levelProgress = xpProgressWithinLevel(xp);
  const progressPercent = missionProgressPercent(completedChapterIds);

  const { chapter: nextChapter, unlockAt, allUnlocked } = useNextUnlock();
  const countdown = useCountdown(unlockAt);

  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-6xl px-6 pb-24 pt-14 sm:px-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-14 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold">{missionConfig.siteTitle}</p>
          <ThemeToggle />
        </div>
        <h1 className="font-display text-4xl text-foreground sm:text-5xl">
          Welcome back, <span className="text-gold-gradient italic">{missionConfig.recipientName}</span>.
        </h1>
        <p className="max-w-lg text-sm text-text-secondary sm:text-base">
          {progressPercent === 100
            ? "Every mission is complete. One transmission remains."
            : "Your missions are listed below. Some are ready now. Some will make you wait."}
        </p>
      </motion.div>

      {/* Hero: countdown + gift illustration */}
      <motion.div variants={fadeUp} className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <GlassPanel strong className="relative flex flex-col justify-between overflow-hidden p-8 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-gold/10 blur-3xl" />
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-text-secondary">
              {allUnlocked ? "Status" : countdown?.isPast ? "Ready and waiting" : "Next transmission unlocks in"}
            </p>
            {allUnlocked || !countdown ? (
              <p className="font-display text-3xl text-foreground sm:text-4xl">
                {allUnlocked ? "All missions available." : "Calculating…"}
              </p>
            ) : countdown.isPast ? (
              <p className="font-display text-3xl text-foreground sm:text-4xl">Finish the mission before it.</p>
            ) : (
              <div className="flex items-baseline gap-3">
                <span className="font-display text-5xl tabular-nums text-foreground sm:text-6xl">
                  {formatCountdown(countdown)}
                </span>
              </div>
            )}
            {nextChapter && (
              <p className="mt-3 text-sm text-text-secondary">
                {nextChapter.missionLabel} · {nextChapter.title}
              </p>
            )}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-foreground/5 pt-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">Missions</p>
              <p className="font-display text-2xl text-foreground">
                {completedChapterIds.length}/{chapters.length}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">Level</p>
              <p className="font-display text-2xl text-foreground">{level}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">Secrets</p>
              <p className="font-display text-2xl text-foreground">
                {unlockedAchievementIds.length}/{achievements.length}
              </p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel strong className="flex flex-col items-center justify-center gap-4 p-8">
          <GiftIllustration size={140} />
          <ProgressRing percent={progressPercent} size={104} strokeWidth={6} label={`${progressPercent}%`} sublabel="Journey" />
        </GlassPanel>
      </motion.div>

      {/* Stat tiles */}
      <motion.div variants={fadeUp} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile icon={Flame} label="Experience" value={`${xp} XP`} />
        <StatTile icon={Star} label="Level Progress" value={`${Math.round(levelProgress.percent)}%`} accent="rose" />
        <StatTile icon={Target} label="Current Level" value={`Level ${level}`} />
      </motion.div>

      {/* Signal fragments */}
      <motion.div variants={fadeUp} className="mb-14">
        <FragmentStrip />
      </motion.div>

      {/* Missions grid */}
      <motion.div variants={fadeUp} className="mb-6 flex items-baseline justify-between">
        <h2 className="font-display text-2xl text-foreground">Missions</h2>
        <span className="text-xs text-text-secondary">{progressPercent}% complete</span>
      </motion.div>
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {chapters.map((chapter) => (
          <MissionCard key={chapter.id} chapter={chapter} onSelect={() => onSelectChapter(chapter.id)} />
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="mt-16 flex justify-center">
        <ShareSnapButton />
      </motion.div>

      <motion.div variants={fadeUp} className="mt-8 text-center">
        <Link href="/admin" className="text-[10px] uppercase tracking-[0.3em] text-text-secondary/40 hover:text-text-secondary">
          Command Center Access
        </Link>
      </motion.div>
    </motion.div>
  );
}
