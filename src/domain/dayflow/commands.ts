import type { CalendarDate } from "./calendar-date";
import { DAY_END_MINUTE, DAY_START_MINUTE, type Task, type TaskDraft, type TaskStatus, validateTaskDraft } from "./task";

export type TaskCommand =
  | { type: "set-status"; id: string; status: TaskStatus }
  | { type: "edit"; id: string; changes: Partial<Omit<TaskDraft, "id">> }
  | { type: "move"; id: string; date: CalendarDate; startMinute: number }
  | { type: "delete"; id: string };

export type TaskCommandResult =
  | { ok: true; tasks: Task[] }
  | { ok: false; code: "task-not-found" | "task-unscheduled" | "invalid-task" | "invalid-move" };

export function applyTaskCommand(tasks: readonly Task[], command: TaskCommand): TaskCommandResult {
  const task = tasks.find((candidate) => candidate.id === command.id);
  if (!task) return { ok: false, code: "task-not-found" };
  if (command.type === "delete") return { ok: true, tasks: tasks.filter((candidate) => candidate.id !== command.id) };

  let replacement: Task;
  if (command.type === "set-status") {
    replacement = { ...task, status: command.status };
  } else if (command.type === "edit") {
    replacement = { ...task, ...command.changes };
  } else {
    if (task.startMinute === null || task.endMinute === null) return { ok: false, code: "task-unscheduled" };
    if (!Number.isInteger(command.startMinute) || command.startMinute < DAY_START_MINUTE || command.startMinute > DAY_END_MINUTE) {
      return { ok: false, code: "invalid-move" };
    }
    const duration = task.endMinute - task.startMinute;
    const endMinute = Math.min(DAY_END_MINUTE, command.startMinute + duration);
    replacement = { ...task, date: command.date, startMinute: endMinute - duration, endMinute };
  }

  if (!validateTaskDraft(replacement).ok) return { ok: false, code: command.type === "move" ? "invalid-move" : "invalid-task" };
  return { ok: true, tasks: tasks.map((candidate) => (candidate.id === command.id ? replacement : candidate)) };
}
