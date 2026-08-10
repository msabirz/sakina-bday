/**
 * A single, module-level (outside React) <audio> instance for the
 * background song. Living outside the component tree means it survives
 * every navigation — intro → Mission Control → chapters — without
 * remounting or restarting.
 *
 * Why not just a ref in a component: browsers only allow unmuted audio to
 * start from a *direct* user gesture. If we set React state on tap and let
 * an effect call `.play()` later, that's one microtask removed from the
 * gesture and some browsers (Safari especially) will silently block it.
 * Calling `playAmbient()` synchronously inside the tap handler itself keeps
 * it unambiguously gesture-initiated.
 */

let audioEl: HTMLAudioElement | null = null;
const listeners = new Set<(playing: boolean) => void>();

// A single silent frame — just enough for a real <audio> element to receive
// a genuine, gesture-backed play() call before we know the real song yet.
const SILENT_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";

function notify(playing: boolean) {
  listeners.forEach((fn) => fn(playing));
}

function ensureAudio(src: string): HTMLAudioElement {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.loop = true;
    audioEl.volume = 0.32;
    audioEl.addEventListener("play", () => notify(true));
    audioEl.addEventListener("pause", () => notify(false));
  }
  if (audioEl.getAttribute("data-src") !== src) {
    audioEl.src = src;
    audioEl.setAttribute("data-src", src);
  }
  return audioEl;
}

/**
 * Warms up the shared <audio> element with a silent, gesture-backed play().
 * A media element that has once played from a real tap keeps that
 * permission for the rest of its life — so a *later* playAmbient(realSrc)
 * call, even one that isn't itself inside a click handler, is allowed to
 * proceed. Call this synchronously from the earliest tap anywhere on the
 * page (see audio-unlock.ts), not just the one meant to start the song.
 */
export function primeAmbientAudio() {
  if (typeof window === "undefined") return;
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.loop = true;
    audioEl.volume = 0.32;
    audioEl.addEventListener("play", () => notify(true));
    audioEl.addEventListener("pause", () => notify(false));
  }
  if (audioEl.getAttribute("data-src")) return; // a real song is already queued — don't clobber it
  audioEl.src = SILENT_WAV;
  audioEl
    .play()
    .then(() => audioEl?.pause())
    .catch(() => {});
}

/** Call synchronously from within a click/tap handler. */
export function playAmbient(src: string) {
  if (typeof window === "undefined" || !src) return;
  const el = ensureAudio(src);
  el.play().catch(() => {
    // Autoplay was blocked anyway — she can still start it manually from
    // the background-music widget's play button.
  });
}

export function pauseAmbient() {
  audioEl?.pause();
}

export function toggleAmbient(src: string) {
  if (!audioEl) {
    playAmbient(src);
    return;
  }
  if (audioEl.paused) audioEl.play().catch(() => {});
  else audioEl.pause();
}

export function isAmbientPlaying(): boolean {
  return !!audioEl && !audioEl.paused;
}

export function subscribeAmbient(fn: (playing: boolean) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
