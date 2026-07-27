"use client";

import { useDayflowStore } from "./dayflow-provider";
import { selectHydrationStatus, selectPersistenceError } from "./dayflow-selectors";

export function useDayflowHydration() { return { status: useDayflowStore(selectHydrationStatus), error: useDayflowStore(selectPersistenceError) }; }
