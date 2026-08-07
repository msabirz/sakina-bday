"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music, X } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { backgroundMusic } from "@/lib/config";

/**
 * A small persistent "now playing" widget, mounted once above the
 * mission/chapter view-switcher so it survives navigation instead of
 * remounting (and restarting) on every screen change.
 *
 * Honest limitation: Spotify's embed can't silently autoplay — both the
 * browser's autoplay policy and Spotify's own embed require a real user
 * gesture — so this starts collapsed as an inviting pill rather than
 * pretending to play music nobody asked for yet.
 */
export function BackgroundMusicWidget() {
  const [expanded, setExpanded] = useState(false);

  if (!backgroundMusic.enabled) return null;

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
