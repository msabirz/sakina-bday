export const MYSTERY_PHRASES = [
  "Interesting...",
  "Maybe...",
  "Not quite...",
  "A theory. Nothing more.",
  "I'll neither confirm nor deny that.",
  "You'll have to wait and see.",
  "Bold guess. No comment.",
  "Getting warmer. Or am I lying?",
  "The mission continues either way.",
  "Nice try, Agent.",
];

export function randomMysteryPhrase(): string {
  return MYSTERY_PHRASES[Math.floor(Math.random() * MYSTERY_PHRASES.length)];
}
