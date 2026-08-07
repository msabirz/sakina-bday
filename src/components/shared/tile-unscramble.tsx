"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Tile {
  id: string | number;
  char: string;
}

interface TileUnscrambleProps {
  /** The scrambled pool of tiles, in the order they should render. */
  letters: Tile[];
  /** The solved phrase. Spaces are ignored for comparison and matching. */
  answer: string;
  onSolved: () => void;
  /**
   * On a wrong attempt: `true` sends every tile back to the pool for a
   * fresh guess (good for short words); `false` leaves the wrong tiles in
   * place so the player can fix just the tiles that are out of order (good
   * for longer phrases).
   */
  resetOnMismatch?: boolean;
  onMismatch?: () => void;
  size?: "sm" | "lg";
}

export function TileUnscramble({
  letters,
  answer,
  onSolved,
  resetOnMismatch = true,
  onMismatch,
  size = "sm",
}: TileUnscrambleProps) {
  const targetLength = answer.replace(/\s/g, "").length;
  const [pool, setPool] = useState<Tile[]>(letters);
  const [slots, setSlots] = useState<Tile[]>([]);
  const [solved, setSolved] = useState(false);

  const tileSize = size === "lg" ? "size-11 text-lg sm:size-12 sm:text-xl" : "size-10 text-lg";

  function pickTile(tile: Tile) {
    if (solved) return;
    // Built from current `slots` directly (not a setState updater) so the
    // onSolved/onMismatch callbacks below — which set state on the parent
    // — run as plain event-handler side effects, not while React is mid-way
    // through committing this component's own state update.
    const next = [...slots, tile];
    setPool((prev) => prev.filter((t) => t.id !== tile.id));
    setSlots(next);

    if (next.length === targetLength) {
      const guess = next
        .map((t) => t.char)
        .join("")
        .toUpperCase();
      if (guess === answer.replace(/\s/g, "").toUpperCase()) {
        setSolved(true);
        onSolved();
      } else {
        onMismatch?.();
        if (resetOnMismatch) {
          setTimeout(() => {
            setPool(letters);
            setSlots([]);
          }, 700);
        }
      }
    }
  }

  function returnTile(tile: Tile) {
    if (solved) return;
    setSlots((prev) => prev.filter((t) => t.id !== tile.id));
    setPool((prev) => [...prev, tile]);
  }

  return (
    <div className="space-y-4">
      <div className="flex min-h-14 flex-wrap gap-2 rounded-2xl border border-foreground/10 bg-background/20 p-3">
        <AnimatePresence>
          {slots.map((tile) => (
            <motion.button
              key={tile.id}
              layout
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={() => returnTile(tile)}
              className={cn(
                "flex items-center justify-center rounded-lg bg-gold font-display font-semibold text-gold-contrast",
                tileSize
              )}
            >
              {tile.char}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {pool.map((tile) => (
            <motion.button
              key={tile.id}
              layout
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={() => pickTile(tile)}
              className={cn(
                "flex items-center justify-center rounded-lg border border-foreground/15 bg-foreground/5 font-display text-foreground transition-colors hover:border-gold/40 hover:text-gold",
                tileSize
              )}
            >
              {tile.char}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
