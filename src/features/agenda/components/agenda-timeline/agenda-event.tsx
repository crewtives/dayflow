import { useDraggable } from "@dnd-kit/core";

import { AGENDA_SLOT_MINUTES, DAY_START_MINUTE, type AgendaTask, type TaskStatus } from "@/domain/dayflow";

type AgendaEventProps = {
  task: AgendaTask;
  onEdit: (task: AgendaTask, trigger: HTMLElement) => void;
};

function clock(minute: number) {
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}

function statusClass(status: TaskStatus) {
  return status === "focus" ? "border-vermilion-deep bg-vermilion text-paper" : status === "done" ? "border-paper-mid bg-paper-grey text-sumi-soft" : "border-paper-mid bg-paper-bright";
}

export function AgendaEvent({ task, onEdit }: AgendaEventProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, data: { task } });
  const height = Math.max(56, ((task.endMinute - task.startMinute) / AGENDA_SLOT_MINUTES) * 44 - 8);
  const top = ((task.startMinute - DAY_START_MINUTE) / AGENDA_SLOT_MINUTES) * 44 + 4;
  const laneShare = 100 / task.totalLanes;
  const style = { height, left: `calc(64px + ${task.lane * laneShare}% - ${(task.lane * 64) / task.totalLanes}px)`, top, transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined, width: `calc(${laneShare}% - ${64 / task.totalLanes}px - 6px)` };
  return <article aria-label={`${task.title}, ${clock(task.startMinute)} a ${clock(task.endMinute)}`} className={`absolute z-10 grid min-w-0 grid-cols-[1fr_auto] items-center border p-2 shadow-sm ${statusClass(task.status)} ${isDragging ? "opacity-50" : ""}`} ref={setNodeRef} style={style}><button aria-label={`Editar ${task.title}`} className="min-w-0 text-left focus-visible:outline-3 focus-visible:outline-sumi" onClick={(event) => onEdit(task, event.currentTarget)} {...attributes} {...listeners}><strong className={`block truncate leading-tight ${task.status === "done" ? "line-through" : ""}`}>{task.title}</strong><small className={`mt-0.5 block text-xs leading-tight ${task.status === "focus" ? "text-paper/85" : "text-sumi-soft"}`}>{clock(task.startMinute)}–{clock(task.endMinute)}</small></button><span aria-label={task.status === "focus" ? "En foco" : task.status === "done" ? "Hecho" : "Pendiente"} className="size-3 shrink-0 border border-current" /></article>;
}
