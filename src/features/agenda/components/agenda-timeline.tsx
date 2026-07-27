"use client";

import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";

import { agendaLanes, tasksOccurringOn, DAY_END_MINUTE, DAY_START_MINUTE, AGENDA_SLOT_MINUTES, type AgendaTask, type CalendarDate } from "@/domain/dayflow";
import { selectTasks } from "@/store/dayflow-selectors";
import { useDayflowStore } from "@/store/dayflow-provider";

import { useTaskActions } from "@/features/tasks";
import { AgendaEvent } from "./agenda-timeline/agenda-event";
import { AgendaSlot } from "./agenda-timeline/agenda-slot";

const minutes = Array.from({ length: (DAY_END_MINUTE - DAY_START_MINUTE) / AGENDA_SLOT_MINUTES }, (_, index) => DAY_START_MINUTE + index * AGENDA_SLOT_MINUTES);
function clock(minute: number) { return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`; }

export function AgendaTimeline({ date, title, kicker, onEdit, onFeedback }: { date: CalendarDate; title: string; kicker: string; onEdit: (task: AgendaTask, trigger: HTMLElement) => void; onFeedback?: (message: string) => void }) {
  const tasks = useDayflowStore(selectTasks);
  const { command } = useTaskActions();
  const agenda = agendaLanes(tasksOccurringOn(tasks, date));
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }), useSensor(KeyboardSensor));
  const onDragEnd = (event: DragEndEvent) => {
    const minute = typeof event.over?.id === "string" ? Number(event.over.id.replace("slot-", "")) : Number.NaN;
    if (!Number.isInteger(minute)) return;
    const task = agenda.find((item) => item.id === String(event.active.id));
    void command({ type: "move", id: String(event.active.id), date, startMinute: minute }).then((result) => onFeedback?.(result.ok ? `${task?.title ?? "El evento"} movido a las ${clock(minute)}.` : result.message));
  };
  return <section aria-labelledby="agenda-title" className="min-w-0 p-6 md:p-7"><header className="mb-5"><p className="font-label text-xs tracking-[.14em] text-vermilion-deep">{kicker}</p><h2 className="mt-1 text-2xl font-medium tracking-tight" id="agenda-title">{title}</h2></header><p className="mb-3 text-xs text-sumi-soft">Arrastra entre bloques de 30 min. Para una hora exacta, abre el evento.</p><DndContext accessibility={{ announcements: { onDragStart: ({ active }) => `Has empezado a mover ${String(active.id)}.`, onDragOver: ({ over }) => over ? `Sobre ${String(over.id).replace("slot-", "las ")}.` : "Fuera de la agenda.", onDragEnd: ({ active, over }) => over ? `${String(active.id)} se ha movido a ${String(over.id).replace("slot-", "las ")}.` : "Movimiento cancelado.", onDragCancel: ({ active }) => `Se canceló el movimiento de ${String(active.id)}.` } }} collisionDetection={closestCenter} onDragEnd={onDragEnd} sensors={sensors}><div className="relative border-t border-paper-mid">{minutes.map((minute) => <AgendaSlot key={minute} minute={minute} />)}{agenda.map((task) => <AgendaEvent key={task.id} onEdit={onEdit} task={task} />)}</div></DndContext></section>;
}
