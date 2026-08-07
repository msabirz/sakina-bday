"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { GlassPanel } from "@/components/shared/glass-panel";
import { useLetterFragments } from "@/hooks/use-letter-fragments";

/**
 * A row of 13 rune-like slots on Mission Control. Each flips to reveal a
 * letter the moment its source (a mission, a mini-game, beginning the
 * mission) completes — but the slots sit in a shuffled, persisted order, so
 * even a mostly-full row never reads as a partial word. All 13 are
 * guaranteed collected by the time the mission right after "Guess Your
 * Gift" unlocks (completing it is the 13th and final source) — well before
 * the finale, where DecodePuzzle actually arranges them.
 */
export function FragmentStrip() {
  const { slots, collectedCount, total, allCollected } = useLetterFragments();
  const previouslyCollected = useRef<Set<string>>(new Set());

  useEffect(() => {
    const newlyCollected = slots.filter((s) => s.collected && !previouslyCollected.current.has(s.id));
    for (const slot of newlyCollected) {
      if (previouslyCollected.current.size > 0) {
        toast("A fragment surfaces...", { description: `Signal recovered. ${collectedCount}/${total} collected.` });
      }
      previouslyCollected.current.add(slot.id);
    }
  }, [slots, collectedCount, total]);

  return (
    <GlassPanel strong className="space-y-4 p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold/80">Signal Fragments</p>
          <p className="font-display text-lg text-foreground">
            {allCollected ? "Every fragment recovered." : "Scattered across your missions."}
          </p>
        </div>
        <span className="text-xs text-text-secondary">
          {collectedCount}/{total}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {slots.map((slot, i) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02, duration: 0.4 }}
            className={`flex size-9 items-center justify-center rounded-lg border font-display text-base sm:size-10 ${
              slot.collected
                ? "border-gold/40 bg-gold/10 text-gold shadow-[0_0_14px_rgba(212,175,55,0.25)]"
                : "border-foreground/10 bg-foreground/[0.03] text-text-secondary/40"
            }`}
          >
            {slot.collected ? slot.char : "·"}
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}
