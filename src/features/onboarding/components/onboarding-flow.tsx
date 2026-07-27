"use client";

import { useEffect, useMemo, useState } from "react";

import type { CalendarDate, Recurrence } from "@/domain/dayflow";
import { addCalendarDays } from "@/domain/dayflow";
import { useTaskActions } from "@/features/tasks";
import { useDayflowHydration } from "@/store/use-dayflow-hydration";
import { useDayflowSubject } from "@/store/dayflow-provider";

import { OnboardingFrame } from "./onboarding-flow/onboarding-frame";
import { NameForm } from "./onboarding-flow/name-form";
import { RoutinesForm } from "./onboarding-flow/routines-form";
import { StartDateForm } from "./onboarding-flow/start-date-form";
import { OnboardingStep } from "./onboarding-flow/onboarding-step";
import type { Routine } from "./onboarding-flow/types";

const profileKey = (subject: string) => `dayflow.onboarding.v1.${subject}`;
type OnboardingRecord = { name: string; completedAt: string };

function readProfile(subject: string): OnboardingRecord | null {
  try {
    const raw = window.localStorage.getItem(profileKey(subject));
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null || !("name" in value) || typeof value.name !== "string") return null;
    return value as OnboardingRecord;
  } catch { return null; }
}
function writeProfile(subject: string, name: string) {
  window.localStorage.setItem(profileKey(subject), JSON.stringify({ name, completedAt: new Date().toISOString() } satisfies OnboardingRecord));
}
function today(): CalendarDate {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function OnboardingFlow() {
  const subject = useDayflowSubject();
  const { status } = useDayflowHydration();
  const { create } = useTaskActions();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [routines, setRoutines] = useState<Routine[]>([{ title: "", recurrence: "weekdays" }, { title: "", recurrence: "weekdays" }]);
  const [startDate, setStartDate] = useState<CalendarDate>(() => addCalendarDays(today(), -7));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const visible = ready && status === "ready";
  const hasRoutine = useMemo(() => routines.some((routine) => routine.title.trim()), [routines]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setReady(readProfile(subject) === null));
    return () => window.cancelAnimationFrame(frame);
  }, [subject]);

  const finish = (nextName = name.trim()) => { writeProfile(subject, nextName); setReady(false); };
  const saveRoutines = async () => {
    setSaving(true); setError("");
    const configuredRoutines = routines.filter((routine) => routine.title.trim());
    for (const routine of configuredRoutines) {
      const result = await create({ title: routine.title, date: startDate, startMinute: null, endMinute: null, status: "pending", recurrence: routine.recurrence });
      if (!result.ok) { setError(result.message); setSaving(false); return; }
    }
    finish(); setSaving(false);
  };
  const updateRoutine = (index: number, changes: Partial<Routine>) => setRoutines((current) => current.map((routine, routineIndex) => routineIndex === index ? { ...routine, ...changes } : routine));

  if (!visible) return null;
  return <OnboardingFrame step={step}>
    <OnboardingStep step={step}>
      {step === 1 && <NameForm name={name} onChangeName={setName} onContinue={() => setStep(2)} onSkip={() => finish("")} />}
      {step === 2 && <RoutinesForm hasRoutine={hasRoutine} onAddRoutine={() => setRoutines((current) => [...current, { title: "", recurrence: "weekdays" }])} onBack={() => setStep(1)} onContinue={() => setStep(3)} onUpdateRoutine={updateRoutine} routines={routines} />}
      {step === 3 && <StartDateForm error={error} hasRoutine={hasRoutine} onBack={() => setStep(2)} onChangeStartDate={setStartDate} onSubmit={() => void saveRoutines()} saving={saving} startDate={startDate} />}
    </OnboardingStep>
  </OnboardingFrame>;
}
