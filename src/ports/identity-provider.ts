/** A replaceable boundary for resolving the browser's anonymous local subject. */
export interface IdentityProvider {
  resolve(): Promise<LocalIdentity>;
}

/**
 * Deliberately contains only an opaque subject. It is not an authenticated user
 * profile and must never be treated as one.
 */
export interface LocalIdentity {
  readonly subject: string;
}
