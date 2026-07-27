import type { IdentityProvider, LocalIdentity } from "@/ports/identity-provider";

import { LOCAL_IDENTITY_SCHEMA_VERSION, localIdentityMetadataSchema, type LocalIdentityMetadata } from "./local-identity-schema";

/** Kept separate from all subject-scoped Dayflow snapshot keys. */
export const IDENTITY_STORAGE_KEY = "dayflow.identity.v1";
const IDENTITY_LOCK_NAME = "dayflow.identity.v1.create";

export interface IdentityStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** Narrow LockManager shape so tests and future browser adapters need no DOM coupling. */
export interface LockManager {
  request<T>(name: string, callback: () => Promise<T>): Promise<T>;
}

export type IdentityProviderErrorCode = "identity-corrupt" | "identity-unsupported" | "storage-unavailable" | "lock-unavailable" | "identity-conflict";

/** A recoverable boundary error. Callers must not hydrate a snapshot after one. */
export class IdentityProviderError extends Error {
  constructor(
    readonly code: IdentityProviderErrorCode,
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "IdentityProviderError";
  }
}

export interface LocalIdentityProviderOptions {
  /** Defaults to browser localStorage when resolving in a browser. */
  storage?: IdentityStorage;
  /** Defaults to the browser Web Locks API. Supplying null explicitly fails closed. */
  lockManager?: LockManager | null;
  /** Test seam; production callers should use the browser cryptographic generator. */
  createSubject?: () => string;
}

/**
 * Browser-local anonymous identity. Metadata failures are intentionally never
 * repaired here: replacing unknown bytes could orphan an existing snapshot.
 */
export class LocalIdentityProvider implements IdentityProvider {
  private readonly storage?: IdentityStorage;
  private readonly lockManager?: LockManager | null;
  private readonly createSubject: () => string;

  constructor(options: LocalIdentityProviderOptions = {}) {
    this.storage = options.storage;
    this.lockManager = options.lockManager;
    this.createSubject = options.createSubject ?? createOpaqueSubject;
  }

  async resolve(): Promise<LocalIdentity> {
    const storage = this.storage ?? browserStorage();
    const existing = readIdentity(storage);
    if (existing) return toLocalIdentity(existing);

    const lockManager = this.lockManager === undefined ? browserLockManager() : this.lockManager;
    if (!lockManager) {
      throw new IdentityProviderError("lock-unavailable", "Dayflow cannot safely create a local identity because browser locking is unavailable.");
    }

    return lockManager.request(IDENTITY_LOCK_NAME, async () => {
      const insideLock = readIdentity(storage);
      if (insideLock) return toLocalIdentity(insideLock);

      const metadata: LocalIdentityMetadata = {
        version: LOCAL_IDENTITY_SCHEMA_VERSION,
        subject: this.createSubject(),
      };
      const validated = localIdentityMetadataSchema.safeParse(metadata);
      if (!validated.success) {
        throw new IdentityProviderError("identity-corrupt", "Dayflow could not create a valid opaque local identity.", validated.error);
      }

      writeIdentity(storage, validated.data);
      const persisted = readIdentity(storage);
      if (!persisted || persisted.subject !== validated.data.subject) {
        throw new IdentityProviderError("identity-conflict", "Dayflow could not confirm the created local identity.");
      }
      return toLocalIdentity(persisted);
    });
  }
}

function readIdentity(storage: IdentityStorage): LocalIdentityMetadata | null {
  let rawValue: string | null;
  try {
    rawValue = storage.getItem(IDENTITY_STORAGE_KEY);
  } catch (error) {
    throw new IdentityProviderError("storage-unavailable", "Dayflow cannot read browser storage for its local identity.", error);
  }
  if (rawValue === null) return null;

  let decoded: unknown;
  try {
    decoded = JSON.parse(rawValue);
  } catch (error) {
    throw new IdentityProviderError("identity-corrupt", "Dayflow found invalid local identity metadata. It has been preserved for recovery.", error);
  }
  if (typeof decoded === "object" && decoded !== null && "version" in decoded && decoded.version !== LOCAL_IDENTITY_SCHEMA_VERSION) {
    throw new IdentityProviderError("identity-unsupported", "Dayflow found a local identity version it cannot safely read. It has been preserved for recovery.");
  }
  const parsed = localIdentityMetadataSchema.safeParse(decoded);
  if (!parsed.success) {
    throw new IdentityProviderError("identity-corrupt", "Dayflow found invalid local identity metadata. It has been preserved for recovery.", parsed.error);
  }
  return parsed.data;
}

function writeIdentity(storage: IdentityStorage, metadata: LocalIdentityMetadata): void {
  try {
    storage.setItem(IDENTITY_STORAGE_KEY, JSON.stringify(metadata));
  } catch (error) {
    throw new IdentityProviderError("storage-unavailable", "Dayflow cannot save its local identity in browser storage.", error);
  }
}

function toLocalIdentity(metadata: LocalIdentityMetadata): LocalIdentity {
  return { subject: metadata.subject };
}

function browserStorage(): IdentityStorage {
  if (typeof window === "undefined") {
    throw new IdentityProviderError("storage-unavailable", "Dayflow local identity is available only in a browser.");
  }
  try {
    return window.localStorage;
  } catch (error) {
    throw new IdentityProviderError("storage-unavailable", "Dayflow cannot access browser storage for its local identity.", error);
  }
}

function browserLockManager(): LockManager | null {
  if (typeof navigator === "undefined" || !navigator.locks) return null;
  return {
    // lib.dom currently types LockGrantedCallback as synchronous, while the Web
    // Locks API intentionally holds a lock until a returned promise settles.
    request: <T>(name: string, callback: () => Promise<T>) => navigator.locks.request(name, (() => callback()) as never) as Promise<T>,
  };
}

function createOpaqueSubject(): string {
  if (!globalThis.crypto?.randomUUID) {
    throw new IdentityProviderError("storage-unavailable", "Dayflow cannot securely create a local identity in this browser.");
  }
  return `df_${globalThis.crypto.randomUUID().replaceAll("-", "")}`;
}
