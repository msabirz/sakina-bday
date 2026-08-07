"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme-script";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "dark", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The boot script (see theme-script.ts) already set the class before
  // hydration; this just syncs React state to match what's on the DOM.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // `document` doesn't exist during SSR, so this can't be a lazy useState
    // initializer — it has to run post-mount, reading the class the boot
    // script already applied before hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // localStorage unavailable (private browsing, etc.) — theme just won't persist.
      }
      return next;
    });
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
