"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { giftGames } from "@/lib/config";
import { randomMysteryPhrase } from "@/lib/mystery-phrases";

function shuffledPieces(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (arr.every((v, i) => v === i));
  return arr;
}

/**
 * A blind jigsaw — no reference thumbnail, so she genuinely doesn't know
 * what the picture is until she's assembled it herself. Tap two tiles to
 * swap them; any permutation is reachable by swaps, so there's no
 * solvability edge case to worry about like a sliding-tile puzzle has.
 */
export function ImageJigsawGame({ onSolved, xpReward }: { onSolved: () => void; xpReward?: number }) {
  const { image, gridSize, caption } = giftGames.imageJigsaw;
  const total = gridSize * gridSize;

  const [pieces, setPieces] = useState<number[]>(() => shuffledPieces(total));
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const continueLabel = xpReward ? `Continue · +${xpReward} XP` : "Continue";

  if (!image) {
    return (
      <div className="space-y-6 text-center">
        <p className="text-sm text-text-secondary">
          No picture has been loaded for this one yet — ask your agent to upload it via the Admin panel.
        </p>
        <Button onClick={onSolved} className="rounded-full bg-gold px-6 text-gold-contrast hover:bg-gold-soft">
          {continueLabel}
        </Button>
      </div>
    );
  }

  function handleTap(slotIndex: number) {
    if (solved) return;
    if (selected === null) {
      setSelected(slotIndex);
      return;
    }
    if (selected === slotIndex) {
      setSelected(null);
      return;
    }
    const next = [...pieces];
    [next[selected], next[slotIndex]] = [next[slotIndex], next[selected]];
    setSelected(null);
    setPieces(next);

    if (next.every((piece, i) => piece === i)) {
      setSolved(true);
      setFeedback(randomMysteryPhrase());
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-secondary">{caption}</p>

      <div
        className="mx-auto grid gap-1 overflow-hidden rounded-2xl border border-foreground/10"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`, maxWidth: 320 }}
      >
        {pieces.map((piece, slotIndex) => {
          const row = Math.floor(piece / gridSize);
          const col = piece % gridSize;
          return (
            <motion.button
              key={slotIndex}
              layout
              onClick={() => handleTap(slotIndex)}
              className="aspect-square"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`,
                outline: selected === slotIndex ? "3px solid #D4AF37" : solved ? "none" : "1px solid rgba(255,255,255,0.08)",
                outlineOffset: -2,
              }}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm italic text-gold/90">{feedback ?? "Tap two pieces to swap them."}</p>
      </div>

      {solved && (
        <Button onClick={onSolved} className="rounded-full bg-gold px-6 text-gold-contrast hover:bg-gold-soft">
          {continueLabel}
        </Button>
      )}
    </div>
  );
}
