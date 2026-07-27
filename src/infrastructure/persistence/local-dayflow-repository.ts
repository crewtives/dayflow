import { BrowserSubjectLock, type SubjectLockManager } from "./browser-subject-lock";
import { BrowserCrossTabChannel, type CrossTabChannel } from "./cross-tab-channel";
import { dayflowSnapshotSchema, emptyDayflowSnapshot } from "./dayflow-snapshot-schema";
import { DayflowRepositoryError, type DayflowRepository, type DayflowSnapshot } from "@/ports/dayflow-repository";

export interface SnapshotStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; }
export interface LocalDayflowRepositoryOptions { storage?: SnapshotStorage; lockManager?: SubjectLockManager | null; channel?: CrossTabChannel; }
export const snapshotStorageKey = (subject: string) => `dayflow.snapshot.v1.${subject}`;

export class LocalDayflowRepository implements DayflowRepository {
  private readonly storage: SnapshotStorage;
  private readonly key: string;
  private readonly lock: BrowserSubjectLock;
  private readonly channel: CrossTabChannel;
  constructor(private readonly subject: string, options: LocalDayflowRepositoryOptions = {}) {
    this.storage = options.storage ?? browserStorage(); this.key = snapshotStorageKey(subject);
    this.lock = new BrowserSubjectLock(subject, options.lockManager); this.channel = options.channel ?? new BrowserCrossTabChannel(subject);
  }
  async read(): Promise<DayflowSnapshot> { return this.readUnsafe(); }
  async mutate(expectedRevision: number, mutation: (snapshot: DayflowSnapshot) => Pick<DayflowSnapshot, "tasks" | "energyByDate">): Promise<DayflowSnapshot> {
    return this.lock.run(async () => {
      const current = this.readUnsafe();
      if (current.revision !== expectedRevision) throw new DayflowRepositoryError("conflict", "Dayflow changed in another tab. Refresh before trying again.");
      const changed = mutation(structuredClone(current));
      const next = dayflowSnapshotSchema.safeParse({ ...current, ...changed, revision: current.revision + 1 });
      if (!next.success) throw new DayflowRepositoryError("snapshot-corrupt", "Dayflow refused an invalid update.", next.error);
      this.writeUnsafe(next.data); this.channel.publish(next.data); return next.data;
    });
  }
  async reset(expectedRevision: number): Promise<DayflowSnapshot> {
    return this.lock.run(async () => {
      const current = this.readUnsafe();
      if (current.revision !== expectedRevision) throw new DayflowRepositoryError("conflict", "Dayflow changed in another tab. Refresh before resetting.");
      const next = { ...emptyDayflowSnapshot(this.subject), generation: current.generation + 1, revision: current.revision + 1 };
      this.writeUnsafe(next); this.channel.publish(next); return next;
    });
  }
  close(): void { this.channel.close(); }
  private readUnsafe(): DayflowSnapshot {
    let raw: string | null; try { raw = this.storage.getItem(this.key); } catch (error) { throw new DayflowRepositoryError("storage-unavailable", "Dayflow cannot read browser storage.", error); }
    if (raw === null) return emptyDayflowSnapshot(this.subject);
    let decoded: unknown; try { decoded = JSON.parse(raw); } catch (error) { throw new DayflowRepositoryError("snapshot-corrupt", "Dayflow found invalid saved data. It has been preserved for recovery.", error); }
    if (typeof decoded === "object" && decoded !== null && "schemaVersion" in decoded && (decoded as { schemaVersion: unknown }).schemaVersion !== 1) throw new DayflowRepositoryError("snapshot-unsupported", "Dayflow found saved data from an unsupported version. It has been preserved for recovery.");
    const parsed = dayflowSnapshotSchema.safeParse(decoded); if (!parsed.success) throw new DayflowRepositoryError("snapshot-corrupt", "Dayflow found invalid saved data. It has been preserved for recovery.", parsed.error);
    if (parsed.data.subject !== this.subject) throw new DayflowRepositoryError("subject-mismatch", "Dayflow found data belonging to another local identity. It has been preserved for recovery.");
    return parsed.data;
  }
  private writeUnsafe(snapshot: DayflowSnapshot): void { try { this.storage.setItem(this.key, JSON.stringify(snapshot)); } catch (error) { throw new DayflowRepositoryError("storage-unavailable", "Dayflow could not save this change. Your previous data remains loaded.", error); } }
}
function browserStorage(): SnapshotStorage { if (typeof window === "undefined") throw new DayflowRepositoryError("storage-unavailable", "Dayflow storage is available only in a browser."); try { return window.localStorage; } catch (error) { throw new DayflowRepositoryError("storage-unavailable", "Dayflow cannot access browser storage.", error); } }
