"use client";

import { useState, type ReactNode } from "react";

import { LocalIdentityProvider } from "@/infrastructure/identity/local-identity-provider";
import { DayflowProvider } from "@/store/dayflow-provider";
import { OnboardingFlow } from "@/features/onboarding";

export function DayflowClientProvider({ children }: { children: ReactNode }) {
  const [identityProvider] = useState(() => new LocalIdentityProvider());
  return <DayflowProvider identityProvider={identityProvider}>{children}<OnboardingFlow /></DayflowProvider>;
}
