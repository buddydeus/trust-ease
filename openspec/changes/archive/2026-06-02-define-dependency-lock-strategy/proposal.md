# Define Dependency Lock Strategy

## Why

The project is now moving from planning and runtime infrastructure work toward
repeatable implementation across machines. The current repository does not
track a `pnpm-lock.yaml`, uses broad dependency ranges in `package.json`, and
has registry/install behavior that can differ between local environments.

That is risky for this Expo 55 prototype because React, React Native, Expo,
Jest, React Native Testing Library, Playwright, TypeScript, and the skin runtime
tests are tightly coupled. A fresh clone on another machine should install the
same dependency graph that was used to validate the current product, page,
i18n, screenshot, and skin-runtime contracts.

## What Changes

- Define the repository policy for tracking `pnpm-lock.yaml`.
- Define the package manager version policy, including whether `packageManager`
  should be pinned in `package.json`.
- Normalize registry guidance so local development can use a mirror when
  needed while reproducible installs and CI can use a predictable registry.
- Review dependency version ranges for Expo 55, React 19, React Native 0.85,
  Jest 29, and related test/runtime packages.
- Document the install and verification workflow for fresh clones and machine
  migration.
- Preserve the current product behavior, page behavior, skin runtime behavior,
  and OpenSpec specs while improving reproducibility.

## Goals

- Make dependency installation deterministic enough for GitHub checkout and
  continuation on another computer.
- Avoid accidental dependency graph drift caused by broad ranges or missing
  lockfiles.
- Keep Expo-managed package versions aligned with the app's current Expo SDK.
- Keep Jest and React test renderer versions compatible with the current React
  Native testing stack.
- Reduce warning noise from npm reading pnpm-oriented `.npmrc` settings where a
  practical fix exists.
- Document a clear fallback when a mirror registry is unavailable or returns
  stale packages.

## Non-Goals

- Do not physically split the repository into a monorepo in this change.
- Do not upgrade the app to a newer Expo SDK, React Native version, or React
  major version.
- Do not redesign product flows, pages, i18n, screenshots, or skin runtime
  behavior.
- Do not add CI infrastructure unless the implementation spec explicitly scopes
  it as a minimal validation surface.
- Do not change `.ai/` files.

## Expected Scope

### Lockfile and Package Manager Policy

Decide and implement whether the repository should:

- track `pnpm-lock.yaml`;
- pin `packageManager` in `package.json`;
- use Corepack-oriented setup guidance;
- require `pnpm install --frozen-lockfile` for CI or verification installs.

### Registry and Install Configuration

Review `.npmrc` and related docs so the project has a clear policy for:

- default registry behavior;
- mirror usage for local development;
- official registry fallback for dependency resolution issues;
- pnpm-only settings that cause warning noise when commands are launched through
  `npm exec`.

### Dependency Range Alignment

Review the currently declared dependencies and devDependencies for:

- Expo SDK 55 package compatibility;
- React 19 and React Native 0.85 compatibility;
- Jest 29 and React Native Testing Library compatibility;
- exact versions where the project has already observed a narrow compatibility
  requirement;
- broad `latest` or major-only ranges that could destabilize future installs.

### Documentation and Verification

Update human-facing docs only where they describe install, lockfile, registry,
or machine migration behavior. Keep `.ai/` unchanged.

Expected verification should include:

- install validation using the agreed lockfile policy;
- `pnpm check:type`;
- focused tests that cover dependency-sensitive surfaces, especially skin tests
  and source-structure tests;
- `pnpm check:local` only if user-visible copy changes.

## Success Criteria

- A fresh clone can install dependencies using the documented command without
  accidentally resolving a materially different dependency graph.
- The repository policy for `pnpm-lock.yaml` is explicit and enforced by the
  checked-in files.
- Registry configuration and fallback instructions are clear enough for machine
  migration.
- Existing app behavior and OpenSpec specs are preserved.
- `.ai/` remains unchanged.

## Constraints

- Use `pnpm` as the package manager.
- Preserve Expo 55, Expo Router, React 19, React Native 0.85, TypeScript strict
  mode, Jest, and React Native Testing Library as the current stack.
- Keep changes scoped to dependency reproducibility and related docs.
- Do not introduce a new package manager, build system, or app framework.
- Do not modify archived planning documents as current implementation truth.

## Open Questions

- Should the repository default registry remain `npmmirror`, switch to the
  official npm registry, or document mirror use as a local override?
- Should all direct dependencies be pinned exactly, or should Expo-managed
  packages keep compatible ranges while `pnpm-lock.yaml` provides determinism?
- Which pnpm version should be recorded in `packageManager` for the current
  project?
- Should CI-oriented install guidance be documented now, even if CI config is
  added later?
