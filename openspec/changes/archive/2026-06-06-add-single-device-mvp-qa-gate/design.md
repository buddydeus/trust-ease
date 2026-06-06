# Design: Add Single Device MVP QA Gate

## Overview

This change adds a repeatable QA gate for the standalone, single-device MVP.
The product loop is now local-first and mostly complete: onboarding, local
items, local helpers, trigger simulation, readiness summary, backup/export
import, and skin-runtime safety have each been verified in slices. The missing
piece is a durable command and documentation contract that a developer or AI
agent can run before entering frontend QA or continuing on another machine.

The QA gate should organize existing verification commands rather than invent a
new test framework. It should be boring, explicit, and easy to debug when one
sub-check fails.

## Command Strategy

Add a top-level script entry such as `pnpm check:qa`. The implementation can be
either:

- a package script that chains existing scripts and test targets; or
- a small script under `scripts/` that runs the same commands sequentially and
  prints clear phase labels.

A script wrapper is preferred if command output needs consistent section labels
or if OpenSpec validation and runtime screenshot checks need clearer failure
messages.

The command should fail fast or fail with a clear final summary. It must not
swallow errors. Any failed sub-command should make the QA gate exit non-zero.

## Verification Coverage

The gate should cover the single-device MVP baseline:

- TypeScript strict check through `pnpm check:type`.
- Locale alignment through `pnpm check:local`.
- Core Jest coverage for:
  - local trust data helpers;
  - welcome/onboarding behavior;
  - item workflows;
  - helper/contact workflows;
  - trigger-state simulation;
  - home readiness summary;
  - my/settings and backup workflow;
  - skin runtime and remote download QA safety.
- OpenSpec consistency through
  `npm.cmd exec -- openspec validate --all --strict` or an equivalent command
  that works in the project shell.
- Runtime screenshots through the existing `pnpm thumbs` command.

The exact Jest command may use broad suites (`pnpm test --runInBand`) or a
curated list of focused suites. A curated list is acceptable if it is documented
and covers the MVP surfaces above.

## Runtime Screenshot Handling

`pnpm thumbs` must remain a real runtime screenshot path:

- export the Expo Web app bundle;
- render that bundle through Playwright or the configured system browser path;
- capture the actual app pages;
- fail if runtime browser rendering is unavailable.

The QA gate may keep screenshots as a separate subcommand if they are slower or
more environment-sensitive than deterministic checks. If separated, docs must
make the split explicit and tell the user what to run before manual frontend QA.
The gate must not fall back to `pnpm design` or generated design preview images.

## Documentation Contract

Update project-facing docs so the QA gate is discoverable:

- `README.md` should list the command and what it covers.
- `AGENTS.md` should include the command in common commands and validation
  guidance.
- `TODO.md` may be updated during build/close so the next handoff points to the
  new QA gate instead of reconstructing command history.

The docs should also explain that this gate is for the local single-device MVP,
not for backend-connected readiness.

## `.bugs` Reporting Convention

Add a durable convention for frontend QA findings under `.bugs/`. A lightweight
README or template is enough for this change.

Each bug document should include:

- problem description;
- reproduction or observed path;
- suspected location;
- suggested fix direction;
- verification command or manual check to rerun.

This change defines the convention. It does not require fixing every future QA
finding.

## Safety and Boundaries

The QA gate must remain local-only. It should not add:

- backend services;
- accounts;
- cloud sync;
- push notification providers;
- SMS/email delivery;
- remote helper workflows;
- real product-data network dependencies.

Existing lower-level commands should continue to work. The gate is an
orchestration layer, not a replacement for focused tests.

## Validation Strategy

Recommended validation for this change:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:qa
npm.cmd exec -- openspec validate add-single-device-mvp-qa-gate --strict
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

If `pnpm thumbs` is split out of the main deterministic gate, run the documented
runtime screenshot command as part of the build verification and report any
environment-specific failure explicitly.
