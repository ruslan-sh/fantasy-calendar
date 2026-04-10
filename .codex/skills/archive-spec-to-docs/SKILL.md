---
name: archive-spec-to-docs
description: Archive an implemented feature spec and update current-state project documentation to match the shipped behavior. Use when a spec in specs/ is no longer an active plan and its outcome should be documented in docs/ or other project docs.
---

# Archive Spec To Docs

## Overview

Use this skill when the user wants to retire an implementation spec and make the resulting behavior part of the project documentation. The goal is to replace future-tense planning language with present-tense documentation that describes the system as it exists now.

## When To Use

Trigger this skill for requests like:
- "archive this spec"
- "move this implemented spec into docs"
- "make this behavior part of the project documentation"
- "turn this spec into current-state docs"

Use it only when the feature is already implemented or the user explicitly wants the docs to describe the current shipped behavior.

## Workflow

### 1. Confirm the implementation surface

Read the target spec and inspect the relevant code paths before editing docs.

Check:
- whether the described behavior is already implemented;
- where the behavior lives in code;
- which existing docs already cover adjacent behavior;
- whether `README.md` should stay minimal and link to docs instead of carrying feature detail.

If the implementation does not match the spec, document the real behavior rather than blindly copying the spec.

### 2. Choose the target documentation

Prefer a focused document in `docs/` for enduring behavior.

Guidelines:
- Update an existing doc if it already owns that behavior.
- Create a new doc in `docs/` if the behavior deserves its own page.
- Keep `README.md` as a brief index unless the repository already uses it for substantial behavior docs.
- Write in present tense and describe actual behavior, constraints, and entry points.

### 3. Archive the spec

Move the spec from `specs/<name>.md` to `specs/archive/<name>.md`.

Preserve the original content unless there is a strong reason to trim it. Add a short archival note at the top stating that the spec was archived after implementation and that the behavior now lives in project documentation.

Remove the active spec file from `specs/`.

### 4. Rewrite as current-state documentation

Translate planning material into documentation for the implemented system.

Include only what is useful for future readers:
- purpose and scope;
- supported user flows or behavior paths;
- important boundaries and edge cases;
- implementation notes only when they help maintenance;
- links or references to relevant modules.

Avoid:
- future-tense acceptance criteria;
- "current status" sections that say the docs are current;
- duplicated speculative design discussion that is no longer needed;
- feature-plan wording such as "proposed behavior", "validation plan", or "risks and mitigations" unless those sections still serve a real documentation purpose.

### 5. Keep diffs focused

Do not refactor unrelated docs. Limit the change to:
- the archived spec;
- the target doc in `docs/`;
- small README link updates if needed.

### 6. Verify the result

Run lightweight verification suitable for doc-only changes:
- inspect the final diff;
- confirm the archive path and doc links are correct;
- scan `docs/` for stale headings or wording introduced by the migration.

If no code changed, it is usually sufficient to report that build, tests, and lint were not run because the change was documentation-only.

## Output Expectations

A good result has these properties:
- the active spec is gone from `specs/`;
- the archived spec exists under `specs/archive/`;
- project docs describe the behavior as implemented, not proposed;
- the documentation is easier to find than the archived spec;
- the final summary calls out files changed, behavior impact, and verification performed.
