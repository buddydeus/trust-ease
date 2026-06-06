# Tasks

## 1. Define the QA gate command contract

- [x] Decide the final command shape for the single-device MVP QA gate, such as
      `pnpm check:qa` plus an optional screenshot subcommand if needed.
- [x] Add or update a package script or script wrapper that runs the selected
      deterministic QA checks.
- [x] Ensure failed sub-checks make the QA gate exit non-zero.
- [x] Preserve existing lower-level commands for focused debugging.

## 2. Cover MVP verification surfaces

- [x] Include TypeScript checking through the existing `pnpm check:type`
      command.
- [x] Include locale alignment through the existing `pnpm check:local` command.
- [x] Include core Jest coverage for trust data, welcome/onboarding, items,
      helpers, trigger-state, home, my/settings, backup, and skin runtime
      behavior.
- [x] Include full OpenSpec strict validation.
- [x] Include `pnpm skin:qa:remote` or equivalent remote-skin QA fixture
      coverage.

## 3. Preserve real runtime screenshot QA

- [x] Keep `pnpm thumbs` on the real Expo Web bundle and Playwright/browser
      rendering path.
- [x] Decide whether runtime screenshots run inside `pnpm check:qa` or as a
      clearly documented subcommand.
- [x] Document environment-sensitive screenshot failures as failures to report,
      not reasons to fall back to design previews.

## 4. Document QA usage and bug reporting

- [x] Update `README.md` with the single-device MVP QA command and coverage.
- [x] Update `AGENTS.md` common commands or validation guidance with the QA
      command.
- [x] Add a `.bugs/` README or template that defines the required fields for
      frontend QA findings.
- [x] Update `TODO.md` if needed so handoff guidance points to the QA gate.

## 5. Add lightweight script contract tests where practical

- [x] Add focused tests or assertions for the package script contract when
      practical.
- [x] Avoid duplicating every sub-command implementation in tests; assert the
      command intent and required coverage instead.

## 6. Final verification

- [x] Run the new QA gate command.
- [x] Run the documented runtime screenshot command if it is split from the main
      gate.
- [x] Run `npm.cmd exec -- openspec validate add-single-device-mvp-qa-gate --strict`.
- [x] Run `npm.cmd exec -- openspec validate --all --strict`.
- [x] Run `git diff -- .ai`.
