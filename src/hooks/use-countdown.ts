"use client";

import { useEffect, useState } from "react";

export interface CountdownParts {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function computeParts(target: Date): CountdownParts {
  const totalMs = target.getTime() - Date.now();
  const isPast = totalMs <= 0;
  const abs = Math.max(totalMs, 0);
  const days = Math.floor(abs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((abs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((abs / (1000 * 60)) % 60);
  const seconds = Math.floor((abs / 1000) % 60);
  return { totalMs, isPast, days, hours, minutes, seconds };
}

/**
 * Ticking countdown to a target date. Returns `null` until mounted on the
 * client so we never render a server/client time mismatch.
 */
export function useCountdown(target: Date | string | null | undefined): CountdownParts | null {
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    // This effect subscribes to the wall clock (an external system) and
    // ticks `parts` every second; the immediate calls below just prime that
    // subscription with the current value instead of waiting a full second.
    if (!target) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setParts(null);
      return;
    }
    const targetDate = typeof target === "string" ? new Date(target) : target;
    setParts(computeParts(targetDate));
    const id = setInterval(() => setParts(computeParts(targetDate)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return parts;
}

export function formatCountdown(p: CountdownParts, showDays = true): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (showDays && p.days > 0) {
    return `${p.days}d ${pad(p.hours)}h ${pad(p.minutes)}m ${pad(p.seconds)}s`;
  }
  return `${pad(p.hours)}h ${pad(p.minutes)}m ${pad(p.seconds)}s`;
}
