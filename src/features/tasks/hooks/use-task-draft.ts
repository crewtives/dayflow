"use client";

import { useState } from "react";
import type { CalendarDate, Task, TaskDraft } from "@/domain/dayflow";

function blank(date: CalendarDate): TaskDraft { return { title: "", date, startMinute: null, endMinute: null, status: "pending", recurrence: "none" }; }
export function useTaskDraft(date: CalendarDate, task?: Task) {
  const [draft, setDraft] = useState<TaskDraft>(() => task ?? blank(date));
  const reset = (nextDate = date) => setDraft(task ?? blank(nextDate));
  return { draft, setDraft, reset };
}
