"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { giftGames } from "@/lib/config";
import { randomMysteryPhrase } from "@/lib/mystery-phrases";

/** Three quick rounds of picks — pure flavor, like the other mini-games. No real plan is made or confirmed. */
export function DatePickerGame({ onSolved, xpReward }: { onSolved: () => void; xpReward?: number }) {
  const { rounds } = giftGames.datePicker;
  const [roundIndex, setRoundIndex] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const continueLabel = xpReward ? `Continue · +${xpReward} XP` : "Continue";

  function choose(option: string) {
    const next = [...picks, option];
    setPicks(next);
    if (roundIndex + 1 >= rounds.length) {
      setDone(true);
    } else {
      setRoundIndex((i) => i + 1);
    }
  }

  if (done) {
    return (
      <div className="space-y-5 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">Your ideal night</p>
        <p className="font-display text-2xl text-foreground">{picks.join(" · ")}</p>
        <p className="text-sm italic text-gold/90">{randomMysteryPhrase()}</p>
        <Button onClick={onSolved} className="rounded-full bg-gold px-6 text-gold-contrast hover:bg-gold-soft">
          {continueLabel}
        </Button>
      </div>
    );
  }

  const round = rounds[roundIndex];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>
          Round {roundIndex + 1} / {rounds.length}
        </span>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-foreground/10">
          <motion.div
            className="h-full bg-gold"
            animate={{ width: `${((roundIndex + 1) / rounds.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={round.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.4 }}
          className="min-h-16 font-display text-2xl text-foreground"
        >
          {round.prompt}
        </motion.p>
      </AnimatePresence>

      <div className="flex flex-col gap-3">
        {round.options.map((option) => (
          <Button
            key={option}
            variant="outline"
            onClick={() => choose(option)}
            className="h-12 justify-center rounded-full border-foreground/15 bg-foreground/5 text-foreground hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
