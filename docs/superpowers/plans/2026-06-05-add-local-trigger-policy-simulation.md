# Local Trigger Policy Simulation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add local-only trigger policy rehearsal/status behavior for the standalone MVP.

**Architecture:** Keep policy mutation and status derivation as pure `src/store/trust` helpers, keep `src/app/my/trigger-state.tsx` limited to i18n/storage/view-model binding, and render all trigger status UI through `src/pages/trigger-state`. Persistence remains AsyncStorage-backed local trust data only.

**Tech Stack:** Expo Router, React Native, TypeScript strict mode, AsyncStorage, Jest, React Native Testing Library, OpenSpec.

---

### Task 1: Trigger Policy Mutation Helpers

**Files:**
- Create: `tests/store/trust/trigger-policy.test.ts`
- Create: `src/store/trust/triggerPolicy.ts`
- Modify: `src/store/trust/index.ts`

- [x] **Step 1: Write failing mutation tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Implement policy mutation helpers**
- [x] **Step 4: Verify GREEN**

### Task 2: Trigger Simulation Status Resolver

**Files:**
- Modify: `tests/store/trust/trigger-policy.test.ts`
- Modify: `src/store/trust/triggerPolicy.ts`

- [x] **Step 1: Write failing resolver tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Implement status resolver**
- [x] **Step 4: Verify GREEN**

### Task 3: Trigger-State Page View Model

**Files:**
- Modify: `tests/pages/trigger-state/trigger-state-screen.test.tsx`
- Modify: `src/pages/trigger-state/TriggerStateScreen.tsx`
- Modify: `src/pages/trigger-state/trigger-state.styled.tsx`

- [x] **Step 1: Write failing page tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Implement prop-driven trigger-state UI**
- [x] **Step 4: Verify GREEN**

### Task 4: Trigger-State Route Persistence

**Files:**
- Modify: `tests/pages/trigger-state/trigger-state-screen.test.tsx`
- Modify: `src/app/my/trigger-state.tsx`

- [x] **Step 1: Write failing route persistence tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Wire route to local trust storage**
- [x] **Step 4: Verify GREEN**

### Task 5: Localization and Copy Safety

**Files:**
- Modify: `src/locals/zh-CN.json`
- Modify: `src/locals/zh-TW.json`
- Modify: `src/locals/en-US.json`
- Modify: `tests/pages/trigger-state/trigger-state-screen.test.tsx`

- [x] **Step 1: Add synchronized trigger-state copy**
- [x] **Step 2: Verify locale checks**
- [x] **Step 3: Verify unsafe trigger copy is absent**

### Task 6: Final Verification

**Files:**
- Modify: `openspec/changes/add-local-trigger-policy-simulation/tasks.md`

- [x] **Step 1: Run focused store and page tests**
- [x] **Step 2: Run type and locale checks**
- [x] **Step 3: Run OpenSpec validation**
- [x] **Step 4: Verify `.ai/` is unchanged**
- [x] **Step 5: Mark OpenSpec tasks complete**
