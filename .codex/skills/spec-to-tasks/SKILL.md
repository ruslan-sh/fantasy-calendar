---
name: spec-to-tasks
description: Split a spec into implementation tasks and keep a task-tracking file beside the spec. Use when the user wants a spec in specs/ converted into small executable tasks, or wants an existing tasks file updated after the spec changes.
---

# Spec To Tasks

## Overview

Use this skill when the user wants a spec decomposed into concrete implementation tasks that an agent or developer can pick up independently.

Before writing output, read:
- [`references/task-file-format.md`](./references/task-file-format.md) for file naming, section structure, required fields, and size-splitting rules.

Read only if updating an existing tasks file or task files:
- [`references/update-rules.md`](./references/update-rules.md) for status preservation and resync behavior.

## When To Use

Trigger this skill for requests like:
- "split this spec into tasks"
- "turn this spec into implementation tasks"
- "create a task list from this spec"
- "update the tasks for this spec"
- "resync task breakdown after the spec changed"

Use it for both:
- initial task generation from a spec
- later updates that preserve task status and useful manual notes where possible

## Core Rules

- Tasks must be small enough to support digestible PRs.
- Each task should aim to leave the repo in a working state with build and relevant tests passing.
- If keeping the repo green requires a slightly larger task, prefer the green boundary over an artificially tiny task.
- Represent both execution order and dependency/parallelism explicitly.
- Preserve existing task statuses and human-added notes when updating, unless the spec changed enough that the task must be replaced.
- Do not create busywork tasks. Each task should correspond to a meaningful implementation increment.

## Workflow

### 1. Read the spec and extract work streams

Read the target spec and identify:
- the main implementation areas;
- likely touched modules;
- sequencing constraints;
- validation requirements;
- natural green checkpoints;
- work that can run in parallel.

Split by delivery boundaries, not by document headings alone.

### 2. Decide the task graph

Create tasks that are:
- independently understandable;
- sized for a small but real implementation increment;
- explicit about whether they depend on earlier tasks;
- explicit about whether they can be done in parallel.

Prefer fewer, cleaner tasks over many trivial ones, but keep tasks small enough to support manageable PRs.

### 3. Preserve existing tracking on updates

If a `.tasks.md` or split task files already exist:
- read them first;
- preserve tracking according to [`references/update-rules.md`](./references/update-rules.md).

Do not blindly overwrite task progress tracking.

### 4. Write the task file

Use the output format and naming rules from [`references/task-file-format.md`](./references/task-file-format.md).

### 5. Validate task quality

Before finalizing, check that:
- every task has a clear working outcome;
- dependencies are coherent;
- parallelizable work is marked clearly;
- validation expectations are concrete;
- the overall set covers the spec without large gaps or overlap;
- the output stays practical for a human or agent to execute incrementally.

## Task Design Guidance

Good tasks usually align to boundaries like:
- add or refactor one cohesive module surface;
- migrate one integration point;
- add or adapt tests for a completed behavior slice;
- complete one end-to-end behavior increment and its validation.

Avoid tasks like:
- "update some imports"
- "fix leftovers"
- "misc cleanup"

unless they are the smallest safe unit needed to keep the repo working and green.

## Dependency Guidance

Use both ordering and dependency language.

Examples:
- a foundational refactor task may unblock multiple parallel migration tasks;
- test expansion may be bundled with a behavior task if separate testing work would leave the branch red;
- cleanup can be its own task only if earlier tasks still produce working code.

If a task is independent, say so explicitly.

## Output Expectations

A good result has these properties:
- the task file sits beside the spec;
- tasks are executable in small, practical increments;
- each task can realistically end with working code;
- dependency and parallelism information is obvious;
- status tracking survives future updates;
- the task set is complete enough that a developer or agent can start work immediately.
