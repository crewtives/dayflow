"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useStore } from "zustand";

import type { IdentityProvider } from "@/ports/identity-provider";

import { createSubjectDayflowStore, type DayflowStore, type DayflowStoreState } from "./dayflow-store";

const DayflowStoreContext = createContext<DayflowStore | null>(null);
export function DayflowProvider({ identityProvider, children }: { identityProvider: IdentityProvider; children: ReactNode }) {
  const [store, setStore] = useState<DayflowStore | null>(null);
  useEffect(() => {
    let active = true;
    let resolvedStore: DayflowStore | null = null;
    void identityProvider.resolve().then((identity) => { if (!active) return; resolvedStore = createSubjectDayflowStore(identity); setStore(resolvedStore); void resolvedStore.getState().hydrate(); });
    return () => { active = false; resolvedStore?.getState().dispose(); setStore(null); };
  }, [identityProvider]);
  return <DayflowStoreContext.Provider value={store}>{store ? children : null}</DayflowStoreContext.Provider>;
}
export function useDayflowStore<T>(selector: (state: DayflowStoreState) => T): T {
  const store = useContext(DayflowStoreContext);
  if (!store) throw new Error("useDayflowStore must be used after DayflowProvider has resolved identity.");
  return useStore(store, selector);
}
