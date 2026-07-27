import type { FormEvent } from "react";

import type { CalendarDate } from "@/domain/dayflow";
import { Button } from "@/shared/ui";

type StartDateFormProps = {
  error: string;
  hasRoutine: boolean;
  onBack: () => void;
  onChangeStartDate: (startDate: CalendarDate) => void;
  onSubmit: () => void;
  saving: boolean;
  startDate: CalendarDate;
};

export function StartDateForm({ error, hasRoutine, onBack, onChangeStartDate, onSubmit, saving, startDate }: StartDateFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return <form className="mt-9 grid gap-7" onSubmit={handleSubmit}>
    <label className="grid max-w-sm gap-2 text-sm font-semibold">Cargar rutinas desde
      <input className="min-h-14 border border-sumi bg-paper-bright px-4 text-lg font-normal" data-dialog-initial-focus onChange={(event) => onChangeStartDate(event.target.value as CalendarDate)} required type="date" value={startDate} />
    </label>
    <div className="border-y border-paper-mid py-5 text-sm leading-6"><span className="font-semibold">Tu agenda no queda cerrada.</span> Usa las flechas de fecha para recorrer el calendario y <span className="text-vermilion-deep">Nueva tarea</span> para crear o corregir cualquier día.</div>
    {error && <p className="border border-error bg-vermilion-wash p-3 text-sm" role="alert">{error}</p>}
    <div className="flex items-center justify-between gap-4">
      <button className="text-sm text-sumi-soft underline underline-offset-4" onClick={onBack} type="button">Atrás</button>
      <Button disabled={saving} type="submit">{saving ? "Guardando…" : hasRoutine ? "Crear mi agenda" : "Empezar"}</Button>
    </div>
  </form>;
}
