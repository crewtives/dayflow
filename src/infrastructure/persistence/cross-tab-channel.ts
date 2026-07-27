export interface RevisionNotification { subject: string; generation: number; revision: number; }
export interface CrossTabChannel { publish(notification: RevisionNotification): void; subscribe(listener: (notification: RevisionNotification) => void): () => void; close(): void; }

/** Notifications are hints only; repository reads remain the authority. */
export class BrowserCrossTabChannel implements CrossTabChannel {
  private readonly listeners = new Set<(notification: RevisionNotification) => void>();
  private readonly channel: BroadcastChannel | null;

  constructor(subject: string) {
    this.channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(`dayflow.snapshot.${subject}`);
    this.channel?.addEventListener("message", (event: MessageEvent<unknown>) => {
      const notification = event.data;
      if (isRevisionNotification(notification)) this.listeners.forEach((listener) => listener(notification));
    });
  }
  publish(notification: RevisionNotification): void { this.channel?.postMessage(notification); }
  subscribe(listener: (notification: RevisionNotification) => void): () => void { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  close(): void { this.channel?.close(); this.listeners.clear(); }
}

function isRevisionNotification(value: unknown): value is RevisionNotification {
  return typeof value === "object" && value !== null && typeof (value as RevisionNotification).subject === "string"
    && Number.isInteger((value as RevisionNotification).generation) && Number.isInteger((value as RevisionNotification).revision);
}
