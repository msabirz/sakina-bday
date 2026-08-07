"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BirthdayOpener } from "@/components/intro/birthday-opener";
import { luxuryEase } from "@/lib/motion";
import { missionConfig } from "@/lib/config";

type Beat = "heart" | "line1" | "line2" | "line3" | "cta";

const LINES: { key: Beat; text: string }[] = [
  { key: "line1", text: "Tonight isn't simply your birthday." },
  { key: "line2", text: "Tonight begins your mission." },
  { key: "line3", text: "Find your gift." },
];

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [showCelebration, setShowCelebration] = useState(true);
  const [beat, setBeat] = useState<Beat>("heart");

  useEffect(() => {
    if (showCelebration) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setBeat("line1"), 2000));
    timers.push(setTimeout(() => setBeat("line2"), 5200));
    timers.push(setTimeout(() => setBeat("line3"), 8400));
    timers.push(setTimeout(() => setBeat("cta"), 11200));
    return () => timers.forEach(clearTimeout);
  }, [showCelebration]);

  const currentLine = LINES.find((l) => l.key === beat)?.text;

  return (
    <AnimatePresence mode="wait">
      {showCelebration ? (
        <BirthdayOpener key="celebration" onComplete={() => setShowCelebration(false)} />
      ) : (
        // Forced black regardless of the site's light/dark theme — this
        // beat is a deliberate cinematic moment, not page chrome.
        <div key="sequence" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090909] px-6">
          <AnimatePresence mode="wait">
            {beat === "heart" && (
              <motion.div
                key="heart"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 1.2, ease: luxuryEase }}
                className="relative flex items-center justify-center"
              >
                <span className="absolute size-16 animate-pulse-glow rounded-full bg-[#E7A7B7]/30 blur-2xl" />
                <Heart className="relative size-6 fill-[#E7A7B7] text-[#E7A7B7] drop-shadow-[0_0_18px_rgba(231,167,183,0.7)]" />
              </motion.div>
            )}

            {currentLine && beat !== "cta" && (
              <motion.p
                key={beat}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                transition={{ duration: 1.1, ease: luxuryEase }}
                className="max-w-md text-center font-display text-3xl font-light italic leading-relaxed text-white sm:text-4xl"
              >
                {currentLine}
              </motion.p>
            )}

            {beat === "cta" && (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: luxuryEase }}
                className="flex flex-col items-center gap-8 text-center"
              >
                <p className="font-display text-3xl font-light italic text-white sm:text-4xl">Find your gift.</p>
                <p className="max-w-sm text-sm text-[#A0A0A0]">
                  {missionConfig.recipientName}, seven missions stand between you and the truth. Some are already
                  unlocked. Some will make you wait.
                </p>
                <Button
                  size="lg"
                  onClick={onComplete}
                  className="group h-13 rounded-full bg-[#D4AF37] px-10 text-sm font-medium tracking-[0.15em] text-gold-contrast uppercase hover:bg-[#E9CE7A]"
                >
                  Begin Mission
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
