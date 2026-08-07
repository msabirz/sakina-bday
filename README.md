# Operation: Find Your Gift 💛

A private, interactive birthday microsite — built as a luxury digital product, not a greeting card. It frames a
delayed physical gift as the deliberate final act of a mission, not an apology: seven "missions" unlock through
the day, each a small chapter (a letter, a memory timeline, songs, a voice message, a hidden-signal hunt, six
guessing games, and a final delivery/reveal). Progress, XP, achievements, and unlock times are all config-driven
via JSON — no database.

Built with **Next.js 16** (App Router, Turbopack), **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**,
**Framer Motion**, **GSAP**, and **Zustand**.

---

## 1. Quick start

Requires **Node 20.9+** (Next.js 16's minimum). Node 24 is recommended and is what this project was built/tested
against.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The intro plays automatically; click **Begin Mission** to
enter Mission Control.

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

---

## 2. Personalize it (start here)

Everything content-related lives in `src/data/*.json`. Nothing needs a rebuild of the component code — edit the
JSON, save, and (in `npm run dev`) it hot-reloads instantly.

| File | What it controls |
|---|---|
| `mission.config.json` | Recipient/sender name, occasion, birthday date, site title, **admin password hash** |
| `chapters.json` | The 7 missions — titles, subtitles, unlock times (`unlockAt`, ISO datetime), XP rewards |
| `letter.json` | Mission 1's typewriter letter, line by line |
| `memories.json` | Mission 2's Memory Vault timeline entries |
| `songs.json` | Mission 3's tracks — Spotify embed URLs + a personal message per song |
| `voice.json` | Mission 4's voice message — audio `src` path, title, message |
| `treasure-hunt.json` | Mission 5's hidden-signal copy and how many signals are required |
| `gift-games.json` | Mission 6's six mini-games (word scramble, 20 questions, higher/lower, blur reveal, emoji puzzle, multiple choice) |
| `shipping.json` | The 5-step delivery timeline labels (Packed → With You) |
| `endings.json` | Mission 7 — the **dynamic ending** (see below) + delayed/delivered/surprise content |
| `achievements.json` | Visible + hidden secret achievements and their XP |
| `letter-fragments.json` | The **13-tile cipher** (see §3.5) — the phrase to spell + which mission/game awards which letter |
| `gift-reveal.json` | What's shown once that phrase is solved — heading, message, image |
| `background-music.json` | The Spotify track behind the persistent "Our Song" widget, and whether it's shown at all |

### Change the admin password

The default password is `mission-control`. To change it:

```bash
printf '%s' "your-new-password" | shasum -a 256
```

Paste the resulting hash into `adminPasswordHash` in `mission.config.json`.

### Real photos, audio, and video

Drop files into `public/` (or use the Admin panel's Uploads tab, see §5) and point the relevant JSON field at the
path — e.g. `voice.json`'s `src`, or add an `image` field to a memory and render it instead of the emoji
placeholder in `src/components/chapters/vault-chapter.tsx`. A silent placeholder WAV already sits at
`public/audio/voice-message.wav` so the voice message chapter works out of the box.

---

## 3. Dynamic Endings

Mission 7 ("Final Delivery") reads a single value — `mode` in `endings.json` — to decide how the story ends:

- **`"delivered"`** — the gift has arrived. The shipping timeline completes, and the chapter reveals
  `endings.json → delivered` (name, description, celebration message) with confetti.
- **`"delayed"`** *(default)* — the honest option. Shows the shipping timeline stuck at
  `currentShippingStepIndex`, then the courier message from `endings.json → delayed`. There's deliberately no
  "complete" button in this mode — **the mission finishes itself the moment you flip it to `delivered` (or
  `surprise`)**, which is the whole point: the delayed gift becomes the ending, not an inconvenience.
- **`"surprise"`** — instead of a physical gift, reveals a planned experience (dinner, a trip, a date) from
  `endings.json → surprise` (title, date/time, location, description, dress code).

This is what makes the site reusable for a birthday, anniversary, Valentine's Day, or any future occasion —
change one value (or use the Admin panel's Live Controls, which apply instantly without touching a file) and the
ending changes with it.

---

## 3.5 The cipher — collecting letters across every mission

Instead of the gift being guessed in one isolated mini-game, it's assembled from fragments earned throughout the
*entire* mission. `letter-fragments.json` defines a `targetPhrase` (ships as **"GOOGLE PIXEL 10"**) and 13
`fragments`, each tied to a `source`:

- `"begin"` — clicking **Begin Mission** on the intro
- `"chapter:<id>"` — completing one of the 5 story chapters (letter, vault, songs, voice, hunt)
- `"game:<id>"` — solving one of the 6 "Guess Your Gift" mini-games

That's 5 + 6 + 1 = 12, plus finishing Mission 6 itself (`chapter:guess`, only possible once all 6 games are done)
for the 13th — so the full set is *always* collected by the time Mission 7 unlocks; there's no dead end where a
tile is missing.

Two things keep it from being guessable early:

1. **Mission Control shows a "Signal Fragments" strip** that fills in live as she plays — but in a shuffled,
   per-playthrough-persisted slot order, so a partially-filled row never reads as a partial word.
2. **The letters don't have to be solved into anything until Mission 7.** There, `DecodePuzzle`
   (`src/components/chapters/decode-puzzle.tsx`) presents all 13 collected tiles and she arranges them — reusing
   the same tap-a-tile interaction as the Word Scramble mini-game (both are built on the shared
   `src/components/shared/tile-unscramble.tsx`). Solving it reveals `gift-reveal.json`'s heading/message/image
   *before* the shipping-status section beneath it — she learns **what** the gift is before **when** it arrives.

To retheme this for a different gift or occasion: change `targetPhrase` (keep it at 13 characters, or add/remove
fragment sources to match a different length — see the `source` list above), update the `fragments[].char` array
to spell it, and swap `gift-reveal.json`'s `image` for something else (drop a file in `public/images/` or use the
Admin panel's Uploads tab).

---

## 4. How unlocking works

Each mission unlocks when **both** are true:

1. **Time gate** — `now >= chapter.unlockAt` (or an admin override, see below)
2. **Sequence gate** — the previous mission has been completed

Locked cards show a live "Locked until HH:MM" countdown. This logic lives in
[`src/hooks/use-chapter-unlock.ts`](src/hooks/use-chapter-unlock.ts) and
[`src/hooks/use-next-unlock.ts`](src/hooks/use-next-unlock.ts) (the latter drives the big home-screen countdown to
the *next* mission).

All player progress (XP, completed missions, unlocked achievements, admin overrides) persists to
`localStorage` under the key `ofy-mission-state` via Zustand's `persist` middleware — see
[`src/store/mission-store.ts`](src/store/mission-store.ts).

---

## 5. Admin panel

Visit `/admin` (there's also a faint "Command Center Access" link in Mission Control's footer). Log in with the
password from §2.

**⚠️ This is convenience, not real security.** The password check is a client-side SHA-256 comparison — anyone
with devtools access to the deployed build can bypass it. Don't put anything truly sensitive behind it. It exists
to keep a curious recipient from stumbling into the admin view, not to withstand an attacker.

Three tabs:

- **Live Controls** — instant, this-browser-only overrides (stored in the same `localStorage` state as
  progress): force-unlock every mission for previewing, override any mission's unlock time, pick the ending mode,
  set the shipping step, toggle mission completion, set XP directly, or reset all progress.
- **Uploads** — uploads a file to `public/uploads/<photos|audio|video>/` via `POST /api/admin/upload` and gives
  you back a path to paste into the Content tab.
- **Content** — raw JSON editors for every file in §2, saved back to `src/data/*.json` on disk via
  `POST /api/admin/content`.

**Uploads and Content-tab saves need a writable filesystem.** They work with `npm run dev` and with
`npm run build && npm run start` on your own machine or a VPS. They will fail gracefully (with an error toast) on
read-only serverless platforms like Vercel — deploy there for the experience itself, and do content edits locally
before pushing. In `next dev`, saved content hot-reloads immediately; in a production build, redeploy to ship
edited content (Live Controls don't require this — they take effect immediately for anyone using that browser).

---

## 6. Secrets & easter eggs

- **Hidden stars** — a few near-invisible sparkles drift on screen at all times; click three across the site (or
  within Mission 5's dedicated hunt) to unlock a hidden achievement.
- **Konami code** — ↑ ↑ ↓ ↓ ← → ← → b a, anywhere.
- **Shake to unlock** — on a phone, physically shake the device (requires a tap-triggered motion permission
  prompt on iOS — see `src/hooks/use-shake.ts`).
- **Long-press** hook is available at `src/hooks/use-long-press.ts` for any component that wants a hold-to-reveal
  interaction.
- All of the above award XP and a toast via `src/components/effects/secret-features.tsx`.

---

## 6.5 Theme toggle & background music

- **Light/dark toggle** — a sun/moon button (Mission Control, every chapter header, and the admin panel) flips
  between a warm-ivory light theme and the original near-black dark theme. Preference persists to `localStorage`
  (`ofy-theme`, independent of the mission-progress store) and is applied by an inline boot script
  (`src/lib/theme-script.ts`, rendered first in `<body>`) before React hydrates, so there's no flash of the wrong
  theme. Defaults to dark — the brand's native mode — until she chooses otherwise. The intro and the closing
  "Forever." screen are deliberately hardcoded to black regardless of the toggle; they're cinematic beats, not
  page chrome.
- **Background music** — a small "🎵 Our Song" pill sits bottom-left throughout the whole experience (mounted
  once above the screen-switcher so it survives navigating between missions instead of restarting). Tap it to
  expand a compact Spotify embed. Swap the track from the Admin panel's Content tab (`background-music.json`) or
  set `"enabled": false` to hide it entirely. **Honest limitation:** neither browsers nor Spotify's embed allow
  silent autoplay — she has to tap play once, same as any embedded Spotify player anywhere on the web.

---

## 7. Project structure

```
src/
  app/                    # routes: / (the whole experience), /admin, API routes, robots.ts
  components/
    intro/                # first-screen fade sequence (always dark, regardless of theme)
    mission/               # Mission Control home, mission cards, fragment strip, chapter shell/router,
                            # gift illustration, background music widget
    chapters/               # one component per mission (letter, vault, songs, voice, hunt, guess, delivery)
                            # + decode-puzzle.tsx, the Mission 7 finale cipher
    games/                  # the 6 "Guess Your Gift" mini-games
    admin/                   # admin panel (login, live controls, uploads, content editor)
    effects/                  # fireflies, hidden stars, konami/shake listeners
    shared/                    # glass panel, progress ring, locked badge, section heading,
                                # tile-unscramble (shared by word scramble + the finale cipher), theme toggle
    providers/                  # hydration gate, theme provider + boot script, service worker registration
    ui/                          # shadcn/ui primitives
  data/                    # ← all content lives here, as JSON
  hooks/                   # countdown, chapter-unlock, typewriter, konami, shake, long-press
  lib/                     # config loader, motion presets, confetti, icon map, mystery phrases, admin auth
  store/                   # Zustand mission store (XP, progress, admin overrides), persisted to localStorage
  types/                   # shared TypeScript types for every JSON shape
```

---

## 8. Design system

- **Colors**: two full themes as CSS custom properties in `src/app/globals.css` — dark (background `#090909`,
  surface `#111111`, cards `#171717`, gold `#D4AF37`, rose `#E7A7B7`) and a warm-ivory light theme (background
  `#FAF7F2`, deepened gold `#A87A22` and rose `#BE6E86` for contrast on a light surface). Selected via a `.dark`
  class on `<html>`, toggled by `src/components/providers/theme-provider.tsx`. `--gold-contrast` is a fixed
  near-black used for text sitting *on* gold buttons/badges — it deliberately does not flip with the theme, since
  gold stays roughly the same brightness in both.
- **Type**: display font is Cormorant Garamond (`font-display`), body is Inter (`font-sans`), loaded via
  `next/font/google` in `src/app/layout.tsx`. Numerals are forced to lining figures (`font-variant-numeric`) —
  Cormorant Garamond's default oldstyle "0" reads almost identically to a lowercase "o" at display sizes, which
  matters a lot for a countdown timer.
- **Motion**: shared Framer Motion variants in `src/lib/motion.ts`; GSAP drives a few continuous, signature
  animations (the gift illustration's shimmer/glow, the delivery truck) that don't map naturally to
  variant-based transitions.

---

## 9. PWA & privacy

- Installable via `public/manifest.webmanifest` + icons in `public/icons/` (generated from
  `public/icons/icon.svg`).
- A minimal offline-shell service worker (`public/sw.js`) registers in production builds only.
- SEO is disabled: `robots: { index: false }` in metadata plus `src/app/robots.ts` disallowing all crawlers. This
  is a private link, not a public page — don't post it anywhere public.

---

## 10. Deploying

Any Node 20.9+ host works. On Vercel (or similar), the site, all 7 missions, games, and Live Controls work exactly
as they do locally — only the Admin panel's **Uploads** and **Content** tabs need a writable filesystem, so do
those edits locally and redeploy. If you want those tabs to work in production too, self-host (a small VPS,
Docker, `next start` behind a reverse proxy) instead of a serverless platform.

Happy birthday. 🎁
