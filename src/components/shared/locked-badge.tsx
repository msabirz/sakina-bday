"use client";

import { Lock } from "lucide-react";
import { formatCountdown, type CountdownParts } from "@/hooks/use-countdown";

interface LockedBadgeProps {
  countdown: CountdownParts | null;
  unlockAt: Date;
}

export function LockedBadge({ countdown, unlockAt }: LockedBadgeProps) {
  const timeLabel = unlockAt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex items-center gap-2 text-text-secondary">
      <Lock className="size-3.5" />
      <span className="text-xs tracking-wide">
        {countdown ? (
          <>
            Locked until {timeLabel}
            <span className="ml-2 font-mono text-[11px] text-gold/80">{formatCountdown(countdown, false)}</span>
          </>
        ) : (
          `Locked until ${timeLabel}`
        )}
      </span>
    </div>
  );
}
