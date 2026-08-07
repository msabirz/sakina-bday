"use client";

import { useEffect, useRef } from "react";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Fires `onUnlock` once the classic Konami code is typed anywhere on the page. */
export function useKonamiCode(onUnlock: () => void) {
  const progress = useRef(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const expected = KONAMI_SEQUENCE[progress.current];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === expected) {
        progress.current += 1;
        if (progress.current === KONAMI_SEQUENCE.length) {
          progress.current = 0;
          onUnlock();
        }
      } else {
        progress.current = key === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onUnlock]);
}
