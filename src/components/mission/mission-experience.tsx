"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useHydrated } from "@/components/providers/app-providers";
import { useMissionStore } from "@/store/mission-store";
import { IntroSequence } from "@/components/intro/intro-sequence";
import { LoadingScreen } from "@/components/mission/loading-screen";
import { MissionControl } from "@/components/mission/mission-control";
import { ChapterRouter } from "@/components/mission/chapter-router";
import { ForeverOutro } from "@/components/mission/forever-outro";
import { Fireflies } from "@/components/effects/fireflies";
import { HiddenStars } from "@/components/effects/hidden-stars";
import { SecretFeatures } from "@/components/effects/secret-features";
import { BackgroundMusicWidget } from "@/components/mission/background-music-widget";
import { fireConfetti } from "@/lib/confetti";

export function MissionExperience() {
  const hydrated = useHydrated();
  const hasBegun = useMissionStore((s) => s.hasBegun);
  const begin = useMissionStore((s) => s.begin);
  const completeChapter = useMissionStore((s) => s.completeChapter);

  const [view, setView] = useState<string>("home");
  const [showOutro, setShowOutro] = useState(false);

  function handleCompleteChapter(chapterId: string, xpReward: number) {
    completeChapter(chapterId, xpReward);
    fireConfetti();
    if (chapterId === "delivery") {
      setShowOutro(true);
    } else {
      setView("home");
    }
  }

  if (!hydrated) return <LoadingScreen />;
  if (!hasBegun) return <IntroSequence onComplete={begin} />;

  return (
    <div className="relative min-h-screen">
      <Fireflies />
      <SecretFeatures />
      <HiddenStars count={3} />
      <BackgroundMusicWidget />

      <AnimatePresence mode="wait">
        {view === "home" ? (
          <MissionControl key="home" onSelectChapter={setView} />
        ) : (
          <ChapterRouter
            key={view}
            chapterId={view}
            onBack={() => setView("home")}
            onCompleteChapter={handleCompleteChapter}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOutro && (
          <ForeverOutro
            key="outro"
            onClose={() => {
              setShowOutro(false);
              setView("home");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
