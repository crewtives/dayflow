"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { DayNavigation } from "@/features/navigation";
import { TaskDrawer } from "@/features/tasks";
import { datePresentation, useSelectedDate } from "@/features/today";
import { LiveRegion } from "@/shared/ui";
import type { Task } from "@/domain/dayflow";
import { useDayflowHydration } from "@/store/use-dayflow-hydration";

import { AppHeader } from "./app-shell/app-header";
import { AppSidebar } from "./app-shell/app-sidebar";
import { HydrationErrorState } from "./app-shell/hydration-error-state";
import { MobileNewTaskButton } from "./app-shell/mobile-new-task-button";
import { TodayContent } from "./app-shell/today-content";

export function AppShell({ children, page }: { children?: ReactNode; page: "today" | "week" }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [returnFocusTo, setReturnFocusTo] = useState<HTMLElement | null>(null);
  const [restoreFocus, setRestoreFocus] = useState(false);
  const [feedback, setFeedback] = useState("");
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);
  const { selectedDate, today, previousDay, nextDay, goToToday } = useSelectedDate();
  const selectedDay = datePresentation(selectedDate, today);
  const { status } = useDayflowHydration();
  useEffect(() => { if (restoreFocus) returnFocusRef.current?.focus(); }, [restoreFocus]);
  useEffect(() => () => { if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current); }, []);
  const announce = useCallback((message: string) => {
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    setFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(""), 3600);
  }, []);
  const openNew = useCallback((trigger: HTMLElement) => { returnFocusRef.current = trigger; setReturnFocusTo(trigger); setEditingTask(undefined); setDrawerOpen(true); }, []);
  const openEdit = useCallback((task: Task, trigger: HTMLElement) => { returnFocusRef.current = trigger; setReturnFocusTo(trigger); setEditingTask(task); setDrawerOpen(true); }, []);
  const closeDrawer = useCallback(() => {
    returnFocusRef.current?.focus();
    setDrawerOpen(false);
    setEditingTask(undefined);
    setRestoreFocus(true);
  }, []);
  if (status === "error" || status === "conflict") return <HydrationErrorState />;
  return <div className="min-h-screen md:grid md:grid-cols-[244px_minmax(0,1fr)]"><a className="fixed left-3 top-3 z-[60] -translate-y-40 bg-sumi px-3 py-2 text-paper focus:translate-y-0" href="#main-content">Saltar al contenido</a><AppSidebar onFeedback={announce} selectedDate={selectedDate} /><div className="min-w-0 md:col-start-2"><AppHeader onGoToToday={goToToday} onNewTask={openNew} onNextDay={nextDay} onPreviousDay={previousDay} page={page} pageTitle={selectedDay.pageTitle} /><main id="main-content" tabIndex={-1}>{page === "today" ? <TodayContent agendaKicker={selectedDay.agendaKicker} agendaTitle={selectedDay.agendaTitle} date={selectedDate} onEdit={openEdit} onFeedback={announce} /> : children}</main></div>{page === "today" && <MobileNewTaskButton onNewTask={openNew} />}<DayNavigation mobile />{page === "today" && <TaskDrawer date={selectedDate} key={editingTask?.id ?? selectedDate} onClose={closeDrawer} onFeedback={announce} open={drawerOpen} returnFocusTo={returnFocusTo} task={editingTask} />}<LiveRegion message={feedback} /></div>;
}
