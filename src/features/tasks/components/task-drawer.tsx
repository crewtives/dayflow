"use client";

import { useCallback, useState, type FormEvent } from "react";

import type { CalendarDate, Task } from "@/domain/dayflow";
import { Dialog } from "@/shared/ui";

import { useTaskActions } from "../hooks/use-task-actions";
import { useTaskDraft } from "../hooks/use-task-draft";
import { TaskDrawerForm } from "./task-drawer/task-drawer-form";
import { TaskDrawerHeader } from "./task-drawer/task-drawer-header";

export function TaskDrawer({ open, onClose, date, task, returnFocusTo, onFeedback }: { open: boolean; onClose: () => void; date: CalendarDate; task?: Task; returnFocusTo?: HTMLElement | null; onFeedback?: (message: string) => void }) {
  const { draft, setDraft, reset } = useTaskDraft(date, task);
  const { create, command } = useTaskActions();
  const [error, setError] = useState("");
  const close = useCallback(() => { reset(date); setError(""); onClose(); }, [date, onClose, reset]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = task ? await command({ type: "edit", id: task.id, changes: draft }) : await create(draft);
    if (!result.ok) { setError(result.message); return; }
    onFeedback?.(task ? "Evento actualizado." : "Evento creado.");
    close();
  };
  return <Dialog onClose={close} open={open} returnFocusTo={returnFocusTo} titleId="drawer-title"><TaskDrawerHeader isEditing={Boolean(task)} onClose={close} /><TaskDrawerForm draft={draft} error={error} onDraftChange={(changes) => setDraft({ ...draft, ...changes })} onSubmit={submit} /></Dialog>;
}
