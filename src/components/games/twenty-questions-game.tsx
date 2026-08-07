"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { giftGames } from "@/lib/config";
import { fadeUp } from "@/lib/motion";

export function TwentyQuestionsGame({ onSolved }: { onSolved: () => void }) {
  const questions = giftGames.twentyQuestions;
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  function answer(choice: "yes" | "no") {
    const q = questions[index];
    if (choice === q.answer) setCorrect((c) => c + 1);

    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (done) {
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-5 text-center">
        <p className="font-display text-2xl text-foreground">
          {correct}/{questions.length} instincts correct.
        </p>
        <p className="text-sm text-text-secondary">
          Not bad, Agent. Not that I&apos;m confirming anything.
        </p>
        <Button onClick={onSolved} className="rounded-full bg-gold px-6 text-gold-contrast hover:bg-gold-soft">
          Continue
        </Button>
      </motion.div>
    );
  }

  const q = questions[index];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>
          Question {index + 1} / {questions.length}
        </span>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-foreground/10">
          <motion.div
            className="h-full bg-gold"
            animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.4 }}
          className="min-h-16 font-display text-2xl text-foreground"
        >
          {q.question}
        </motion.p>
      </AnimatePresence>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => answer("yes")}
          className="h-12 flex-1 rounded-full border-foreground/15 bg-foreground/5 text-foreground hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
        >
          <Check className="mr-1.5 size-4" /> Yes
        </Button>
        <Button
          variant="outline"
          onClick={() => answer("no")}
          className="h-12 flex-1 rounded-full border-foreground/15 bg-foreground/5 text-foreground hover:border-rose/50 hover:bg-rose/10 hover:text-rose"
        >
          <X className="mr-1.5 size-4" /> No
        </Button>
      </div>
    </div>
  );
}
