import { z } from "zod";

import { DAYFLOW_SCHEMA_VERSION, type DayflowSnapshot } from "@/ports/dayflow-repository";

const calendarDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
});

const taskSchema = z.object({
  id: z.string().min(1), title: z.string().min(1), date: calendarDateSchema,
  startMinute: z.number().int().nullable(), endMinute: z.number().int().nullable(),
  status: z.enum(["pending", "focus", "done"]), recurrence: z.enum(["none", "daily", "weekdays", "weekly"]),
}).strict().superRefine((task, context) => {
  const paired = (task.startMinute === null) === (task.endMinute === null);
  if (!paired) context.addIssue({ code: "custom", message: "Task times must be paired." });
  if (task.startMinute !== null && task.endMinute !== null && (task.startMinute < 480 || task.endMinute > 1140 || task.endMinute <= task.startMinute)) {
    context.addIssue({ code: "custom", message: "Task times must be within the agenda bounds." });
  }
});

export const dayflowSnapshotSchema = z.object({
  subject: z.string().min(1), schemaVersion: z.literal(DAYFLOW_SCHEMA_VERSION), generation: z.number().int().nonnegative(),
  revision: z.number().int().nonnegative(), tasks: z.array(taskSchema), energyByDate: z.record(calendarDateSchema, z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])),
}).strict();

export function emptyDayflowSnapshot(subject: string): DayflowSnapshot {
  return { subject, schemaVersion: DAYFLOW_SCHEMA_VERSION, generation: 0, revision: 0, tasks: [], energyByDate: {} };
}
