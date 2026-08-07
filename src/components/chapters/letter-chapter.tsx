"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/shared/glass-panel";
import { Button } from "@/components/ui/button";
import { useTypewriterLines } from "@/hooks/use-typewriter-lines";
import { letter } from "@/lib/config";
import { fadeIn } from "@/lib/motion";

export function LetterChapter({ onComplete, xpReward }: { onComplete: () => void; xpReward: number }) {
  const { completedLines, currentPartial, isDone } = useTypewriterLines(letter.lines, {
    charDelay: 22,
    lineDelay: 420,
  });

  return (
    <div className="space-y-8">
      <GlassPanel strong className="noise-overlay p-8 sm:p-12">
        <p className="mb-8 text-xs uppercase tracking-[0.3em] text-gold/80">{letter.heading}</p>
        <div className="min-h-[280px] space-y-4 font-display text-xl leading-relaxed text-foreground/90 sm:text-2xl">
          {completedLines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
          {!isDone && (
            <p>
              {currentPartial}
              <span className="ml-0.5 inline-block h-[1.1em] w-[2px] animate-pulse bg-gold align-middle" />
            </p>
          )}
        </div>
        {isDone && (
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="mt-8 text-right font-display italic text-gold"
          >
            {letter.signature}
          </motion.p>
        )}
      </GlassPanel>

      {isDone && (
        <motion.div variants={fadeIn} initial="hidden" animate="show" className="flex justify-end">
          <Button
            size="lg"
            onClick={onComplete}
            className="rounded-full bg-gold px-8 text-sm font-medium tracking-wide text-gold-contrast hover:bg-gold-soft"
          >
            Mark Mission Complete · +{xpReward} XP
          </Button>
        </motion.div>
      )}
    </div>
  );
}
