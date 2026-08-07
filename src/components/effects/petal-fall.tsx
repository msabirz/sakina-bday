"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Petal {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
  rotateStart: number;
}

function generatePetals(count: number): Petal[] {
  const colors = ["#E7A7B7", "#D4AF37", "#F2C9D3", "#E9CE7A"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 10 + Math.random() * 10,
    duration: 7 + Math.random() * 6,
    delay: Math.random() * 6,
    drift: 40 + Math.random() * 60,
    color: colors[i % colors.length],
    rotateStart: Math.random() * 360,
  }));
}

/**
 * Soft rose/gold petals drifting down from the top of the screen — the
 * "grand entry" atmosphere layer. Mounted only during the intro (opener +
 * heart/text beats); purely decorative, pointer-events-none throughout.
 */
export function PetalFall({ count = 22 }: { count?: number }) {
  const [petals] = useState<Petal[]>(() => generatePetals(count));

  return (
    <div className="pointer-events-none fixed inset-0 z-[55] overflow-hidden">
      {petals.map((petal) => (
        <motion.svg
          key={petal.id}
          width={petal.size}
          height={petal.size * 1.3}
          viewBox="0 0 20 26"
          className="absolute -top-10"
          style={{ left: petal.left }}
          initial={{ y: -40, x: 0, rotate: petal.rotateStart, opacity: 0 }}
          animate={{
            y: "115vh",
            x: [0, petal.drift, -petal.drift * 0.5, 0],
            rotate: petal.rotateStart + 260,
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <path
            d="M10 0 C 16 4, 20 12, 10 26 C 0 12, 4 4, 10 0 Z"
            fill={petal.color}
            opacity={0.85}
          />
        </motion.svg>
      ))}
    </div>
  );
}
