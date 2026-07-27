"use client";

import { useCallback } from "react";

import { applyTaskCommand, type Task, type TaskCommand, type TaskDraft, validateTaskDraft } from "@/domain/dayflow";
import { selectSnapshot } from "@/store/dayflow-selectors";
import { useDayflowStore } from "@/store/dayflow-provider";

export type TaskActionResult = { ok: true } | { ok: false; message: string };

const messages: Record<string, string> = {
  "title-required": "Escribe un título para la tarea.",
  "invalid-date": "Elige una fecha válida.",
  "paired-times-required": "Indica ambas horas o deja las dos vacías.",
  "invalid-time": "La hora no es válida.",
  "end-must-follow-start": "La hora de fin debe ser posterior al inicio.",
  "outside-agenda-bounds": "La agenda solo admite horas entre las 08:00 y las 19:00.",
  "task-not-found": "La tarea ya no existe. Actualiza la vista.",
  "task-unscheduled": "Solo se pueden arrastrar tareas con horario.",
  "invalid-move": "Ese horario no cabe en la agenda.",
  "invalid-task": "Los cambios de la tarea no son válidos.",
};

function id(): string { return globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}-${Math.random().toString(36).slice(2)}`; }

export function useTaskActions() {
  const snapshot = useDayflowStore(selectSnapshot);
  const update = useDayflowStore((state) => state.update);
  const create = useCallback(async (draft: TaskDraft): Promise<TaskActionResult> => {
    const validation = validateTaskDraft(draft);
    if (!validation.ok) return { ok: false, message: messages[validation.code] };
    const accepted = await update((current) => ({ tasks: [...current.tasks, { ...draft, id: id(), title: draft.title.trim() } as Task], energyByDate: current.energyByDate }));
    return accepted ? { ok: true } : { ok: false, message: "No se pudo guardar la tarea. Tus datos no han cambiado." };
  }, [update]);
  const command = useCallback(async (nextCommand: TaskCommand): Promise<TaskActionResult> => {
    if (!snapshot) return { ok: false, message: "Dayflow todavía está cargando." };
    const result = applyTaskCommand(snapshot.tasks, nextCommand);
    if (!result.ok) return { ok: false, message: messages[result.code] };
    const accepted = await update((current) => {
      const currentResult = applyTaskCommand(current.tasks, nextCommand);
      return { tasks: currentResult.ok ? currentResult.tasks : current.tasks, energyByDate: current.energyByDate };
    });
    return accepted ? { ok: true } : { ok: false, message: "No se pudo guardar el cambio. Tus datos no han cambiado." };
  }, [snapshot, update]);
  return { create, command };
}
