# Dayflow

> Una jornada que toma forma mediante decisiones deliberadas.

Dayflow es un MVP web para profesionales independientes y estudiantes que quieren convertir una lista de pendientes en un plan diario realista. En vez de limitarse a almacenar tareas, ayuda a decidir qué merece foco, cuándo encaja en el día y cómo evoluciona la energía a lo largo de la semana.

Este repositorio contiene la versión funcional del prototipo: una aplicación Next.js en español, con datos locales del navegador y sin servicios externos.

## La idea

Una lista de tareas no responde por sí sola a las preguntas que realmente importan al comenzar el día: «¿qué debo hacer primero?», «¿cuándo cabe?» y «¿tengo energía para ello?». Dayflow reúne esas decisiones en un único flujo:

1. Preparar la jornada en una agenda visual de 08:00 a 19:00.
2. Crear tareas, asignarlas a una hora o dejarlas pendientes, y repetirlas diaria, semanalmente o solo en días laborables.
3. Marcar lo que está `En foco` para que la prioridad sea visible.
4. Registrar y consultar la energía de la semana como contexto para planificar, no como una métrica de rendimiento.

El resultado no pretende ser otro gestor de proyectos. Es una herramienta de planificación personal que hace explícita la relación entre tiempo, atención y energía.

## Qué incluye el MVP

- Onboarding de tres pasos para nombre, rutinas y fecha inicial.
- Vista **Hoy** con navegación por fechas, agenda, tareas y creación/edición en un drawer accesible.
- Bloques de 30 minutos, validación de horarios y representación explícita de eventos solapados.
- Tareas `Pendiente`, `En foco` y `Hecho`, con recurrencia `none`, `daily`, `weekdays` o `weekly`.
- Vista **Semana** para revisar el resumen energético.
- Persistencia en `localStorage`, validación de los snapshots, control de revisiones y actualización entre pestañas del mismo navegador.
- Estados de carga, error y conflicto; enlace para saltar al contenido y mensajes anunciados para tecnologías asistivas.

## Límites intencionados

Es un MVP de validación, no un producto conectado a cuentas reales. No incorpora autenticación, backend, sincronización entre dispositivos, colaboración, integraciones externas, IA ni aplicación móvil nativa. Los datos se guardan únicamente en el navegador del usuario.

## Diseño: «el día plegado»

La dirección visual parte de una idea sencilla: cada día es una hoja que toma forma con las decisiones que se hacen sobre ella. De ahí salen el papel claro, la tinta oscura, las líneas de pliegue y una geometría casi cuadrada. El vermellón indica intención, acción y foco; el punto dorado se reserva para una única referencia activa en cada región.

La metáfora está al servicio de la operación: no reemplaza etiquetas, controles conocidos ni jerarquía. En escritorio, agenda y tareas comparten una misma superficie; en móvil, esa hoja se repliega en una secuencia vertical. La especificación completa está en [DESIGN.md](DESIGN.md) y la definición de producto en [PRODUCT.md](PRODUCT.md).

## Desarrollo en una sesión de cuatro horas

Dayflow se construyó en una única sesión de cuatro horas combinando dos marcos complementarios: **Impeccable** para convertir una intención de producto en una experiencia visual coherente y **Compound Engineering** para llevarla a una implementación verificable y mantenible.

No se trató de añadir una capa estética al final. La idea de producto, las restricciones del MVP, el diseño, el código y las pruebas se fueron concretando en el mismo ciclo.

### 1. Enmarcar el producto

Primero se definió el problema: el usuario no necesita acumular tareas, sino decidir qué atención y energía dedicar a su día. Se fijaron los usuarios principales, el flujo esencial y los límites del MVP. Esta definición evita presentar como reales integraciones o datos que todavía no existen y queda recogida en `PRODUCT.md`.

### 2. Convertir la idea en una dirección visual

Con los pasos de Impeccable se estableció una dirección creativa concreta —**«el día plegado»**— y no una colección de decisiones decorativas. Se documentaron paleta, tipografía, espaciado, estados, reglas de accesibilidad y límites visuales en `DESIGN.md`. Entre las decisiones relevantes están:

- vermellón para foco y acciones, no para adornar toda la pantalla;
- un solo punto dorado por región para no diluir el estado activo;
- separación mediante retícula, reglas y cambios de superficie antes que tarjetas flotantes;
- controles reconocibles, foco visible y errores expresados también con texto.

### 3. Crear una base técnica reemplazable

La aplicación se migró a Next.js 16, React 19 y TypeScript estricto. Antes de construir los flujos, se modeló el dominio sin depender de React: tareas, fechas, recurrencias, energía, agenda y resumen semanal. Eso permite probar reglas como los horarios válidos, la recurrencia y los solapamientos de forma aislada.

Después se declararon puertos para identidad y persistencia, y se implementaron adaptadores de navegador. La identidad local delimita los datos; el repositorio local valida cada snapshot, usa revisiones para detectar conflictos y comunica cambios entre pestañas.

### 4. Componer por funcionalidades

Compound Engineering guio la separación de responsabilidades y la entrega en unidades pequeñas y comprobables:

- `src/domain/`: reglas puras de negocio.
- `src/ports/`: contratos de identidad y almacenamiento.
- `src/infrastructure/`: `localStorage`, bloqueo del sujeto y canal entre pestañas.
- `src/store/`: estado de dominio con Zustand e hidratación.
- `src/features/`: onboarding, agenda, energía, navegación, tareas, hoy y semana.
- `src/app/`: rutas y composición de Next.js.
- `src/shared/`: primitivas de interfaz reutilizables.

Cada funcionalidad expone una API pública desde su propio `index.ts`. El lint bloquea los imports a internals de otras funcionalidades, una regla que ayuda a conservar las fronteras del sistema cuando el MVP crezca. El protocolo de estas decisiones vive en [docs/architecture/feature-protocol.md](docs/architecture/feature-protocol.md).

### 5. Hacer interactivo el flujo principal

Sobre esa base se conectaron los recorridos que hacen útil el prototipo: onboarding, creación y edición de tareas, agenda con eventos concurrentes, navegación temporal, selección de foco, resumen semanal y recuperación de errores. Las decisiones temporales de la interfaz —por ejemplo, abrir un drawer o restaurar el foco— se mantienen cerca del componente; los datos compartidos y persistentes se mantienen en el store.

### 6. Verificar en cada capa

El proceso incorporó pruebas de dominio, infraestructura, estado y componentes, además de pruebas end-to-end con Playwright. La intención fue comprobar el comportamiento donde vive: una regla de recurrencia en el dominio, la protección de snapshots en persistencia, y los recorridos del usuario en el navegador.

La sesión cerró con una estructura de commits que refleja esa progresión: fundación Next.js, reglas de dominio, identidad, shell visual, persistencia y flujos interactivos. Las decisiones de planificación que guiaron la migración y la composición de componentes siguen disponibles en `docs/plans/`.

## Arquitectura en un vistazo

```text
src/app              rutas y layouts de Next.js
        ↓
src/features         UI y casos de uso por funcionalidad
        ↓                    ↘
src/domain           reglas puras   src/shared
        ↑
src/ports            contratos de infraestructura
        ↑
src/infrastructure   adaptadores del navegador
        ↑
src/store            estado hidratado y acciones compartidas
```

Las dependencias fluyen de la interfaz hacia las reglas y contratos; la infraestructura implementa esos contratos. Así, el almacenamiento local puede sustituirse en el futuro sin trasladar reglas de negocio a los componentes.

## Stack

- Next.js 16 y React 19
- TypeScript estricto
- Tailwind CSS 4
- Zustand para estado
- Zod para validar snapshots persistidos
- Vitest + Testing Library para pruebas unitarias e integración
- Playwright + axe-core para pruebas de navegador y accesibilidad
- pnpm 10 y Node.js 24

## Puesta en marcha

Requiere Node.js `>=24 <25` y pnpm `>=10.19`.

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000). La ruta raíz redirige a `/today`; también está disponible `/week`.

## Comandos de calidad

```bash
pnpm lint        # reglas de estilo y fronteras entre funcionalidades
pnpm typecheck   # comprobación estática de TypeScript
pnpm test        # Vitest
pnpm test:e2e    # Playwright
pnpm build       # build de producción
```

## Documentación para contribuciones asistidas

[AGENTS.md](AGENTS.md) ofrece el contexto y las reglas operativas para agentes de desarrollo. [CLAUDE.md](CLAUDE.md) adapta el mismo contexto a Claude Code. Ambos documentos indican dónde añadir código, cómo respetar las fronteras de módulos y qué verificaciones ejecutar antes de dar un cambio por terminado.

## Siguientes validaciones

La arquitectura queda deliberadamente abierta hasta observar uso real. Los siguientes pasos de producto no deberían ser añadir funcionalidades por inercia, sino validar si el flujo ayuda realmente a decidir el foco diario y qué señales permiten evaluar esa utilidad.
