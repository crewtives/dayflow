import type { FormEvent } from "react";

import { Button } from "@/shared/ui";

type NameFormProps = {
  name: string;
  onChangeName: (name: string) => void;
  onContinue: () => void;
  onSkip: () => void;
};

export function NameForm({ name, onChangeName, onContinue, onSkip }: NameFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim()) onContinue();
  };

  return <form className="mt-10 grid gap-7" onSubmit={handleSubmit}>
    <label className="grid gap-2 text-sm font-semibold">Tu nombre
      <input autoComplete="given-name" className="min-h-14 border border-sumi bg-paper-bright px-4 text-lg font-normal placeholder:text-sumi-soft/70" data-dialog-initial-focus maxLength={60} onChange={(event) => onChangeName(event.target.value)} placeholder="Escribe tu nombre" required value={name} />
    </label>
    <div className="flex items-center justify-between gap-4 border-t border-paper-mid pt-6">
      <button className="text-sm text-sumi-soft underline underline-offset-4" onClick={onSkip} type="button">Omitir por ahora</button>
      <Button type="submit">Continuar</Button>
    </div>
  </form>;
}
