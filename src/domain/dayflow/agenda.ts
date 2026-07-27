import type { Task } from "./task";

export interface AgendaTask extends Task {
  startMinute: number;
  endMinute: number;
  lane: number;
  totalLanes: number;
}

export function agendaLanes(tasks: readonly Task[]): AgendaTask[] {
  const scheduled = tasks
    .filter((task): task is Task & { startMinute: number; endMinute: number } => task.startMinute !== null && task.endMinute !== null)
    .sort((left, right) => left.startMinute - right.startMinute || left.endMinute - right.endMinute || left.id.localeCompare(right.id));
  const active: AgendaTask[] = [];
  const result: AgendaTask[] = [];

  for (const task of scheduled) {
    for (let index = active.length - 1; index >= 0; index -= 1) {
      if (active[index].endMinute <= task.startMinute) active.splice(index, 1);
    }
    let lane = 0;
    while (active.some((item) => item.lane === lane)) lane += 1;
    const agendaTask: AgendaTask = { ...task, lane, totalLanes: lane + 1 };
    active.push(agendaTask);
    result.push(agendaTask);
    const totalLanes = Math.max(...active.map((item) => item.lane)) + 1;
    for (const item of active) item.totalLanes = Math.max(item.totalLanes, totalLanes);
  }
  return result;
}
