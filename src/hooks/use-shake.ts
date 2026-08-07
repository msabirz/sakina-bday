"use client";

import { useEffect, useRef } from "react";

const SHAKE_THRESHOLD = 18;
const SHAKE_COOLDOWN_MS = 2500;

/** Fires `onShake` when the device is physically shaken (mobile only). */
export function useShake(onShake: () => void) {
  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);
  const lastZ = useRef<number | null>(null);
  const lastShakeAt = useRef(0);

  useEffect(() => {
    function handleMotion(e: DeviceMotionEvent) {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      if (lastX.current !== null && lastY.current !== null && lastZ.current !== null) {
        const delta =
          Math.abs(acc.x - lastX.current) +
          Math.abs(acc.y - lastY.current) +
          Math.abs(acc.z - lastZ.current);

        const now = Date.now();
        if (delta > SHAKE_THRESHOLD && now - lastShakeAt.current > SHAKE_COOLDOWN_MS) {
          lastShakeAt.current = now;
          onShake();
        }
      }
      lastX.current = acc.x;
      lastY.current = acc.y;
      lastZ.current = acc.z;
    }

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [onShake]);
}

/** iOS 13+ requires an explicit user gesture to grant motion permission. */
export async function requestMotionPermission(): Promise<boolean> {
  type MotionEventConstructorWithPermission = typeof DeviceMotionEvent & {
    requestPermission?: () => Promise<"granted" | "denied">;
  };
  const ctor = DeviceMotionEvent as unknown as MotionEventConstructorWithPermission;
  if (typeof ctor.requestPermission === "function") {
    try {
      const result = await ctor.requestPermission();
      return result === "granted";
    } catch {
      return false;
    }
  }
  return true;
}
