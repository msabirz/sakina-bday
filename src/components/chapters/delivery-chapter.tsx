"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MapPin, Shirt, CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/shared/glass-panel";
import { ShippingTimeline } from "@/components/mission/shipping-timeline";
import { DecodePuzzle } from "@/components/chapters/decode-puzzle";
import { useMissionStore } from "@/store/mission-store";
import { endingsConfig, shippingSteps } from "@/lib/config";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { fireCelebration } from "@/lib/confetti";

export function DeliveryChapter({ onComplete, xpReward }: { onComplete: () => void; xpReward: number }) {
  const overrides = useMissionStore((s) => s.adminOverrides);
  const phraseSolved = useMissionStore((s) => s.phraseSolved);
  const [revealed, setRevealed] = useState(false);

  const mode = overrides.endingModeOverride ?? endingsConfig.mode;
  const rawStepIndex = overrides.shippingStepOverride ?? endingsConfig.currentShippingStepIndex;
  const stepIndex = mode === "delivered" ? shippingSteps.length - 1 : rawStepIndex;

  const canFinish = mode === "delivered" || mode === "surprise";

  useEffect(() => {
    if (revealed) fireCelebration();
  }, [revealed]);

  return (
    <div className="space-y-10">
      <DecodePuzzle />

      {phraseSolved && (
        <>
          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            animate="show"
            className="space-y-3 text-center"
          >
            <motion.p variants={staggerItem} className="text-xs uppercase tracking-[0.3em] text-gold">
              Mission Complete
            </motion.p>
            <motion.h2 variants={staggerItem} className="font-display text-3xl text-foreground sm:text-4xl">
              Every trial, solved.
            </motion.h2>
            {mode === "delayed" && !revealed && (
              <motion.p variants={staggerItem} className="mx-auto max-w-md text-sm text-text-secondary">
                There is only one problem...
              </motion.p>
            )}
          </motion.div>

          <GlassPanel strong className="p-8 sm:p-10">
            <ShippingTimeline currentIndex={stepIndex} />
          </GlassPanel>

          {mode === "delayed" && (
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <GlassPanel strong className="space-y-4 p-8 text-center sm:p-10">
                {endingsConfig.delayed.courierMessageLines.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.5, duration: 0.7 }}
                    className="font-display text-lg italic text-foreground/90 sm:text-xl"
                  >
                    {line}
                  </motion.p>
                ))}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + endingsConfig.delayed.courierMessageLines.length * 0.5 }}
                  className="pt-4 text-xs uppercase tracking-[0.25em] text-text-secondary"
                >
                  Estimated arrival: {endingsConfig.delayed.eta}
                </motion.p>
              </GlassPanel>
              <p className="mt-6 text-center text-xs text-text-secondary">
                This mission completes itself the moment the gift reaches you. Come back and check.
              </p>
            </motion.div>
          )}

          {mode === "delivered" && !revealed && (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => setRevealed(true)}
                className="rounded-full bg-gold px-10 text-sm font-medium tracking-[0.15em] text-gold-contrast uppercase hover:bg-gold-soft"
              >
                Open Your Gift
              </Button>
            </div>
          )}

          {mode === "delivered" && revealed && (
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <GlassPanel strong glow="gold" className="space-y-4 p-8 text-center sm:p-10">
                <Sparkles className="mx-auto size-8 text-gold" />
                <h3 className="font-display text-3xl text-foreground">{endingsConfig.delivered.giftName}</h3>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-text-secondary">
                  {endingsConfig.delivered.giftDescription}
                </p>
                <p className="pt-2 font-display italic text-gold">{endingsConfig.delivered.celebrationMessage}</p>
              </GlassPanel>
            </motion.div>
          )}

          {mode === "surprise" && !revealed && (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => setRevealed(true)}
                className="rounded-full bg-gold px-10 text-sm font-medium tracking-[0.15em] text-gold-contrast uppercase hover:bg-gold-soft"
              >
                Reveal the Surprise
              </Button>
            </div>
          )}

          {mode === "surprise" && revealed && (
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <GlassPanel strong glow="rose" className="space-y-5 p-8 text-center sm:p-10">
                <CalendarHeart className="mx-auto size-8 text-rose" />
                <h3 className="font-display text-3xl text-foreground">{endingsConfig.surprise.title}</h3>
                <p className="font-display italic text-rose">{endingsConfig.surprise.subtitle}</p>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-text-secondary">
                  {endingsConfig.surprise.description}
                </p>
                <div className="mx-auto flex max-w-sm flex-col gap-2 border-t border-foreground/10 pt-5 text-sm text-text-secondary">
                  <div className="flex items-center justify-center gap-2">
                    <CalendarHeart className="size-3.5 text-gold" />
                    {new Date(endingsConfig.surprise.dateTime).toLocaleString(undefined, {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="size-3.5 text-gold" />
                    {endingsConfig.surprise.location}
                  </div>
                  {endingsConfig.surprise.dressCode && (
                    <div className="flex items-center justify-center gap-2">
                      <Shirt className="size-3.5 text-gold" />
                      {endingsConfig.surprise.dressCode}
                    </div>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {canFinish && revealed && (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={onComplete}
                className="rounded-full border border-gold/40 bg-transparent px-8 text-sm font-medium tracking-wide text-gold hover:bg-gold/10"
              >
                Close the Mission · +{xpReward} XP
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
