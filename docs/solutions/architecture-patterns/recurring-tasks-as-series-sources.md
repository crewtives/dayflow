---
title: Modelar la recurrencia como una única fuente de serie
date: 2026-07-27
category: architecture-patterns
module: dayflow-domain
problem_type: architecture_pattern
component: development_workflow
severity: high
applies_when:
  - "Una tarea recurrente aparece en varias fechas"
  - "Las ocurrencias no admiten excepciones independientes"
tags: [recurrence, domain-model, tasks, projections, calendar]
---

# Modelar la recurrencia como una única fuente de serie

## Context

Al migrar el prototipo había que decidir si cada aparición recurrente sería una entidad independiente o una proyección. Crear copias o excepciones por aparición introducía una segunda autoridad y divergía del comportamiento validado; Dayflow eligió una sola tarea fuente para toda la serie (session history).

## Guidance

Persiste una tarea recurrente una sola vez y deriva sus ocurrencias para la fecha consultada. `occursOn` determina si la fuente aparece en un día y nunca proyecta antes de su fecha de inicio (`src/domain/dayflow/recurrence.ts:4`). `tasksOccurringOn` devuelve las fuentes que ocurren ese día, no copias persistibles (`src/domain/dayflow/recurrence.ts:19`).

Los comandos editan, mueven, cambian de estado o eliminan la fuente identificada. El resultado reemplaza esa tarea dentro de una colección nueva (`src/domain/dayflow/commands.ts:14`).

## Why This Matters

Una única fuente elimina divergencias entre apariciones y mantiene los agregados semanales derivados del mismo dato. También hace explícita una limitación del modelo: completar una serie afecta cómo se interpreta en todas sus ocurrencias; no existe completion independiente por día.

Esa limitación debe tratarse como contrato de producto, no como detalle accidental. Si aparecen excepciones por ocurrencia, harán falta una entidad y unas reglas nuevas en vez de mutaciones especiales ocultas.

## When to Apply

- La recurrencia representa una serie homogénea.
- Editar una aparición debe modificar toda la serie.
- No hay excepciones, cancelaciones ni estados independientes por fecha.

## Examples

```ts
const visibleTasks = tasksOccurringOn(seriesSources, selectedDate);
const result = applyTaskCommand(seriesSources, {
  type: "set-status",
  id: sourceId,
  status: "done",
});
```

## Related

- `src/domain/dayflow/recurrence.test.ts:15`
- `src/domain/dayflow/task.test.ts:43`

