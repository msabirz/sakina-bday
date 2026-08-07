"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { TileUnscramble, type Tile } from "@/components/shared/tile-unscramble";
import { giftGames } from "@/lib/config";
import { randomMysteryPhrase } from "@/lib/mystery-phrases";

/** A word scramble puzzle, fully driven by the `scrambled` / `answer` config. */
export function WordScrambleGame({ onSolved }: { onSolved: () => void }) {
  const { scrambled, answer, hint } = giftGames.wordScramble;
  const letters = useMemo<Tile[]>(() => scrambled.split("").map((char, id) => ({ id, char })), [scrambled]);

  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  function handleSolved() {
    setSolved(true);
    setFeedback("Unscrambled. Whether that's actually your gift is another question entirely.");
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-secondary">Tap the letters below in order to spell it out.</p>

      <TileUnscramble
        letters={letters}
        answer={answer}
        onSolved={handleSolved}
        onMismatch={() => setFeedback(randomMysteryPhrase())}
      />

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setShowHint(true)}
          className="text-xs uppercase tracking-wide text-text-secondary hover:text-gold"
        >
          Reveal a hint
        </button>
        {feedback && <p className="text-sm italic text-gold/90">{feedback}</p>}
      </div>
      {showHint && !solved && <p className="text-sm text-text-secondary">{hint}</p>}

      {solved && (
        <Button onClick={onSolved} className="rounded-full bg-gold px-6 text-gold-contrast hover:bg-gold-soft">
          Continue
        </Button>
      )}
    </div>
  );
}
