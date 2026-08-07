import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { isValidAdminPassword } from "@/lib/admin-auth";

const CATEGORIES = new Set(["photos", "audio", "video"]);

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-120);
}

/**
 * Accepts a multipart upload and writes it into `public/uploads/<category>/`.
 * Same self-hosting caveat as the content route: needs a writable
 * filesystem, so it works with `next dev` / `next start` on your own
 * machine or server, not on read-only serverless platforms.
 */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const password = form.get("password");
  const category = form.get("category");
  const file = form.get("file");

  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  if (typeof category !== "string" || !CATEGORIES.has(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const safeName = `${Date.now()}-${sanitizeFilename(file.name)}`;
  const dir = path.join(process.cwd(), "public", "uploads", category);
  const filePath = path.join(dir, safeName);

  try {
    await fs.mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    return NextResponse.json({ ok: true, url: `/uploads/${category}/${safeName}` });
  } catch {
    return NextResponse.json(
      { error: "Could not write to disk. This works when self-hosting, not on read-only deployments." },
      { status: 500 }
    );
  }
}

/** Lists every file already sitting in public/uploads/<category>/, newest first. */
export async function GET(request: Request) {
  const password = new URL(request.url).searchParams.get("password");
  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const files: Record<string, string[]> = {};
  for (const category of CATEGORIES) {
    const dir = path.join(process.cwd(), "public", "uploads", category);
    try {
      const entries = await fs.readdir(dir);
      files[category] = entries
        .filter((name) => name !== ".gitkeep")
        .sort()
        .reverse();
    } catch {
      files[category] = [];
    }
  }

  return NextResponse.json({ ok: true, files });
}
