import { z } from "zod";

export const LOCAL_IDENTITY_SCHEMA_VERSION = 1;

export const localIdentityMetadataSchema = z
  .object({
    version: z.literal(LOCAL_IDENTITY_SCHEMA_VERSION),
    subject: z.string().regex(/^df_[A-Za-z0-9_-]{8,}$/, "subject must be an opaque Dayflow identifier"),
  })
  .strict();

export type LocalIdentityMetadata = z.infer<typeof localIdentityMetadataSchema>;
