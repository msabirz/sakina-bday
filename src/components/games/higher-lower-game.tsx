"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { giftGames } from "@/lib/config";
import { randomMysteryPhrase } from "@/lib/mystery-phrases";

const ROUNDS = 5;

export function HigherLowerGame({ onSolved }: { onSolved: () => void }) {
  const { currency, steps } = giftGames.higherLower;
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(steps[steps.length - 1] + 40);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const candidate = Math.round((low + high) / 2);

  function guess(direction: "higher" | "lower") {
    if (direction === "higher") setLow(candidate);
    else setHigh(candidate);

    setFeedback(randomMysteryPhrase());

    if (round + 1 >= ROUNDS) {
      setDone(true);
    } else {
      setRound((r) => r + 1);
    }
  }

  if (done) {
    return (
      <div className="space-y-5 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">Your narrowed estimate</p>
        <p className="font-display text-4xl text-gold">
          {currency}
          {candidate}
        </p>
        <p className="text-sm text-text-secondary">Am I close? I&apos;ll never tell.</p>
        <Button onClick={onSolved} className="rounded-full bg-gold px-6 text-gold-contrast hover:bg-gold-soft">
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>
          Round {round + 1} / {ROUNDS}
        </span>
        {feedback && <span className="italic text-gold/90">{feedback}</span>}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={candidate}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-text-secondary">Is the real price...</p>
          <p className="font-display text-5xl text-foreground">
            {currency}
            {candidate}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => guess("higher")}
          className="h-12 flex-1 rounded-full border-foreground/15 bg-foreground/5 text-foreground hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
        >
          <ArrowUp className="mr-1.5 size-4" /> Higher
        </Button>
        <Button
          variant="outline"
          onClick={() => guess("lower")}
          className="h-12 flex-1 rounded-full border-foreground/15 bg-foreground/5 text-foreground hover:border-rose/50 hover:bg-rose/10 hover:text-rose"
        >
          <ArrowDown className="mr-1.5 size-4" /> Lower
        </Button>
      </div>
    </div>
  );
}
