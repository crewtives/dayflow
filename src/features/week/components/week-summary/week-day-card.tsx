import type { WeekDaySummary } from "@/domain/dayflow";

type WeekDayCardProps = {
  day: WeekDaySummary;
  isToday: boolean;
  label: (date: WeekDaySummary["date"]) => string;
  dateLabel: (date: WeekDaySummary["date"]) => string;
};

export function WeekDayCard({ day, isToday, label, dateLabel }: WeekDayCardProps) {
  return <article className={`grid min-h-80 min-w-28 grid-rows-[auto_1fr_auto] border-b border-r border-paper-mid bg-paper-bright p-4 ${isToday ? "outline-2 outline-vermilion outline-offset-[-2px]" : ""}`}><header><strong className="text-sm">{isToday ? "HOY" : label(day.date)}</strong><p className="mt-1 text-xs text-sumi-soft">{dateLabel(day.date)}</p></header><div className="mx-3 mt-8 flex items-end border-b border-sumi"><div className="relative w-full bg-vermilion" style={{ height: `${(day.energy ?? 0) * 20}%` }}>{day.energy && <i className="absolute -top-2 left-1/2 size-3 -translate-x-1/2 rounded-full border-2 border-paper-bright bg-gold" />}</div></div><footer className="mt-4 text-xs text-sumi-soft">{day.energy ? `Energía ${day.energy}/5` : "Sin energía"}<span className="mt-2 block">{day.completed}/{day.total} hechas</span></footer></article>;
}
