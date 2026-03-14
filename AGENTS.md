# Purpose

This file guides AI and human contributors making changes in this repository.
Prioritize minimal, focused diffs and preserve the existing architecture unless the task explicitly requires structural changes.

# Project Layout

- `src/index.ts`: app entry point.
- `src/index.ejs`: HTML template used by webpack.
- `src/ts/logic.ts`: calendar logic and state transitions.
- `src/ts/moon.ts`: moon phase calculation logic and moon-specific state helpers.
- `src/ts/render.ts`: DOM rendering and UI updates.
- `src/scss/index.scss`: SCSS entry point that composes partials.
- `src/scss/abstracts/_variables.scss`: shared style variables.
- `src/scss/base/_base.scss`: base/global styles.
- `src/scss/components/`: component-level styles (for example `_controls.scss`, `_moon.scss`).
- `src/scss/layout/_calendar.scss`: calendar layout styles.
- `src/ts/url-utils.ts`: TypeScript URL helper utilities.
- `tests/moon.test.ts`: moon logic unit tests.
- `tsconfig.test.json`: TypeScript config used for the unit test build.
- `webpack.common.js`, `webpack.dev.js`, `webpack.prod.js`: build and development configuration.
- `dist/`: build output; do not hand-edit generated assets.

# Run & Validate

Core commands:

- `npm install`
- `npm run start`
- `npm run build`
- `npm test`

Validation policy for substantive changes:

- Run `npm run build`.
- Run `npm test` when changing moon logic or adding logic-level behavior that has unit coverage.
- Run lint checks relevant to touched files:
  - JS/TS changes: run ESLint (for example `npx eslint src`).
  - SCSS changes: run Stylelint (prefer `npm run lint:styles`; equivalent: `npx stylelint "src/**/*.scss"`).
- If any check cannot be run, document exactly what failed and why.

# Coding Guardrails

- Keep changes small and localized to the task.
- Preserve existing style, naming, and module boundaries in touched files.
- Avoid new dependencies unless they are explicitly required.
- Do not refactor unrelated code in the same change.
- Prefer logic-only updates in `src/ts/logic.ts` and UI-only updates in `src/ts/render.ts` / `src/scss/`.

# Change Workflow

1. Understand affected module boundaries before editing.
2. Implement the smallest viable change.
3. Validate with required build and relevant lint checks.
4. Summarize files changed, behavior impact, verification performed, assumptions, and edge cases considered.

# Definition of Done

- Build passes (`npm run build`).
- Relevant lint checks pass for all touched JS/TS/SCSS files.
- No unintended regressions in primary calendar interactions.
- Change summary includes concrete verification evidence.

# Non-Goals / Cautions

- Do not modify webpack config unless required by the task.
- Do not manually edit generated output files in `dist/`.
- Do not broaden scope into unrelated cleanup.
