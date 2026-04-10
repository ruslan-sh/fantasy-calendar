# Tasks For Convert `logic.ts` To `Calendar` Class

## Task 1: Introduce the `Calendar` class API in `logic.ts`
Status: done
Summary: Refactor the logic module so its primary export is a `Calendar` class with an explicit constructor contract for `calendar` and `astronomical` props, while keeping behavior unchanged and the branch buildable.
Scope:
- Add a dedicated `CalendarProps` interface using explicit `CalendarConfig` and `AstronomicalConfig` types rather than `Pick<AppProps, ...>`.
- Move the current public calendar calculations into instance methods on `Calendar`, including month lookup, leap-year checks, month-day calculation, day-of-year helpers, leap-year counting, and `calculateDate`.
- Remove the old public `*InCalendar` helper surface from the end-state module API, keeping any extracted helper logic private/internal as needed.
- Eliminate the logic module’s direct dependency on global `props`.
Dependencies:
- Depends on: none
- Parallelizable: no
- Parallel with: none
Validation:
- Run `npm run build`.
- Run `npx eslint src/ts/logic.ts` or the repo-equivalent ESLint command for touched TypeScript files.
Definition of done:
- The refactored module exports `Calendar` as the main API.
- The constructor only accepts the explicit `calendar` and `astronomical` subset.
- Calendar calculations return the same results as before for equivalent inputs.
- No public free-function compatibility layer is required for later tasks to proceed.

## Task 2: Migrate `Moon` to consume `Calendar`
Status: done
Summary: Update the moon logic so it depends on an injected `Calendar` instance instead of importing loose helper functions from the calendar logic module.
Scope:
- Change `Moon` construction to accept a `Calendar` instance explicitly alongside its existing moon props.
- Replace direct imports of `countLeapYearsBetweenInCalendar`, `getDayOfYearInCalendar`, `getMonthByNameInCalendar`, and `getMonthDaysInCalendarYear` with equivalent `Calendar` instance calls.
- Preserve the existing `Moon` public behavior and moon-phase generation results.
Dependencies:
- Depends on: Task 1
- Parallelizable: yes
- Parallel with: Task 3
Validation:
- Run `npm test`.
- Run `npx eslint src/ts/moon.ts` or the repo-equivalent ESLint command for touched TypeScript files.
Definition of done:
- `src/ts/moon.ts` no longer imports calendar helper functions from the logic module.
- `Moon` computes offsets and month phases through an injected `Calendar`.
- Existing moon behavior remains unchanged for current inputs.

## Task 3: Migrate render-layer callers to a shared `Calendar` instance
Status: done
Summary: Replace render-layer usage of free functions with a shared `Calendar` instance and keep current date navigation and festival rendering behavior intact.
Scope:
- Instantiate `Calendar` at the current composition point that keeps the diff minimal, likely in `src/ts/render.ts` unless a slightly higher owner is clearly cleaner.
- Replace direct imports of `calculateDate` and `isLeapYear` with instance-method calls.
- Update any local month lookups or related render wiring only where needed to support the class-based integration cleanly.
- Ensure `Moon` is constructed with the shared `Calendar` instance.
Dependencies:
- Depends on: Task 1
- Parallelizable: yes
- Parallel with: Task 2
Validation:
- Run `npm run build`.
- Run `npx eslint src/ts/render.ts src/index.ts` for any touched TypeScript files.
Definition of done:
- Render code no longer depends on the old free-function calendar API.
- A shared `Calendar` instance drives date calculation and leap-year checks in the render flow.
- Interactive calendar behavior remains unchanged in normal usage.

## Task 4: Add regression coverage for the class API and integration points
Status: todo
Summary: Expand or adapt tests so the new class-based API and the `Moon` integration remain covered by automated regression checks.
Scope:
- Add or update tests for `Calendar` instance methods: month lookup, leap-year evaluation, month-day calculation, day-of-year calculation, leap-year counting, and date rollover behavior.
- Add regression coverage for `Moon` behavior after the constructor and dependency changes.
- Cover spec-identified edge cases where practical, including missing month names, leap-year boundaries, reverse leap-year range counts, leap-only or extra-day months, and year-boundary date calculations.
- Keep test fixtures focused on logic behavior rather than render concerns.
Dependencies:
- Depends on: Task 2, Task 3
- Parallelizable: no
- Parallel with: none
Validation:
- Run `npm test`.
- Run `npm run build`.
- Run `npx eslint src tests` for touched TypeScript test files.
Definition of done:
- Automated tests exercise the `Calendar` class directly rather than relying on the removed free-function API.
- Moon regression coverage still passes after dependency injection changes.
- The required build and test commands pass with the final refactor in place.
