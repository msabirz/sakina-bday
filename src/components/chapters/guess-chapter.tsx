"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Type, HelpCircle, TrendingUp, Eye, Smile, Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/shared/glass-panel";
import { useMissionStore } from "@/store/mission-store";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/motion";
import { WordScrambleGame } from "@/components/games/word-scramble-game";
import { TwentyQuestionsGame } from "@/components/games/twenty-questions-game";
import { HigherLowerGame } from "@/components/games/higher-lower-game";
import { BlurRevealGame } from "@/components/games/blur-reveal-game";
import { EmojiPuzzleGame } from "@/components/games/emoji-puzzle-game";
import { MultipleChoiceGame } from "@/components/games/multiple-choice-game";

const GAMES = [
  { id: "word-scramble", title: "Word Scramble", description: "Unscramble the letters.", icon: Type },
  { id: "twenty-questions", title: "20 Questions", description: "Yes or no. Your instincts only.", icon: HelpCircle },
  { id: "higher-lower", title: "Higher or Lower", description: "Narrow down the price.", icon: TrendingUp },
  { id: "blur-reveal", title: "Blur Reveal", description: "Peek through the fog.", icon: Eye },
  { id: "emoji-puzzle", title: "Emoji Puzzle", description: "Decode the symbols.", icon: Smile },
  { id: "multiple-choice", title: "Choose a Box", description: "Four boxes. One truth.", icon: Gift },
] as const;

type GameId = (typeof GAMES)[number]["id"];

export function GuessChapter({ onComplete, xpReward }: { onComplete: () => void; xpReward: number }) {
  const completedGameIds = useMissionStore((s) => s.completedGameIds);
  const completeGame = useMissionStore((s) => s.completeGame);
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const allDone = GAMES.every((g) => completedGameIds.includes(g.id));

  function handleSolved(id: GameId) {
    completeGame(id);
    setActiveGame(null);
  }

  return (
    <div className="space-y-8">
      <p className="max-w-xl text-sm text-text-secondary sm:text-base">
        Six trials. Complete every one. I promise nothing — not even at the end.
      </p>

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {GAMES.map((game) => {
          const done = completedGameIds.includes(game.id);
          const Icon = game.icon;
          return (
            <motion.button
              key={game.id}
              variants={staggerItem}
              onClick={() => setActiveGame(game.id)}
              whileHover={{ y: -4 }}
              className="text-left"
            >
              <GlassPanel strong glow={done ? "gold" : "none"} className="flex h-full flex-col gap-3 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    <Icon className="size-4.5" />
                  </div>
                  {done && (
                    <span className="flex size-6 items-center justify-center rounded-full bg-gold text-gold-contrast">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-display text-lg text-foreground">{game.title}</p>
                  <p className="text-sm text-text-secondary">{game.description}</p>
                </div>
              </GlassPanel>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-text-secondary">
          {completedGameIds.length}/{GAMES.length} trials complete
        </p>
        {allDone && (
          <motion.div variants={fadeIn} initial="hidden" animate="show">
            <Button
              size="lg"
              onClick={onComplete}
              className="rounded-full bg-gold px-8 text-sm font-medium tracking-wide text-gold-contrast hover:bg-gold-soft"
            >
              Mark Mission Complete · +{xpReward} XP
            </Button>
          </motion.div>
        )}
      </div>

      <Dialog open={activeGame !== null} onOpenChange={(open) => !open && setActiveGame(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-foreground/10 bg-panel text-foreground sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {GAMES.find((g) => g.id === activeGame)?.title}
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              {GAMES.find((g) => g.id === activeGame)?.description}
            </DialogDescription>
          </DialogHeader>

          {activeGame === "word-scramble" && <WordScrambleGame onSolved={() => handleSolved("word-scramble")} />}
          {activeGame === "twenty-questions" && (
            <TwentyQuestionsGame onSolved={() => handleSolved("twenty-questions")} />
          )}
          {activeGame === "higher-lower" && <HigherLowerGame onSolved={() => handleSolved("higher-lower")} />}
          {activeGame === "blur-reveal" && <BlurRevealGame onSolved={() => handleSolved("blur-reveal")} />}
          {activeGame === "emoji-puzzle" && <EmojiPuzzleGame onSolved={() => handleSolved("emoji-puzzle")} />}
          {activeGame === "multiple-choice" && (
            <MultipleChoiceGame onSolved={() => handleSolved("multiple-choice")} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
