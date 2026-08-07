"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { memories } from "@/lib/config";

interface FallingPhoto {
  id: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  rotateStart: number;
  memory: (typeof memories)[number];
}

function generatePhotos(): FallingPhoto[] {
  if (memories.length === 0) return [];
  // Cycle through the memories (repeating if there are fewer than 8) so the
  // fall always feels populated regardless of how many are configured.
  const desired = 8;
  return Array.from({ length: desired }, (_, i) => {
    const memory = memories[i % memories.length];
    return {
      id: `${memory.id}-${i}`,
      left: `${5 + Math.random() * 90}%`,
      size: 64 + Math.random() * 26,
      duration: 9 + Math.random() * 5,
      delay: i * 0.9 + Math.random() * 1.5,
      drift: 30 + Math.random() * 50,
      rotateStart: -18 + Math.random() * 36,
      memory,
    };
  });
}

/**
 * A gentle rain of her actual memory photos (or the gradient+emoji card
 * where no photo's been uploaded yet) — small tumbling polaroids, part of
 * the "grand entry" atmosphere alongside the petals.
 */
export function PhotoRain() {
  const [photos] = useState<FallingPhoto[]>(generatePhotos);

  if (photos.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[55] overflow-hidden">
      {photos.map((p) => (
        <motion.div
          key={p.id}
          className="absolute -top-24 overflow-hidden rounded-lg border-2 border-white/80 shadow-xl"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.15,
            background: p.memory.image
              ? undefined
              : `linear-gradient(160deg, ${p.memory.gradient[0]}, ${p.memory.gradient[1]})`,
          }}
          initial={{ y: -80, rotate: p.rotateStart, opacity: 0 }}
          animate={{
            y: "120vh",
            x: [0, p.drift, -p.drift * 0.4, 0],
            rotate: p.rotateStart + 180,
            opacity: [0, 0.95, 0.95, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {p.memory.image ? (
            <img src={p.memory.image} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-xl">{p.memory.emoji}</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
