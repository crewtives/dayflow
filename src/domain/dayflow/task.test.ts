import { describe, expect, it } from "vitest";

import {
  applyTaskCommand,
  validateTaskDraft,
  type Task,
} from "./index";

const scheduled: Task = {
  id: "series-1",
  title: "Weekly planning",
  date: "2026-03-23",
  startMinute: 540,
  endMinute: 600,
  status: "pending",
  recurrence: "weekly",
};

describe("task validation and whole-series commands", () => {
  it("accepts an unscheduled task only when both times are blank", () => {
    expect(validateTaskDraft({ ...scheduled, startMinute: null, endMinute: null }).ok).toBe(true);
    expect(validateTaskDraft({ ...scheduled, startMinute: 540, endMinute: null })).toMatchObject({
      ok: false,
      code: "paired-times-required",
    });
  });

  it("rejects invalid agenda intervals", () => {
    expect(validateTaskDraft({ ...scheduled, startMinute: 600, endMinute: 600 })).toMatchObject({
      ok: false,
      code: "end-must-follow-start",
    });
    expect(validateTaskDraft({ ...scheduled, startMinute: 450, endMinute: 540 })).toMatchObject({
      ok: false,
      code: "outside-agenda-bounds",
    });
    expect(validateTaskDraft({ ...scheduled, startMinute: 1080, endMinute: 1200 })).toMatchObject({
      ok: false,
      code: "outside-agenda-bounds",
    });
  });

  it("changes the series source for status, edits, moves, and deletion", () => {
    const done = applyTaskCommand([scheduled], { type: "set-status", id: scheduled.id, status: "done" });
    expect(done).toMatchObject({ ok: true, tasks: [{ status: "done" }] });

    const edited = applyTaskCommand([scheduled], { type: "edit", id: scheduled.id, changes: { title: "Updated" } });
    expect(edited).toMatchObject({ ok: true, tasks: [{ title: "Updated" }] });

    const moved = applyTaskCommand([scheduled], {
      type: "move",
      id: scheduled.id,
      date: "2026-03-30",
      startMinute: 1110,
    });
    expect(moved).toMatchObject({
      ok: true,
      tasks: [{ date: "2026-03-30", startMinute: 1080, endMinute: 1140 }],
    });

    expect(applyTaskCommand([scheduled], { type: "delete", id: scheduled.id })).toMatchObject({
      ok: true,
      tasks: [],
    });
  });
});
