import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/today",
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/store/dayflow-provider", () => ({
  useDayflowStore: (selector: (state: { snapshot: { tasks: never[]; energyByDate: Record<string, never> }; update: () => Promise<boolean> }) => unknown) => selector({ snapshot: { tasks: [], energyByDate: {} }, update: async () => true }),
}));
import { AppShell } from "./components/app-shell";

describe("AppShell", () => {
  it("keeps focus in the title while typing, traps the drawer, and restores the trigger", async () => {
    const user = userEvent.setup(); render(<AppShell page="today" />);
    const trigger = screen.getAllByRole("button", { name: /nueva tarea/i })[0]; await user.click(trigger);
    const dialog = screen.getByRole("dialog"); const title = within(dialog).getByLabelText("Título"); expect(dialog).toBeVisible(); expect(title).toHaveFocus();
    await user.type(title, "Preparar propuesta"); expect(title).toHaveFocus(); expect(title).toHaveValue("Preparar propuesta");
    await user.tab({ shift: true }); expect(within(dialog).getByLabelText("Cerrar formulario")).toHaveFocus();
    await user.tab({ shift: true }); expect(screen.getByRole("button", { name: /guardar evento/i })).toHaveFocus();
    await user.keyboard("{Escape}"); expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); expect(trigger).toHaveFocus();
  });
  it("exposes one named energy radiogroup with roving focus", async () => {
    const user = userEvent.setup(); render(<AppShell page="today" />);
    const group = screen.getAllByRole("radiogroup", { name: "Nivel de energía" })[0]; const first = screen.getAllByRole("radio", { name: /muy baja/i })[0]; first.focus(); await user.keyboard("{ArrowRight}");
    expect(group).toBeInTheDocument(); expect(within(group).getByRole("radio", { name: "2Baja" })).toHaveFocus();
  });
});
