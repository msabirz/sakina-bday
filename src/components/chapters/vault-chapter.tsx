"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memories } from "@/lib/config";
import { fadeIn, scaleIn, staggerContainer, staggerItem } from "@/lib/motion";
import type { MemoryItem } from "@/types";

export function VaultChapter({ onComplete, xpReward }: { onComplete: () => void; xpReward: number }) {
  const [openMemory, setOpenMemory] = useState<MemoryItem | null>(null);
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  function handleOpen(memory: MemoryItem) {
    setOpenMemory(memory);
    setViewed((prev) => new Set(prev).add(memory.id));
  }

  const allViewed = viewed.size === memories.length;

  return (
    <div className="space-y-10">
      <p className="max-w-xl text-sm text-text-secondary sm:text-base">
        Every one of these actually happened. Tap through the timeline — open each memory to unlock the next
        mission.
      </p>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="show"
        className="scrollbar-none -mx-6 flex gap-5 overflow-x-auto px-6 pb-4 sm:mx-0 sm:px-0"
      >
        {memories.map((memory) => (
          <motion.button
            key={memory.id}
            variants={staggerItem}
            onClick={() => handleOpen(memory)}
            whileHover={{ y: -6 }}
            className="group relative h-72 w-56 shrink-0 overflow-hidden rounded-3xl border border-white/10 text-left"
            style={memory.image ? undefined : { background: `linear-gradient(160deg, ${memory.gradient[0]}, ${memory.gradient[1]})` }}
          >
            {memory.image ? (
              <img
                src={memory.image}
                alt={memory.title}
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : null}
            <div
              className={
                memory.image
                  ? "absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 transition-colors group-hover:from-black/70"
                  : "absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10"
              }
            />
            {!memory.image && <span className="absolute right-4 top-4 text-3xl">{memory.emoji}</span>}
            <div className="absolute inset-x-0 bottom-0 space-y-1 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">{memory.date}</p>
              <p className="font-display text-lg text-white">{memory.title}</p>
            </div>
            {viewed.has(memory.id) && (
              <span className="absolute left-4 top-4 rounded-full bg-background/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gold backdrop-blur">
                Unlocked
              </span>
            )}
          </motion.button>
        ))}
      </motion.div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-text-secondary">
          {viewed.size}/{memories.length} memories opened
        </p>
        {allViewed && (
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

      <AnimatePresence>
        {openMemory && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-6 backdrop-blur-xl"
            onClick={() => setOpenMemory(null)}
          >
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10"
              style={openMemory.image ? undefined : { background: `linear-gradient(160deg, ${openMemory.gradient[0]}, ${openMemory.gradient[1]})` }}
            >
              <button
                onClick={() => setOpenMemory(null)}
                className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50"
              >
                <X className="size-4" />
              </button>
              {openMemory.image ? (
                <div
                  className="flex max-h-[65vh] min-h-[220px] w-full items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(160deg, ${openMemory.gradient[0]}, ${openMemory.gradient[1]})` }}
                >
                  <img
                    src={openMemory.image}
                    alt={openMemory.title}
                    className="max-h-[65vh] w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center text-7xl">{openMemory.emoji}</div>
              )}
              <div className="space-y-2 bg-background/80 p-8 backdrop-blur-xl">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold">{openMemory.date}</p>
                <h3 className="font-display text-2xl text-foreground">{openMemory.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{openMemory.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
