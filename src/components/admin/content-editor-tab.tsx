"use client";

import { useState } from "react";
import { ChevronDown, Save } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  chapters,
  letter,
  memories,
  songs,
  voiceMessage,
  giftGames,
  shippingSteps,
  endingsConfig,
  achievements,
  treasureHunt,
  missionConfig,
  letterFragmentsConfig,
  giftReveal,
  backgroundMusic,
} from "@/lib/config";

const FILES: { key: string; label: string; data: unknown; hint: string }[] = [
  { key: "mission", label: "Site Config", data: missionConfig, hint: "Recipient name, occasion, admin password hash." },
  { key: "chapters", label: "Chapters / Missions", data: chapters, hint: "Titles, subtitles, unlock times, XP rewards." },
  { key: "letter", label: "Today's Letter", data: letter, hint: "The typewriter letter, line by line." },
  { key: "memories", label: "Memory Vault", data: memories, hint: "Timeline memories." },
  { key: "songs", label: "The Soundtrack", data: songs, hint: "Spotify embeds and per-song messages." },
  { key: "voice", label: "Voice Message", data: voiceMessage, hint: "Audio src path and message text." },
  { key: "gift-games", label: "Guess Your Gift — Games", data: giftGames, hint: "All 6 mini-game configs." },
  {
    key: "letter-fragments",
    label: "Signal Fragments",
    data: letterFragmentsConfig,
    hint: "The 13-tile phrase collected across every mission, and which mission/game awards which letter.",
  },
  {
    key: "gift-reveal",
    label: "Gift Reveal",
    data: giftReveal,
    hint: "What shows after the final phrase is unscrambled in Mission 7 — heading, message, image.",
  },
  {
    key: "background-music",
    label: "Background Music",
    data: backgroundMusic,
    hint: "The Spotify track behind the persistent 'Our Song' widget.",
  },
  { key: "shipping", label: "Shipping Steps", data: shippingSteps, hint: "The 5-step delivery timeline labels." },
  { key: "endings", label: "Endings", data: endingsConfig, hint: "Default ending mode + delivered/delayed/surprise content." },
  { key: "achievements", label: "Achievements", data: achievements, hint: "Secret + visible achievements." },
  { key: "treasure-hunt", label: "Treasure Hunt", data: treasureHunt, hint: "Hidden-signal chapter copy." },
];

export function ContentEditorTab({ password }: { password: string }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  function getDraft(key: string, data: unknown) {
    return drafts[key] ?? JSON.stringify(data, null, 2);
  }

  async function save(key: string) {
    const raw = drafts[key];
    if (raw === undefined) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      toast("That's not valid JSON — nothing was saved.");
      return;
    }

    setSaving(key);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, file: key, data: parsed }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      toast("Saved. In dev this hot-reloads instantly; in production, redeploy to ship it.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-text-secondary">
        These edit the actual JSON files in <code>src/data</code>. Requires a self-hosted, writable filesystem —
        it will fail gracefully on read-only platforms.
      </p>

      {FILES.map(({ key, label, data, hint }) => {
        const isOpen = openKey === key;
        return (
          <GlassPanel key={key} strong className="overflow-hidden">
            <button
              onClick={() => setOpenKey(isOpen ? null : key)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <div>
                <p className="font-display text-lg text-foreground">{label}</p>
                <p className="text-xs text-text-secondary">{hint}</p>
              </div>
              <ChevronDown className={`size-4 shrink-0 text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="space-y-3 border-t border-foreground/5 p-5">
                <Textarea
                  value={getDraft(key, data)}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="min-h-64 border-foreground/15 bg-background/40 font-mono text-xs text-foreground"
                  spellCheck={false}
                />
                <Button
                  type="button"
                  onClick={() => save(key)}
                  disabled={saving === key}
                  className="rounded-full bg-gold text-gold-contrast hover:bg-gold-soft"
                >
                  <Save className="mr-1.5 size-3.5" />
                  {saving === key ? "Saving…" : "Save to project files"}
                </Button>
              </div>
            )}
          </GlassPanel>
        );
      })}
    </div>
  );
}
