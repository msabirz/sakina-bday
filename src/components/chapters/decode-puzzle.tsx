"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { TileUnscramble, type Tile } from "@/components/shared/tile-unscramble";
import { useLetterFragments } from "@/hooks/use-letter-fragments";
import { useMissionStore } from "@/store/mission-store";
import { giftReveal } from "@/lib/config";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { fireCelebration } from "@/lib/confetti";

/**
 * The finale cipher: every fragment collected across the whole mission,
 * arranged into the answer. Sits above the shipping/ending section in
 * DeliveryChapter and gates it — she learns *what* the gift is before
 * learning *when* it arrives.
 */
export function DecodePuzzle() {
  const { slots, targetPhrase } = useLetterFragments();
  const phraseSolved = useMissionStore((s) => s.phraseSolved);
  const setPhraseSolved = useMissionStore((s) => s.setPhraseSolved);

  const letters: Tile[] = slots.map((s) => ({ id: s.id, char: s.char }));

  useEffect(() => {
    if (phraseSolved) fireCelebration();
  }, [phraseSolved]);

  if (phraseSolved) {
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <GlassPanel strong glow="gold" className="space-y-4 p-8 text-center sm:p-10">
          <Sparkles className="mx-auto size-8 text-gold" />
          <p className="font-display text-2xl tracking-[0.15em] text-gold sm:text-3xl">{targetPhrase}</p>
          <h3 className="font-display text-xl text-foreground sm:text-2xl">{giftReveal.revealHeading}</h3>
          <img src={giftReveal.image} alt="A hint of what's coming" className="mx-auto h-40 w-40 object-contain" />
          <p className="mx-auto max-w-md text-sm leading-relaxed text-text-secondary">{giftReveal.revealMessage}</p>
        </GlassPanel>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer(0.12)} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={staggerItem} className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">One Last Cipher</p>
        <h3 className="font-display text-2xl text-foreground sm:text-3xl">
          Every mission handed you a fragment. Arrange them.
        </h3>
      </motion.div>

      <motion.div variants={staggerItem}>
        <GlassPanel strong className="p-8 sm:p-10">
          <TileUnscramble
            letters={letters}
            answer={targetPhrase}
            resetOnMismatch={false}
            size="lg"
            onSolved={() => setPhraseSolved(true)}
          />
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
