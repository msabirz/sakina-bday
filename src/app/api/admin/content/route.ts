import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { isValidAdminPassword } from "@/lib/admin-auth";

/**
 * Writes an edited JSON config back to `src/data/*.json`. This only makes
 * sense when self-hosting (the Next.js server process needs write access to
 * the project files) — on read-only-filesystem platforms like Vercel this
 * will fail, which is expected. In `next dev` your edits hot-reload
 * instantly; in `next start` you'll need to rebuild for them to ship.
 */
const CONTENT_FILES: Record<string, string> = {
  chapters: "chapters.json",
  letter: "letter.json",
  memories: "memories.json",
  songs: "songs.json",
  voice: "voice.json",
  "gift-games": "gift-games.json",
  shipping: "shipping.json",
  endings: "endings.json",
  achievements: "achievements.json",
  "treasure-hunt": "treasure-hunt.json",
  mission: "mission.config.json",
  "letter-fragments": "letter-fragments.json",
  "gift-reveal": "gift-reveal.json",
  "background-music": "background-music.json",
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const { password, file, data } = body as { password?: string; file?: string; data?: unknown };

  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const filename = file ? CONTENT_FILES[file] : undefined;
  if (!filename) {
    return NextResponse.json({ error: "Unknown config file" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "src", "data", filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not write to disk. This works when self-hosting, not on read-only deployments." },
      { status: 500 }
    );
  }
}
