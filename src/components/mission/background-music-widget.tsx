"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music, Pause, Play, X } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { backgroundMusic } from "@/lib/config";
import { isAmbientPlaying, subscribeAmbient, toggleAmbient } from "@/lib/ambient-audio";

/**
 * A small persistent "now playing" widget, mounted once above the
 * mission/chapter view-switcher so it survives navigation instead of
 * remounting (and restarting) on every screen change.
 *
 * When `background-music.json` has an `audioSrc`, this reflects and
 * controls that self-hosted track (which auto-starts from the birthday
 * opener's first tap — see ambient-audio.ts). Without one, it falls back
 * to a Spotify embed pill — honestly, that one can never truly autoplay,
 * so it just starts collapsed rather than pretending otherwise.
 */
export function BackgroundMusicWidget() {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Syncs to the module-level ambient-audio singleton's *current* state
    // on mount (it may already be playing from the birthday opener), then
    // subscribes for further changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlaying(isAmbientPlaying());
    return subscribeAmbient(setPlaying);
  }, []);

  if (!backgroundMusic.enabled) return null;

  if (backgroundMusic.audioSrc) {
    return (
      <div className="fixed bottom-5 left-5 z-40">
        <button
          type="button"
          onClick={() => toggleAmbient(backgroundMusic.audioSrc!)}
          className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-xs text-text-secondary transition-colors hover:border-gold/40 hover:text-gold"
        >
          {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {backgroundMusic.label}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            <GlassPanel strong className="w-72 space-y-2 p-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold/80">{backgroundMusic.label}</span>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  aria-label="Collapse player"
                  className="text-text-secondary hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <div className="overflow-hidden rounded-xl">
                <iframe
                  title={backgroundMusic.label}
                  src={backgroundMusic.spotifyEmbedUrl}
                  width="100%"
                  height="80"
                  frameBorder={0}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </GlassPanel>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            type="button"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            onClick={() => setExpanded(true)}
            className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-xs text-text-secondary transition-colors hover:border-gold/40 hover:text-gold"
          >
            <Music className="size-3.5" />
            {backgroundMusic.label}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
