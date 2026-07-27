import type { Task, TaskStatus } from "@/domain/dayflow";

type TaskRailGroupProps = {
  name: string;
  tasks: Task[];
  onEdit: (task: Task, trigger: HTMLElement) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
};

export function TaskRailGroup({ name, tasks, onEdit, onStatusChange }: TaskRailGroupProps) {
  return <section className="border-t border-vermilion-wash"><header className="flex min-h-12 items-center justify-between"><h3 className="font-label text-xs tracking-[.1em]">{name.toUpperCase()}</h3><span className="grid size-6 place-items-center rounded-full border border-paper-mid text-xs">{tasks.length}</span></header><ul className="grid gap-2">{tasks.map((task) => <li className="flex border border-paper-mid bg-paper" key={task.id}><button className="min-h-11 min-w-0 flex-1 p-3 text-left text-sm focus-visible:outline-3 focus-visible:outline-sumi" onClick={(event) => onEdit(task, event.currentTarget)}><span className={task.status === "done" ? "line-through" : ""}>{task.title}</span></button><select aria-label={`Cambiar estado de ${task.title}`} className="min-h-11 border-l border-paper-mid bg-paper px-3 text-xs text-sumi-soft focus-visible:outline-3 focus-visible:outline-sumi" onChange={(event) => onStatusChange(task, event.target.value as TaskStatus)} value={task.status}><option value="pending">Pendiente</option><option value="focus">En foco</option><option value="done">Hecho</option></select></li>)}</ul></section>;
}
