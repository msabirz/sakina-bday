"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { luxuryEase } from "@/lib/motion";
import { missionConfig } from "@/lib/config";

export function ForeverOutro({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      /* Forced black regardless of the site's light/dark theme — this
         closing moment is a deliberate cinematic bookend to the intro. */
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#090909] px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: luxuryEase }}
        className="relative flex items-center justify-center"
      >
        <span className="absolute size-16 animate-pulse-glow rounded-full bg-[#E7A7B7]/30 blur-2xl" />
        <Heart className="relative size-6 fill-[#E7A7B7] text-[#E7A7B7] drop-shadow-[0_0_18px_rgba(231,167,183,0.7)]" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="font-display text-4xl italic text-gold-gradient sm:text-5xl"
      >
        Forever.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="max-w-md text-sm leading-relaxed text-[#A0A0A0]"
      >
        Happy birthday, {missionConfig.recipientName}. Every mission was real, every word was true, and
        I&apos;d build this all over again just to see your face right now.
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 1 }}>
        <Button
          onClick={onClose}
          variant="outline"
          className="rounded-full border-gold/40 bg-transparent px-8 text-sm tracking-wide text-gold hover:bg-gold/10"
        >
          Return to Mission Control
        </Button>
      </motion.div>
    </motion.div>
  );
}
