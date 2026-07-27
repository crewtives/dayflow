import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AppShell } from "./components/app-shell";

describe("AppShell", () => {
  it("opens a modal drawer, traps focus, closes with Escape, and restores the trigger", async () => {
    const user = userEvent.setup(); render(<AppShell page="today" />);
    const trigger = screen.getAllByRole("button", { name: /nueva tarea/i })[0]; await user.click(trigger);
    const dialog = screen.getByRole("dialog"); expect(dialog).toBeVisible(); expect(within(dialog).getByLabelText("Cerrar formulario")).toHaveFocus();
    await user.tab({ shift: true }); expect(screen.getByRole("button", { name: /guardar evento/i })).toHaveFocus();
    await user.keyboard("{Escape}"); expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); expect(trigger).toHaveFocus();
  });
  it("exposes one named energy radiogroup with roving focus", async () => {
    const user = userEvent.setup(); render(<AppShell page="today" />);
    const group = screen.getAllByRole("radiogroup", { name: "Nivel de energía" })[0]; const first = screen.getAllByRole("radio", { name: /muy baja/i })[0]; first.focus(); await user.keyboard("{ArrowRight}");
    expect(group).toBeInTheDocument(); expect(within(group).getByRole("radio", { name: "2Baja" })).toHaveFocus();
  });
});
