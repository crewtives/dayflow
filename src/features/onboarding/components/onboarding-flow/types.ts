import type { Recurrence } from "@/domain/dayflow";

export type OnboardingStepNumber = 1 | 2 | 3;
export type Routine = { title: string; recurrence: Recurrence };
