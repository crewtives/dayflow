import { expect, test } from "@playwright/test";

test("the root route redirects to the Spanish Dayflow shell", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/today$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { name: /jornada/i })).toBeVisible();
});
