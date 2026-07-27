import { EnergyScale } from "@/features/energy";
import { DayNavigation } from "@/features/navigation";
import type { CalendarDate } from "@/domain/dayflow";

type AppSidebarProps = { selectedDate: CalendarDate; onFeedback: (message: string) => void };

export function AppSidebar({ selectedDate, onFeedback }: AppSidebarProps) {
  return <aside aria-label="Navegación y estado del día" className="hidden min-h-screen flex-col border-r border-sumi/30 bg-vermilion p-6 text-paper md:fixed md:inset-y-0 md:left-0 md:flex md:w-[244px]"><div className="flex items-center gap-3 text-xs font-bold tracking-[.18em]"><span aria-hidden="true" className="grid size-8 place-items-center border border-current">×</span>DAYFLOW</div><DayNavigation /><section aria-labelledby="energy-title" className="mt-7 border-t border-paper/40 pt-5"><div className="flex items-center justify-between gap-2"><h2 className="font-label text-xs tracking-[.14em]" id="energy-title">ENERGÍA DEL DÍA</h2></div><p className="my-4 text-sm">¿Cómo estuvo tu energía?</p><EnergyScale date={selectedDate} onFeedback={onFeedback} /></section><p className="mt-auto border-t border-paper/30 pt-5 text-xs text-paper/80">Datos guardados solo en este navegador</p></aside>;
}
