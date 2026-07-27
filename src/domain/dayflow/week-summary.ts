import { addCalendarDays, type CalendarDate } from "./calendar-date";
import type { EnergyByDate, EnergyValue } from "./energy";
import { tasksOccurringOn } from "./recurrence";
import type { Task } from "./task";

export interface WeekDaySummary {
  date: CalendarDate;
  energy: EnergyValue | null;
  completed: number;
  total: number;
}

export function rollingWeekSummary(today: CalendarDate, tasks: readonly Task[], energy: EnergyByDate): WeekDaySummary[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addCalendarDays(today, index - 6);
    const tasksForDay = tasksOccurringOn(tasks, date);
    return {
      date,
      energy: energy[date] ?? null,
      completed: tasksForDay.filter((task) => task.status === "done").length,
      total: tasksForDay.length,
    };
  });
}
