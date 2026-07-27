type MobileNewTaskButtonProps = { onNewTask: (trigger: HTMLElement) => void };

export function MobileNewTaskButton({ onNewTask }: MobileNewTaskButtonProps) {
  return <button aria-label="Nueva tarea" className="fixed bottom-4 right-4 z-40 grid size-14 place-items-center rounded-full bg-vermilion text-2xl text-paper shadow-fold md:hidden" onClick={(event) => onNewTask(event.currentTarget)}>＋</button>;
}
