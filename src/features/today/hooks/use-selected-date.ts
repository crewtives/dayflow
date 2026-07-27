"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { addCalendarDays, isCalendarDate, type CalendarDate } from "@/domain/dayflow";

function localToday(): CalendarDate {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function useSelectedDate() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const today = useMemo(() => localToday(), []);
  const selectedDate = isCalendarDate(searchParams.get("date") ?? "") ? searchParams.get("date") as CalendarDate : today;
  const setSelectedDate = useCallback((date: CalendarDate) => {
    const params = new URLSearchParams(searchParams.toString());
    if (date === today) params.delete("date"); else params.set("date", date);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams, today]);
  return { selectedDate, today, setSelectedDate, previousDay: () => setSelectedDate(addCalendarDays(selectedDate, -1)), nextDay: () => setSelectedDate(addCalendarDays(selectedDate, 1)), goToToday: () => setSelectedDate(today) };
}
