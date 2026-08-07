"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { getIcon } from "@/lib/icon-map";
import { shippingSteps } from "@/lib/config";

export function ShippingTimeline({ currentIndex }: { currentIndex: number }) {
  const truckRef = useRef<SVGGElement>(null);
  const wheelsRef = useRef<SVGGElement>(null);
  const clamped = Math.min(Math.max(currentIndex, 0), shippingSteps.length - 1);
  const percent = (clamped / (shippingSteps.length - 1)) * 100;
  const inTransit = clamped > 0 && clamped < shippingSteps.length - 1;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (truckRef.current) {
        gsap.to(truckRef.current, {
          y: -3,
          duration: 0.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (wheelsRef.current && inTransit) {
        gsap.to(wheelsRef.current, { rotate: 360, transformOrigin: "center", duration: 0.8, repeat: -1, ease: "linear" });
      }
    });
    return () => ctx.revert();
  }, [inTransit]);

  return (
    <div className="space-y-10">
      {/* Truck + road */}
      <div className="relative h-20">
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-foreground/10">
          <div className="absolute inset-0 flex animate-drift gap-6 opacity-40">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="h-full w-6 shrink-0 bg-gold/40" />
            ))}
          </div>
        </div>
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          animate={{ left: `calc(${percent}% - 20px)` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <g ref={truckRef}>
              <rect x="2" y="14" width="22" height="12" rx="2" fill="#D4AF37" />
              <path d="M24 18h8l4 5v3h-12z" fill="#E9CE7A" />
              <rect x="27" y="20" width="4" height="4" fill="#0d0d0d" opacity="0.4" />
            </g>
            <g ref={wheelsRef}>
              <circle cx="9" cy="28" r="3" fill="#111111" stroke="#D4AF37" strokeWidth="1" />
              <circle cx="27" cy="28" r="3" fill="#111111" stroke="#D4AF37" strokeWidth="1" />
            </g>
          </svg>
        </motion.div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-5 gap-2">
        {shippingSteps.map((step, i) => {
          // getIcon looks up a stable reference in a frozen, module-level icon map.
          const Icon = getIcon(step.icon);
          const isActive = i === clamped;
          const isPast = i < clamped;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 text-center">
              <div
                className={`flex size-10 items-center justify-center rounded-full border transition-colors ${
                  isActive
                    ? "border-gold bg-gold/15 text-gold"
                    : isPast
                      ? "border-gold/40 bg-gold/5 text-gold/70"
                      : "border-foreground/10 bg-foreground/5 text-text-secondary"
                }`}
              >
                <Icon className="size-4" />
              </div>
              <p className={`text-[10px] uppercase tracking-wide ${isActive ? "text-gold" : "text-text-secondary"}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm italic text-text-secondary">{shippingSteps[clamped]?.description}</p>
    </div>
  );
}
