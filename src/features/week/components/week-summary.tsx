"use client";

import { rollingWeekSummary, type CalendarDate } from "@/domain/dayflow";
import { selectEnergyByDate, selectTasks } from "@/store/dayflow-selectors";
import { useDayflowStore } from "@/store/dayflow-provider";
import { WeekDayCard } from "./week-summary/week-day-card";
import { WeekSummaryHeader } from "./week-summary/week-summary-header";

function label(date: CalendarDate) { return new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(new Date(`${date}T12:00:00`)).replace(".", "").toUpperCase(); }
function dateLabel(date: CalendarDate) { return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`)).toUpperCase(); }
function today(): CalendarDate { const value = new Date(); return new Date(value.getTime() - value.getTimezoneOffset() * 60_000).toISOString().slice(0, 10); }
export function WeekSummary() {
  const tasks = useDayflowStore(selectTasks);
  const energyByDate = useDayflowStore(selectEnergyByDate);
  const anchor = today();
  const days = rollingWeekSummary(anchor, tasks, energyByDate);
  return <section aria-labelledby="week-title" className="p-6 md:p-14"><WeekSummaryHeader /><div className="grid overflow-x-auto border-l border-t border-paper-mid md:grid-cols-7">{days.map((day) => <WeekDayCard dateLabel={dateLabel} day={day} isToday={day.date === anchor} key={day.date} label={label} />)}</div></section>;
}
