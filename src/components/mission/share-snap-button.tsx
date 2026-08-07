"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, Share2 } from "lucide-react";
import { generateSnapCard } from "@/lib/share-snap";
import { useMissionStore, xpToLevel } from "@/store/mission-store";
import { missionConfig, chapters, memories } from "@/lib/config";
import { toast } from "sonner";

/**
 * Generates a portrait "moment" card (Canvas 2D, client-side, no
 * dependency) with her name, progress, and a memory photo, then offers the
 * native share sheet (WhatsApp/Instagram/etc, where supported) or a
 * plain download fallback everywhere else.
 */
export function ShareSnapButton() {
  const [open, setOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);

  const xp = useMissionStore((s) => s.xp);
  const completedChapterIds = useMissionStore((s) => s.completedChapterIds);

  async function handleOpen() {
    setOpen(true);
    setGenerating(true);
    try {
      const heroPhoto = memories.find((m) => m.image)?.image;
      const generated = await generateSnapCard({
        recipientName: missionConfig.recipientName,
        missionsComplete: completedChapterIds.length,
        missionsTotal: chapters.length,
        level: xpToLevel(xp),
        photoSrc: heroPhoto,
        dateLabel: new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }),
      });
      setBlob(generated);
      setImgUrl(URL.createObjectURL(generated));
    } catch {
      toast("Couldn't create the card — try again?");
      setOpen(false);
    } finally {
      setGenerating(false);
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next && imgUrl) {
      URL.revokeObjectURL(imgUrl);
      setImgUrl(null);
      setBlob(null);
    }
  }

  async function handleShare() {
    if (!blob) return;
    const file = new File([blob], "find-your-gift-moment.png", { type: "image/png" });
    const nav = navigator as Navigator & {
      canShare?: (data?: { files?: File[] }) => boolean;
      share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
    };

    if (nav.canShare?.({ files: [file] }) && nav.share) {
      try {
        await nav.share({ files: [file], title: missionConfig.siteTitle, text: "A moment from my mission." });
      } catch {
        // she cancelled the share sheet — nothing to do
      }
    } else {
      handleDownload();
      toast("Sharing isn't available here — downloaded instead. Share it to Instagram or WhatsApp manually.");
    }
  }

  function handleDownload() {
    if (!imgUrl) return;
    const a = document.createElement("a");
    a.href = imgUrl;
    a.download = "find-your-gift-moment.png";
    a.click();
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpen}
        className="rounded-full border-gold/30 bg-gold/5 text-gold hover:bg-gold/10"
      >
        <Sparkles className="mr-1.5 size-4" />
        Create a Shareable Moment
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="border-foreground/10 bg-panel text-foreground sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Your Moment</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Ready to share on Instagram or WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-hidden rounded-2xl border border-foreground/10">
            {generating || !imgUrl ? (
              <div className="flex aspect-9/16 items-center justify-center text-sm text-text-secondary">
                Creating your card…
              </div>
            ) : (
              <img src={imgUrl} alt="Shareable moment" className="w-full" />
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleShare}
              disabled={!imgUrl}
              className="flex-1 rounded-full bg-gold text-gold-contrast hover:bg-gold-soft"
            >
              <Share2 className="mr-1.5 size-4" /> Share
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!imgUrl}
              variant="outline"
              className="flex-1 rounded-full border-foreground/15"
            >
              <Download className="mr-1.5 size-4" /> Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
