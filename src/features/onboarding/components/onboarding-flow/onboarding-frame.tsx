import type { PropsWithChildren } from "react";

import type { OnboardingStepNumber } from "./types";

type OnboardingFrameProps = PropsWithChildren<{ step: OnboardingStepNumber }>;

export function OnboardingFrame({ children, step }: OnboardingFrameProps) {
  return <section aria-labelledby="onboarding-title" aria-modal="true" className="fixed inset-0 z-50 grid min-h-[100dvh] overflow-y-auto bg-sumi text-paper" role="dialog">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-30 [background:linear-gradient(135deg,transparent_0_49.85%,#f7f3ee_50%,transparent_50.15%)]" />
    <div className="relative z-10 grid min-h-[100dvh] lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,.95fr)]">
      <aside className="flex min-h-[50dvh] flex-col border-b border-paper/35 bg-vermilion p-6 sm:p-10 lg:grid lg:min-h-screen lg:grid-rows-[auto_1fr_auto] lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 text-xs font-bold tracking-[.18em]"><span aria-hidden="true" className="grid size-8 place-items-center border border-current">×</span>DAYFLOW</div>
        <div className="max-w-xl py-10 lg:self-center lg:py-0 lg:-translate-y-12"><p className="font-label text-xs tracking-[.16em] text-paper/80">CONFIGURA TU RITMO</p><h1 className="mt-4 max-w-[9ch] text-balance text-4xl font-normal leading-[.9] tracking-[-.04em] sm:text-6xl">Tu agenda empieza donde estás.</h1><p className="mt-7 hidden max-w-[38ch] text-base leading-7 text-paper/90 sm:block">Crea una base que te acompañe hoy y que puedas ajustar cuando la vida cambie: antes, ahora o después.</p></div>
        <div aria-label={`Paso ${step} de 3`} className="mt-auto flex gap-2 lg:mt-0"><span className="h-1 w-12 bg-paper" /><span className={`h-1 w-12 ${step >= 2 ? "bg-paper" : "bg-paper/35"}`} /><span className={`h-1 w-12 ${step >= 3 ? "bg-paper" : "bg-paper/35"}`} /></div>
      </aside>
      <main className="flex items-center bg-paper px-6 py-10 text-sumi sm:px-10 lg:px-[clamp(3rem,7vw,8rem)] lg:py-16">{children}</main>
    </div>
  </section>;
}
