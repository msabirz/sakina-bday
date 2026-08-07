import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
  glow?: "gold" | "rose" | "none";
}

export function GlassPanel({ className, strong, glow = "none", ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-3xl",
        strong ? "glass-strong" : "glass",
        glow === "gold" && "glow-gold",
        glow === "rose" && "glow-rose",
        className
      )}
      {...props}
    />
  );
}
