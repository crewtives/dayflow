import { BrowserCrossTabChannel } from "@/infrastructure/persistence/cross-tab-channel";
import { LocalDayflowRepository } from "@/infrastructure/persistence/local-dayflow-repository";
import type { LocalIdentity } from "@/ports/identity-provider";

import { createDayflowStore, type DayflowStore } from "./create-dayflow-store";

/** Create once after identity resolution; never create this store during render. */
export function createSubjectDayflowStore(identity: LocalIdentity): DayflowStore {
  const channel = new BrowserCrossTabChannel(identity.subject);
  return createDayflowStore({ subject: identity.subject, channel, repository: new LocalDayflowRepository(identity.subject, { channel }) });
}

export type { DayflowStore, DayflowStoreState, DayflowHydrationStatus } from "./create-dayflow-store";
