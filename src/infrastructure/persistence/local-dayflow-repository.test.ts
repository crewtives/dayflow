import { describe, expect, it } from "vitest";

import { LocalDayflowRepository, snapshotStorageKey } from "./local-dayflow-repository";
import { DAYFLOW_SCHEMA_VERSION, DayflowRepositoryError } from "@/ports/dayflow-repository";

class MemoryStorage { values = new Map<string, string>(); getItem(key: string) { return this.values.get(key) ?? null; } setItem(key: string, value: string) { this.values.set(key, value); } }
const lock = { request: async <T>(_name: string, callback: () => Promise<T>) => callback() };
const channel = { publish: () => {}, subscribe: () => () => {}, close: () => {} };
const task = { id: "a", title: "Focus", date: "2026-07-27", startMinute: null, endMinute: null, status: "pending" as const, recurrence: "none" as const };

describe("LocalDayflowRepository", () => {
  it("hydrates an empty subject snapshot without reading prototype keys", async () => {
    const storage = new MemoryStorage(); const repository = new LocalDayflowRepository("df_a", { storage, lockManager: lock, channel });
    await expect(repository.read()).resolves.toEqual({ subject: "df_a", schemaVersion: DAYFLOW_SCHEMA_VERSION, generation: 0, revision: 0, tasks: [], energyByDate: {} });
  });
  it("accepts exactly one expected revision and preserves a failed write's previous snapshot", async () => {
    const storage = new MemoryStorage(); const repository = new LocalDayflowRepository("df_a", { storage, lockManager: lock, channel });
    const accepted = await repository.mutate(0, () => ({ tasks: [task], energyByDate: {} }));
    expect(accepted.revision).toBe(1);
    await expect(repository.mutate(0, () => ({ tasks: [], energyByDate: {} }))).rejects.toMatchObject({ code: "conflict" });
    expect((await repository.read()).tasks).toEqual([task]);
  });
  it("preserves corrupt and unsupported raw snapshots for explicit recovery", async () => {
    const storage = new MemoryStorage(); const key = snapshotStorageKey("df_a"); storage.setItem(key, "not-json");
    const repository = new LocalDayflowRepository("df_a", { storage, lockManager: lock, channel });
    await expect(repository.read()).rejects.toMatchObject({ code: "snapshot-corrupt" }); expect(storage.getItem(key)).toBe("not-json");
    storage.setItem(key, JSON.stringify({ schemaVersion: 99 })); await expect(repository.read()).rejects.toMatchObject({ code: "snapshot-unsupported" });
  });
  it("retains the subject and advances generation atomically on reset", async () => {
    const storage = new MemoryStorage(); const repository = new LocalDayflowRepository("df_a", { storage, lockManager: lock, channel });
    const changed = await repository.mutate(0, () => ({ tasks: [task], energyByDate: {} })); const reset = await repository.reset(changed.revision);
    expect(reset).toMatchObject({ subject: "df_a", generation: 1, revision: 2, tasks: [] });
  });
});
