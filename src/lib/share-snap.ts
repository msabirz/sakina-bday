/**
 * Renders a shareable "moment" card entirely client-side with the Canvas
 * 2D API — an Instagram-Story-shaped (1080x1920) portrait image, no server
 * round-trip, no extra dependency. Reused fonts already loaded on the page
 * (via a computed-style trick) so it matches the site's actual type rather
 * than a generic system font.
 */

const WIDTH = 1080;
const HEIGHT = 1920;

interface SnapCardOptions {
  recipientName: string;
  missionsComplete: number;
  missionsTotal: number;
  level: number;
  photoSrc?: string;
  dateLabel: string;
}

function resolveDisplayFont(): string {
  if (typeof document === "undefined") return "italic 1em Georgia, serif";
  const probe = document.createElement("span");
  probe.className = "font-display";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily;
  document.body.removeChild(probe);
  return family || "Georgia, serif";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function heartPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.beginPath();
  const s = size / 20;
  ctx.moveTo(cx, cy + 6 * s);
  ctx.bezierCurveTo(cx - 12 * s, cy - 8 * s, cx - 4 * s, cy - 14 * s, cx, cy - 6 * s);
  ctx.bezierCurveTo(cx + 4 * s, cy - 14 * s, cx + 12 * s, cy - 8 * s, cx, cy + 6 * s);
  ctx.closePath();
}

export async function generateSnapCard(opts: SnapCardOptions): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  if (document.fonts?.ready) {
    await document.fonts.ready.catch(() => {});
  }
  const displayFont = resolveDisplayFont();

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bgGrad.addColorStop(0, "#111111");
  bgGrad.addColorStop(1, "#050505");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Optional hero photo, dimmed, upper 60% of the card
  if (opts.photoSrc) {
    try {
      const img = await loadImage(opts.photoSrc);
      ctx.save();
      ctx.globalAlpha = 0.55;
      drawCover(ctx, img, 0, 0, WIDTH, HEIGHT * 0.62);
      ctx.restore();

      const scrim = ctx.createLinearGradient(0, 0, 0, HEIGHT * 0.62);
      scrim.addColorStop(0, "rgba(9,9,9,0.15)");
      scrim.addColorStop(0.75, "rgba(9,9,9,0.85)");
      scrim.addColorStop(1, "rgba(9,9,9,1)");
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, WIDTH, HEIGHT * 0.62);
    } catch {
      // no photo available/loadable — plain gradient background is fine
    }
  }

  // Gold radial glow
  const glow = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.72, 40, WIDTH / 2, HEIGHT * 0.72, 520);
  glow.addColorStop(0, "rgba(212,175,55,0.16)");
  glow.addColorStop(1, "rgba(212,175,55,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Frame
  ctx.strokeStyle = "rgba(212,175,55,0.5)";
  ctx.lineWidth = 3;
  ctx.strokeRect(56, 56, WIDTH - 112, HEIGHT - 112);

  ctx.textAlign = "center";

  // Kicker
  ctx.fillStyle = "#D4AF37";
  ctx.font = "600 30px Inter, system-ui, sans-serif";
  ctx.fillText("O P E R A T I O N :   F I N D   Y O U R   G I F T", WIDTH / 2, HEIGHT * 0.68);

  // Title
  const titleGrad = ctx.createLinearGradient(WIDTH * 0.2, 0, WIDTH * 0.8, 0);
  titleGrad.addColorStop(0, "#F4E2A0");
  titleGrad.addColorStop(0.5, "#D4AF37");
  titleGrad.addColorStop(1, "#B8892C");
  ctx.fillStyle = titleGrad;
  ctx.font = `italic 500 92px ${displayFont}`;
  ctx.fillText("Happy Birthday,", WIDTH / 2, HEIGHT * 0.76);
  ctx.font = `italic 600 108px ${displayFont}`;
  ctx.fillText(opts.recipientName, WIDTH / 2, HEIGHT * 0.815);

  // Stats
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "500 34px Inter, system-ui, sans-serif";
  ctx.fillText(
    `${opts.missionsComplete}/${opts.missionsTotal} Missions Complete  ·  Level ${opts.level}`,
    WIDTH / 2,
    HEIGHT * 0.865
  );

  // Heart
  ctx.fillStyle = "#E7A7B7";
  heartPath(ctx, WIDTH / 2, HEIGHT * 0.9, 46);
  ctx.fill();

  // Footer date
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "400 26px Inter, system-ui, sans-serif";
  ctx.fillText(opts.dateLabel, WIDTH / 2, HEIGHT * 0.94);

  // toDataURL is synchronous (unlike toBlob's callback, which has been
  // observed to simply never fire in some browser/GPU configurations) —
  // converting the data URL to a Blob via fetch() is the reliable path.
  const dataUrl = canvas.toDataURL("image/png", 0.95);
  const response = await fetch(dataUrl);
  return response.blob();
}
