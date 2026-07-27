"use client";

import { useState } from "react";
const labels = ["Muy baja", "Baja", "Media", "Alta", "Muy alta"];
export function EnergyScale({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState<number>();
  const move = (index: number, delta: number) => document.getElementById(`energy-${compact ? "mobile" : "rail"}-${(index + delta + 5) % 5}`)?.focus();
  return <div aria-label={compact ? "Nivel de energía de hoy" : "Nivel de energía"} className="grid grid-cols-5 gap-1.5" role="radiogroup">{labels.map((label, index) => { const selected = value === index + 1; return <button aria-checked={selected} className="grid justify-items-center gap-1 text-[.68rem] leading-tight" id={`energy-${compact ? "mobile" : "rail"}-${index}`} key={label} onClick={() => setValue(index + 1)} onKeyDown={(event) => { if (["ArrowRight", "ArrowDown"].includes(event.key)) { event.preventDefault(); move(index, 1); } if (["ArrowLeft", "ArrowUp"].includes(event.key)) { event.preventDefault(); move(index, -1); } }} role="radio" tabIndex={selected || (!value && index === 0) ? 0 : -1}><span className={`grid size-7 place-items-center rounded-full border ${selected ? "border-gold bg-gold text-sumi shadow-[0_0_0_3px_rgba(247,243,238,.9)]" : "border-current"}`}>{index + 1}</span><small>{label}</small></button>; })}</div>;
}
