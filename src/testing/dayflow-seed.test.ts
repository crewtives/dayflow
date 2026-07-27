import { describe, expect, it } from "vitest";

import { seedDayflowSnapshot } from "./dayflow-seed";

describe("seedDayflowSnapshot", () => {
  it("creates a valid rich fixture with scheduled, overlapping, recurring and unscheduled work", () => {
    const snapshot = seedDayflowSnapshot("subject-test", "2026-07-27");
    expect(snapshot.tasks).toHaveLength(5);
    expect(snapshot.tasks.some((task) => task.startMinute === null)).toBe(true);
    expect(snapshot.tasks.some((task) => task.recurrence !== "none")).toBe(true);
    expect(snapshot.energyByDate["2026-07-27"]).toBe(4);
  });
});
