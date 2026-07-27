---
title: Calcular eventos de agenda dentro del área útil de la línea temporal
date: 2026-07-27
category: ui-bugs
module: agenda
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - "Los eventos solapados invadían el panel vecino"
  - "Los bloques breves ocultaban título u horario"
root_cause: logic_error
resolution_type: code_fix
severity: medium
tags: [agenda, layout, overlap, css, geometry]
---

# Calcular eventos de agenda dentro del área útil de la línea temporal

## Problem

La anchura porcentual de los carriles se calculaba respecto a toda la agenda aunque una parte estaba reservada para las horas. Además, la altura estrictamente proporcional a la duración hacía ilegibles los eventos breves (session history).

## Symptoms

- Un carril podía sobrepasar el borde derecho de la agenda.
- Eventos breves perdían título u horario aunque su posición temporal fuera correcta.

## What Didn't Work

- Aplicar porcentajes sobre el ancho total: incluía el gutter horario en la base geométrica.
- Ocultar el desbordamiento: tapaba el síntoma sin corregir la anchura.
- Usar solo altura proporcional: preservaba escala temporal pero no contenido mínimo legible.

## Solution

Deriva carriles de solape de forma determinista en dominio, ordenando por inicio, fin e identificador y asignando el primer carril libre (`src/domain/dayflow/agenda.ts:10`).

En presentación, calcula `left` y `width` sobre el área útil que queda después del gutter y de la separación entre carriles. Mantén la posición vertical temporal, pero aplica una altura visual mínima al artículo (`src/features/agenda/components/agenda-timeline/agenda-event.tsx:18`).

## Why This Works

La lógica de dominio decide relaciones de solape sin conocer píxeles; la capa visual traduce carriles a la geometría concreta del layout. Separar ambas evita persistir datos de presentación y permite probar tanto determinismo como límites visuales.

## Prevention

- Añade una prueba E2E que compare el borde derecho del evento con el de la agenda.
- Incluye un caso de duración breve que conserve título y horario visibles.
- No persistas `lane` ni medidas CSS en el snapshot.

## Related Issues

- `src/domain/dayflow/agenda.test.ts:15`
- `tests/e2e/visual-parity.spec.ts:15`

