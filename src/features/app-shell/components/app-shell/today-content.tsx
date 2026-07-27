import { AgendaTimeline } from "@/features/agenda";
import { EnergyScale } from "@/features/energy";
import { TaskRail } from "@/features/tasks";
import type { CalendarDate, Task } from "@/domain/dayflow";

type TodayContentProps = {
  date: CalendarDate;
  agendaKicker: string;
  agendaTitle: string;
  onEdit: (task: Task, trigger: HTMLElement) => void;
  onFeedback: (message: string) => void;
};

export function TodayContent({ date, agendaKicker, agendaTitle, onEdit, onFeedback }: TodayContentProps) {
  return <><section className="border-b border-paper-mid p-5 md:hidden"><h2 className="sr-only">Energía del día</h2><EnergyScale compact date={date} onFeedback={onFeedback} /></section><div className="grid min-h-[calc(100vh-96px)] md:grid-cols-[minmax(0,1.55fr)_minmax(330px,.9fr)]"><AgendaTimeline date={date} kicker={agendaKicker} onEdit={onEdit} onFeedback={onFeedback} title={agendaTitle} /><TaskRail date={date} onEdit={onEdit} onFeedback={onFeedback} /></div></>;
}
