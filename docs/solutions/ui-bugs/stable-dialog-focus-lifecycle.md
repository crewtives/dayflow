---
title: Evitar que callbacks inestables reinicien el ciclo de foco del diálogo
date: 2026-07-27
category: ui-bugs
module: shared-ui
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - "Escribir dentro del drawer devolvía el foco al disparador"
  - "El foco saltaba de nuevo al cerrar el diálogo"
root_cause: async_timing
resolution_type: code_fix
severity: high
tags: [accessibility, dialog, focus, react, webkit]
---

# Evitar que callbacks inestables reinicien el ciclo de foco del diálogo

## Problem

El efecto que controlaba el foco del drawer dependía de un callback `onClose` cuya identidad cambiaba durante renders normales. Cada cambio ejecutaba el cleanup como si el diálogo se hubiera cerrado, devolviendo el foco fuera del modal (session history).

## Symptoms

- Escribir en un campo podía sacar el foco del diálogo.
- Cerrar el drawer podía producir dos movimientos de foco consecutivos.

## What Didn't Work

- Incluir directamente el callback cambiante en las dependencias del efecto: convierte cambios de identidad en reinicios del lifecycle.
- Restaurar el foco de forma inmediata en todos los navegadores: WebKit necesitó una restauración coordinada con el cierre renderizado (session history).

## Solution

Guarda el callback más reciente en un ref y limita el efecto de lifecycle a las dependencias que realmente abren, cierran o cambian el destino de retorno. El diálogo captura el foco previo, mueve el foco inicial dentro del modal, contiene `Tab`, responde a `Escape` y restaura al desmontar (`src/shared/ui/dialog.tsx:8`).

El shell conserva además el elemento disparador y solicita el cierre; `Dialog` restaura el destino desde su cleanup (`src/features/app-shell/components/app-shell.tsx:20`, `src/features/app-shell/components/app-shell.tsx:37`, `src/shared/ui/dialog.tsx:30`).

## Why This Works

Actualizar un ref no dispara el cleanup. El efecto representa el ciclo de vida del diálogo, mientras el ref mantiene fresca la acción de cierre sin convertirla en una señal de apertura o desmontaje.

## Prevention

- Separa callbacks frescos de las señales que gobiernan un efecto.
- Prueba que escribir no mueve el foco y que `Escape` lo devuelve al disparador.
- Mantén el foco inicial, el trap y la restauración como un único contrato observable.

## Related Issues

- `src/features/app-shell/app-shell.test.tsx:16`
- `tests/e2e/visual-parity.spec.ts:13`
