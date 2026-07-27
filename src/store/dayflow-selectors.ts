import type { DayflowStoreState } from "./create-dayflow-store";

export const selectSnapshot = (state: DayflowStoreState) => state.snapshot;
export const selectTasks = (state: DayflowStoreState) => state.snapshot?.tasks ?? [];
export const selectEnergyByDate = (state: DayflowStoreState) => state.snapshot?.energyByDate ?? {};
export const selectHydrationStatus = (state: DayflowStoreState) => state.status;
export const selectPersistenceError = (state: DayflowStoreState) => state.error;
