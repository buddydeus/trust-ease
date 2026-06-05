# Local Item CRUD Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static item prototype with local create, edit, archive, and list behavior backed by the local trust snapshot.

**Architecture:** Keep item mutation pure under `src/store/trust`, render list/form behavior in `src/pages/items`, and keep Expo Router modules limited to i18n, storage binding, and navigation. Persist all item changes through the existing AsyncStorage-backed trust snapshot.

**Tech Stack:** Expo Router, React Native, TypeScript strict mode, AsyncStorage, React Hook Form/Zod or equivalent local validation, Jest, React Native Testing Library.

---

### Task 1: Local Item Mutation Helpers

**Files:**
- Create: `tests/store/trust/items.test.ts`
- Create: `src/store/trust/items.ts`
- Modify: `src/store/trust/index.ts`

- [x] **Step 1: Write failing helper tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Implement create/update/archive helpers**
- [x] **Step 4: Verify GREEN**

### Task 2: Items Screen Local Data UI

**Files:**
- Modify: `tests/pages/items/items-screen.test.tsx`
- Modify: `src/pages/items/ItemsScreen.tsx`
- Modify: `src/pages/items/items.styled.tsx`

- [x] **Step 1: Write failing ItemsScreen tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Render empty state and item view models**
- [x] **Step 4: Verify GREEN**

### Task 3: Item Form Create/Edit UI

**Files:**
- Modify: `tests/pages/items/item-form-screen.test.tsx`
- Modify: `src/pages/items/ItemFormScreen.tsx`
- Modify: `src/pages/items/item-form.styled.tsx`

- [x] **Step 1: Write failing form tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Implement title/kind/summary form**
- [x] **Step 4: Verify GREEN**

### Task 4: Route Storage Wiring

**Files:**
- Modify: `src/app/(tabs)/items.tsx`
- Modify: `src/app/items/new.tsx`
- Modify: `tests/pages/items/items-screen.test.tsx`
- Modify: `tests/pages/items/item-form-screen.test.tsx`

- [x] **Step 1: Add route behavior tests**
- [x] **Step 2: Verify RED**
- [x] **Step 3: Wire load/create/archive persistence**
- [x] **Step 4: Verify GREEN**

### Task 5: Localization and Final Verification

**Files:**
- Modify: `src/locals/zh-CN.json`
- Modify: `src/locals/zh-TW.json`
- Modify: `src/locals/en-US.json`
- Modify: `openspec/changes/add-local-item-crud-workflow/tasks.md`

- [x] **Step 1: Add synchronized locale copy**
- [x] **Step 2: Run focused tests and checks**
- [x] **Step 3: Run OpenSpec validation**
- [x] **Step 4: Mark OpenSpec tasks complete**
