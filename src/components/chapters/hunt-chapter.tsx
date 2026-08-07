"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/shared/glass-panel";
import { useMissionStore } from "@/store/mission-store";
import { fireConfetti } from "@/lib/confetti";
import { treasureHunt } from "@/lib/config";
import { fadeIn } from "@/lib/motion";

const FIELD_STAR_COUNT = 24;

function generateDecoyStars() {
  return Array.from({ length: FIELD_STAR_COUNT }, () => ({
    left: `${Math.random() * 96}%`,
    top: `${Math.random() * 96}%`,
    size: 8 + Math.random() * 8,
  }));
}

function generateRealIndexes(required: number) {
  const indexes = new Set<number>();
  while (indexes.size < required && indexes.size < FIELD_STAR_COUNT) {
    indexes.add(Math.floor(Math.random() * FIELD_STAR_COUNT));
  }
  return indexes;
}

export function HuntChapter({ onComplete, xpReward }: { onComplete: () => void; xpReward: number }) {
  const huntStarsFound = useMissionStore((s) => s.huntStarsFound);
  const addHuntStar = useMissionStore((s) => s.addHuntStar);

  const required = treasureHunt.starsRequired;
  const complete = huntStarsFound >= required;

  // Randomized once via useState's lazy initializer, at mount.
  const [decoyStars] = useState(generateDecoyStars);

  // A handful of the field's stars are "real" signals; the rest are decoys
  // that just twinkle. Every click that lands on a real one counts.
  const [realIndexes] = useState(() => generateRealIndexes(required));

  function handleClick(index: number, isReal: boolean) {
    if (!isReal || complete) return;
    addHuntStar();
    fireConfetti();
  }

  return (
    <div className="space-y-8">
      <p className="max-w-xl text-sm text-text-secondary sm:text-base">{treasureHunt.intro}</p>
      <p className="max-w-xl text-sm italic text-gold/80">{treasureHunt.clue}</p>

      <GlassPanel strong className="relative h-[380px] overflow-hidden p-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.06),transparent_60%)]" />
        {decoyStars.map((star, i) => {
          const isReal = realIndexes.has(i);
          return (
            <motion.button
              key={i}
              type="button"
              aria-label="signal"
              onClick={() => handleClick(i, isReal)}
              className="absolute -m-3 p-3"
              style={{ left: star.left, top: star.top }}
              animate={{ opacity: [0.15, 0.6, 0.15] }}
              transition={{ duration: 2.5 + (i % 5) * 0.4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.4 }}
            >
              <Sparkle
                style={{ width: star.size, height: star.size }}
                className={isReal ? "text-gold" : "text-foreground/40"}
              />
            </motion.button>
          );
        })}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-6 text-center">
          <p className="text-sm text-text-secondary">
            {complete ? treasureHunt.revealMessage : `${huntStarsFound}/${required} signals located`}
          </p>
        </div>
      </GlassPanel>

      <div className="flex items-center justify-between">
        <p className="text-xs text-text-secondary">{complete ? treasureHunt.revealTitle : "Keep looking, Agent."}</p>
        {complete && (
          <motion.div variants={fadeIn} initial="hidden" animate="show">
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
    </div>
  );
}
