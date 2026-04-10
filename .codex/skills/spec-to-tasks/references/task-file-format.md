# Task File Format

Use this reference when writing or rewriting task files for a spec.

## Naming

Primary output:
- `specs/<name>.tasks.md`

If the generated task file would exceed about 500 lines, split it into:
- `specs/<name>.task.1.md`
- `specs/<name>.task.2.md`
- and so on

Prefer a single `.tasks.md` file unless size makes it difficult to navigate or update safely.

If split files are used, the first file should explain the sequence and list the remaining task files.

## Section Structure

Each task should be a separate section. Task IDs may be simple and local to the file, such as:
- `Task 1`
- `Task 2`
- `Task 3`

Example shape:

```md
# Tasks For <spec title>

## Task 1: <short title>
Status: todo
Summary: <one short paragraph>
Scope:
- ...
- ...
Dependencies:
- Depends on: none
- Parallelizable: yes
- Parallel with: Task 3
Validation:
- ...
- ...
Definition of done:
- ...
- ...
```

## Required Fields

Every task must include:
- `Status`
- `Summary`
- `Scope`
- `Dependencies`
- `Validation`
- `Definition of done`

Recommended dependency metadata inside `Dependencies`:
- `Depends on:`
- `Parallelizable:`
- `Parallel with:`

## Supported Statuses

Use only:
- `todo`
- `in-progress`
- `done`
- `blocked`

Keep the format stable so later updates can preserve status cleanly.
