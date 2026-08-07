"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useMissionStore } from "@/store/mission-store";

const HydrationContext = createContext(false);

export function useHydrated() {
  return useContext(HydrationContext);
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Subscribe to the persist store's own hydration event rather than
    // setting state synchronously in the effect body.
    const unsubscribe = useMissionStore.persist.onFinishHydration(() => setHydrated(true));
    useMissionStore.persist.rehydrate();
    return unsubscribe;
  }, []);

  return <HydrationContext.Provider value={hydrated}>{children}</HydrationContext.Provider>;
}
