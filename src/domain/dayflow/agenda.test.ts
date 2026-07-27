import { describe, expect, it } from "vitest";

import { agendaLanes, type Task } from "./index";

const task = (id: string, startMinute: number, endMinute: number): Task => ({
  id,
  title: id,
  date: "2026-03-23",
  startMinute,
  endMinute,
  status: "pending",
  recurrence: "none",
});

describe("agenda lanes", () => {
  it("assigns deterministic overlap lanes without mutating persisted tasks", () => {
    const tasks = [task("second", 540, 630), task("first", 540, 600), task("after", 630, 660)];

    expect(agendaLanes(tasks)).toEqual([
      expect.objectContaining({ id: "first", lane: 0, totalLanes: 2 }),
      expect.objectContaining({ id: "second", lane: 1, totalLanes: 2 }),
      expect.objectContaining({ id: "after", lane: 0, totalLanes: 1 }),
    ]);
    expect(tasks).toEqual([task("second", 540, 630), task("first", 540, 600), task("after", 630, 660)]);
  });
});
