import { describe, expect, it } from "vitest";

import {
  IDENTITY_STORAGE_KEY,
  LocalIdentityProvider,
  type IdentityStorage,
  type LockManager,
} from "./local-identity-provider";

class MemoryStorage implements IdentityStorage {
  readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

class QueuedLockManager implements LockManager {
  private tail = Promise.resolve();

  request<T>(_name: string, callback: () => Promise<T>): Promise<T> {
    const result = this.tail.then(callback);
    this.tail = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }
}

describe("LocalIdentityProvider", () => {
  it("creates an opaque subject once and resolves it again after reload", async () => {
    const storage = new MemoryStorage();
    const first = new LocalIdentityProvider({
      storage,
      lockManager: new QueuedLockManager(),
      createSubject: () => "df_q7g4r3t8w9x2",
    });

    const identity = await first.resolve();
    const reloaded = await new LocalIdentityProvider({ storage, lockManager: new QueuedLockManager() }).resolve();

    expect(identity.subject).toBe("df_q7g4r3t8w9x2");
    expect(identity.subject).not.toMatch(/@|name|email/i);
    expect(reloaded).toEqual(identity);
  });

  it("serializes simultaneous first use so tabs converge on one subject", async () => {
    const storage = new MemoryStorage();
    const locks = new QueuedLockManager();
    let nextSubject = 0;
    const createSubject = () => `df_subject${++nextSubject}`;
    const firstTab = new LocalIdentityProvider({ storage, lockManager: locks, createSubject });
    const secondTab = new LocalIdentityProvider({ storage, lockManager: locks, createSubject });

    const [first, second] = await Promise.all([firstTab.resolve(), secondTab.resolve()]);

    expect(first).toEqual(second);
    expect(nextSubject).toBe(1);
  });

  it.each([
    ["corrupt", "not-json", "identity-corrupt"],
    ["unsupported", JSON.stringify({ version: 2, subject: "df_existing" }), "identity-unsupported"],
  ])("preserves %s identity metadata and blocks hydration", async (_caseName, rawValue, code) => {
    const storage = new MemoryStorage();
    storage.setItem(IDENTITY_STORAGE_KEY, rawValue);
    const provider = new LocalIdentityProvider({ storage, lockManager: new QueuedLockManager() });

    await expect(provider.resolve()).rejects.toMatchObject({ code });
    expect(storage.getItem(IDENTITY_STORAGE_KEY)).toBe(rawValue);
  });

  it("treats denied storage reads and writes as identity-boundary failures", async () => {
    const deniedRead: IdentityStorage = {
      getItem: () => {
        throw new DOMException("denied", "SecurityError");
      },
      setItem: () => undefined,
    };
    const quotaLimited: IdentityStorage = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException("quota", "QuotaExceededError");
      },
    };

    await expect(new LocalIdentityProvider({ storage: deniedRead, lockManager: new QueuedLockManager() }).resolve()).rejects.toMatchObject({
      code: "storage-unavailable",
    });
    await expect(new LocalIdentityProvider({ storage: quotaLimited, lockManager: new QueuedLockManager() }).resolve()).rejects.toMatchObject({
      code: "storage-unavailable",
    });
  });

  it("fails closed when browser locks are unavailable instead of risking a fork", async () => {
    await expect(new LocalIdentityProvider({ storage: new MemoryStorage(), lockManager: null }).resolve()).rejects.toMatchObject({
      code: "lock-unavailable",
    });
  });
});
