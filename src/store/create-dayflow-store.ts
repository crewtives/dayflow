import { createStore, type StoreApi } from "zustand/vanilla";

import type { EnergyByDate, Task } from "@/domain/dayflow";
import type { CrossTabChannel, RevisionNotification } from "@/infrastructure/persistence/cross-tab-channel";
import { DayflowRepositoryError, type DayflowRepository, type DayflowSnapshot } from "@/ports/dayflow-repository";

export type DayflowHydrationStatus = "idle" | "hydrating" | "ready" | "error" | "conflict";
export interface DayflowStoreState {
  subject: string;
  status: DayflowHydrationStatus;
  snapshot: DayflowSnapshot | null;
  error: DayflowRepositoryError | null;
  hydrate(): Promise<void>;
  refresh(): Promise<void>;
  update(mutation: (snapshot: DayflowSnapshot) => Pick<DayflowSnapshot, "tasks" | "energyByDate">): Promise<boolean>;
  reset(): Promise<boolean>;
  dispose(): void;
}
export interface CreateDayflowStoreOptions { subject: string; repository: DayflowRepository; channel: CrossTabChannel; }
export type DayflowStore = StoreApi<DayflowStoreState>;

export function createDayflowStore({ subject, repository, channel }: CreateDayflowStoreOptions): DayflowStore {
  let unsubscribe = () => {};
  const store = createStore<DayflowStoreState>((set, get) => ({
    subject, status: "idle", snapshot: null, error: null,
    hydrate: async () => { set({ status: "hydrating", error: null }); await load(set, repository); },
    refresh: async () => { if (get().status === "hydrating") return; await load(set, repository, get().snapshot); },
    update: async (mutation) => {
      const current = get().snapshot; if (!current) return false;
      try { const next = await repository.mutate(current.revision, mutation); set({ snapshot: next, status: "ready", error: null }); return true; }
      catch (error) { return reject(set, error); }
    },
    reset: async () => {
      const current = get().snapshot; if (!current) return false;
      try { const next = await repository.reset(current.revision); set({ snapshot: next, status: "ready", error: null }); return true; }
      catch (error) { return reject(set, error); }
    },
    dispose: () => unsubscribe(),
  }));
  unsubscribe = channel.subscribe((notification) => { if (shouldRefresh(store.getState().snapshot, subject, notification)) void store.getState().refresh(); });
  return store;
}

async function load(set: StoreApi<DayflowStoreState>["setState"], repository: DayflowRepository, current?: DayflowSnapshot | null): Promise<void> {
  try { const next = await repository.read(); if (!current || newerThan(next, current)) set({ snapshot: next, status: "ready", error: null }); else set({ status: "ready", error: null }); }
  catch (error) { reject(set, error); }
}
function reject(set: StoreApi<DayflowStoreState>["setState"], error: unknown): false {
  const repositoryError = error instanceof DayflowRepositoryError ? error : new DayflowRepositoryError("storage-unavailable", "Dayflow could not load saved data.", error);
  set({ status: repositoryError.code === "conflict" ? "conflict" : "error", error: repositoryError }); return false;
}
function newerThan(candidate: DayflowSnapshot, current: DayflowSnapshot): boolean { return candidate.generation > current.generation || (candidate.generation === current.generation && candidate.revision > current.revision); }
function shouldRefresh(current: DayflowSnapshot | null, subject: string, notification: RevisionNotification): boolean { return notification.subject === subject && (!current || notification.generation > current.generation || (notification.generation === current.generation && notification.revision > current.revision)); }

export type { EnergyByDate, Task };
