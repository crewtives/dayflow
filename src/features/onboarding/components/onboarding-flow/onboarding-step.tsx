import type { PropsWithChildren } from "react";

import type { OnboardingStepNumber } from "./types";

const copy = {
  1: { title: "¿Cómo quieres que te llamemos?", description: "Tu nombre personaliza la bienvenida y se guarda únicamente en este navegador." },
  2: { title: "Lo que vuelve merece un lugar.", description: "Añade las tareas que forman parte de tu ritmo. Puedes cambiar sus horarios, días o repetición siempre que quieras." },
  3: { title: "Que tu agenda tenga historia.", description: "Elige desde cuándo quieres cargar estas rutinas. Después podrás abrir cualquier día —pasado, presente o futuro— y editar su agenda." },
} satisfies Record<OnboardingStepNumber, { title: string; description: string }>;

type OnboardingStepProps = PropsWithChildren<{ step: OnboardingStepNumber }>;

export function OnboardingStep({ children, step }: OnboardingStepProps) {
  const content = copy[step];
  return <div className="w-full max-w-xl animate-[onboarding-fold_520ms_cubic-bezier(0.22,1,0.36,1)]">
    <p className="font-label text-xs tracking-[.14em] text-vermilion-deep">PRIMER ACCESO · {step} / 3</p>
    <h2 className="mt-3 max-w-[12ch] text-balance text-4xl font-normal leading-[.96] tracking-[-.04em] sm:text-5xl" id="onboarding-title">{content.title}</h2>
    <p className="mt-5 max-w-[48ch] text-sm leading-6 text-sumi-soft">{content.description}</p>
    {children}
  </div>;
}
