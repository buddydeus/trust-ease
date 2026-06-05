# Local Helper Contact Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add local trusted helper/contact management and item-to-helper assignment for the standalone MVP.

**Architecture:** Keep helper/contact snapshot mutations pure in `src/store/trust`, keep route files limited to i18n/storage/navigation, and render all helper and item assignment UI through page components. Persistence remains AsyncStorage-backed local trust data only.

**Tech Stack:** Expo Router, React Native, TypeScript strict mode, AsyncStorage, Jest, React Native Testing Library, OpenSpec.

---

### Task 1: Local Helper Mutation Helpers

**Files:**
- Create: `tests/store/trust/helpers.test.ts`
- Create: `src/store/trust/helpers.ts`
- Modify: `src/store/trust/index.ts`

- [x] **Step 1: Write failing helper mutation tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Implement create/update/archive helpers**
- [x] **Step 4: Verify GREEN**

### Task 2: Item Helper Assignment Helper

**Files:**
- Modify: `tests/store/trust/helpers.test.ts`
- Modify: `src/store/trust/helpers.ts`

- [x] **Step 1: Write failing assignment tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Implement assignment helper**
- [x] **Step 4: Verify GREEN**

### Task 3: Helper List and Form UI

**Files:**
- Create: `tests/pages/helpers/helper-screen.test.tsx`
- Create: `src/pages/helpers/HelpersScreen.tsx`
- Create: `src/pages/helpers/HelperFormScreen.tsx`
- Create: `src/pages/helpers/helpers.styled.tsx`
- Create: `src/pages/helpers/helper-form.styled.tsx`

- [x] **Step 1: Write failing helper page tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Implement helper list/form screens**
- [x] **Step 4: Verify GREEN**

### Task 4: Helper Routes and Navigation Entry

**Files:**
- Create: `src/app/helpers/index.tsx`
- Create: `src/app/helpers/new.tsx`
- Create: `src/app/helpers/[id].tsx`
- Modify: `src/app/(tabs)/my.tsx`
- Modify: `src/pages/my/MyScreen.tsx`
- Modify: `src/pages/my/types.ts`
- Modify: `tests/pages/helpers/helper-screen.test.tsx`
- Modify: `tests/pages/my/my-screen.test.tsx`

- [x] **Step 1: Write failing route/navigation tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Wire helper routes and My entry**
- [x] **Step 4: Verify GREEN**

### Task 5: Item Form Helper Assignment

**Files:**
- Modify: `tests/pages/items/item-form-screen.test.tsx`
- Modify: `src/pages/items/ItemFormScreen.tsx`
- Modify: `src/pages/items/item-form.styled.tsx`
- Modify: `src/app/items/new.tsx`
- Modify: `src/app/items/[id].tsx`

- [x] **Step 1: Write failing item assignment tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Add helper choices and persistence**
- [x] **Step 4: Verify GREEN**

### Task 6: Localization and Final Verification

**Files:**
- Modify: `src/locals/zh-CN.json`
- Modify: `src/locals/zh-TW.json`
- Modify: `src/locals/en-US.json`
- Modify: `openspec/changes/add-local-helper-contact-workflow/tasks.md`

- [x] **Step 1: Add synchronized locale copy**
- [x] **Step 2: Run focused tests and checks**
- [x] **Step 3: Run OpenSpec validation**
- [x] **Step 4: Mark OpenSpec tasks complete**
