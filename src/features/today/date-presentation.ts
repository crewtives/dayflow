import type { CalendarDate } from "@/domain/dayflow";

function dateAtNoon(date: CalendarDate): Date {
  return new Date(`${date}T12:00:00Z`);
}

export function formatDay(date: CalendarDate): string {
  const value = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(dateAtNoon(date));
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

export function datePresentation(date: CalendarDate, today: CalendarDate) {
  if (date === today) return { agendaKicker: "HOJA / HOY", agendaTitle: "Agenda del día", pageTitle: "Hoy" };
  const label = formatDay(date);
  return { agendaKicker: `HOJA / ${label.toLocaleUpperCase("es-ES")}`, agendaTitle: `Agenda · ${label}`, pageTitle: label };
}
