"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { giftGames } from "@/lib/config";

const STEPS = [18, 13, 9, 5, 2.5];

export function BlurRevealGame({ onSolved }: { onSolved: () => void }) {
  const { image, caption } = giftGames.blurReveal;
  const [level, setLevel] = useState(0);

  const blurPx = STEPS[level];
  const isMax = level >= STEPS.length - 1;

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-secondary">
        {isMax ? "That's as clear as it gets. Some mystery stays intact." : "Peek a little closer, if you dare."}
      </p>

      <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-foreground/10 bg-background/40">
        <motion.img
          src={image}
          alt="A mystery gift, obscured"
          animate={{ filter: `blur(${blurPx}px)` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="size-48 object-contain"
        />
      </div>

      <p className="text-center text-xs italic text-text-secondary">{caption}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-1 w-6 rounded-full ${i <= level ? "bg-gold" : "bg-foreground/10"}`} />
          ))}
        </div>
        {!isMax ? (
          <Button
            variant="outline"
            onClick={() => setLevel((l) => Math.min(l + 1, STEPS.length - 1))}
            className="rounded-full border-foreground/15 bg-foreground/5 text-foreground hover:border-gold/50 hover:text-gold"
          >
            Reveal a little more
          </Button>
        ) : (
          <Button onClick={onSolved} className="rounded-full bg-gold px-6 text-gold-contrast hover:bg-gold-soft">
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
