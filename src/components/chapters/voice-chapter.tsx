"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/shared/glass-panel";
import { voiceMessage } from "@/lib/config";
import { fadeIn } from "@/lib/motion";

const BAR_COUNT = 48;

function generateBarHeights() {
  return Array.from({ length: BAR_COUNT }, () => 0.25 + Math.random() * 0.75);
}

export function VoiceChapter({ onComplete, xpReward }: { onComplete: () => void; xpReward: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-1
  const [heard, setHeard] = useState(false);

  // Randomized once via useState's lazy initializer, at mount.
  const [barHeights] = useState(generateBarHeights);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function handleTimeUpdate() {
      const current = audioRef.current;
      if (!current || !current.duration) return;
      setProgress(current.currentTime / current.duration);
    }
    function handleEnded() {
      setPlaying(false);
      setProgress(1);
      setHeard(true);
    }

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => setHeard(true));
      setPlaying(true);
    }
  }

  return (
    <div className="space-y-8">
      <p className="max-w-xl text-sm text-text-secondary sm:text-base">{voiceMessage.transcriptTeaser}</p>

      <GlassPanel strong className="p-8 sm:p-10">
        <audio ref={audioRef} src={voiceMessage.src} preload="metadata" />

        <div className="flex items-center gap-6">
          <button
            onClick={togglePlay}
            className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gold text-gold-contrast shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-transform hover:scale-105 active:scale-95"
          >
            {playing ? <Pause className="size-6" fill="currentColor" /> : <Play className="ml-1 size-6" fill="currentColor" />}
          </button>

          <div className="flex-1">
            <p className="font-display text-xl text-foreground">{voiceMessage.title}</p>
            <p className="text-xs text-text-secondary">{voiceMessage.duration}</p>
          </div>
        </div>

        {/* waveform */}
        <div className="mt-8 flex h-20 items-center gap-[3px]">
          {barHeights.map((h, i) => {
            const barProgress = i / BAR_COUNT;
            const isActive = barProgress <= progress;
            return (
              <motion.span
                key={i}
                className="flex-1 rounded-full"
                style={{
                  background: isActive ? "#D4AF37" : "rgba(255,255,255,0.12)",
                }}
                animate={{
                  height: playing ? [`${h * 40}%`, `${h * 100}%`, `${h * 55}%`] : `${h * 60}%`,
                }}
                transition={{
                  duration: 0.9 + (i % 5) * 0.1,
                  repeat: playing ? Infinity : 0,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>

        <p className="mt-8 text-sm italic leading-relaxed text-text-secondary">{voiceMessage.message}</p>
      </GlassPanel>

      <div className="flex items-center justify-between">
        <p className="text-xs text-text-secondary">{heard ? "Message received." : "Press play to receive your transmission."}</p>
        {heard && (
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
    </div>
  );
}
