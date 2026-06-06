# Implementation Plan: add-single-device-mvp-qa-gate

## Sources

- Proposal: `openspec/changes/add-single-device-mvp-qa-gate/proposal.md`
- Design: `openspec/changes/add-single-device-mvp-qa-gate/design.md`
- Specs: `openspec/changes/add-single-device-mvp-qa-gate/specs/`
- Tasks: `openspec/changes/add-single-device-mvp-qa-gate/tasks.md`

## Implementation Steps

### Task 1: Define the QA gate command contract

- Goal: Add a stable command entry point for the single-device MVP QA gate
  without removing existing lower-level commands.
- Files to change:
  - `package.json`
  - optionally a new script under `scripts/`
  - optionally tests under `tests/support/`
- Verification:
  - Run the new command or wrapper enough to confirm it starts the intended
    sub-checks.
  - Confirm failed sub-checks would return a non-zero exit code.
  - Confirm existing commands such as `pnpm check:type`, `pnpm check:local`,
    `pnpm test`, `pnpm skin:qa:remote`, and `pnpm thumbs` remain present.

### Task 2: Cover MVP verification surfaces

- Goal: Ensure the QA gate covers deterministic MVP checks before frontend QA.
- Files to change:
  - `package.json` or the selected script wrapper
  - optional tests under `tests/support/`
- Verification:
  - Confirm the gate includes TypeScript and locale checks.
  - Confirm the gate includes Jest coverage for trust data, welcome/onboarding,
    items, helpers, trigger-state, home, my/settings, backup, and skin runtime.
  - Confirm the gate includes full OpenSpec strict validation.
  - Confirm the gate includes `pnpm skin:qa:remote` or equivalent fixture-based
    remote skin QA.

### Task 3: Preserve real runtime screenshot QA

- Goal: Keep runtime screenshot coverage tied to the real Expo Web bundle and
  make any split from the deterministic gate explicit.
- Files to change:
  - `package.json`
  - `README.md`
  - `AGENTS.md`
  - optional script wrapper under `scripts/`
- Verification:
  - Run or inspect the documented screenshot command.
  - Confirm it still calls `pnpm thumbs` or the existing runtime screenshot
    path.
  - Confirm docs say screenshot failure must be reported and must not fall back
    to `pnpm design`.

### Task 4: Document QA usage and bug reporting

- Goal: Make the QA gate and frontend QA reporting convention durable for
  future agents and cross-machine handoff.
- Files to change:
  - `README.md`
  - `AGENTS.md`
  - `.bugs/README.md` or `.bugs/TEMPLATE.md`
  - `TODO.md` if the handoff needs to point at the new gate
- Verification:
  - Review docs for the command name, coverage, local-only boundary, and
    screenshot caveat.
  - Confirm `.bugs` documentation requires problem description, reproduction or
    observed path, suspected location, suggested fix direction, and verification
    command/manual check.
  - Run `git diff -- .ai` and confirm it is empty.

### Task 5: Add lightweight script contract tests where practical

- Goal: Guard the QA script contract without duplicating all command internals.
- Files to change:
  - likely `tests/support/*`
  - possibly `package.json` or script wrapper if tests reveal missing coverage
- Verification:
  - Run the focused script contract test.
  - Confirm it asserts command intent and required coverage rather than brittle
    full command output.

### Task 6: Final verification and task status sync

- Goal: Verify the implementation and mark OpenSpec tasks complete only after
  evidence exists.
- Files to change:
  - `openspec/changes/add-single-device-mvp-qa-gate/tasks.md`
- Verification:
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:qa`
  - documented runtime screenshot command if split from the main gate
  - `npm.cmd exec -- openspec validate add-single-device-mvp-qa-gate --strict`
  - `npm.cmd exec -- openspec validate --all --strict`
  - `git diff -- .ai`
