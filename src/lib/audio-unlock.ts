import { primeAudioContext } from "@/lib/birthday-audio";
import { primeAmbientAudio } from "@/lib/ambient-audio";

let installed = false;

/**
 * Widens what counts as "the gesture that unlocks audio" from just the one
 * specific tap that happens to call playX() to the very first touch
 * anywhere on the page. The birthday opener's cake ritual can also advance
 * itself on a timer if she never taps — and any sound scheduled from that
 * timer is silently blocked by the browser, since it isn't a trusted
 * gesture. If she touches the screen for *any* reason before that timer
 * fires, this catches it and primes both audio systems early, so the
 * later (timer-triggered or not) playback actually has a chance to work.
 *
 * Safe to call multiple times — only the first call installs anything.
 */
export function installAudioUnlock() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  function unlock() {
    primeAudioContext();
    primeAmbientAudio();
    window.removeEventListener("pointerdown", unlock, true);
    window.removeEventListener("keydown", unlock, true);
  }

  window.addEventListener("pointerdown", unlock, { capture: true, once: true });
  window.addEventListener("keydown", unlock, { capture: true, once: true });
}
