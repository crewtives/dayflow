import { expect, test } from "@playwright/test";

test("first use collects a name and turns daily routines into real tasks", async ({ page }) => {
  await page.goto("/today");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "¿Cómo quieres que te llamemos?" })).toBeVisible();
  await dialog.getByLabel("Tu nombre").fill("Migue");
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByLabel("Tarea cotidiana 1").fill("Revisar prioridades");
  await dialog.getByRole("button", { name: "Elegir periodo" }).click();
  await dialog.getByRole("button", { name: "Crear mi agenda" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { exact: true, name: "Revisar prioridades" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
