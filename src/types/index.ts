/**
 * Shared type definitions for Operation: Find Your Gift.
 * The whole experience is config/data driven — these types describe the
 * shape of everything that lives in `src/data/*.json`.
 */

export type ChapterType =
  | "letter"
  | "vault"
  | "songs"
  | "voice"
  | "guess"
  | "hunt"
  | "jigsaw"
  | "datepicker"
  | "courier"
  | "final";

export interface ChapterConfig {
  id: string;
  order: number;
  missionLabel: string; // "Mission 1"
  title: string; // "Today's Letter"
  subtitle: string;
  type: ChapterType;
  icon: string; // lucide icon name
  unlockAt: string; // ISO datetime
  xpReward: number;
  estMinutes: number;
}

export interface LetterConfig {
  heading: string;
  signature: string;
  lines: string[];
}

export interface MemoryItem {
  id: string;
  date: string;
  title: string;
  description: string;
  gradient: [string, string];
  emoji: string;
  /** Optional real photo (e.g. an Admin-uploaded path like /uploads/photos/xxx.jpg).
   *  Falls back to the emoji + gradient card when omitted. */
  image?: string;
}

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  spotifyEmbedUrl: string;
  message: string;
  gradient: [string, string];
}

export interface VoiceMessageConfig {
  title: string;
  duration: string;
  src: string;
  transcriptTeaser: string;
  message: string;
}

export interface WordScrambleGame {
  scrambled: string;
  answer: string;
  hint: string;
}

export interface TwentyQuestionsItem {
  id: string;
  question: string;
  answer: "yes" | "no";
}

export interface HigherLowerConfig {
  actualPrice: number;
  currency: string;
  steps: number[];
}

export interface BlurRevealConfig {
  image: string;
  caption: string;
}

export interface EmojiPuzzleConfig {
  emojis: string[];
  answer: string;
  hint: string;
}

export interface MultipleChoiceOption {
  id: string;
  label: string;
  correct: boolean;
}

export interface MultipleChoiceConfig {
  prompt: string;
  options: MultipleChoiceOption[];
}

export interface ImageJigsawConfig {
  /** An Admin-uploaded photo path. Empty until she's been given one to solve. */
  image: string;
  gridSize: number;
  caption: string;
}

export interface DatePickerRound {
  id: string;
  prompt: string;
  options: string[];
}

export interface DatePickerConfig {
  rounds: DatePickerRound[];
}

export interface GiftGamesConfig {
  wordScramble: WordScrambleGame;
  twentyQuestions: TwentyQuestionsItem[];
  higherLower: HigherLowerConfig;
  blurReveal: BlurRevealConfig;
  emojiPuzzle: EmojiPuzzleConfig;
  multipleChoice: MultipleChoiceConfig;
  imageJigsaw: ImageJigsawConfig;
  datePicker: DatePickerConfig;
}

export interface ShippingStep {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export type EndingMode = "delivered" | "delayed" | "surprise";

export interface DeliveredEndingConfig {
  giftName: string;
  giftDescription: string;
  giftImage: string;
  celebrationMessage: string;
}

export interface DelayedEndingConfig {
  courierMessageLines: string[];
  eta: string;
}

export interface SurpriseEndingConfig {
  title: string;
  subtitle: string;
  dateTime: string;
  location: string;
  description: string;
  dressCode?: string;
}

export interface EndingsConfig {
  mode: EndingMode;
  currentShippingStepIndex: number;
  delivered: DeliveredEndingConfig;
  delayed: DelayedEndingConfig;
  surprise: SurpriseEndingConfig;
}

export interface AchievementConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  hidden: boolean;
}

export interface LetterFragment {
  id: string;
  /** "begin" | "chapter:<chapterId>" | "game:<gameId>" — what unlocks this fragment. */
  source: string;
  char: string;
}

export interface LetterFragmentsConfig {
  targetPhrase: string;
  fragments: LetterFragment[];
}

export interface GiftRevealConfig {
  revealHeading: string;
  revealMessage: string;
  image: string;
}

export interface BackgroundMusicConfig {
  enabled: boolean;
  label: string;
  spotifyEmbedUrl: string;
  /**
   * A self-hosted audio file (e.g. an Admin-uploaded path like
   * /uploads/audio/our-song.mp3). When set, this is preferred over the
   * Spotify embed — Spotify's iframe can never truly autoplay (cross-origin
   * autoplay restriction, no way around it), but a same-origin file can
   * start the instant she makes her first tap in the birthday opener.
   */
  audioSrc?: string;
}

export interface MissionSiteConfig {
  recipientName: string;
  senderName: string;
  occasion: string;
  birthdayDateTime: string;
  siteTitle: string;
  adminPasswordHash: string;
}
