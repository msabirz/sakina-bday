import missionConfigRaw from "@/data/mission.config.json";
import chaptersRaw from "@/data/chapters.json";
import letterRaw from "@/data/letter.json";
import memoriesRaw from "@/data/memories.json";
import songsRaw from "@/data/songs.json";
import voiceRaw from "@/data/voice.json";
import giftGamesRaw from "@/data/gift-games.json";
import shippingRaw from "@/data/shipping.json";
import endingsRaw from "@/data/endings.json";
import achievementsRaw from "@/data/achievements.json";
import treasureHuntRaw from "@/data/treasure-hunt.json";
import letterFragmentsRaw from "@/data/letter-fragments.json";
import giftRevealRaw from "@/data/gift-reveal.json";
import backgroundMusicRaw from "@/data/background-music.json";
import type {
  MissionSiteConfig,
  ChapterConfig,
  LetterConfig,
  MemoryItem,
  SongItem,
  VoiceMessageConfig,
  GiftGamesConfig,
  ShippingStep,
  EndingsConfig,
  AchievementConfig,
  LetterFragmentsConfig,
  GiftRevealConfig,
  BackgroundMusicConfig,
} from "@/types";

/**
 * Everything below is intentionally a thin typed pass-through of the JSON
 * files in `src/data`. This is "the database" for the project — no server,
 * no ORM. The admin panel layers overrides on top of these defaults inside
 * localStorage (see `src/store/mission-store.ts`), so editing here always
 * changes the shipped defaults for every visitor.
 */

export const missionConfig = missionConfigRaw as MissionSiteConfig;
export const chapters = (chaptersRaw as ChapterConfig[]).sort((a, b) => a.order - b.order);
export const letter = letterRaw as LetterConfig;
export const memories = memoriesRaw as MemoryItem[];
export const songs = songsRaw as SongItem[];
export const voiceMessage = voiceRaw as VoiceMessageConfig;
export const giftGames = giftGamesRaw as GiftGamesConfig;
export const shippingSteps = shippingRaw as ShippingStep[];
export const endingsConfig = endingsRaw as EndingsConfig;
export const achievements = achievementsRaw as AchievementConfig[];
export const treasureHunt = treasureHuntRaw as {
  intro: string;
  clue: string;
  starsRequired: number;
  revealTitle: string;
  revealMessage: string;
};
export const letterFragmentsConfig = letterFragmentsRaw as LetterFragmentsConfig;
export const giftReveal = giftRevealRaw as GiftRevealConfig;
export const backgroundMusic = backgroundMusicRaw as BackgroundMusicConfig;

export function getChapter(id: string) {
  return chapters.find((c) => c.id === id);
}

export function nextChapter(id: string) {
  const current = getChapter(id);
  if (!current) return undefined;
  return chapters.find((c) => c.order === current.order + 1);
}
