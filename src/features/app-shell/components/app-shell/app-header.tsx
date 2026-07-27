import Link from "next/link";

import { Button } from "@/shared/ui";

type AppHeaderProps = {
  page: "today" | "week";
  pageTitle: string;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onGoToToday: () => void;
  onNewTask: (trigger: HTMLElement) => void;
};

export function AppHeader({ page, pageTitle, onPreviousDay, onNextDay, onGoToToday, onNewTask }: AppHeaderProps) {
  return <header className="sticky top-0 z-20 grid min-h-24 grid-cols-[1fr_auto] items-center gap-4 border-b border-paper-mid bg-paper/95 px-5 py-4 backdrop-blur md:grid-cols-[1fr_auto_1fr] md:px-7"><div><h2 className="font-label text-xs tracking-[.14em] text-vermilion-deep">JORNADA</h2><h1 className="mt-1 text-3xl font-normal leading-none tracking-tight">{page === "today" ? pageTitle : "Semana"}</h1></div>{page === "today" && <div className="order-3 col-span-2 flex border border-paper-mid md:order-none md:col-span-1"><Button aria-label="Día anterior" onClick={onPreviousDay} tone="quiet">←</Button><Button onClick={onGoToToday} tone="quiet">Hoy</Button><Button aria-label="Día siguiente" onClick={onNextDay} tone="quiet">→</Button></div>}<div className="justify-self-end">{page === "today" ? <Button onClick={(event) => onNewTask(event.currentTarget)}><span aria-hidden="true">＋</span> Nueva tarea</Button> : <Link className="inline-flex min-h-11 items-center border border-vermilion-deep bg-paper px-4 py-2 font-semibold text-vermilion-deep transition hover:bg-vermilion-deep hover:text-paper focus-visible:outline-3 focus-visible:outline-sumi focus-visible:outline-offset-3" href="/today">Volver a hoy</Link>}</div></header>;
}
