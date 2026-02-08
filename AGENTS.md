# Purpose

This file guides AI and human contributors making changes in this repository.
Prioritize minimal, focused diffs and preserve the existing architecture unless the task explicitly requires structural changes.

# Project Layout

- `src/index.js`: app entry point.
- `src/js/logic.js`: calendar logic and state transitions.
- `src/js/render.js`: DOM rendering and UI updates.
- `src/css/index.css`: application styles.
- `src/ts/url-utils.ts`: TypeScript URL helper utilities.
- `webpack.common.js`, `webpack.dev.js`, `webpack.prod.js`: build and development configuration.
- `dist/`: build output; do not hand-edit generated assets.

# Run & Validate

Core commands:

- `npm install`
- `npm run start`
- `npm run build`

Validation policy for substantive changes:

- Run `npm run build`.
- Run lint checks relevant to touched files:
  - JS/TS changes: run ESLint (for example `npx eslint src` if no npm lint script exists).
  - CSS changes: run Stylelint (for example `npx stylelint "src/**/*.css"`).
- If any check cannot be run, document exactly what failed and why.

# Coding Guardrails

- Keep changes small and localized to the task.
- Preserve existing style, naming, and module boundaries in touched files.
- Avoid new dependencies unless they are explicitly required.
- Do not refactor unrelated code in the same change.
- Prefer logic-only updates in `src/js/logic.js` and UI-only updates in `src/js/render.js` / `src/css/index.css`.

# Change Workflow

1. Understand affected module boundaries before editing.
2. Implement the smallest viable change.
3. Validate with required build and relevant lint checks.
4. Summarize files changed, behavior impact, verification performed, assumptions, and edge cases considered.

# Definition of Done

- Build passes (`npm run build`).
- Relevant lint checks pass for all touched JS/TS/CSS files.
- No unintended regressions in primary calendar interactions.
- Change summary includes concrete verification evidence.

# Non-Goals / Cautions

- Do not modify webpack config unless required by the task.
- Do not manually edit generated output files in `dist/`.
- Do not broaden scope into unrelated cleanup.
