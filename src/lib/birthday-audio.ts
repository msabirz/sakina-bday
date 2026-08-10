/**
 * Tiny synthesized sound effects for the birthday opener — no audio files,
 * no network, no licensing questions. Everything here is generated at
 * runtime with the Web Audio API: a music-box rendition of the (public
 * domain) "Happy Birthday" melody, a burst of applause, and a soft blow/whoosh
 * for the candles. Browsers require a user gesture before audio can play,
 * which fits naturally here since everything fires from a tap.
 */

let sharedContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedContext) sharedContext = new Ctor();
  if (sharedContext.state === "suspended") sharedContext.resume().catch(() => {});
  return sharedContext;
}

/**
 * Call synchronously from the earliest real tap anywhere on the page (not
 * necessarily the one that plays a sound) — browsers only let a suspended
 * AudioContext actually resume from inside a trusted gesture, but once it's
 * running, every *later* scheduled sound plays fine even if the code that
 * schedules it fires from a timer instead of a click. See audio-unlock.ts.
 */
export function primeAudioContext() {
  getContext();
}

/** Whether the shared context actually made it to "running" — i.e. whether
 * anything played so far had a real chance to be heard. */
export function isAudioUnlocked(): boolean {
  return sharedContext?.state === "running";
}

const NOTE_FREQ: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  C5: 523.25,
};

interface MelodyNote {
  note: keyof typeof NOTE_FREQ;
  duration: number; // seconds
}

// "Happy Birthday to You" — melody only, public domain. Rhythm simplified
// to a gentle, even music-box feel rather than an exact score.
const MELODY: MelodyNote[] = [
  { note: "C4", duration: 0.28 },
  { note: "C4", duration: 0.28 },
  { note: "D4", duration: 0.34 },
  { note: "C4", duration: 0.34 },
  { note: "F4", duration: 0.5 },
  { note: "E4", duration: 0.85 },

  { note: "C4", duration: 0.28 },
  { note: "C4", duration: 0.28 },
  { note: "D4", duration: 0.34 },
  { note: "C4", duration: 0.34 },
  { note: "G4", duration: 0.5 },
  { note: "F4", duration: 0.85 },

  { note: "C4", duration: 0.28 },
  { note: "C4", duration: 0.28 },
  { note: "C5", duration: 0.34 },
  { note: "A4", duration: 0.34 },
  { note: "F4", duration: 0.34 },
  { note: "E4", duration: 0.34 },
  { note: "D4", duration: 0.85 },

  { note: "Bb4", duration: 0.28 },
  { note: "Bb4", duration: 0.28 },
  { note: "A4", duration: 0.34 },
  { note: "F4", duration: 0.34 },
  { note: "G4", duration: 0.5 },
  { note: "F4", duration: 1.1 },
];

export function playHappyBirthdayMelody(volume = 0.16) {
  const ctx = getContext();
  if (!ctx) return;

  let t = ctx.currentTime + 0.05;
  for (const { note, duration } of MELODY) {
    const freq = NOTE_FREQ[note];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;

    const attack = 0.02;
    const release = Math.min(0.18, duration * 0.4);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + attack);
    gain.gain.setValueAtTime(volume, t + duration - release);
    gain.gain.linearRampToValueAtTime(0, t + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);

    t += duration * 0.98; // tiny overlap for legato warmth
  }
}

/** A short burst of synthesized applause — layered filtered noise claps. */
export function playApplause(duration = 1.3, volume = 0.22) {
  const ctx = getContext();
  if (!ctx) return;

  const clapCount = 22;
  for (let i = 0; i < clapCount; i++) {
    const start = ctx.currentTime + Math.random() * duration;
    const bufferSize = Math.floor(ctx.sampleRate * 0.04);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let n = 0; n < bufferSize; n++) {
      data[n] = (Math.random() * 2 - 1) * (1 - n / bufferSize);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1500 + Math.random() * 1500;

    const gain = ctx.createGain();
    gain.gain.value = volume * (0.6 + Math.random() * 0.5);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(start);
  }
}

/** A soft breathy whoosh, timed with candles being blown out. */
export function playBlowWhoosh(duration = 0.6, volume = 0.14) {
  const ctx = getContext();
  if (!ctx) return;

  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let n = 0; n < bufferSize; n++) {
    data[n] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2200, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.08);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}
