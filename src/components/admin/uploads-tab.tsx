"use client";

import { useCallback, useEffect, useState } from "react";
import { UploadCloud, Copy, Check, ImageIcon, Music, Video as VideoIcon } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Category = "photos" | "audio" | "video";

const CATEGORY_META: Record<Category, { label: string; icon: typeof ImageIcon }> = {
  photos: { label: "Photos", icon: ImageIcon },
  audio: { label: "Audio", icon: Music },
  video: { label: "Video", icon: VideoIcon },
};

export function UploadsTab({ password }: { password: string }) {
  const [category, setCategory] = useState<Category>("photos");
  const [uploading, setUploading] = useState(false);
  const [library, setLibrary] = useState<Record<Category, string[]>>({ photos: [], audio: [], video: [] });
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/upload?password=${encodeURIComponent(password)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not load uploads");
      setLibrary(json.files);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not load uploads.");
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    // Standard fetch-on-mount: loads the server's actual upload library
    // (not just this session's uploads) the moment the tab opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLibrary();
  }, [fetchLibrary]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("password", password);
    form.append("category", category);
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      toast("Uploaded successfully.");
      await fetchLibrary();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 1500);
  }

  return (
    <div className="space-y-6">
      <GlassPanel strong className="space-y-4 p-6">
        <p className="font-display text-lg text-foreground">Upload Media</p>
        <p className="text-xs text-text-secondary">
          Files are written to <code>public/uploads/&lt;category&gt;/</code>. Copy a path into the relevant field
          in the Content tab (e.g. a memory&apos;s <code>image</code>, or the voice message&apos;s{" "}
          <code>src</code>). Requires a self-hosted, writable filesystem.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={category} onValueChange={(v) => v && setCategory(v as Category)}>
            <SelectTrigger className="w-40 border-foreground/15 bg-foreground/5 text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="photos">Photos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>

          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-foreground/15 bg-foreground/5 px-4 py-2 text-sm text-foreground transition-colors hover:border-gold/40">
            <UploadCloud className="size-4" />
            {uploading ? "Uploading…" : "Choose file"}
            <input type="file" onChange={handleFile} disabled={uploading} className="hidden" />
          </label>
        </div>
      </GlassPanel>

      {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
        const { label, icon: Icon } = CATEGORY_META[cat];
        const items = library[cat] ?? [];
        return (
          <GlassPanel key={cat} strong className="space-y-3 p-6">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg text-foreground">{label}</p>
              <span className="text-xs text-text-secondary">
                {loading ? "Loading…" : `${items.length} file${items.length === 1 ? "" : "s"}`}
              </span>
            </div>

            {!loading && items.length === 0 && (
              <p className="text-xs text-text-secondary">Nothing uploaded here yet.</p>
            )}

            <div className="space-y-2">
              {items.map((filename) => {
                const url = `/uploads/${cat}/${filename}`;
                return (
                  <div
                    key={filename}
                    className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-background/30 px-3 py-2.5"
                  >
                    {cat === "photos" ? (
                      <img src={url} alt={filename} className="size-10 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                        <Icon className="size-4" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs text-text-secondary">{filename}</p>
                      {cat === "audio" && <audio controls src={url} className="mt-1 h-8 w-full max-w-xs" />}
                      {cat === "video" && (
                        <a href={url} target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-wide text-gold hover:underline">
                          Open in new tab
                        </a>
                      )}
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => copy(url)}
                      className="shrink-0 text-text-secondary hover:text-gold"
                    >
                      {copiedUrl === url ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    </Button>
                  </div>
                );
              })}
            </div>
          </GlassPanel>
        );
      })}
    </div>
  );
}
