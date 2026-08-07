"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/shared/glass-panel";
import { sha256Hex } from "@/lib/sha256";
import { missionConfig } from "@/lib/config";

export function LoginGate({ onAuthed }: { onAuthed: (password: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(null);
    const hash = await sha256Hex(password);
    setChecking(false);
    if (hash === missionConfig.adminPasswordHash) {
      onAuthed(password);
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <GlassPanel strong className="w-full max-w-sm space-y-6 p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Lock className="size-4.5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-text-secondary">Restricted</p>
              <h1 className="font-display text-xl text-foreground">Command Center</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="border-foreground/15 bg-foreground/5 text-foreground placeholder:text-text-secondary"
              autoFocus
            />
            {error && <p className="text-xs text-rose">{error}</p>}
            <Button
              type="submit"
              disabled={checking || !password}
              className="w-full rounded-full bg-gold text-gold-contrast hover:bg-gold-soft"
            >
              <ShieldCheck className="mr-1.5 size-4" />
              {checking ? "Verifying…" : "Enter"}
            </Button>
          </form>

          <p className="text-center text-[11px] leading-relaxed text-text-secondary/70">
            Default password is <code className="text-gold/80">mission-control</code>. Change the hash in{" "}
            <code>src/data/mission.config.json</code>.
          </p>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
