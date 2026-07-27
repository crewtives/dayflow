export type CalendarDate = string;

const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isCalendarDate(value: string): value is CalendarDate {
  const match = CALENDAR_DATE.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function addCalendarDays(date: CalendarDate, days: number): CalendarDate {
  if (!isCalendarDate(date) || !Number.isInteger(days)) throw new Error("Expected a calendar date and whole-day offset");
  const [year, month, day] = date.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  return formatCalendarDate(shifted);
}

export function calendarDaysBetween(start: CalendarDate, end: CalendarDate): number {
  if (!isCalendarDate(start) || !isCalendarDate(end)) throw new Error("Expected calendar dates");
  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);
  return (Date.UTC(endYear, endMonth - 1, endDay) - Date.UTC(startYear, startMonth - 1, startDay)) / 86_400_000;
}

export function weekdayOf(date: CalendarDate): number {
  if (!isCalendarDate(date)) throw new Error("Expected a calendar date");
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function formatCalendarDate(date: Date): CalendarDate {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
