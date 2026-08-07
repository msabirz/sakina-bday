"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift as GiftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { giftGames } from "@/lib/config";
import { randomMysteryPhrase } from "@/lib/mystery-phrases";

export function MultipleChoiceGame({ onSolved }: { onSolved: () => void }) {
  const { prompt, options } = giftGames.multipleChoice;
  const [considered, setConsidered] = useState<Set<string>>(new Set());
  const [shaking, setShaking] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  function select(id: string) {
    setConsidered((prev) => new Set(prev).add(id));
    setFeedback(randomMysteryPhrase());
    setShaking(id);
    setTimeout(() => setShaking(null), 500);
  }

  const canFinish = considered.size >= 2;

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-secondary">{prompt}</p>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => select(option.id)}
            animate={
              shaking === option.id
                ? { x: [0, -6, 6, -4, 4, 0], rotate: [0, -2, 2, -1, 1, 0] }
                : { x: 0, rotate: 0 }
            }
            transition={{ duration: 0.45 }}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-colors ${
              considered.has(option.id)
                ? "border-gold/40 bg-gold/5"
                : "border-foreground/10 bg-foreground/5 hover:border-foreground/25"
            }`}
          >
            <GiftIcon className={`size-8 ${considered.has(option.id) ? "text-gold" : "text-foreground/70"}`} />
            <span className="text-xs text-text-secondary">{option.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm italic text-gold/90">{feedback ?? "Choose carefully. Or don't."}</p>
      </div>

      {canFinish && (
        <Button onClick={onSolved} className="rounded-full bg-gold px-6 text-gold-contrast hover:bg-gold-soft">
          Lock In &amp; Continue
        </Button>
      )}
    </div>
  );
}
