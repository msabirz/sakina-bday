"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

interface CakeIllustrationProps {
  size?: number;
  /** Candles extinguished — flames fade out, soft smoke wisps rise. */
  blown?: boolean;
  /** A wedge slice separates from the cake. */
  cut?: boolean;
}

/**
 * A luxury birthday cake illustration — line-art proportions, gold/cream
 * palette. GSAP drives the continuous candle flicker (ambient, non-reactive);
 * Framer Motion drives the state-driven beats (blowing out, cutting) since
 * those map naturally to React state rather than a running timeline.
 */
export function CakeIllustration({ size = 220, blown = false, cut = false }: CakeIllustrationProps) {
  const flameRefs = useRef<(SVGGElement | null)[]>([]);
  const glowRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!blown) {
        flameRefs.current.forEach((flame, i) => {
          if (!flame) return;
          gsap.to(flame, {
            scaleY: 1.15 + Math.random() * 0.15,
            scaleX: 0.92,
            rotate: -3 + Math.random() * 6,
            transformOrigin: "50% 100%",
            duration: 0.4 + Math.random() * 0.35,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.12,
          });
        });
      }
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: blown ? 0.15 : 0.7,
          duration: 1.4,
          repeat: blown ? 0 : -1,
          yoyo: !blown,
          ease: "sine.inOut",
        });
      }
    });
    return () => ctx.revert();
  }, [blown]);

  const candleXs = [90, 118, 150, 182, 210];

  return (
    <svg width={size} height={size} viewBox="0 0 300 300" fill="none" className="overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="cakeGlow">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tierBottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2416" />
          <stop offset="100%" stopColor="#171310" />
        </linearGradient>
        <linearGradient id="tierTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#332b18" />
          <stop offset="100%" stopColor="#1c170d" />
        </linearGradient>
        <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE9B0" />
          <stop offset="55%" stopColor="#E9CE7A" />
          <stop offset="100%" stopColor="#B8892C" />
        </linearGradient>
      </defs>

      <circle ref={glowRef} cx="150" cy="150" r="95" fill="url(#cakeGlow)" opacity="0.35" />

      {/* plate shadow */}
      <ellipse cx="150" cy="252" rx="88" ry="9" fill="#000000" opacity="0.4" />

      {/* bottom tier */}
      <motion.g animate={{ x: cut ? -6 : 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <rect x="66" y="176" width="168" height="66" rx="10" fill="url(#tierBottom)" stroke="#3a3020" />
        <rect x="66" y="176" width="168" height="10" rx="5" fill="#D4AF37" opacity="0.85" />
      </motion.g>

      {/* separated slice, revealed once cut */}
      <AnimatePresence>
        {cut && (
          <motion.g
            key="slice"
            initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
            animate={{ opacity: 1, x: 28, y: 12, rotate: 14 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <path d="M150 178 L208 178 L188 236 Z" fill="url(#tierBottom)" stroke="#D4AF37" strokeWidth="1.5" />
            <path d="M150 178 L208 178" stroke="#E9CE7A" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* top tier */}
      <rect x="96" y="120" width="108" height="60" rx="10" fill="url(#tierTop)" stroke="#3a3020" />
      <rect x="96" y="120" width="108" height="9" rx="4.5" fill="#D4AF37" opacity="0.85" />

      {/* candles + flames */}
      {candleXs.map((x, i) => (
        <g key={x}>
          <rect x={x - 3} y="88" width="6" height="34" rx="2" fill={i % 2 === 0 ? "#D4AF37" : "#E7A7B7"} />

          <AnimatePresence>
            {!blown && (
              <motion.g
                key="flame"
                ref={(el) => {
                  flameRefs.current[i] = el;
                }}
                exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.35 } }}
              >
                <path
                  d={`M${x} 68 C ${x + 6} 76, ${x + 5} 84, ${x} 88 C ${x - 5} 84, ${x - 6} 76, ${x} 68 Z`}
                  fill="url(#flameGrad)"
                />
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {blown && (
              <motion.circle
                key="smoke"
                cx={x}
                cy={80}
                r="3"
                fill="#d8d8d8"
                initial={{ opacity: 0.55, scale: 1 }}
                animate={{ opacity: 0, y: -32, scale: 2.6 }}
                transition={{ duration: 1.3, ease: "easeOut", delay: i * 0.04 }}
              />
            )}
          </AnimatePresence>
        </g>
      ))}
    </svg>
  );
}
