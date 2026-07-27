import { describe, expect, it } from "vitest";

import { occursOn, type Task } from "./index";

const task = (recurrence: Task["recurrence"], date = "2026-03-06"): Task => ({
  id: recurrence,
  title: recurrence,
  date,
  startMinute: null,
  endMinute: null,
  status: "pending",
  recurrence,
});

describe("recurrence", () => {
  it("projects none, daily, weekdays, and weekly series on local calendar dates", () => {
    expect(occursOn(task("none"), "2026-03-06")).toBe(true);
    expect(occursOn(task("none"), "2026-03-07")).toBe(false);
    expect(occursOn(task("daily"), "2026-03-08")).toBe(true);
    expect(occursOn(task("weekdays"), "2026-03-09")).toBe(true);
    expect(occursOn(task("weekdays"), "2026-03-08")).toBe(false);
    expect(occursOn(task("weekly"), "2026-03-13")).toBe(true);
    expect(occursOn(task("weekly"), "2026-03-12")).toBe(false);
  });

  it("does not shift a daily series across a DST boundary", () => {
    expect(occursOn(task("daily", "2026-03-28"), "2026-03-29")).toBe(true);
    expect(occursOn(task("daily", "2026-03-28"), "2026-03-30")).toBe(true);
  });
});
