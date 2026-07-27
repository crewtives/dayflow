"use client";

import type { CalendarDate, Task, TaskStatus } from "@/domain/dayflow";
import { tasksOccurringOn } from "@/domain/dayflow";
import { selectTasks } from "@/store/dayflow-selectors";
import { useDayflowStore } from "@/store/dayflow-provider";

import { useTaskActions } from "../hooks/use-task-actions";
import { TaskRailGroup } from "./task-rail/task-rail-group";

const groups: { status: TaskStatus; name: string }[] = [{ status: "focus", name: "En foco" }, { status: "pending", name: "Pendiente" }, { status: "done", name: "Hecho" }];

export function TaskRail({ date, onEdit, onFeedback }: { date: CalendarDate; onEdit: (task: Task, trigger: HTMLElement) => void; onFeedback?: (message: string) => void }) {
  const tasks = useDayflowStore(selectTasks);
  const { command } = useTaskActions();
  const occurrences = tasksOccurringOn(tasks, date);
  const changeStatus = async (task: Task, status: TaskStatus) => { const result = await command({ type: "set-status", id: task.id, status }); onFeedback?.(result.ok ? `${task.title}: ${status === "focus" ? "en foco" : status === "done" ? "completada" : "pendiente"}.` : result.message); };
  return <aside aria-labelledby="tasks-title" className="border-t border-paper-mid bg-paper-bright p-6 md:border-l md:border-t-0 md:p-7"><header className="mb-5"><p className="font-label text-xs tracking-[.14em] text-vermilion-deep">ESTADO</p><h2 className="mt-1 text-2xl font-medium tracking-tight" id="tasks-title">Tareas</h2></header><div className="grid gap-6">{groups.map((group) => <TaskRailGroup key={group.status} name={group.name} onEdit={onEdit} onStatusChange={(task, status) => void changeStatus(task, status)} tasks={occurrences.filter((task) => task.status === group.status)} />)}</div></aside>;
}
