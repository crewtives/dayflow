import type { ReactNode } from "react";
import { DayflowClientProvider } from "@/features/app-shell";

export default function DayflowLayout({ children }: { children: ReactNode }) {
  return <DayflowClientProvider>{children}</DayflowClientProvider>;
}
