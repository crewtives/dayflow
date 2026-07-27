import { expect, test } from "@playwright/test";
import { completeOnboarding, seedDayflow } from "./support/seed-dayflow";

test("today and week use the Dayflow shell", async ({ page }) => { await completeOnboarding(page); await page.goto("/today"); await expect(page.getByRole("heading", { name: "Agenda del día" })).toBeVisible(); await expect(page.getByRole("link", { name: "Hoy" })).toHaveAttribute("aria-current", "page"); await page.goto("/week"); await expect(page.getByRole("heading", { name: "La forma de tu semana" })).toBeVisible(); await expect(page.getByRole("link", { name: "Semana" })).toHaveAttribute("aria-current", "page"); });

test("a selected day is named in the page and agenda headings", async ({ page }) => {
  await completeOnboarding(page); await page.goto("/today?date=2026-07-29");
  await expect(page.getByRole("heading", { level: 1, name: "Miércoles, 29 de julio" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Agenda · Miércoles, 29 de julio" })).toBeVisible();
  await expect(page.getByText("HOJA / MIÉRCOLES, 29 DE JULIO")).toBeVisible();
});

test("mobile today has no horizontal overflow and the drawer restores focus", async ({ page }) => { await completeOnboarding(page); await page.setViewportSize({ width: 393, height: 852 }); await page.goto("/today"); expect(await page.locator("html").evaluate((node) => node.scrollWidth <= window.innerWidth)).toBeTruthy(); const trigger = page.getByRole("button", { name: "Nueva tarea" }).last(); await trigger.focus(); await trigger.click(); await expect(page.getByRole("dialog")).toBeVisible(); await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).toHaveCount(0); await expect(trigger).toBeFocused(); });

test("agenda events stay inside the timeline and mutations confirm their result", async ({ page }) => {
  await seedDayflow(page); await page.goto("/today");
  const agenda = page.getByRole("heading", { name: "Agenda del día" }).locator("../..");
  const event = page.getByRole("article", { name: /Preparar propuesta/ });
  const [agendaBox, eventBox] = await Promise.all([agenda.boundingBox(), event.boundingBox()]);
  expect(agendaBox).not.toBeNull(); expect(eventBox).not.toBeNull();
  expect(eventBox!.x + eventBox!.width).toBeLessThanOrEqual(agendaBox!.x + agendaBox!.width);
  await page.getByLabel("Cambiar estado de Preparar propuesta").selectOption("focus");
  await expect(page.locator("div.fixed[role='status']")).toHaveText("Preparar propuesta: en foco.");
});

test("short agenda events keep their title and time visible", async ({ page }) => {
  await seedDayflow(page); await page.addInitScript(() => {
    const subject = "df_e2e_dayflow";
    const key = `dayflow.snapshot.v1.${subject}`;
    const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "{}");
    snapshot.tasks.push({ id: "seed-short", title: "Bloque breve", date: "2026-07-27", startMinute: 720, endMinute: 723, status: "pending", recurrence: "none" });
    window.localStorage.setItem(key, JSON.stringify(snapshot));
  });
  await page.goto("/today");
  const event = page.getByRole("article", { name: "Bloque breve, 12:00 a 12:03" });
  await expect(event).toBeVisible(); await expect(event.getByText("12:00–12:03")).toBeVisible();
  expect((await event.boundingBox())?.height).toBeGreaterThanOrEqual(56);
});
