"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { giftGames } from "@/lib/config";
import { randomMysteryPhrase } from "@/lib/mystery-phrases";

export function EmojiPuzzleGame({ onSolved }: { onSolved: () => void }) {
  const { emojis, answer, hint } = giftGames.emojiPuzzle;
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState(false);

  function submit() {
    if (value.trim().toUpperCase() === answer.toUpperCase()) {
      setSolved(true);
      setFeedback("Correctly unscrambled. That's all I'm confirming.");
    } else {
      setFeedback(randomMysteryPhrase());
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-secondary">What does this spell?</p>

      <div className="flex justify-center gap-4 rounded-2xl border border-foreground/10 bg-background/30 py-8 text-5xl">
        {emojis.map((emoji, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {!solved ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Type your answer"
              className="border-foreground/15 bg-foreground/5 text-foreground placeholder:text-text-secondary"
            />
            <Button onClick={submit} className="rounded-full bg-gold text-gold-contrast hover:bg-gold-soft">
              Guess
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowHint(true)}
              className="text-xs uppercase tracking-wide text-text-secondary hover:text-gold"
            >
              Reveal a hint
            </button>
            {feedback && <p className="text-sm italic text-gold/90">{feedback}</p>}
          </div>
          {showHint && <p className="text-sm text-text-secondary">{hint}</p>}
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-sm italic text-gold/90">{feedback}</p>
          <Button onClick={onSolved} className="rounded-full bg-gold px-6 text-gold-contrast hover:bg-gold-soft">
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
