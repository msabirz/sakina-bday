"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMissionStore } from "@/store/mission-store";
import { chapters, shippingSteps } from "@/lib/config";
import type { EndingMode } from "@/types";

function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function LiveControlsTab() {
  const overrides = useMissionStore((s) => s.adminOverrides);
  const setForceUnlockAll = useMissionStore((s) => s.setForceUnlockAll);
  const setChapterUnlockOverride = useMissionStore((s) => s.setChapterUnlockOverride);
  const setEndingModeOverride = useMissionStore((s) => s.setEndingModeOverride);
  const setShippingStepOverride = useMissionStore((s) => s.setShippingStepOverride);
  const completedChapterIds = useMissionStore((s) => s.completedChapterIds);
  const setChapterCompleted = useMissionStore((s) => s.setChapterCompleted);
  const xp = useMissionStore((s) => s.xp);
  const setXp = useMissionStore((s) => s.setXp);
  const resetProgress = useMissionStore((s) => s.resetProgress);

  const [xpInput, setXpInput] = useState(String(xp));

  return (
    <div className="space-y-6">
      <GlassPanel strong className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg text-foreground">Preview Mode</p>
            <p className="text-xs text-text-secondary">Unlock every mission instantly, ignoring dates and order.</p>
          </div>
          <Switch checked={overrides.forceUnlockAll} onCheckedChange={setForceUnlockAll} />
        </div>
      </GlassPanel>

      <GlassPanel strong className="space-y-4 p-6">
        <p className="font-display text-lg text-foreground">Final Chapter Ending</p>
        <p className="text-xs text-text-secondary">
          Overrides <code>endings.json</code> for this browser only. Clear to fall back to the shipped default (
          <code>delayed</code>).
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={overrides.endingModeOverride ?? "default"}
            onValueChange={(v) => setEndingModeOverride(v === "default" ? null : (v as EndingMode))}
          >
            <SelectTrigger className="w-48 border-foreground/15 bg-foreground/5 text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Use default</SelectItem>
              <SelectItem value="delivered">Gift Delivered</SelectItem>
              <SelectItem value="delayed">Gift Delayed</SelectItem>
              <SelectItem value="surprise">Surprise Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="pt-2 text-xs text-text-secondary">Shipping status</p>
        <div className="flex flex-wrap gap-2">
          {shippingSteps.map((step, i) => (
            <Button
              key={step.id}
              type="button"
              size="sm"
              variant={overrides.shippingStepOverride === i ? "default" : "outline"}
              onClick={() => setShippingStepOverride(i)}
              className={
                overrides.shippingStepOverride === i
                  ? "rounded-full bg-gold text-gold-contrast hover:bg-gold-soft"
                  : "rounded-full border-foreground/15 bg-foreground/5 text-foreground hover:border-gold/40"
              }
            >
              {step.label}
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShippingStepOverride(null)}
            className="rounded-full text-text-secondary hover:text-foreground"
          >
            Clear
          </Button>
        </div>
      </GlassPanel>

      <GlassPanel strong className="space-y-4 p-6">
        <p className="font-display text-lg text-foreground">Chapter Unlock Times</p>
        <div className="space-y-3">
          {chapters.map((chapter) => {
            const overrideIso = overrides.chapterUnlockOverrides[chapter.id];
            return (
              <div key={chapter.id} className="flex flex-wrap items-center gap-3 border-t border-foreground/5 pt-3 first:border-0 first:pt-0">
                <div className="w-40 shrink-0">
                  <p className="text-sm text-foreground">{chapter.title}</p>
                  <p className="text-[10px] uppercase tracking-wide text-text-secondary">{chapter.missionLabel}</p>
                </div>
                <Input
                  type="datetime-local"
                  defaultValue={toLocalInputValue(overrideIso ?? chapter.unlockAt)}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    setChapterUnlockOverride(chapter.id, new Date(val).toISOString());
                  }}
                  className="w-56 border-foreground/15 bg-foreground/5 text-foreground"
                />
                {overrideIso && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setChapterUnlockOverride(chapter.id, null)}
                    className="text-text-secondary hover:text-foreground"
                  >
                    Reset
                  </Button>
                )}
                <div className="ml-auto flex items-center gap-2">
                  <Label className="text-xs text-text-secondary">Completed</Label>
                  <Switch
                    checked={completedChapterIds.includes(chapter.id)}
                    onCheckedChange={(checked) => setChapterCompleted(chapter.id, checked)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassPanel>

      <GlassPanel strong className="space-y-4 p-6">
        <p className="font-display text-lg text-foreground">Progress</p>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="number"
            value={xpInput}
            onChange={(e) => setXpInput(e.target.value)}
            className="w-32 border-foreground/15 bg-foreground/5 text-foreground"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setXp(Number(xpInput) || 0)}
            className="rounded-full border-foreground/15 bg-foreground/5 text-foreground hover:border-gold/40"
          >
            Set XP
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (confirm("Reset all progress, XP, and achievements? This cannot be undone.")) {
                resetProgress();
                setXpInput("0");
              }
            }}
            className="ml-auto rounded-full border-rose/30 bg-rose/5 text-rose hover:bg-rose/15"
          >
            Reset All Progress
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
}
