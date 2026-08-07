"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * A luxury animated gift-box illustration. Framer Motion handles the gentle
 * float; GSAP drives the ribbon shimmer sweep and the slow-breathing glow —
 * a signature, continuous timeline that feels alive rather than triggered.
 */
export function GiftIllustration({ size = 220 }: { size?: number }) {
  const sheenRef = useRef<SVGRectElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const boxRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (sheenRef.current) {
        gsap.fromTo(
          sheenRef.current,
          { x: -140 },
          { x: 220, duration: 3.2, repeat: -1, repeatDelay: 2.4, ease: "power2.inOut" }
        );
      }
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.75,
          scale: 1.12,
          transformOrigin: "center",
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (boxRef.current) {
        gsap.fromTo(
          boxRef.current,
          { rotate: -2, transformOrigin: "50% 90%" },
          { rotate: 2, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      fill="none"
      className="overflow-visible"
      aria-hidden
    >
      <circle ref={glowRef} cx="110" cy="130" r="70" fill="url(#giftGlow)" opacity="0.45" />

      <defs>
        <radialGradient id="giftGlow">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="boxBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1c1c" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </linearGradient>
        <linearGradient id="lidBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#232323" />
          <stop offset="100%" stopColor="#141414" />
        </linearGradient>
        <clipPath id="boxClip">
          <rect x="45" y="100" width="130" height="90" rx="6" />
        </clipPath>
      </defs>

      <g ref={boxRef}>
        {/* box body */}
        <rect x="45" y="100" width="130" height="90" rx="6" fill="url(#boxBody)" stroke="#2c2c2c" />
        <g clipPath="url(#boxClip)">
          <rect ref={sheenRef} x="-40" y="90" width="40" height="110" fill="#D4AF37" opacity="0.14" transform="skewX(-18)" />
        </g>

        {/* lid */}
        <rect x="38" y="78" width="144" height="28" rx="6" fill="url(#lidBody)" stroke="#2c2c2c" />

        {/* ribbon vertical */}
        <rect x="100" y="78" width="20" height="112" fill="#D4AF37" opacity="0.9" />
        {/* ribbon horizontal on lid */}
        <rect x="38" y="88" width="144" height="10" fill="#D4AF37" opacity="0.9" />

        {/* bow */}
        <path
          d="M110 78 C 90 55, 55 55, 60 78 C 62 90, 90 84, 110 78 Z"
          fill="#D4AF37"
        />
        <path
          d="M110 78 C 130 55, 165 55, 160 78 C 158 90, 130 84, 110 78 Z"
          fill="#E9CE7A"
        />
        <circle cx="110" cy="78" r="7" fill="#F4E2A0" />
      </g>
    </svg>
  );
}
