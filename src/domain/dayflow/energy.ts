import type { CalendarDate } from "./calendar-date";

export type EnergyValue = 1 | 2 | 3 | 4 | 5;
export type EnergyByDate = Readonly<Record<CalendarDate, EnergyValue>>;

export function validateEnergy(value: unknown): value is EnergyValue {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}
