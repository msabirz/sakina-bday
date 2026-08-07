"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc3, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/shared/glass-panel";
import { songs } from "@/lib/config";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/motion";

export function SongsChapter({ onComplete, xpReward }: { onComplete: () => void; xpReward: number }) {
  const [openId, setOpenId] = useState<string | null>(songs[0]?.id ?? null);
  const [opened, setOpened] = useState<Set<string>>(new Set(songs[0] ? [songs[0].id] : []));

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
    setOpened((prev) => new Set(prev).add(id));
  }

  const allOpened = opened.size === songs.length;

  return (
    <div className="space-y-8">
      <p className="max-w-xl text-sm text-text-secondary sm:text-base">
        Three songs, three moments. Open each one — every track carries a message.
      </p>

      <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="show" className="space-y-4">
        {songs.map((song) => {
          const isOpen = openId === song.id;
          return (
            <motion.div key={song.id} variants={staggerItem}>
              <GlassPanel strong className="overflow-hidden">
                <button
                  onClick={() => toggle(song.id)}
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  <div
                    className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white"
                    style={{ background: `linear-gradient(160deg, ${song.gradient[0]}, ${song.gradient[1]})` }}
                  >
                    <Disc3 className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg text-foreground">{song.title}</p>
                    <p className="truncate text-sm text-text-secondary">{song.artist}</p>
                  </div>
                  {opened.has(song.id) && !isOpen && (
                    <span className="text-[10px] uppercase tracking-wide text-gold">Heard</span>
                  )}
                  <ChevronDown className={`size-4 shrink-0 text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 border-t border-white/5 p-5">
                        <div className="overflow-hidden rounded-xl">
                          <iframe
                            title={song.title}
                            src={song.spotifyEmbedUrl}
                            width="100%"
                            height="152"
                            frameBorder={0}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-sm italic leading-relaxed text-text-secondary">&ldquo;{song.message}&rdquo;</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassPanel>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-text-secondary">
          {opened.size}/{songs.length} tracks opened
        </p>
        {allOpened && (
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
