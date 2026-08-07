"use client";

import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/components/providers/theme-provider";

export function AppToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} position="top-center" />;
}
