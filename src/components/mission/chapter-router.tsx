"use client";

import { ChapterShell } from "@/components/mission/chapter-shell";
import { LetterChapter } from "@/components/chapters/letter-chapter";
import { VaultChapter } from "@/components/chapters/vault-chapter";
import { SongsChapter } from "@/components/chapters/songs-chapter";
import { VoiceChapter } from "@/components/chapters/voice-chapter";
import { HuntChapter } from "@/components/chapters/hunt-chapter";
import { GuessChapter } from "@/components/chapters/guess-chapter";
import { DeliveryChapter } from "@/components/chapters/delivery-chapter";
import { getChapter } from "@/lib/config";

interface ChapterRouterProps {
  chapterId: string;
  onBack: () => void;
  onCompleteChapter: (chapterId: string, xpReward: number) => void;
}

export function ChapterRouter({ chapterId, onBack, onCompleteChapter }: ChapterRouterProps) {
  const chapter = getChapter(chapterId);
  if (!chapter) return null;

  const onComplete = () => onCompleteChapter(chapter.id, chapter.xpReward);

  return (
    <ChapterShell chapter={chapter} onBack={onBack}>
      {chapter.type === "letter" && <LetterChapter onComplete={onComplete} xpReward={chapter.xpReward} />}
      {chapter.type === "vault" && <VaultChapter onComplete={onComplete} xpReward={chapter.xpReward} />}
      {chapter.type === "songs" && <SongsChapter onComplete={onComplete} xpReward={chapter.xpReward} />}
      {chapter.type === "voice" && <VoiceChapter onComplete={onComplete} xpReward={chapter.xpReward} />}
      {chapter.type === "hunt" && <HuntChapter onComplete={onComplete} xpReward={chapter.xpReward} />}
      {chapter.type === "guess" && <GuessChapter onComplete={onComplete} xpReward={chapter.xpReward} />}
      {chapter.type === "courier" && <DeliveryChapter onComplete={onComplete} xpReward={chapter.xpReward} />}
    </ChapterShell>
  );
}
