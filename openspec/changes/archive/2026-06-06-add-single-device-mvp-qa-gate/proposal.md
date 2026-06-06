# Add Single Device MVP QA Gate

## Why

The single-device MVP now has the core local product loop: onboarding,
important item CRUD, trusted helper/contact management, local trigger policy
simulation, readiness summary, and local backup export/import. These pieces
have been verified in focused slices, but the project still lacks one repeatable
gate that says whether the current local-only app is ready to enter hands-on QA
or cross-machine continuation.

Without a single QA gate, each phase relies on remembered command sets. That is
fragile for a product that is being resumed across turns and machines, and it
also makes it too easy to miss important boundaries such as locale alignment,
OpenSpec consistency, remote skin safety, or real runtime screenshot coverage.

Add a single-device MVP QA gate so the local app can be checked with a stable
command and documented workflow before moving on to bug-fix loops, GitHub push,
monorepo physical splitting, or connected-app capabilities.

## What Changes

- Add a documented single-device MVP QA command entry point, such as
  `pnpm check:qa`, that runs the local verification suite needed before manual
  or automated frontend QA.
- Include TypeScript, locale, focused Jest, skin remote QA, OpenSpec strict
  validation, and runtime screenshot checks in the gate or in clearly separated
  subcommands when runtime screenshots need special handling.
- Keep `pnpm thumbs` on the real Expo Web bundle path. It must not fall back to
  generated design previews when the runtime browser path is unavailable.
- Document the QA gate in project-facing docs so a new machine or future agent
  can run the same entry point without reconstructing command history.
- Define how frontend QA findings should be recorded under `.bugs/*.md`, with a
  problem description, suspected location, and suggested fix direction.
- Keep the gate local-only. It must not introduce backend accounts, cloud sync,
  push delivery, third-party messaging, or real network dependencies for product
  data.

## Success Criteria

- A developer or AI agent can run one documented command to verify the
  single-device MVP baseline.
- The command or its documented subcommands cover:
  - `pnpm check:type`;
  - `pnpm check:local`;
  - core Jest suites for local trust data, onboarding/welcome, items, helpers,
    trigger-state, home, my/settings, backup, and skin runtime safety;
  - `pnpm skin:qa:remote`;
  - `npm.cmd exec -- openspec validate --all --strict`;
  - runtime screenshot coverage through the existing `pnpm thumbs` path.
- The QA docs explain when screenshot/runtime checks are expected to fail due to
  local environment constraints, and how that failure should be reported rather
  than silently bypassed.
- The workflow gives a durable location for frontend QA findings in `.bugs/`.
- The gate is safe to run without backend services, user accounts, remote
  product data, push notification providers, SMS/email providers, or cloud sync.
- Existing commands continue to work; the gate organizes them rather than
  replacing lower-level focused checks.

## Scope

In scope:

- Package scripts or script wrappers needed to run the MVP QA gate.
- Documentation updates for README, AGENTS.md, and handoff TODO as needed.
- Lightweight support tests that assert the QA script contract where practical.
- `.bugs/` reporting convention for automated or manual frontend QA findings.
- Clear separation between fast deterministic checks and slower runtime
  screenshot checks if that improves reliability.

Out of scope:

- Fixing every frontend issue found by the future QA loop.
- Adding backend services, accounts, sync, cloud backup, push notifications,
  SMS/email delivery, or remote helper workflows.
- Changing product behavior in onboarding, item CRUD, helper CRUD, trigger
  simulation, readiness, backup, or skin runtime.
- Monorepo physical splitting.
- Replacing Jest, OpenSpec, Expo Web export, Playwright, or the existing
  screenshot tooling.
- Making `pnpm thumbs` fall back to design previews.

## Existing Constraints

- Follow AGENTS.md: do not modify `.ai/`; OpenFlow plans may use
  `docs/superpowers/plans/`; keep route/page/store boundaries intact.
- Preserve the package manager contract: `packageManager` remains
  `pnpm@11.5.0`, and lockfile changes must be intentional.
- The gate must use existing commands where possible:
  `pnpm check:type`, `pnpm check:local`, `pnpm test`, `pnpm skin:qa:remote`,
  `pnpm thumbs`, and `npm.cmd exec -- openspec validate --all --strict`.
- `pnpm thumbs` must continue to render the real Expo Web bundle through
  Playwright or the configured system browser path.
- New user-facing copy, if any, must be synchronized across `zh-CN`, `zh-TW`,
  and `en-US`.
- Product language must remain calm and precise; QA documentation must not
  imply legal execution, third-party account control, automatic helper contact,
  or remote recovery behavior.
