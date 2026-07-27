import { describe, expect, it } from "vitest";

import { datePresentation, formatDay } from "./date-presentation";

describe("date presentation", () => {
  it("makes a selected calendar day explicit in Spanish", () => {
    expect(formatDay("2026-07-29")).toBe("Miércoles, 29 de julio");
    expect(datePresentation("2026-07-29", "2026-07-27")).toEqual({ agendaKicker: "HOJA / MIÉRCOLES, 29 DE JULIO", agendaTitle: "Agenda · Miércoles, 29 de julio", pageTitle: "Miércoles, 29 de julio" });
  });

  it("keeps the compact today language only for today", () => {
    expect(datePresentation("2026-07-27", "2026-07-27")).toEqual({ agendaKicker: "HOJA / HOY", agendaTitle: "Agenda del día", pageTitle: "Hoy" });
  });
});
