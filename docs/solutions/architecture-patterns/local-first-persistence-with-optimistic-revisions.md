---
title: Persistencia local segura con revisiones optimistas
date: 2026-07-27
category: architecture-patterns
module: persistence
problem_type: architecture_pattern
component: development_workflow
severity: high
applies_when:
  - "Los datos viven en el navegador y varias pestañas pueden modificarlos"
  - "Una identidad local separa snapshots sin implicar autenticación"
tags: [local-first, persistence, concurrency, zod, browser-storage]
---

# Persistencia local segura con revisiones optimistas

## Context

Dayflow necesitaba persistencia duradera por navegador sin backend y sin presentar una identidad local como autenticación. Una revisión numérica aislada no era suficiente: dos pestañas podían leer el mismo valor y sobrescribirse si la comparación y la escritura no formaban una operación serializada (session history).

## Guidance

Mantén cuatro responsabilidades separadas:

1. Un proveedor de identidad resuelve un sujeto local opaco.
2. Un puerto define `read`, `mutate` y `reset` sin exponer `localStorage` (`src/ports/dayflow-repository.ts:29`).
3. El adaptador valida los snapshots al leer y valida las mutaciones antes de escribir; `reset` construye un snapshot vacío conforme al esquema (`src/infrastructure/persistence/local-dayflow-repository.ts:20`, `src/infrastructure/persistence/local-dayflow-repository.ts:30`, `src/infrastructure/persistence/local-dayflow-repository.ts:39`).
4. Cada mutación adquiere un lock por sujeto, relee el snapshot y compara la revisión esperada antes de persistir (`src/infrastructure/persistence/local-dayflow-repository.ts:20`).

Las notificaciones entre pestañas solo anuncian que podría existir una versión más nueva. El repositorio sigue siendo la autoridad y el store vuelve a leer antes de aceptar estado (`src/store/create-dayflow-store.ts:40`).

Los bytes corruptos, de versión desconocida o pertenecientes a otro sujeto se preservan y producen un error recuperable; no se reparan ni reemplazan en silencio (`src/infrastructure/persistence/local-dayflow-repository.ts:42`).

## Why This Matters

El patrón evita last-write-wins silencioso, mantiene reemplazables los adaptadores de navegador y permite distinguir fallos de almacenamiento, corrupción y conflictos. También conserva una salida de recuperación: el dato inválido permanece disponible en vez de desaparecer al hidratar.

`generation` y `revision` resuelven problemas distintos. Cada cambio aceptado avanza la revisión; un reset inicia una generación nueva y también avanza la revisión (`src/infrastructure/persistence/local-dayflow-repository.ts:30`). La frescura se compara primero por generación y después por revisión (`src/store/create-dayflow-store.ts:52`).

## When to Apply

- Estado local compartido entre pestañas.
- Persistencia que no puede permitirse sobrescrituras silenciosas.
- Adaptadores futuros que deben sustituir al almacenamiento local sin cambiar las features.

## Examples

```ts
const current = repository.read();
const next = repository.mutate(current.revision, update);
```

La forma importante no es la API concreta, sino la secuencia atómica: lock, relectura, comparación, validación, escritura y notificación.

## Related

- `src/infrastructure/persistence/local-dayflow-repository.test.ts:16`
- `src/store/dayflow-store.test.ts:15`
