import { isCalendarDate, type CalendarDate } from "./calendar-date";

export const DAY_START_MINUTE = 8 * 60;
export const DAY_END_MINUTE = 19 * 60;
export const AGENDA_SLOT_MINUTES = 30;

export const taskStatuses = ["pending", "focus", "done"] as const;
export type TaskStatus = (typeof taskStatuses)[number];
export const recurrences = ["none", "daily", "weekdays", "weekly"] as const;
export type Recurrence = (typeof recurrences)[number];

export interface Task {
  id: string;
  title: string;
  date: CalendarDate;
  startMinute: number | null;
  endMinute: number | null;
  status: TaskStatus;
  recurrence: Recurrence;
}

export type TaskDraft = Omit<Task, "id"> & Partial<Pick<Task, "id">>;

export type TaskValidationResult = { ok: true } | { ok: false; code: TaskValidationError };
export type TaskValidationError =
  | "title-required"
  | "invalid-date"
  | "invalid-status"
  | "invalid-recurrence"
  | "paired-times-required"
  | "invalid-time"
  | "end-must-follow-start"
  | "outside-agenda-bounds";

export function validateTaskDraft(task: TaskDraft): TaskValidationResult {
  if (!task.title.trim()) return { ok: false, code: "title-required" };
  if (!isCalendarDate(task.date)) return { ok: false, code: "invalid-date" };
  if (!taskStatuses.includes(task.status)) return { ok: false, code: "invalid-status" };
  if (!recurrences.includes(task.recurrence)) return { ok: false, code: "invalid-recurrence" };

  const { startMinute, endMinute } = task;
  const hasStart = startMinute !== null;
  const hasEnd = endMinute !== null;
  if (hasStart !== hasEnd) return { ok: false, code: "paired-times-required" };
  if (!hasStart || !hasEnd) return { ok: true };
  if (!Number.isInteger(startMinute) || !Number.isInteger(endMinute)) return { ok: false, code: "invalid-time" };
  if (endMinute <= startMinute) return { ok: false, code: "end-must-follow-start" };
  if (startMinute < DAY_START_MINUTE || endMinute > DAY_END_MINUTE) {
    return { ok: false, code: "outside-agenda-bounds" };
  }
  return { ok: true };
}

export function isTask(value: TaskDraft): value is Task {
  return typeof value.id === "string" && value.id.length > 0 && validateTaskDraft(value).ok;
}
