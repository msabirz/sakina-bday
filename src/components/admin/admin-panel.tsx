"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut } from "lucide-react";
import { LoginGate } from "@/components/admin/login-gate";
import { LiveControlsTab } from "@/components/admin/live-controls-tab";
import { UploadsTab } from "@/components/admin/uploads-tab";
import { ContentEditorTab } from "@/components/admin/content-editor-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useMissionStore } from "@/store/mission-store";
import { fadeUp } from "@/lib/motion";

export function AdminPanel() {
  const adminAuthed = useMissionStore((s) => s.adminAuthed);
  const setAdminAuthed = useMissionStore((s) => s.setAdminAuthed);
  const [password, setPassword] = useState<string | null>(null);

  if (!adminAuthed || !password) {
    return (
      <LoginGate
        onAuthed={(pw) => {
          setPassword(pw);
          setAdminAuthed(true);
        }}
      />
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="mx-auto max-w-3xl px-6 py-14 sm:px-8">
      <div className="mb-10 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-secondary hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          Mission Control
        </Link>
        <button
          onClick={() => {
            setAdminAuthed(false);
            setPassword(null);
          }}
          className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-text-secondary hover:text-rose"
        >
          <LogOut className="size-3.5" />
          Log out
        </button>
      </div>

      <div className="mb-10 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Command Center</p>
          <h1 className="font-display text-4xl text-foreground">Admin</h1>
        </div>
        <ThemeToggle />
      </div>

      <Tabs defaultValue="live">
        <TabsList className="mb-8 bg-foreground/5">
          <TabsTrigger value="live">Live Controls</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        <TabsContent value="live">
          <LiveControlsTab />
        </TabsContent>
        <TabsContent value="uploads">
          <UploadsTab password={password} />
        </TabsContent>
        <TabsContent value="content">
          <ContentEditorTab password={password} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
