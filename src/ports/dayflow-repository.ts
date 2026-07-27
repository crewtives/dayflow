import type { EnergyByDate, Task } from "@/domain/dayflow";

export const DAYFLOW_SCHEMA_VERSION = 1;

export interface DayflowSnapshot {
  subject: string;
  schemaVersion: typeof DAYFLOW_SCHEMA_VERSION;
  generation: number;
  revision: number;
  tasks: Task[];
  energyByDate: EnergyByDate;
}

export type DayflowRepositoryErrorCode =
  | "snapshot-corrupt"
  | "snapshot-unsupported"
  | "subject-mismatch"
  | "storage-unavailable"
  | "lock-unavailable"
  | "conflict";

export class DayflowRepositoryError extends Error {
  constructor(readonly code: DayflowRepositoryErrorCode, message: string, readonly cause?: unknown) {
    super(message);
    this.name = "DayflowRepositoryError";
  }
}

export interface DayflowRepository {
  read(): Promise<DayflowSnapshot>;
  mutate(expectedRevision: number, mutation: (snapshot: DayflowSnapshot) => Pick<DayflowSnapshot, "tasks" | "energyByDate">): Promise<DayflowSnapshot>;
  reset(expectedRevision: number): Promise<DayflowSnapshot>;
}
