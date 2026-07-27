import type { FormEvent } from "react";

import type { Recurrence, TaskDraft, TaskStatus } from "@/domain/dayflow";
import { Button } from "@/shared/ui";

type TaskDrawerFormProps = {
  draft: TaskDraft;
  error: string;
  onDraftChange: (changes: Partial<TaskDraft>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function timeToMinute(value: string): number | null {
  if (!value) return null;
  const [hour, minute] = value.split(":").map(Number);
  return Number.isInteger(hour) && Number.isInteger(minute) ? hour * 60 + minute : null;
}

function minuteToTime(value: number | null): string {
  return value === null ? "" : `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

export function TaskDrawerForm({ draft, error, onDraftChange, onSubmit }: TaskDrawerFormProps) {
  return <form className="grid gap-5 pt-7" noValidate onSubmit={onSubmit}><label className="grid gap-2 text-sm font-semibold">Título<input aria-describedby={error ? "task-form-error" : undefined} autoComplete="off" className="min-h-12 border border-sumi-soft bg-paper-bright px-3 font-normal" data-dialog-initial-focus maxLength={90} onChange={(event) => onDraftChange({ title: event.target.value })} required value={draft.title} /></label><fieldset className="grid gap-3"><legend className="mb-2 text-sm font-semibold">Cuándo</legend><div className="grid grid-cols-2 gap-3"><label className="grid gap-2 text-sm">Día<input className="min-h-12 border border-sumi-soft bg-paper-bright px-3" onChange={(event) => onDraftChange({ date: event.target.value })} required type="date" value={draft.date} /></label><label className="grid gap-2 text-sm">Empieza<input className="min-h-12 border border-sumi-soft bg-paper-bright px-3" max="19:00" min="08:00" onChange={(event) => onDraftChange({ startMinute: timeToMinute(event.target.value) })} step="1800" type="time" value={minuteToTime(draft.startMinute)} /></label><label className="grid gap-2 text-sm">Termina<input className="min-h-12 border border-sumi-soft bg-paper-bright px-3" max="19:00" min="08:00" onChange={(event) => onDraftChange({ endMinute: timeToMinute(event.target.value) })} step="1800" type="time" value={minuteToTime(draft.endMinute)} /></label></div></fieldset><label className="grid gap-2 text-sm font-semibold">Estado<select className="min-h-12 border border-sumi-soft bg-paper-bright px-3 font-normal" onChange={(event) => onDraftChange({ status: event.target.value as TaskStatus })} value={draft.status}><option value="pending">Pendiente</option><option value="focus">En foco</option><option value="done">Hecho</option></select></label><label className="grid gap-2 text-sm font-semibold">Repetición<select className="min-h-12 border border-sumi-soft bg-paper-bright px-3 font-normal" onChange={(event) => onDraftChange({ recurrence: event.target.value as Recurrence })} value={draft.recurrence}><option value="none">No se repite</option><option value="daily">Cada día</option><option value="weekdays">Días laborables</option><option value="weekly">Cada semana</option></select></label>{error && <p className="border border-vermilion bg-vermilion-wash p-3 text-sm" id="task-form-error" role="alert">{error}</p>}<div className="flex justify-end border-t border-paper-mid pt-5"><Button type="submit">Guardar evento</Button></div></form>;
}
