import { describe, expect, it } from "vitest";

import { rollingWeekSummary, validateEnergy, type Task } from "./index";

const tasks: Task[] = [
  { id: "done", title: "Done", date: "2026-03-17", startMinute: null, endMinute: null, status: "done", recurrence: "daily" },
  { id: "open", title: "Open", date: "2026-03-23", startMinute: null, endMinute: null, status: "pending", recurrence: "none" },
];

describe("weekly summary", () => {
  it("returns today plus the previous six local dates with derived completion counts", () => {
    const week = rollingWeekSummary("2026-03-23", tasks, { "2026-03-23": 4 });
    expect(week.map((day) => day.date)).toEqual([
      "2026-03-17", "2026-03-18", "2026-03-19", "2026-03-20", "2026-03-21", "2026-03-22", "2026-03-23",
    ]);
    expect(week.at(-1)).toMatchObject({ energy: 4, completed: 1, total: 2 });
  });

  it("accepts only integer energy values from one through five", () => {
    expect(validateEnergy(1)).toBe(true);
    expect(validateEnergy(5)).toBe(true);
    expect(validateEnergy(0)).toBe(false);
    expect(validateEnergy(2.5)).toBe(false);
    expect(validateEnergy(6)).toBe(false);
  });
});
