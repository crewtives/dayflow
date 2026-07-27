---
title: Componer features con regiones privadas y orquestación en la raíz
date: 2026-07-27
category: architecture-patterns
module: frontend-features
problem_type: architecture_pattern
component: development_workflow
severity: medium
applies_when:
  - "Un componente raíz mezcla varias regiones semánticas"
  - "Hooks, foco o feedback coordinan más de una región"
tags: [react, feature-boundaries, composition, state-ownership, accessibility]
---

# Componer features con regiones privadas y orquestación en la raíz

## Context

Los roots de varias features acumulaban JSX monolítico. Extraer hojas sin una regla de ownership podía dispersar efectos, persistencia y callbacks; introducir Context o un bus global para árboles poco profundos añadía otra capa de estado sin una necesidad demostrada (session history).

## Guidance

Conserva en el root exportado:

- hooks y efectos compartidos;
- estado efímero observable por varias regiones;
- persistencia y comandos;
- foco, feedback y callbacks entre regiones.

Extrae regiones semánticas privadas bajo `components/<root-name>/` y conéctalas mediante props explícitas. No las exportes desde `index.ts` (`docs/architecture/feature-protocol.md:21`).

Los consumidores externos importan únicamente el barrel de la feature. ESLint rechaza imports a internals tanto por alias como por rutas relativas (`eslint.config.mjs:10`).

Coloca el estado según lifetime: datos duraderos y compartidos en el store, estado navegable en la URL y drawers, drafts, hover, drag, foco o feedback en la feature que los coordina. `AppShell` muestra este reparto al mantener drawer, foco y anuncios en su raíz mientras delega regiones visuales (`src/features/app-shell/components/app-shell.tsx:17`).

## Why This Matters

La raíz sigue contando la historia del comportamiento completo y las hojas reducen ruido visual sin convertirse en nuevas autoridades. Las APIs públicas permanecen pequeñas, los cambios internos no se propagan entre features y la accesibilidad conserva un coordinador claro.

## When to Apply

- El JSX oculta las regiones importantes del flujo.
- Varias regiones comparten callbacks o efectos.
- La API pública no necesita exponer las piezas internas.

No introduzcas Context solo para evitar una cadena corta de props. Hazlo cuando exista un contrato profundo y compartido demostrado.

## Examples

```text
components/task-drawer.tsx
components/task-drawer/task-drawer-header.tsx
components/task-drawer/task-drawer-form.tsx
```

El root gestiona draft, submit, error y cierre; header y form reciben contratos estrechos (`src/features/tasks/components/task-drawer.tsx:13`).

## Related

- `docs/architecture/feature-protocol.md`
- `docs/plans/2026-07-27-002-refactor-feature-compound-components-plan.md`

