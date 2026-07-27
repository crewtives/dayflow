import { calendarDaysBetween, weekdayOf, type CalendarDate } from "./calendar-date";
import type { Task } from "./task";

export function occursOn(task: Task, date: CalendarDate): boolean {
  if (calendarDaysBetween(task.date, date) < 0) return false;
  switch (task.recurrence) {
    case "none":
      return task.date === date;
    case "daily":
      return true;
    case "weekdays": {
      const weekday = weekdayOf(date);
      return weekday > 0 && weekday < 6;
    }
    case "weekly":
      return calendarDaysBetween(task.date, date) % 7 === 0;
  }
}

export function tasksOccurringOn(tasks: readonly Task[], date: CalendarDate): Task[] {
  return tasks.filter((task) => occursOn(task, date));
}
