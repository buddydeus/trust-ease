# Tasks

## 1. Audit current dependency surface

- [x] Review `package.json`, `.npmrc`, existing docs, and test/runtime packages.
- [x] Identify broad ranges, `latest` dependencies, and Expo-managed packages
      that need explicit policy.
- [x] Confirm whether a lockfile should be generated and tracked.

## 2. Define install and registry policy

- [x] Decide default registry behavior and local mirror override guidance.
- [x] Decide whether `packageManager` should be pinned in `package.json`.
- [x] Decide how CI or fresh-clone installs should use frozen lockfiles.
- [x] Remove or relocate configuration that creates avoidable npm warning noise,
      if doing so does not break pnpm behavior.

## 3. Implement dependency reproducibility changes

- [x] Update `package.json`, `.npmrc`, lockfile, and docs according to the
      approved policy.
- [x] Avoid unrelated package upgrades or product behavior changes.
- [x] Keep `.ai/` unchanged.

## 4. Verify fresh install and core checks

- [x] Run the agreed install command.
- [x] Run `pnpm check:type`.
- [x] Run `pnpm test tests/skin --runInBand`.
- [x] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.
- [x] Run additional focused tests if dependency changes affect pages,
      screenshots, or i18n.

## 5. Close readiness

- [x] Confirm `npm.cmd exec -- openspec validate define-dependency-lock-strategy --strict`.
- [x] Confirm `git diff -- .ai` is empty.
- [x] Summarize resulting install policy and any remaining dependency risks.
