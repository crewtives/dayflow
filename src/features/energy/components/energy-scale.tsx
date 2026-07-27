"use client";

import { useCallback } from "react";

import type { CalendarDate, EnergyValue } from "@/domain/dayflow";
import { selectEnergyByDate } from "@/store/dayflow-selectors";
import { useDayflowStore } from "@/store/dayflow-provider";
import { EnergyOption } from "./energy-scale/energy-option";

const labels = ["Muy baja", "Baja", "Media", "Alta", "Muy alta"];
export function EnergyScale({ compact = false, date, onFeedback }: { compact?: boolean; date: CalendarDate; onFeedback?: (message: string) => void }) {
  const energyByDate = useDayflowStore(selectEnergyByDate);
  const update = useDayflowStore((state) => state.update);
  const value = energyByDate[date];
  const setValue = useCallback((next: EnergyValue) => { void update((snapshot) => ({ tasks: snapshot.tasks, energyByDate: { ...snapshot.energyByDate, [date]: next } })).then((saved) => onFeedback?.(saved ? `Energía registrada: ${labels[next - 1]}.` : "No pudimos guardar tu energía.")); }, [date, onFeedback, update]);
  const move = (index: number, delta: number) => document.getElementById(`energy-${compact ? "mobile" : "rail"}-${(index + delta + 5) % 5}`)?.focus();
  return <div aria-label={compact ? "Nivel de energía de hoy" : "Nivel de energía"} className="grid grid-cols-5 gap-1.5" role="radiogroup">{labels.map((label, index) => { const next = (index + 1) as EnergyValue; return <EnergyOption id={`energy-${compact ? "mobile" : "rail"}-${index}`} index={index} key={label} label={label} onMove={move} onSelect={setValue} selected={value === next} tabIndex={value === next || (!value && index === 0) ? 0 : -1} />; })}</div>;
}
