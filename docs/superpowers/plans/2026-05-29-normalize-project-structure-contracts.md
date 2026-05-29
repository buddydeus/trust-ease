# Normalize Project Structure Contracts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the current repository structure contract executable and reduce route/page boundary pressure without changing product behavior.

**Architecture:** Keep `src/app` as route/app-shell code, `src/pages` as screen UI, `src/store` as state/helper aggregation, and `src/skin` as skin runtime logic. Use `tests/support/source-structure.test.ts` and root docs as the public contract. Refactor `RootLayout` and `MyScreen` into local focused helpers/components while preserving exports and behavior.

**Tech Stack:** Expo Router, React Native, TypeScript, Zustand, styled-components, Jest, OpenSpec.

---

### Task 1: Structure Contract Tests And Root Docs

**Files:**
- Modify: `tests/support/source-structure.test.ts`
- Modify: `README.md`
- Modify: `AGENTS.md`

- [x] **Step 1: Extend structure tests**

Add assertions for root docs, screenshot commands, and route boundaries.

- [x] **Step 2: Align root docs**

Update root documentation only where it contradicts or omits active structure and script contracts.

- [x] **Step 3: Verify structure tests**

Run: `pnpm test tests/support/source-structure.test.ts --runInBand`
Expected: PASS.

### Task 2: Root Layout Side-Effect Hooks

**Files:**
- Modify: `src/app/_layout.tsx`
- Create: `src/app/usePreviewRouteSync.ts`
- Create: `src/app/useSkinStorageSync.ts`
- Create: `src/app/usePreviewReadyMarker.ts`

- [x] **Step 1: Extract preview route sync**

Move `router.replace(preview.route)` logic to `usePreviewRouteSync`.

- [x] **Step 2: Extract skin storage sync**

Move `loadSkinStorageState`, `useAppStore.setState`, subscription, and `saveSkinStorageState` logic to `useSkinStorageSync`.

- [x] **Step 3: Extract preview ready marker**

Move DOM dataset and animation-frame logic to `usePreviewReadyMarker`.

- [x] **Step 4: Simplify RootLayout**

Call the three hooks from `_layout.tsx` and leave provider/Stack composition there.

- [x] **Step 5: Verify route boundary**

Run: `pnpm test tests/support/source-structure.test.ts --runInBand` and `pnpm check:type`.

### Task 3: My Screen Local Components

**Files:**
- Modify: `src/pages/my/MyScreen.tsx`
- Create: `src/pages/my/types.ts`
- Create: `src/pages/my/SettingsCard.tsx`
- Create: `src/pages/my/LanguagePicker.tsx`
- Create: `src/pages/my/SkinPicker.tsx`

- [x] **Step 1: Extract My screen types**

Move `MyScreenCopy`, `SkinOption`, and `IMyScreenProps` to `types.ts`.

- [x] **Step 2: Extract static cards**

Create `SettingsCard` for title/summary cards and keep existing text behavior.

- [x] **Step 3: Extract language picker**

Move language picker state UI to `LanguagePicker`.

- [x] **Step 4: Extract skin picker**

Move skin picker state UI to `SkinPicker`.

- [x] **Step 5: Simplify MyScreen**

Keep `MyScreen` as page composition and local open/close state owner.

- [x] **Step 6: Verify My screen**

Run: `pnpm test tests/pages/my/my-screen.test.tsx --runInBand` and `pnpm check:type`.

### Task 4: Skin Manifest Assessment

**Files:**
- Optional Modify: `src/skin/manifest.ts`
- Optional Test: `tests/skin/manifest.test.ts`

- [x] **Step 1: Assess manifest pressure**

Review `src/skin/manifest.ts` after Tasks 1-3 and decide whether splitting internals is worth the churn.

- [x] **Step 2: Split only if useful**

If splitting, move whitelist definitions and field readers into skin-local files while keeping parser behavior stable.

- [x] **Step 3: Verify manifest behavior**

If changed, run `pnpm test tests/skin/manifest.test.ts --runInBand` and `pnpm check:type`.

### Task 5: Final Verification

**Files:**
- Modify: `openspec/changes/normalize-project-structure-contracts/tasks.md`

- [x] **Step 1: Run required checks**

Run focused tests, `pnpm check:type`, OpenSpec validation, and git diff boundary checks.

- [x] **Step 2: Mark OpenSpec tasks complete**

Mark tasks in `openspec/changes/normalize-project-structure-contracts/tasks.md` after verification passes.

- [x] **Step 3: Summarize result**

Report files changed, checks run, and any skipped optional manifest split decision.
