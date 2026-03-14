# Update Moon Phase Calculation Logic Tasks

## Task 1: Add Moon Phase Domain Types and Classifier Helpers

Status: Done

### Goal
Introduce the new moon-state vocabulary and pure helper functions without changing rendered behavior yet.

### Scope
- Add moon-state types needed for the daily classification model.
- Add moon-specific helpers in `src/ts/moon.ts` for:
  - normalized modulo/wrap behavior
  - advancing `cyclePos` by one day
  - classifying `cyclePos` into `full`, `new`, `half-waning`, `half-waxing`, or `none`
- It is acceptable for these helpers to be instance methods on a dedicated `Moon` class that accepts the required moon/calendar config in its constructor.
- Keep shared calendar helpers in `src/ts/logic.ts` when they are not moon-specific.
- Keep `getMonthMoonCycle` and renderer behavior unchanged.

### Why This Task Is Complete
- The app still renders exactly as before.
- The new model primitives exist and can be validated independently before integration.

### Acceptance Criteria
- Helper functions implement the boundary semantics from the spec.
- Moon-state vocabulary is represented in code via `MoonPhaseState`.
- No UI or rendering output changes.
- Existing build remains green.

### Validation
- Add focused logic tests if test infrastructure is introduced, or verify through temporary local assertions during implementation.
- Run `npm run build`.
- Run ESLint for touched TS files.

## Task 2: Add Direct Year/Day Phase Initialization Utilities

Status: Done

### Goal
Implement O(1) moon phase initialization from the known full-moon anchor, still without changing the renderer.

### Scope
- Add moon-specific initialization helpers in `src/ts/moon.ts` for:
  - counting leap years between two years with arithmetic
  - computing day-of-year offsets from the full-moon anchor
  - computing `cyclePos` for the start of any target day
- These may be implemented as instance methods on the `Moon` class instead of standalone exports.
- Reuse shared calendar/date helpers from `src/ts/logic.ts` as needed.
- Keep visibility minimal, but make the behavior directly unit-testable.
- Do not replace the current month moon rendering path yet.

### Why This Task Is Complete
- The app remains in its current working state.
- The expensive/complex part of the new algorithm is isolated and testable before adoption.

### Acceptance Criteria
- Initialization works for years before and after the anchor year.
- Leap-year handling matches current calendar rules.
- No renderer changes yet.

### Validation
- Verify anchor, leap-year, festival, and far-past/far-future dates through direct moon-logic checks.
- Cover the implemented moon initialization behavior with focused unit tests.
- Run `npm run build`.
- Run ESLint for touched TS files.

## Task 3: Build a New Daily Moon-State Month API Alongside the Existing API

Status: Done

### Goal
Generate month-level day markers using the new daily phase model while keeping the old API available until renderer migration is done.

### Scope
- Add a new month-oriented API in `src/ts/moon.ts` that returns moon state by day for a given month.
- Use:
  - direct initialization for the month start
  - incremental progression for each subsequent day
- This API may be exposed as an instance method on the `Moon` class.
- Ensure festival months and leap-only festival behavior are represented correctly by the new API.
- Keep `getMonthMoonCycle` available so the current UI still works unchanged.

### Why This Task Is Complete
- The application still uses the old rendering path, so behavior stays stable.
- The new month API can be inspected or logged independently before switching UI integration.

### Acceptance Criteria
- Returned month data marks only classified days.
- Festival-day months follow the same classification rules.
- Month and year boundary progression is correct.

### Validation
- Compare selected month outputs from the new API to hand-checked expected results around full/new/half windows.
- Check festival months and leap-year transitions.
- Run `npm run build`.
- Run ESLint for touched TS files.

## Task 4: Switch Renderer to the New Daily Moon-State API

Status: Done

### Goal
Adopt the new daily moon-state model in rendering while preserving existing CSS classes and a working UI.

### Scope
- Update `src/ts/render.ts` to consume the new month/festival moon-state API.
- Preserve existing rendered classes:
  - `calendar__day--moon-full`
  - `calendar__day--moon-new`
  - `calendar__day--moon-half-waxing`
  - `calendar__day--moon-half-waning`
- Remove tuple-based renderer assumptions.
- Keep all non-moon rendering behavior unchanged.

### Why This Task Is Complete
- The app now uses the new behavior end to end.
- UI remains fully working with the same styling contract.

### Acceptance Criteria
- Moon markers now come from daily `cyclePos` classification.
- Festival rendering uses the same logic as normal days.
- Non-classified days have no moon-state modifier class.

### Validation
- Manual UI check for a few representative months and festivals.
- Run `npm run build`.
- Run ESLint for touched TS files.

## Task 5: Remove Legacy Quarter-Event Moon Logic and Tighten Types

Status: Done

### Goal
Delete the superseded moon tuple logic once the new renderer path is proven.

### Scope
- Remove obsolete tuple-based moon-cycle generation from `src/ts/moon.ts`.
- Remove obsolete `MoonCycle` tuple types from `src/ts/types.ts`.
- Rename/refine types and helpers to match the final model.
- Keep public/internal APIs minimal and coherent.

### Why This Task Is Complete
- The codebase reflects one moon model instead of two.
- The application remains fully functional on the new implementation.

### Acceptance Criteria
- No dead quarter-event moon logic remains.
- Types match the final rendering contract.
- Build and lint remain clean.

### Validation
- Run `npm run build`.
- Run ESLint for touched TS files.

## Task 6: Add Regression Coverage for Boundaries and Long-Range Initialization

Status: Done

### Goal
Lock in correctness for the new model with focused regression checks.

### Scope
- Add automated coverage for:
  - full/new/half boundary semantics
  - waxing vs waning classification
  - festival-day parity
  - leap-year transitions
  - far-past/far-future initialization against a simple reference implementation
- If no test harness exists yet, introduce the smallest practical validation approach consistent with the repo.

### Why This Task Is Complete
- The feature is fully implemented and guarded against the main regression risks identified in the spec.
- The application remains in a working state with stronger verification.

### Acceptance Criteria
- Boundary semantics from the spec are covered.
- Long-range initialization is verified without requiring per-day anchor traversal in production logic.
- Verification is repeatable for future changes.

### Validation
- Run the new automated checks.
- Run `npm run build`.
- Run ESLint for touched TS files.
