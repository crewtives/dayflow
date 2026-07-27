# Concepts

Shared domain vocabulary for this project — entities, named processes, and status concepts with project-specific meaning. Seeded with core domain vocabulary, then accretes as ce-compound and ce-compound-refresh process learnings; direct edits are fine. Glossary only, not a spec or catch-all.

## Planning domain

### Task

A persisted planning item anchored to a civil date, optionally scheduled within the agenda, with one workflow state and an optional recurrence rule.

### Recurring series

A Task whose recurrence projects appearances onto eligible dates while remaining a single persisted source.

Mutations apply to the source and therefore affect the whole series; Dayflow does not model independent exceptions or completion per occurrence.

### Occurrence

A derived appearance of a recurring series on a particular Calendar Date, not an independently persisted entity.

### Calendar Date

A civil day used for planning without time-of-day or timezone identity, represented independently from an instant.

### Selected Date

The Calendar Date the Today view is presenting and editing, which may differ from the user's current day and is navigable through the URL.

### Agenda

The daily time surface onto which scheduled Tasks are projected; overlap lanes are derived presentation data rather than persisted task state.

### Task State

The workflow classification that distinguishes work awaiting attention, deliberately in focus, or completed.

“Focus” is a task state, not a separate priority score.

### Daily Energy

A qualitative check-in associated with one Calendar Date and used as planning context rather than as a productivity, mood, or health score.

### Rolling Week

The inclusive recent-day window ending on the current Calendar Date from which Dayflow derives energy and completion summaries.

## Local data model

### Local Subject

An opaque browser-local identity that scopes Dayflow data without representing an authenticated account or promising continuity outside that browser profile.

### Dayflow Snapshot

The validated, subject-scoped aggregate of persisted Tasks and Daily Energy together with the metadata needed to interpret and order changes.

### Revision

The optimistic concurrency version advanced by each accepted change within a data generation.

### Generation

The data epoch advanced by an explicit reset so a post-reset Snapshot remains newer than every Snapshot from the prior epoch.

### Persistence Conflict

A recoverable rejection produced when the Revision expected by a mutation does not match the current persisted Snapshot.

## Flagged ambiguities

- “Tarea” y “evento” se usan en parte de la interfaz para la misma entidad; el término canónico de dominio es **Task / Tarea**.
- “Usuario” no debe utilizarse como sinónimo de **Local Subject**: Dayflow no tiene cuentas ni autenticación.
