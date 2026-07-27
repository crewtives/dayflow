# Dayflow — instrucciones para Claude Code

Lee primero [AGENTS.md](AGENTS.md): contiene la guía canónica de arquitectura, diseño, pruebas y límites de producto de este repositorio. Este archivo añade convenciones prácticas para trabajar aquí desde Claude Code.

## Inicio rápido

```bash
pnpm install
pnpm dev
```

El proyecto usa Node.js 24 y pnpm 10.19 o superior. Antes de finalizar una tarea, ejecuta según el alcance:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## Reglas de implementación

- Trabaja en TypeScript estricto y usa imports `@/…`.
- Respeta las capas `app → features → domain/shared` y `infrastructure → ports`.
- No importes componentes internos de otra feature; consume su `index.ts` público.
- No sitúes reglas de negocio o acceso directo a almacenamiento del navegador en componentes React.
- Conserva los estados de carga, error, conflicto, foco de teclado y feedback accesible al modificar flujos de usuario.
- Mantén el producto honesto: Dayflow es local y no dispone de cuentas, nube, colaboración, IA ni integraciones.

## Diseño

Consulta `PRODUCT.md` y `DESIGN.md` antes de cambios visuales. La interfaz sigue «el día plegado»: papel, tinta, líneas de pliegue y vermellón para intención. No introduzcas tarjetas genéricas, esquinas excesivamente redondeadas, ornamentos temáticos ni color como único indicador de estado.

## Verificación y entrega

Busca pruebas existentes antes de tocar comportamiento. Añade o actualiza la prueba de menor nivel que demuestre el cambio y usa Playwright si afecta a rutas, persistencia o interacción del navegador. Inspecciona el diff antes de entregar y no realices commits, pushes ni PRs sin una petición explícita.
