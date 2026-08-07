import { GlassPanel } from "@/components/shared/glass-panel";
import type { LucideIcon } from "lucide-react";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: "gold" | "rose";
}

export function StatTile({ icon: Icon, label, value, accent = "gold" }: StatTileProps) {
  return (
    <GlassPanel className="flex items-center gap-4 px-5 py-4">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
        style={{
          background: accent === "gold" ? "rgba(212,175,55,0.12)" : "rgba(231,167,183,0.12)",
          color: accent === "gold" ? "#D4AF37" : "#E7A7B7",
        }}
      >
        <Icon className="size-4.5" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">{label}</p>
        <p className="font-display text-xl text-foreground">{value}</p>
      </div>
    </GlassPanel>
  );
}
