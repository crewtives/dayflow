"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useStore } from "zustand";

import type { IdentityProvider } from "@/ports/identity-provider";

import { createSubjectDayflowStore, type DayflowStore, type DayflowStoreState } from "./dayflow-store";

const DayflowStoreContext = createContext<DayflowStore | null>(null);
const DayflowSubjectContext = createContext<string | null>(null);
export function DayflowProvider({ identityProvider, children }: { identityProvider: IdentityProvider; children: ReactNode }) {
  const [store, setStore] = useState<DayflowStore | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [initializationError, setInitializationError] = useState(false);
  const storeRef = useRef<DayflowStore | null>(null);
  useEffect(() => {
    let active = true;
    void identityProvider.resolve().then((identity) => {
      if (!active) return;
      const resolvedStore = createSubjectDayflowStore(identity);
      storeRef.current = resolvedStore;
      setSubject(identity.subject);
      setStore(resolvedStore);
      void resolvedStore.getState().hydrate();
    }).catch(() => { if (active) setInitializationError(true); });
    return () => { active = false; storeRef.current?.getState().dispose(); storeRef.current = null; setSubject(null); };
  }, [identityProvider]);
  if (!store) return initializationError
    ? <main className="grid min-h-screen place-items-center bg-paper p-6 text-sumi"><section className="max-w-md border border-paper-mid bg-paper-bright p-6" role="alert"><p className="font-label text-xs tracking-[.14em] text-vermilion-deep">DATOS SIN ACCESO</p><h1 className="mt-2 text-2xl">No pudimos abrir tus datos locales.</h1><p className="mt-3 text-sm text-sumi-soft">Comprueba que el navegador permite almacenamiento para Dayflow e inténtalo de nuevo.</p><button className="mt-5 min-h-11 border border-vermilion-deep px-4 py-2 text-vermilion-deep" onClick={() => window.location.reload()} type="button">Reintentar</button></section></main>
    : <main aria-busy="true" aria-live="polite" className="grid min-h-screen place-items-center bg-paper text-sumi"><p>Preparando tu jornada…</p></main>;
  return <DayflowSubjectContext.Provider value={subject}><DayflowStoreContext.Provider value={store}>{children}</DayflowStoreContext.Provider></DayflowSubjectContext.Provider>;
}
export function useDayflowStore<T>(selector: (state: DayflowStoreState) => T): T {
  const store = useContext(DayflowStoreContext);
  if (!store) throw new Error("useDayflowStore must be used after DayflowProvider has resolved identity.");
  return useStore(store, selector);
}
export function useDayflowSubject(): string {
  const subject = useContext(DayflowSubjectContext);
  if (!subject) throw new Error("useDayflowSubject must be used after DayflowProvider has resolved identity.");
  return subject;
}
