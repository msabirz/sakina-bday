"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Firefly {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

function generateFireflies(count: number): Firefly[] {
  const colors = ["#D4AF37", "#E7A7B7", "#FFFFFF"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 3,
    duration: 8 + Math.random() * 10,
    delay: Math.random() * 6,
    color: colors[i % colors.length],
  }));
}

export function Fireflies({ count = 18 }: { count?: number }) {
  // Randomized once via useState's lazy initializer (runs a single time, at
  // mount) — this component only ever renders client-side post-hydration,
  // so there's no server/client mismatch to worry about.
  const [flies] = useState<Firefly[]>(() => generateFireflies(count));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {flies.map((fly) => (
        <motion.span
          key={fly.id}
          className="absolute rounded-full"
          style={{
            left: fly.left,
            top: fly.top,
            width: fly.size,
            height: fly.size,
            background: fly.color,
            boxShadow: `0 0 ${fly.size * 4}px ${fly.color}`,
          }}
          animate={{
            y: [0, -30, 10, -18, 0],
            x: [0, 14, -10, 6, 0],
            opacity: [0, 0.9, 0.4, 0.9, 0],
          }}
          transition={{
            duration: fly.duration,
            delay: fly.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
