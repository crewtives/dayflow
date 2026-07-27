import type { Page } from "@playwright/test";

import { seedDayflowSnapshot } from "@/testing/dayflow-seed";

export async function seedDayflow(page: Page, date = "2026-07-27") {
  const subject = "df_e2e_dayflow";
  const snapshot = seedDayflowSnapshot(subject, date);
  await page.addInitScript(({ subject, snapshot }) => {
    window.localStorage.setItem("dayflow.identity.v1", JSON.stringify({ version: 1, subject }));
    window.localStorage.setItem(`dayflow.snapshot.v1.${subject}`, JSON.stringify(snapshot));
    window.localStorage.setItem(`dayflow.onboarding.v1.${subject}`, JSON.stringify({ name: "Prueba", completedAt: "2026-07-27T08:00:00.000Z" }));
  }, { subject, snapshot });
}

export async function completeOnboarding(page: Page) {
  const subject = "df_e2e_dayflow";
  await page.addInitScript((value) => {
    window.localStorage.setItem("dayflow.identity.v1", JSON.stringify({ version: 1, subject: value }));
    window.localStorage.setItem(`dayflow.onboarding.v1.${value}`, JSON.stringify({ name: "Prueba", completedAt: "2026-07-27T08:00:00.000Z" }));
  }, subject);
}
