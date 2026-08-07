"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useMissionStore } from "@/store/mission-store";
import { fireConfetti } from "@/lib/confetti";

interface Spot {
  left: string;
  top: string;
}

function generateSpots(count: number): Spot[] {
  return Array.from({ length: count }, () => ({
    left: `${8 + Math.random() * 84}%`,
    top: `${10 + Math.random() * 80}%`,
  }));
}

/**
 * A handful of near-invisible stars scattered across the viewport. Purely a
 * secret — finding and clicking all of them unlocks a hidden achievement.
 * Re-randomizes position per mount (i.e. per screen) so they never feel
 * predictable.
 */
export function HiddenStars({ count = 4 }: { count?: number }) {
  const [found, setFound] = useState<Set<number>>(new Set());
  const addHuntStar = useMissionStore((s) => s.addHuntStar);

  // Randomized once via useState's lazy initializer — this component only
  // ever renders client-side post-hydration.
  const [spots] = useState<Spot[]>(() => generateSpots(count));

  // Finding stars anywhere on the site — decorative or in the Treasure Hunt
  // chapter — feeds the same signal counter and can unlock the hidden
  // "Sharp-Eyed" achievement (handled centrally by SecretFeatures' watcher).
  function handleFind(index: number) {
    if (found.has(index)) return;
    setFound((prev) => new Set(prev).add(index));
    addHuntStar();
    fireConfetti();
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {spots.map((spot, i) => (
        <motion.button
          key={i}
          type="button"
          aria-label="A quiet signal"
          onClick={() => handleFind(i)}
          className="pointer-events-auto absolute -m-4 p-4"
          style={{ left: spot.left, top: spot.top }}
          animate={{ opacity: found.has(i) ? 0 : [0.05, 0.22, 0.05] }}
          transition={{ duration: 5, repeat: found.has(i) ? 0 : Infinity, ease: "easeInOut" }}
        >
          <Sparkle className="size-3 text-gold" />
        </motion.button>
      ))}
    </div>
  );
}
