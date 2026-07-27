import type { CalendarDate, Task } from "@/domain/dayflow";
import { DAYFLOW_SCHEMA_VERSION, type DayflowSnapshot } from "@/ports/dayflow-repository";

/**
 * Deterministic rich fixture for browser tests and local manual verification.
 * It is intentionally not imported by the application runtime.
 */
export function seedDayflowSnapshot(subject: string, date: CalendarDate): DayflowSnapshot {
  const tasks: Task[] = [
    { id: "seed-done", title: "Cerrar la planificación", date, startMinute: 480, endMinute: 540, status: "done", recurrence: "none" },
    { id: "seed-pending", title: "Preparar propuesta", date, startMinute: 540, endMinute: 630, status: "pending", recurrence: "none" },
    { id: "seed-focus", title: "Diseñar el flujo", date, startMinute: 600, endMinute: 720, status: "focus", recurrence: "daily" },
    { id: "seed-overlap", title: "Llamada de coordinación", date, startMinute: 630, endMinute: 690, status: "pending", recurrence: "weekly" },
    { id: "seed-unscheduled", title: "Responder correos", date, startMinute: null, endMinute: null, status: "pending", recurrence: "none" },
  ];
  return { subject, schemaVersion: DAYFLOW_SCHEMA_VERSION, generation: 0, revision: 1, tasks, energyByDate: { [date]: 4 } };
}
