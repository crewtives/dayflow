import type { FormEvent } from "react";

import type { Recurrence } from "@/domain/dayflow";
import { Button } from "@/shared/ui";

import type { Routine } from "./types";

const recurrenceLabels: Record<Recurrence, string> = { none: "Una vez", daily: "Cada día", weekdays: "Laborables", weekly: "Cada semana" };

type RoutinesFormProps = {
  hasRoutine: boolean;
  onAddRoutine: () => void;
  onBack: () => void;
  onContinue: () => void;
  onUpdateRoutine: (index: number, changes: Partial<Routine>) => void;
  routines: Routine[];
};

export function RoutinesForm({ hasRoutine, onAddRoutine, onBack, onContinue, onUpdateRoutine, routines }: RoutinesFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onContinue();
  };

  return <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
    <fieldset className="grid gap-4">
      <legend className="text-sm font-semibold">Tus rutinas</legend>
      {routines.map((routine, index) => <div className="grid gap-2 sm:grid-cols-[1fr_152px]" key={`routine-${index}`}>
        <label className="sr-only" htmlFor={`routine-${index}`}>Tarea cotidiana {index + 1}</label>
        <input className="min-h-12 border border-sumi-soft bg-paper-bright px-3" data-dialog-initial-focus={index === 0 ? "true" : undefined} id={`routine-${index}`} maxLength={90} onChange={(event) => onUpdateRoutine(index, { title: event.target.value })} placeholder={index === 0 ? "Ej. Revisar prioridades" : "Otra tarea habitual"} value={routine.title} />
        <label className="sr-only" htmlFor={`recurrence-${index}`}>Frecuencia de tarea {index + 1}</label>
        <select className="min-h-12 border border-sumi-soft bg-paper-bright px-3 text-sm" id={`recurrence-${index}`} onChange={(event) => onUpdateRoutine(index, { recurrence: event.target.value as Recurrence })} value={routine.recurrence}>
          {(["daily", "weekdays", "weekly"] as const).map((value) => <option key={value} value={value}>{recurrenceLabels[value]}</option>)}
        </select>
      </div>)}
    </fieldset>
    <button className="justify-self-start text-sm text-vermilion-deep underline underline-offset-4" onClick={onAddRoutine} type="button">+ Añadir otra rutina</button>
    <div className="flex items-center justify-between gap-4 border-t border-paper-mid pt-6">
      <button className="text-sm text-sumi-soft underline underline-offset-4" onClick={onBack} type="button">Atrás</button>
      <Button type="submit">{hasRoutine ? "Elegir periodo" : "Continuar sin rutinas"}</Button>
    </div>
  </form>;
}
