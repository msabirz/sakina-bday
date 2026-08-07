import confetti from "canvas-confetti";

const THEME_COLORS = ["#D4AF37", "#E9CE7A", "#E7A7B7", "#FFFFFF"];

export function fireConfetti() {
  const duration = 1600;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.7 },
      colors: THEME_COLORS,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.7 },
      colors: THEME_COLORS,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function fireCelebration() {
  confetti({
    particleCount: 140,
    spread: 100,
    origin: { y: 0.55 },
    colors: THEME_COLORS,
    startVelocity: 45,
    ticks: 220,
    disableForReducedMotion: true,
  });
}

/**
 * A bigger, cracker-like multi-burst for the very first moment of the site
 * — two side bursts plus a center shower, timed like party poppers rather
 * than one flat explosion.
 */
export function fireBirthdayBurst() {
  const shoot = (originX: number, angle: number) =>
    confetti({
      particleCount: 70,
      angle,
      spread: 70,
      origin: { x: originX, y: 0.6 },
      colors: THEME_COLORS,
      startVelocity: 55,
      gravity: 0.9,
      ticks: 260,
      scalar: 1.05,
      disableForReducedMotion: true,
    });

  shoot(0.08, 55);
  shoot(0.92, 125);

  setTimeout(() => {
    confetti({
      particleCount: 90,
      spread: 130,
      origin: { y: 0.4 },
      colors: THEME_COLORS,
      startVelocity: 40,
      gravity: 0.85,
      ticks: 300,
      disableForReducedMotion: true,
    });
  }, 220);
}
