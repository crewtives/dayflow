import { DayflowRepositoryError } from "@/ports/dayflow-repository";

export interface SubjectLockManager { request<T>(name: string, callback: () => Promise<T>): Promise<T>; }

export class BrowserSubjectLock {
  constructor(private readonly subject: string, private readonly manager: SubjectLockManager | null | undefined = browserLockManager()) {}

  run<T>(operation: () => Promise<T>): Promise<T> {
    if (!this.manager) return Promise.reject(new DayflowRepositoryError("lock-unavailable", "Dayflow cannot safely write because browser locking is unavailable."));
    return this.manager.request(`dayflow.snapshot.${this.subject}`, operation);
  }
}

function browserLockManager(): SubjectLockManager | null {
  if (typeof navigator === "undefined" || !navigator.locks) return null;
  return { request: <T>(name: string, callback: () => Promise<T>) => navigator.locks.request(name, (() => callback()) as never) as Promise<T> };
}
