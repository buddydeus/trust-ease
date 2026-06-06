# Single Device MVP QA Gate Implementation Plan

> Source: `openspec/changes/add-single-device-mvp-qa-gate/plan-ready.md`

## Goal

Add a repeatable QA gate for the local single-device MVP without changing product
behavior or introducing connected-app dependencies.

## Steps

### Task 1: Define the QA gate command contract

- [x] Add `pnpm check:qa` as the deterministic QA gate entry point.
- [x] Add `pnpm check:qa:runtime` for runtime screenshot QA through `pnpm thumbs`.
- [x] Add `pnpm check:qa:all` for deterministic plus runtime QA.
- [x] Keep lower-level commands available for focused debugging.

### Task 2: Cover MVP verification surfaces

- [x] Include TypeScript checking through `pnpm check:type`.
- [x] Include locale alignment through `pnpm check:local`.
- [x] Include core Jest coverage for local trust data, onboarding/welcome, items,
      helpers, trigger-state, home, my/settings, backup, and skin runtime.
- [x] Include OpenSpec full strict validation.
- [x] Include `pnpm skin:qa:remote`.

### Task 3: Preserve real runtime screenshot QA

- [x] Keep runtime screenshots routed through `pnpm thumbs`.
- [x] Keep screenshot QA as a documented runtime subcommand.
- [x] Document that screenshot failures should be reported and must not fall
      back to design previews.

### Task 4: Document QA usage and bug reporting

- [x] Update README QA command documentation.
- [x] Update AGENTS common commands and validation guidance.
- [x] Add `.bugs/README.md` with required bug report fields.
- [x] Update TODO handoff guidance for the active QA gate phase.

### Task 5: Add lightweight script contract tests

- [x] Add `tests/support/check-qa-script.test.ts`.
- [x] Assert package scripts, QA script coverage, docs, and `.bugs` contract.

### Task 6: Final verification and task status sync

- [x] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/check-qa-script.test.ts --runInBand`.
- [x] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:qa`.
- [x] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:qa:runtime`.
- [x] Run `npm.cmd exec -- openspec validate add-single-device-mvp-qa-gate --strict`.
- [x] Run `npm.cmd exec -- openspec validate --all --strict`.
- [x] Run `git diff -- .ai`.
- [x] Mark `openspec/changes/add-single-device-mvp-qa-gate/tasks.md` complete after verification evidence exists.
