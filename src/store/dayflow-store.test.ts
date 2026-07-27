import { describe, expect, it } from "vitest";

import { createDayflowStore } from "./create-dayflow-store";
import type { CrossTabChannel, RevisionNotification } from "@/infrastructure/persistence/cross-tab-channel";
import type { DayflowRepository, DayflowSnapshot } from "@/ports/dayflow-repository";

class TestChannel implements CrossTabChannel { listeners = new Set<(note: RevisionNotification) => void>(); publish(note: RevisionNotification) { this.listeners.forEach((listener) => listener(note)); } subscribe(listener: (note: RevisionNotification) => void) { this.listeners.add(listener); return () => this.listeners.delete(listener); } close() {} }
const snapshot = (revision: number, generation = 0): DayflowSnapshot => ({ subject: "df_a", schemaVersion: 1, generation, revision, tasks: [], energyByDate: {} });

describe("createDayflowStore", () => {
  it("exposes explicit hydration state and loads the real snapshot", async () => {
    const repository: DayflowRepository = { read: async () => snapshot(2), mutate: async () => snapshot(3), reset: async () => snapshot(3, 1) }; const store = createDayflowStore({ subject: "df_a", repository, channel: new TestChannel() });
    expect(store.getState().status).toBe("idle"); await store.getState().hydrate(); expect(store.getState()).toMatchObject({ status: "ready", snapshot: { revision: 2 } });
  });
  it("refreshes on newer notifications but ignores duplicate, malformed and older revisions", async () => {
    let current = snapshot(2); let reads = 0; const channel = new TestChannel();
    const repository: DayflowRepository = { read: async () => { reads++; return current; }, mutate: async () => current, reset: async () => current };
    const store = createDayflowStore({ subject: "df_a", repository, channel }); await store.getState().hydrate();
    channel.publish({ subject: "df_a", generation: 0, revision: 2 }); channel.publish({ subject: "other", generation: 0, revision: 99 }); expect(reads).toBe(1);
    current = snapshot(3); channel.publish({ subject: "df_a", generation: 0, revision: 3 }); await Promise.resolve(); await Promise.resolve(); expect(store.getState().snapshot?.revision).toBe(3);
  });
});
