# Guía para agentes — Dayflow

## Propósito y alcance

Dayflow es un MVP web de planificación personal. Ayuda a organizar una jornada, elegir tareas de foco y revisar la energía semanal. No presentes como existentes funciones que el producto no tiene: no hay autenticación, backend, sincronización entre dispositivos, colaboración, integraciones ni IA.

Antes de cambiar interfaz o copy, lee [PRODUCT.md](PRODUCT.md) y [DESIGN.md](DESIGN.md). El principio visual es «el día plegado»: el lenguaje de papel debe reforzar la claridad operativa, no convertir controles en decoración.

## Entorno

- Node.js: `>=24 <25` (consulta `.nvmrc`).
- Gestor de paquetes: pnpm `>=10.19`.
- Framework: Next.js 16, React 19 y TypeScript estricto.

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

Ejecuta la comprobación más estrecha que cubra el cambio durante el trabajo; antes de entregar cambios de comportamiento, ejecuta al menos `pnpm lint`, `pnpm typecheck` y las pruebas relevantes. Para cambios de rutas, persistencia o interacción de navegador, añade `pnpm test:e2e` cuando sea posible.

## Arquitectura y fronteras

```text
src/app/             composición de rutas y layouts; sin reglas de dominio
src/features/        UI, hooks y casos de uso por funcionalidad
src/domain/          entidades y reglas puras, sin React ni navegador
src/ports/           contratos de infraestructura
src/infrastructure/  adaptadores de navegador y persistencia
src/store/           estado de dominio e hidratación
src/shared/          primitivas genéricas reutilizables
docs/solutions/      aprendizajes y soluciones documentadas por categoría, buscables por frontmatter (`module`, `tags`, `problem_type`)
CONCEPTS.md           vocabulario compartido del dominio y sus distinciones
```

- Importa una funcionalidad desde `@/features/<feature>`, nunca desde sus carpetas internas. ESLint lo impone.
- Exporta solo la API pública de una funcionalidad desde su `index.ts`.
- Las reglas de fechas, recurrencias, agenda y resumen semanal pertenecen a `src/domain/dayflow/`.
- El estado persistente y compartido pertenece a `src/store/`; estado efímero de UI (drawer, borrador, foco, hover o feedback) permanece en el componente o funcionalidad.
- Crea adaptadores en `src/infrastructure/` contra un contrato de `src/ports/`; no llames directamente a `localStorage` desde una funcionalidad nueva.
- Consulta [docs/architecture/feature-protocol.md](docs/architecture/feature-protocol.md) para la composición de funcionalidades complejas.
- `docs/solutions/` resulta relevante al implementar, depurar o decidir en áreas ya documentadas; `CONCEPTS.md` orienta las conversaciones y cambios sobre el dominio.

## Patrones importantes

- Las rutas reales son `/today` y `/week`; `/` redirige a hoy.
- Usa el alias `@/*` para imports desde `src/`.
- Mantén los componentes complejos compuestos por regiones privadas bajo `components/<root-name>/` y deja la orquestación, efectos y callbacks compartidos en su raíz.
- Conserva accesibilidad: foco visible, etiquetas persistentes, mensajes de error en texto y anuncios mediante `LiveRegion` cuando una acción requiera feedback.
- La persistencia local valida los snapshots con Zod, usa revisiones y avisa entre pestañas. No debilites esos controles para simplificar una mutación.

## Pruebas

- Coloca pruebas unitarias junto al módulo (`*.test.ts` o `*.test.tsx`).
- Añade pruebas de dominio para reglas puras y pruebas de infraestructura para fallos o conflictos de persistencia.
- Usa Testing Library para componentes y Playwright en `tests/e2e/` cuando el comportamiento atraviese rutas, almacenamiento o entradas del navegador.
- Para cambios de comportamiento, busca primero la prueba existente y actualízala o amplíala; no dupliques cobertura sin motivo.

## Forma de trabajar

1. Inspecciona la implementación y las pruebas relacionadas antes de editar.
2. Mantén el cambio acotado; evita reformateos o refactors ajenos a la tarea.
3. Sigue las convenciones y nombres del módulo más parecido.
4. Verifica el resultado y comunica con precisión qué cambió y qué comando pasó.

No sobrescribas cambios ajenos, no uses comandos destructivos de Git y no hagas commits, pushes o PRs salvo que se solicite expresamente.
