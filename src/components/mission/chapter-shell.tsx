"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { pageTransition } from "@/lib/motion";
import type { ChapterConfig } from "@/types";
import { getIcon } from "@/lib/icon-map";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface ChapterShellProps {
  chapter: ChapterConfig;
  onBack: () => void;
  children: React.ReactNode;
}

export function ChapterShell({ chapter, onBack, children }: ChapterShellProps) {
  // getIcon looks up a stable reference in a frozen, module-level icon map —
  // safe to use as a JSX tag despite the lint rule's generic warning.
  const Icon = getIcon(chapter.icon);

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
      className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 pb-24 pt-10 sm:px-8"
    >
      <div className="mb-10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="group flex w-fit items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-secondary transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          Mission Control
        </button>
        <ThemeToggle />
      </div>

      <div className="mb-10 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
          {/* eslint-disable-next-line react-hooks/static-components -- stable lookup in a frozen icon map */}
          <Icon className="size-5.5" />
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold/80">{chapter.missionLabel}</p>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">{chapter.title}</h1>
        </div>
      </div>

      {children}
    </motion.div>
  );
}
