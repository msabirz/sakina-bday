"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CakeIllustration } from "@/components/intro/cake-illustration";
import { Button } from "@/components/ui/button";
import { luxuryEase } from "@/lib/motion";
import { fireBirthdayBurst, fireCelebration } from "@/lib/confetti";
import { playHappyBirthdayMelody, playApplause, playBlowWhoosh } from "@/lib/birthday-audio";
import { playAmbient } from "@/lib/ambient-audio";
import { missionConfig, backgroundMusic } from "@/lib/config";

type Phase = "lit" | "blown" | "cut";

// If she doesn't interact, the ritual still plays itself out — nobody gets
// stuck on a screen waiting for a tap they didn't know to make.
const FALLBACK_BLOW_MS = 5500;
const FALLBACK_CUT_MS = 3000;

/**
 * The very first thing the site shows — an interactive birthday ritual
 * (blow out the candles, then cut the cake) before the minimal black intro
 * sequence begins. Forced black regardless of theme, same as the rest of
 * the intro/outro bookends.
 */
export function BirthdayOpener({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("lit");
  // Guards against a tap and the fallback timer racing each other. A plain
  // ref (not the setState updater) so the side effects below run exactly
  // once, including under StrictMode's dev-only double-invocation.
  const phaseRef = useRef<Phase>("lit");

  useEffect(() => {
    const burst = setTimeout(() => fireCelebration(), 250);
    return () => clearTimeout(burst);
  }, []);

  useEffect(() => {
    if (phase !== "lit") return;
    const fallback = setTimeout(handleBlow, FALLBACK_BLOW_MS);
    return () => clearTimeout(fallback);
  }, [phase]);

  useEffect(() => {
    if (phase !== "blown") return;
    const fallback = setTimeout(handleCut, FALLBACK_CUT_MS);
    return () => clearTimeout(fallback);
  }, [phase]);

  function handleBlow() {
    if (phaseRef.current !== "lit") return;
    phaseRef.current = "blown";
    playBlowWhoosh();
    setTimeout(() => playApplause(0.9, 0.18), 450);
    // This is her first tap on the site — the one and only moment browsers
    // will reliably allow real audio to start without a further click.
    if (backgroundMusic.audioSrc) playAmbient(backgroundMusic.audioSrc);
    setPhase("blown");
  }

  function handleCut() {
    if (phaseRef.current !== "blown") return;
    phaseRef.current = "cut";
    fireBirthdayBurst();
    playHappyBirthdayMelody();
    setPhase("cut");
  }

  function handleTap() {
    if (phase === "lit") handleBlow();
    else if (phase === "blown") handleCut();
  }

  const prompt =
    phase === "lit"
      ? "Make a wish. Tap to blow out the candles."
      : phase === "blown"
        ? "Tap to cut the cake."
        : null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: luxuryEase }}
      onClick={phase !== "cut" ? handleTap : undefined}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#090909] px-6 text-center"
      style={{ cursor: phase !== "cut" ? "pointer" : "default" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: luxuryEase }}
      >
        <CakeIllustration size={180} blown={phase !== "lit"} cut={phase === "cut"} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.9, ease: luxuryEase }}
        className="font-display text-3xl italic text-gold-gradient sm:text-4xl"
      >
        Happy Birthday, {missionConfig.recipientName}.
      </motion.p>

      <div className="h-12">
        <AnimatePresence mode="wait">
          {prompt && (
            <motion.p
              key={prompt}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]"
            >
              {prompt}
            </motion.p>
          )}
          {phase === "cut" && (
            <motion.div
              key="continue"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete();
                }}
                className="rounded-full bg-[#D4AF37] px-8 text-xs font-medium tracking-[0.15em] text-gold-contrast uppercase hover:bg-[#E9CE7A]"
              >
                Continue
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
