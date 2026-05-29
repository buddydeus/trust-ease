# Normalize Project Structure Contracts

## Summary

Normalize the project structure, documentation contracts, and verification
surface around the current Expo Router implementation without changing product
behavior. The refactor should make the repository easier for future agents and
developers to navigate by aligning active source boundaries, tests, scripts, and
human-facing docs with the implementation that already exists.

## Problem

The project has evolved from earlier planning documents into a working Expo app
with established directories:

- `src/app/` for route wrappers and navigation side effects.
- `src/pages/` for screen-level UI.
- `src/store/` for global state, onboarding, reporting, and preview helpers.
- `src/skin/` for controlled skin manifests, compatibility, runtime, paths, and
  storage.
- `scripts/` for preview and runtime screenshot workflows.
- `tests/support/source-structure.test.ts` for enforcing active source
  structure.

Some repository guidance is now scattered across README, AGENTS, OpenFlow
skills, and archived planning material. The next substantial work, especially
skin downloader / init state machine work, needs clearer boundaries before new
runtime behavior is added. Otherwise future changes risk mixing route logic,
screen UI, persistence, skin runtime logic, and screenshot contracts.

## Goals

- Make the active architecture contract explicit and enforceable.
- Keep `src/app` thin: route files should bind navigation, i18n copy, and
  side effects only.
- Keep `src/pages` focused on visual screen composition, with large screen files
  split only where that improves local comprehension.
- Keep `src/store` as the stable aggregation layer for app state and side-effect
  helpers such as onboarding, reporting, and preview configuration.
- Keep `src/skin` responsible for skin package contracts, parsing,
  compatibility, runtime snapshots, and persistence.
- Align tests and docs with the actual screenshot commands:
  `pnpm design` uses `scripts/render_current_app_screens.py`; `pnpm thumbs`
  uses `scripts/capture_runtime_thumbs.js`.
- Preserve existing product behavior, routes, i18n behavior, screenshots, and
  skin semantics.

## Non-Goals

- Do not implement the skin downloader or init state machine in this change.
- Do not redesign product flows or visual style.
- Do not change onboarding, welcome, report, tab, item, or skin behavior except
  for mechanical preservation during refactoring.
- Do not introduce new application frameworks, state libraries, routing
  libraries, or styling systems.
- Do not move active code back to old `src/features`, `src/domain`,
  `src/reporting`, `src/onboarding`, `src/preview`, `src/design`, or `src/ui`
  directories.
- Do not modify any `.ai/` file.
- Do not treat `.ai/archive/` as current implementation truth.

## Proposed Scope

### 1. Repository Guidance Alignment

Review root guidance and human-facing docs for contradictions against current
code. Keep the canonical project contract in root-level docs and active tests.
The `.ai/` directory remains read-only input for this change.

Expected outcome:

- README and AGENTS-style guidance agree on active directories and command
  behavior.
- Any doc update avoids `.ai/`.
- Screenshot command descriptions match `package.json`.

### 2. Structure Contract Tests

Extend or refine `tests/support/source-structure.test.ts` so the intended
architecture remains executable as a regression check.

Expected outcome:

- Old directory names remain rejected in active source references.
- Route files do not accumulate screen implementation responsibilities.
- Public guidance continues to mention the active directories.
- The test remains narrow enough that it catches architectural drift without
  blocking normal implementation details.

### 3. Focused File Boundary Cleanup

Split only files whose current size or responsibility mix makes the established
boundaries harder to maintain. Candidate pressure points are:

- `src/pages/my/MyScreen.tsx`, where language picker, skin picker, status card,
  and settings entry composition are all in one component.
- `src/skin/manifest.ts`, where manifest validation and normalization logic can
  become harder to evolve when downloader support arrives.
- `src/app/_layout.tsx`, where preview routing, skin storage hydration, skin
  persistence subscription, and preview-ready DOM markers currently share the
  root layout component.

Expected outcome:

- Each split creates small local helpers/components with clear names.
- Behavior and public exports remain stable unless tests are deliberately
  updated to reflect a documented boundary.
- The refactor prepares for future downloader/init work without implementing
  that future feature.

### 4. Verification Surface

Use focused tests to prove behavior did not change.

Expected checks:

- Existing source-structure tests pass.
- Relevant page tests pass for any split screen.
- Relevant skin tests pass for any manifest/runtime split.
- Type checking passes.
- If screenshot scripts or docs are touched, support tests covering export
  scripts pass.

## Success Criteria

- A future agent can read the repository guidance and know where route logic,
  page UI, app state, skin runtime logic, locales, and scripts belong.
- The structure contract is covered by tests instead of living only in prose.
- Existing runtime behavior is preserved.
- No `.ai/` file is changed.
- No unrelated product or visual redesign is included.
- The resulting implementation plan can be split into small, independently
  reviewable tasks.

## Constraints

- Follow current TypeScript, React memo, interface naming, import sorting, and
  lint rules already enforced by the repository.
- Preserve the current three locales: `zh-CN`, `zh-TW`, and `en-US`.
- Preserve the current skin model: local controlled components plus runtime
  manifest orchestration, with no arbitrary remote React execution.
- Preserve `skins/` as build-time bundled skin input, not mobile runtime
  writable storage.
- Work within OpenFlow phase boundaries: this proposal only records
  requirements. Implementation requires a later `/openflow spec` and
  `/openflow build`.

## Open Questions

- Should route-layer thinness be enforced by tests only through import/path
  restrictions, or also through file-size/responsibility heuristics?
- Should `MyScreen` be split first as the representative page-layer cleanup, or
  should the initial implementation focus on `src/app/_layout.tsx` because it
  affects app startup and preview behavior?
- Should README be updated in the same implementation change as source
  refactoring, or should documentation alignment be a separate first task?
