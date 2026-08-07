"use client";

import { useEffect, useState } from "react";

interface Options {
  charDelay?: number;
  lineDelay?: number;
  startDelay?: number;
}

/**
 * Reveals an array of lines one character at a time, then moves to the
 * next line. Returns the lines revealed so far (fully) plus the current
 * line's partial text, and whether the whole sequence is done.
 */
export function useTypewriterLines(lines: string[], { charDelay = 28, lineDelay = 550, startDelay = 300 }: Options = {}) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (lineIndex >= lines.length) return;

    const currentLine = lines[lineIndex];
    if (charIndex < currentLine.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), charDelay);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, lineDelay);
    return () => clearTimeout(t);
  }, [started, charIndex, lineIndex, lines, charDelay, lineDelay]);

  const completedLines = lines.slice(0, lineIndex);
  const currentPartial = lineIndex < lines.length ? lines[lineIndex].slice(0, charIndex) : "";
  const isDone = lineIndex >= lines.length;

  return { completedLines, currentPartial, isDone, started };
}
