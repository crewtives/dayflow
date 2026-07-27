# Dayflow feature protocol

Dayflow keeps framework composition, feature behavior, domain rules, and browser adapters separate so local persistence and future integrations remain replaceable.

## Module boundaries

- `src/app/` composes App Router routes and layouts; it does not own domain rules.
- `src/features/<feature>/` owns feature UI, hooks, selectors, local types, and its public `index.ts` entry point.
- `src/domain/` owns framework-free entities, value rules, recurrence, date arithmetic, overlap inputs, and weekly aggregation.
- `src/infrastructure/` implements declared identity, persistence, cross-tab, and calendar ports.
- `src/shared/` owns reusable design primitives and generic utilities, with no feature imports.

## Dependency direction

Dependencies point from app to features, features to domain/shared, and infrastructure to declared ports. Feature internals are private: consumers import a feature only from `@/features/<feature>`. ESLint rejects nested feature imports such as `@/features/tasks/components/task-card`.

## State and testing

Use global state only for identity-scoped domain data and cross-feature actions. Keep drawers, drafts, focus, hover, drag, and temporary feedback in component state. Every feature-bearing change includes the lowest useful automated test; add browser coverage when a behavior crosses routing, persistence, or browser input.
