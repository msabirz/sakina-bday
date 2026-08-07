"use client";

import { useCallback, useRef, useState } from "react";

interface LongPressOptions {
  onLongPress: () => void;
  onProgress?: (percent: number) => void;
  ms?: number;
}

/**
 * Returns handlers to spread onto an element for a long-press interaction,
 * plus a live `progress` (0-1) while the press is held.
 */
export function useLongPress({ onLongPress, onProgress, ms = 900 }: LongPressOptions) {
  const [pressing, setPressing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef(0);

  const clear = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    timeoutRef.current = null;
    frameRef.current = null;
    setPressing(false);
    onProgress?.(0);
  }, [onProgress]);

  const start = useCallback(() => {
    setPressing(true);
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      onProgress?.(Math.min(elapsed / ms, 1));
      if (elapsed < ms) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);

    timeoutRef.current = setTimeout(() => {
      onLongPress();
      clear();
    }, ms);
  }, [ms, onLongPress, onProgress, clear]);

  return {
    pressing,
    handlers: {
      onMouseDown: start,
      onMouseUp: clear,
      onMouseLeave: clear,
      onTouchStart: start,
      onTouchEnd: clear,
      onTouchCancel: clear,
    },
  };
}
