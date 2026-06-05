# Local Readiness Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-only readiness summary that derives advisory preparation state from trust items, trusted helpers, item-helper assignments, and trigger policy simulation.

**Architecture:** Add a pure resolver in `src/store/trust/readiness.ts`, render the result on the Home surface through prop-driven page UI, and let the Home route bind local trust storage plus existing navigation targets. No readiness state is persisted.

**Tech Stack:** Expo Router, React Native, TypeScript, styled-components, Jest, React Native Testing Library, OpenSpec.

---

## File Structure

- Create `src/store/trust/readiness.ts`: stable readiness types and pure resolver.
- Modify `src/store/trust/index.ts`: export readiness API.
- Create `tests/store/trust/readiness.test.ts`: resolver RED/GREEN coverage.
- Modify `src/pages/home/HomeScreen.tsx`: render optional readiness summary props.
- Modify `src/pages/home/home.styled.tsx`: compact readiness section styles.
- Modify `src/app/(tabs)/home.tsx`: load local trust snapshot, derive readiness, and map actions to existing routes.
- Modify `tests/pages/home/home-screen.test.tsx`: page and route coverage for readiness summary.
- Modify `tests/pages/home/home-screen.i18n.test.tsx`: copy injection coverage.
- Modify `src/locals/zh-CN.json`, `src/locals/zh-TW.json`, `src/locals/en-US.json`: readiness copy.
- Modify `openspec/changes/add-local-readiness-summary/tasks.md`: mark tasks complete after verification.

### Task 1: Readiness Resolver

**Files:**
- Create: `tests/store/trust/readiness.test.ts`
- Create: `src/store/trust/readiness.ts`
- Modify: `src/store/trust/index.ts`

- [x] **Step 1: Write failing resolver tests**

Cover empty snapshot gaps, active counts, archived helper exclusion, mixed coverage, paused trigger gap, simulation review, and immutability.

- [x] **Step 2: Run resolver tests and verify RED**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/readiness.test.ts --runInBand`

Expected: FAIL because `deriveLocalReadinessSummary` is not exported yet.

- [x] **Step 3: Implement minimal resolver**

Create `src/store/trust/readiness.ts` with `deriveLocalReadinessSummary(snapshot)`, stable gap ids, next action ids, counts, section statuses, and `isLocalOnly: true`.

- [x] **Step 4: Run resolver tests and verify GREEN**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/readiness.test.ts --runInBand`

Expected: PASS.

### Task 2: Home Readiness UI

**Files:**
- Modify: `tests/pages/home/home-screen.test.tsx`
- Modify: `tests/pages/home/home-screen.i18n.test.tsx`
- Modify: `src/pages/home/HomeScreen.tsx`
- Modify: `src/pages/home/home.styled.tsx`

- [x] **Step 1: Write failing page tests**

Render `HomeScreen` with a readiness prop and assert local advisory copy, section labels, next action callbacks, and absence of score/legal/automatic-delivery wording.

- [x] **Step 2: Run page tests and verify RED**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/home --runInBand`

Expected: FAIL because `HomeScreen` does not accept/render readiness props yet.

- [x] **Step 3: Implement prop-driven readiness section**

Add `readiness` and `readinessCopy` props to `HomeScreen`, render a compact readiness card below existing summary stats, and keep the component free of storage imports.

- [x] **Step 4: Run page tests and verify GREEN**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/home --runInBand`

Expected: PASS.

### Task 3: Route Integration and Localization

**Files:**
- Modify: `src/app/(tabs)/home.tsx`
- Modify: `tests/pages/home/home-screen.test.tsx`
- Modify: `src/locals/zh-CN.json`
- Modify: `src/locals/zh-TW.json`
- Modify: `src/locals/en-US.json`

- [x] **Step 1: Write failing route test**

Seed local trust storage, render Home route, and assert readiness summary reflects active trust data and actions point to existing flows.

- [x] **Step 2: Run route test and verify RED**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/home/home-screen.test.tsx --runInBand`

Expected: FAIL because route does not load local trust snapshot yet.

- [x] **Step 3: Implement route binding and copy**

Load `loadTrustDataSnapshot()`, derive readiness, map action ids to existing Expo Router routes, and add all new copy keys in three locales.

- [x] **Step 4: Run route and locale tests**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/home --runInBand`

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local`

Expected: PASS.

### Task 4: Verification and OpenSpec Task Sync

**Files:**
- Modify: `openspec/changes/add-local-readiness-summary/tasks.md`

- [x] **Step 1: Run focused and broad checks**

Run:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/home --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec -- openspec validate add-local-readiness-summary --strict
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

- [x] **Step 2: Mark OpenSpec tasks complete**

Update `openspec/changes/add-local-readiness-summary/tasks.md` from `- [ ]` to `- [x]` only after the related implementation and verification have passed.

- [x] **Step 3: Commit build result**

Use `/commit-helper` rules with scoped staging and a multiline commit message.
