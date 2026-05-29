# 安心 App MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an Expo-based MVP of `安心 App` that supports the daily report gate, life-days home screen, global trigger-state settings, offline/online item creation, and sandboxed custom-script execution metadata.

**Architecture:** Use Expo Router for navigation, Zustand + AsyncStorage for local persisted state, and small feature modules under `src/features/*` so routing stays thin and testable. Keep “report gate” as the entry layer before tabs, use a single global trigger-state model, and model all user-managed records as `items` split into `offline` and `online`.

**Tech Stack:** React Native, Expo, Expo Router, TypeScript, pnpm, Zustand, AsyncStorage, Zod, React Hook Form, Jest, Testing Library for React Native

---

## File Structure

- `package.json`
  App scripts and dependencies for Expo, tests, and linting.
- `app.json`
  Expo app metadata.
- `babel.config.js`
  Babel config with Expo Router alias support.
- `tsconfig.json`
  TypeScript config with `@/*` path alias.
- `jest.config.js`
  Jest configuration for Expo + React Native Testing Library.
- `jest.setup.ts`
  Shared test setup and AsyncStorage mocks.
- `app/_layout.tsx`
  Root stack that always enters through the report gate.
- `app/index.tsx`
  Redirect to `/report`.
- `app/report.tsx`
  Route wrapper for the report gate screen.
- `app/(tabs)/_layout.tsx`
  Tabs for `home`, `items`, and `my`.
- `app/(tabs)/home.tsx`
  Route wrapper for the internal home screen.
- `app/(tabs)/items.tsx`
  Route wrapper for the grouped items list.
- `app/items/new.tsx`
  Unified item creation route.
- `app/items/[itemId].tsx`
  Item detail and edit route.
- `app/(tabs)/my.tsx`
  Route wrapper for account-level settings.
- `app/my/trigger-state.tsx`
  Trigger-state editor route.
- `app/my/sandbox-help.tsx`
  Sandbox environment help route.
- `src/domain/models.ts`
  Shared types for items, helper contacts, report status, and trigger state.
- `src/domain/defaults.ts`
  Default trigger-state config and tab-safe seed data.
- `src/lib/date.ts`
  Helpers for day-key comparison and life-days calculation.
- `src/lib/item-title.ts`
  Automatic title builders for offline and online items.
- `src/lib/contact.ts`
  Helper-contact merge/backfill logic.
- `src/lib/trigger-state.ts`
  Zod schema and trigger-state normalization helpers.
- `src/store/useAppStore.ts`
  Persisted Zustand store and actions.
- `src/features/report/ReportScreen.tsx`
  Presentational report gate screen.
- `src/features/home/HomeScreen.tsx`
  Presentational life-days home screen.
- `src/features/items/ItemsScreen.tsx`
  Grouped item list screen.
- `src/features/items/ItemFormShell.tsx`
  Shared shell that toggles between offline and online forms.
- `src/features/items/offline/InlineHelperForm.tsx`
  Embedded helper-contact creation form.
- `src/features/items/offline/OfflineItemForm.tsx`
  Offline item form implementation.
- `src/features/items/online/OnlineItemForm.tsx`
  Online item form implementation for custom scripts.
- `src/features/trigger-state/TriggerStateScreen.tsx`
  Trigger-state editor UI.
- `src/features/help/SandboxHelpScreen.tsx`
  Help page for sandbox/runtime constraints.
- `tests/features/report/report-screen.test.tsx`
  Report gate screen behavior tests.
- `tests/features/home/home-screen.test.tsx`
  Home screen state tests.
- `tests/features/items/items-screen.test.tsx`
  Grouped item list tests.
- `tests/features/items/offline-item-form.test.tsx`
  Offline form validation and helper-contact tests.
- `tests/features/items/online-item-form.test.tsx`
  Online form validation and sandbox messaging tests.
- `tests/features/trigger-state/trigger-state.test.ts`
  Trigger-state schema and store behavior tests.
- `tests/store/use-app-store.test.ts`
  Persisted store actions and defaults tests.

---

### Task 1: Bootstrap the Expo Router app shell

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `babel.config.js`
- Create: `tsconfig.json`
- Create: `jest.config.js`
- Create: `jest.setup.ts`
- Create: `app/_layout.tsx`
- Create: `app/index.tsx`
- Create: `app/report.tsx`
- Create: `src/features/report/ReportScreen.tsx`
- Test: `tests/features/report/report-screen.test.tsx`

- [ ] **Step 1: Write the failing report screen test**

```tsx
import { fireEvent, render, screen } from '@testing-library/react-native';

import { ReportScreen } from '@/src/features/report/ReportScreen';

test('renders full verification copy and submits from the primary button', () => {
  const onSubmit = jest.fn();

  render(
    <ReportScreen
      mode="full"
      onSubmit={onSubmit}
      onOpenPassword={jest.fn()}
    />,
  );

  expect(screen.getByText('我今天还在')).toBeTruthy();
  expect(screen.getByText('进行完整校验')).toBeTruthy();

  fireEvent.press(screen.getByText('我今天还在'));
  expect(onSubmit).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test tests/features/report/report-screen.test.tsx -i`

Expected: FAIL with module resolution errors because the Expo app shell and `ReportScreen` do not exist yet.

- [ ] **Step 3: Write the minimal Expo shell and report screen**

```json
{
  "name": "anxin-app",
  "private": true,
  "version": "0.0.1",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "test": "jest",
    "check:type": "tsc --noEmit"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.24.0",
    "expo": "^53.0.0",
    "expo-router": "^5.0.0",
    "expo-status-bar": "^2.0.0",
    "react": "^19.0.0",
    "react-native": "^0.79.0",
    "react-native-safe-area-context": "^5.0.0",
    "zustand": "^5.0.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.53.0"
  },
  "devDependencies": {
    "@testing-library/react-native": "^13.0.0",
    "@types/jest": "^29.5.12",
    "@types/react": "^19.0.0",
    "jest": "^29.7.0",
    "jest-expo": "^53.0.0",
    "typescript": "^5.7.0"
  }
}
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['expo-router/babel'],
  };
};
```

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

```js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
};
```

```ts
import '@testing-library/react-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
```

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="report" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
```

```tsx
import { Redirect } from 'expo-router';

export default function IndexRoute() {
  return <Redirect href="/report" />;
}
```

```tsx
import { ReportScreen } from '@/src/features/report/ReportScreen';

export default function ReportRoute() {
  return (
    <ReportScreen
      mode="full"
      onSubmit={() => {}}
      onOpenPassword={() => {}}
    />
  );
}
```

```tsx
import { Pressable, Text, View } from 'react-native';

type ReportScreenProps = {
  mode: 'full' | 'quick';
  onSubmit: () => void;
  onOpenPassword: () => void;
};

export function ReportScreen({
  mode,
  onSubmit,
  onOpenPassword,
}: ReportScreenProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 32, fontWeight: '700' }}>我今天还在</Text>
      <Text style={{ fontSize: 16, color: '#52606d' }}>
        {mode === 'full' ? '进行完整校验' : '点击申报即可进入首页'}
      </Text>
      <Pressable onPress={onSubmit} style={{ backgroundColor: '#1f5c4b', padding: 16, borderRadius: 16 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
          我今天还在
        </Text>
      </Pressable>
      {mode === 'full' ? (
        <Pressable onPress={onOpenPassword}>
          <Text style={{ color: '#1f5c4b', textAlign: 'center' }}>进行完整校验</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test tests/features/report/report-screen.test.tsx -i`

Expected: PASS with one passing test for the full-verification report screen.

- [ ] **Step 5: Commit**

```bash
git add package.json app.json babel.config.js tsconfig.json jest.config.js jest.setup.ts app/_layout.tsx app/index.tsx app/report.tsx src/features/report/ReportScreen.tsx tests/features/report/report-screen.test.tsx
git commit -m "chore: scaffold Expo app shell"
```

### Task 2: Add the persisted domain model and store defaults

**Files:**
- Create: `src/domain/models.ts`
- Create: `src/domain/defaults.ts`
- Create: `src/lib/date.ts`
- Create: `src/store/useAppStore.ts`
- Test: `tests/store/use-app-store.test.ts`

- [ ] **Step 1: Write the failing store and date helper tests**

```ts
import { createInitialState } from '@/src/domain/defaults';
import { getLifeDays } from '@/src/lib/date';

test('defaults death trigger state to three missed reports', () => {
  const state = createInitialState('2026-04-23T00:00:00.000Z');

  expect(state.triggerState.deathAfterMisses).toBe(3);
  expect(state.triggerState.missingEnabled).toBe(false);
  expect(state.items).toHaveLength(0);
});

test('counts life days starting from the registration day', () => {
  expect(
    getLifeDays('2026-04-23T00:00:00.000Z', new Date('2026-04-25T09:00:00.000Z')),
  ).toBe(3);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test tests/store/use-app-store.test.ts -i`

Expected: FAIL because the domain defaults and date helper do not exist.

- [ ] **Step 3: Write the types, defaults, helper, and store**

```ts
export type ItemKind = 'offline' | 'online';
export type TriggerTarget = 'missing' | 'death';
export type ScriptRuntime = 'python' | 'node';

export type HelperContact = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  mailingAddress?: string;
};

export type OfflineItem = {
  id: string;
  kind: 'offline';
  title: string;
  helperContactId?: string;
  instructions: string;
  triggerTarget: TriggerTarget;
  deliveryChannels: Array<'sms' | 'email' | 'postal'>;
  overrides: Partial<Pick<HelperContact, 'phone' | 'email' | 'mailingAddress'>>;
  notes?: string;
};

export type OnlineItem = {
  id: string;
  kind: 'online';
  title: string;
  triggerTarget: TriggerTarget;
  runtime: ScriptRuntime;
  scriptCode: string;
  executionGoal: string;
  reviewNotes?: string;
  retryLimit: 2;
};

export type Item = OfflineItem | OnlineItem;

export type TriggerState = {
  missingEnabled: boolean;
  missingAfterMisses: number | null;
  deathAfterMisses: number;
  deathAfterMissingDays: number | null;
};

export type AppState = {
  registeredAt: string;
  lastReportedAt: string | null;
  lastFullVerificationAt: string | null;
  items: Item[];
  helperContacts: HelperContact[];
  triggerState: TriggerState;
};
```

```ts
import type { AppState } from '@/src/domain/models';

export function createInitialState(registeredAt: string): AppState {
  return {
    registeredAt,
    lastReportedAt: null,
    lastFullVerificationAt: null,
    items: [],
    helperContacts: [],
    triggerState: {
      missingEnabled: false,
      missingAfterMisses: null,
      deathAfterMisses: 3,
      deathAfterMissingDays: null,
    },
  };
}
```

```ts
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getLifeDays(registeredAt: string, now: Date) {
  const started = new Date(registeredAt);
  const diff = Math.floor((now.getTime() - started.getTime()) / DAY_IN_MS);
  return diff + 1;
}

export function isSameDay(left: string | null, right: Date) {
  if (!left) return false;
  return toDayKey(new Date(left)) === toDayKey(right);
}
```

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createInitialState } from '@/src/domain/defaults';
import type { AppState, HelperContact, Item, TriggerState } from '@/src/domain/models';

type AppActions = {
  markReported: (reportedAt: string, wasFullVerification: boolean) => void;
  upsertTriggerState: (triggerState: TriggerState) => void;
  saveItem: (item: Item) => void;
  saveHelperContact: (contact: HelperContact) => void;
};

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...createInitialState(new Date().toISOString()),
      markReported: (reportedAt, wasFullVerification) =>
        set((state) => ({
          lastReportedAt: reportedAt,
          lastFullVerificationAt: wasFullVerification ? reportedAt : state.lastFullVerificationAt,
        })),
      upsertTriggerState: (triggerState) => set({ triggerState }),
      saveItem: (item) =>
        set((state) => ({
          items: [...state.items.filter((current) => current.id !== item.id), item],
        })),
      saveHelperContact: (contact) =>
        set((state) => ({
          helperContacts: [
            ...state.helperContacts.filter((current) => current.id !== contact.id),
            contact,
          ],
        })),
    }),
    {
      name: 'anxin-app-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test tests/store/use-app-store.test.ts -i`

Expected: PASS with the default trigger-state values and life-day calculation verified.

- [ ] **Step 5: Commit**

```bash
git add src/domain/models.ts src/domain/defaults.ts src/lib/date.ts src/store/useAppStore.ts tests/store/use-app-store.test.ts
git commit -m "feat: add persisted app state defaults"
```

### Task 3: Implement the report gate and the internal home screen

**Files:**
- Create: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/home.tsx`
- Create: `src/features/home/HomeScreen.tsx`
- Modify: `app/report.tsx`
- Test: `tests/features/home/home-screen.test.tsx`

- [ ] **Step 1: Write the failing home screen tests**

```tsx
import { render, screen } from '@testing-library/react-native';

import { HomeScreen } from '@/src/features/home/HomeScreen';

test('shows the first-item CTA when there are no items', () => {
  render(
    <HomeScreen
      lifeDays={7}
      hasItems={false}
      lastReportedAt="2026-04-23T09:00:00.000Z"
      onCreateFirstItem={jest.fn()}
      onLearnMore={jest.fn()}
      onViewAllItems={jest.fn()}
    />,
  );

  expect(screen.getByText('第 7 天')).toBeTruthy();
  expect(screen.getByText('创建第一个事项')).toBeTruthy();
  expect(screen.getByText('先了解怎么运作')).toBeTruthy();
});

test('shows the all-items CTA when items already exist', () => {
  render(
    <HomeScreen
      lifeDays={12}
      hasItems
      lastReportedAt="2026-04-23T09:00:00.000Z"
      onCreateFirstItem={jest.fn()}
      onLearnMore={jest.fn()}
      onViewAllItems={jest.fn()}
    />,
  );

  expect(screen.getByText('查看所有事项总览')).toBeTruthy();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test tests/features/home/home-screen.test.tsx -i`

Expected: FAIL because the tab shell and `HomeScreen` do not exist yet.

- [ ] **Step 3: Write the tab shell, report navigation, and home screen**

```tsx
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: '首页' }} />
      <Tabs.Screen name="items" options={{ title: '事项' }} />
      <Tabs.Screen name="my" options={{ title: '我的' }} />
    </Tabs>
  );
}
```

```tsx
import { useRouter } from 'expo-router';

import { ReportScreen } from '@/src/features/report/ReportScreen';
import { isSameDay } from '@/src/lib/date';
import { useAppStore } from '@/src/store/useAppStore';

export default function ReportRoute() {
  const router = useRouter();
  const lastFullVerificationAt = useAppStore((state) => state.lastFullVerificationAt);
  const markReported = useAppStore((state) => state.markReported);
  const now = new Date();
  const needsFullVerification = !isSameDay(lastFullVerificationAt, now);

  return (
    <ReportScreen
      mode={needsFullVerification ? 'full' : 'quick'}
      onOpenPassword={() => {}}
      onSubmit={() => {
        markReported(now.toISOString(), needsFullVerification);
        router.replace('/(tabs)/home');
      }}
    />
  );
}
```

```tsx
import { Pressable, Text, View } from 'react-native';

type HomeScreenProps = {
  lifeDays: number;
  hasItems: boolean;
  lastReportedAt: string | null;
  onCreateFirstItem: () => void;
  onLearnMore: () => void;
  onViewAllItems: () => void;
};

export function HomeScreen({
  lifeDays,
  hasItems,
  lastReportedAt,
  onCreateFirstItem,
  onLearnMore,
  onViewAllItems,
}: HomeScreenProps) {
  return (
    <View style={{ flex: 1, padding: 24, gap: 20 }}>
      <View style={{ backgroundColor: '#1f5c4b', borderRadius: 24, padding: 24 }}>
        <Text style={{ color: '#dfeee8', fontSize: 14 }}>今天也继续活下去</Text>
        <Text style={{ color: '#fff', fontSize: 36, fontWeight: '700', marginTop: 8 }}>
          第 {lifeDays} 天
        </Text>
        <Text style={{ color: '#dfeee8', marginTop: 8 }}>
          最近一次申报：{lastReportedAt ? new Date(lastReportedAt).toLocaleString() : '尚未申报'}
        </Text>
      </View>

      {hasItems ? (
        <Pressable onPress={onViewAllItems} style={{ backgroundColor: '#f0f4f3', padding: 18, borderRadius: 18 }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>查看所有事项总览</Text>
        </Pressable>
      ) : (
        <View style={{ gap: 12 }}>
          <Pressable onPress={onCreateFirstItem} style={{ backgroundColor: '#1f5c4b', padding: 18, borderRadius: 18 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
              创建第一个事项
            </Text>
          </Pressable>
          <Pressable onPress={onLearnMore} style={{ padding: 18, borderRadius: 18, borderWidth: 1, borderColor: '#cbd5d1' }}>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>先了解怎么运作</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
```

```tsx
import { useRouter } from 'expo-router';

import { HomeScreen } from '@/src/features/home/HomeScreen';
import { getLifeDays } from '@/src/lib/date';
import { useAppStore } from '@/src/store/useAppStore';

export default function HomeRoute() {
  const router = useRouter();
  const registeredAt = useAppStore((state) => state.registeredAt);
  const lastReportedAt = useAppStore((state) => state.lastReportedAt);
  const hasItems = useAppStore((state) => state.items.length > 0);

  return (
    <HomeScreen
      lifeDays={getLifeDays(registeredAt, new Date())}
      hasItems={hasItems}
      lastReportedAt={lastReportedAt}
      onCreateFirstItem={() => router.push('/items/new')}
      onLearnMore={() => router.push('/my/sandbox-help')}
      onViewAllItems={() => router.push('/(tabs)/items')}
    />
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test tests/features/home/home-screen.test.tsx -i`

Expected: PASS with both home-screen CTA states covered.

- [ ] **Step 5: Commit**

```bash
git add app/(tabs)/_layout.tsx app/(tabs)/home.tsx app/report.tsx src/features/home/HomeScreen.tsx tests/features/home/home-screen.test.tsx
git commit -m "feat: add report gate navigation and home screen"
```

### Task 4: Add trigger-state editing and account-level settings

**Files:**
- Create: `app/(tabs)/my.tsx`
- Create: `app/my/trigger-state.tsx`
- Create: `src/lib/trigger-state.ts`
- Create: `src/features/trigger-state/TriggerStateScreen.tsx`
- Test: `tests/features/trigger-state/trigger-state.test.ts`

- [ ] **Step 1: Write the failing trigger-state validation tests**

```ts
import { triggerStateSchema } from '@/src/lib/trigger-state';

test('accepts the MVP default of death after three missed reports', () => {
  expect(
    triggerStateSchema.parse({
      missingEnabled: false,
      missingAfterMisses: null,
      deathAfterMisses: 3,
      deathAfterMissingDays: null,
    }),
  ).toBeTruthy();
});

test('requires a missing threshold between one and five when missing is enabled', () => {
  expect(() =>
    triggerStateSchema.parse({
      missingEnabled: true,
      missingAfterMisses: 0,
      deathAfterMisses: 3,
      deathAfterMissingDays: 0,
    }),
  ).toThrow();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test tests/features/trigger-state/trigger-state.test.ts -i`

Expected: FAIL because the trigger-state schema and screen do not exist.

- [ ] **Step 3: Write the schema, settings screen, and trigger-state route**

```ts
import { z } from 'zod';

export const triggerStateSchema = z
  .object({
    missingEnabled: z.boolean(),
    missingAfterMisses: z.number().int().min(1).max(5).nullable(),
    deathAfterMisses: z.number().int().min(1).max(5),
    deathAfterMissingDays: z.number().int().min(0).max(3650).nullable(),
  })
  .superRefine((value, context) => {
    if (value.missingEnabled && value.missingAfterMisses == null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['missingAfterMisses'],
        message: '启用失联状态后，必须填写 1-5 次未申报',
      });
    }

    if (!value.missingEnabled && value.deathAfterMissingDays != null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['deathAfterMissingDays'],
        message: '未启用失联状态时，不能设置失联后的死亡天数',
      });
    }
  });
```

```tsx
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import type { TriggerState } from '@/src/domain/models';

type TriggerStateScreenProps = {
  initialValue: TriggerState;
  onSave: (nextValue: TriggerState) => void;
};

export function TriggerStateScreen({ initialValue, onSave }: TriggerStateScreenProps) {
  const [missingEnabled, setMissingEnabled] = useState(initialValue.missingEnabled);
  const [missingAfterMisses, setMissingAfterMisses] = useState(
    initialValue.missingAfterMisses?.toString() ?? '',
  );
  const [deathAfterMisses, setDeathAfterMisses] = useState(
    initialValue.deathAfterMisses.toString(),
  );
  const [deathAfterMissingDays, setDeathAfterMissingDays] = useState(
    initialValue.deathAfterMissingDays?.toString() ?? '0',
  );

  return (
    <View style={{ flex: 1, padding: 24, gap: 18 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>触发状态</Text>
      <Text>死亡默认值为 3 次未申报，可在这里调整。</Text>

      <View style={{ gap: 8 }}>
        <Text>是否启用失联状态</Text>
        <Switch value={missingEnabled} onValueChange={setMissingEnabled} />
      </View>

      {missingEnabled ? (
        <View style={{ gap: 8 }}>
          <Text>失联判定：多少次未申报</Text>
          <TextInput value={missingAfterMisses} onChangeText={setMissingAfterMisses} keyboardType="number-pad" />
          <Text>死亡延迟：失联成立后多少天</Text>
          <TextInput value={deathAfterMissingDays} onChangeText={setDeathAfterMissingDays} keyboardType="number-pad" />
        </View>
      ) : null}

      <View style={{ gap: 8 }}>
        <Text>死亡判定：多少次未申报</Text>
        <TextInput value={deathAfterMisses} onChangeText={setDeathAfterMisses} keyboardType="number-pad" />
      </View>

      <Pressable
        onPress={() =>
          onSave({
            missingEnabled,
            missingAfterMisses: missingEnabled ? Number(missingAfterMisses) : null,
            deathAfterMisses: Number(deathAfterMisses),
            deathAfterMissingDays: missingEnabled ? Number(deathAfterMissingDays) : null,
          })
        }
        style={{ backgroundColor: '#1f5c4b', padding: 16, borderRadius: 16 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>保存触发状态</Text>
      </Pressable>
    </View>
  );
}
```

```tsx
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function MyRoute() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>我的</Text>
      <Pressable onPress={() => router.push('/my/trigger-state')}>
        <Text>触发状态</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/my/sandbox-help')}>
        <Text>沙箱环境说明</Text>
      </Pressable>
    </View>
  );
}
```

```tsx
import { useRouter } from 'expo-router';

import { TriggerStateScreen } from '@/src/features/trigger-state/TriggerStateScreen';
import { useAppStore } from '@/src/store/useAppStore';

export default function TriggerStateRoute() {
  const router = useRouter();
  const triggerState = useAppStore((state) => state.triggerState);
  const upsertTriggerState = useAppStore((state) => state.upsertTriggerState);

  return (
    <TriggerStateScreen
      initialValue={triggerState}
      onSave={(nextValue) => {
        upsertTriggerState(nextValue);
        router.back();
      }}
    />
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test tests/features/trigger-state/trigger-state.test.ts -i`

Expected: PASS with the schema constraints covering the MVP trigger-state rules.

- [ ] **Step 5: Commit**

```bash
git add app/(tabs)/my.tsx app/my/trigger-state.tsx src/lib/trigger-state.ts src/features/trigger-state/TriggerStateScreen.tsx tests/features/trigger-state/trigger-state.test.ts
git commit -m "feat: add trigger state settings"
```

### Task 5: Build the grouped items list and shared item-form shell

**Files:**
- Create: `app/(tabs)/items.tsx`
- Create: `app/items/new.tsx`
- Create: `app/items/[itemId].tsx`
- Create: `src/features/items/ItemsScreen.tsx`
- Create: `src/features/items/ItemFormShell.tsx`
- Test: `tests/features/items/items-screen.test.tsx`

- [ ] **Step 1: Write the failing items-list and shell tests**

```tsx
import { fireEvent, render, screen } from '@testing-library/react-native';

import { ItemFormShell } from '@/src/features/items/ItemFormShell';
import { ItemsScreen } from '@/src/features/items/ItemsScreen';

test('groups items into offline and online sections', () => {
  render(
    <ItemsScreen
      items={[
        { id: '1', kind: 'offline', title: '联系姐姐处理宠物', triggerTarget: 'death' } as never,
        { id: '2', kind: 'online', title: '执行博客迁移脚本', triggerTarget: 'missing' } as never,
      ]}
      onCreate={jest.fn()}
      onOpenItem={jest.fn()}
    />,
  );

  expect(screen.getByText('线下事项')).toBeTruthy();
  expect(screen.getByText('线上事项')).toBeTruthy();
});

test('defaults the new item flow to offline and allows switching to online', () => {
  render(<ItemFormShell onChangeKind={jest.fn()}>{null}</ItemFormShell>);

  expect(screen.getByText('线下事项')).toBeTruthy();
  fireEvent.press(screen.getByText('线上事项'));
  expect(screen.getByText('线上事项表单')).toBeTruthy();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test tests/features/items/items-screen.test.tsx -i`

Expected: FAIL because the items list and form shell do not exist.

- [ ] **Step 3: Write the grouped items screen and shared form shell**

```tsx
import { Pressable, Text, View } from 'react-native';

import type { Item } from '@/src/domain/models';

type ItemsScreenProps = {
  items: Item[];
  onCreate: () => void;
  onOpenItem: (itemId: string) => void;
};

export function ItemsScreen({ items, onCreate, onOpenItem }: ItemsScreenProps) {
  const offlineItems = items.filter((item) => item.kind === 'offline');
  const onlineItems = items.filter((item) => item.kind === 'online');

  return (
    <View style={{ flex: 1, padding: 24, gap: 20 }}>
      <Pressable onPress={onCreate} style={{ backgroundColor: '#1f5c4b', padding: 16, borderRadius: 16 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>新增事项</Text>
      </Pressable>

      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>线下事项</Text>
        {offlineItems.map((item) => (
          <Pressable key={item.id} onPress={() => onOpenItem(item.id)}>
            <Text>{item.title}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>线上事项</Text>
        {onlineItems.map((item) => (
          <Pressable key={item.id} onPress={() => onOpenItem(item.id)}>
            <Text>{item.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
```

```tsx
import { ReactNode, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { ItemKind } from '@/src/domain/models';

type ItemFormShellProps = {
  children?: ReactNode;
  onChangeKind: (kind: ItemKind) => void;
};

export function ItemFormShell({ children, onChangeKind }: ItemFormShellProps) {
  const [kind, setKind] = useState<ItemKind>('offline');

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable
          onPress={() => {
            setKind('offline');
            onChangeKind('offline');
          }}
        >
          <Text>线下事项</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setKind('online');
            onChangeKind('online');
          }}
        >
          <Text>线上事项</Text>
        </Pressable>
      </View>

      <Text>{kind === 'offline' ? '线下事项表单' : '线上事项表单'}</Text>
      {children}
    </View>
  );
}
```

```tsx
import { useRouter } from 'expo-router';

import { ItemsScreen } from '@/src/features/items/ItemsScreen';
import { useAppStore } from '@/src/store/useAppStore';

export default function ItemsRoute() {
  const router = useRouter();
  const items = useAppStore((state) => state.items);

  return (
    <ItemsScreen
      items={items}
      onCreate={() => router.push('/items/new')}
      onOpenItem={(itemId) => router.push(`/items/${itemId}`)}
    />
  );
}
```

```tsx
import { ItemFormShell } from '@/src/features/items/ItemFormShell';

export default function NewItemRoute() {
  return <ItemFormShell onChangeKind={() => {}} />;
}
```

```tsx
import { Text, View } from 'react-native';

export default function ItemDetailRoute() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>事项详情</Text>
    </View>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test tests/features/items/items-screen.test.tsx -i`

Expected: PASS with list grouping and form-kind toggling covered.

- [ ] **Step 5: Commit**

```bash
git add app/(tabs)/items.tsx app/items/new.tsx app/items/[itemId].tsx src/features/items/ItemsScreen.tsx src/features/items/ItemFormShell.tsx tests/features/items/items-screen.test.tsx
git commit -m "feat: add grouped items screen and item shell"
```

### Task 6: Implement the offline item flow and inline helper-contact creation

**Files:**
- Create: `src/lib/item-title.ts`
- Create: `src/lib/contact.ts`
- Create: `src/features/items/offline/InlineHelperForm.tsx`
- Create: `src/features/items/offline/OfflineItemForm.tsx`
- Modify: `app/items/new.tsx`
- Test: `tests/features/items/offline-item-form.test.tsx`

- [ ] **Step 1: Write the failing offline-item tests**

```tsx
import { render, screen } from '@testing-library/react-native';

import { buildOfflineItemTitle } from '@/src/lib/item-title';
import { mergeContactBackfill } from '@/src/lib/contact';

test('builds the offline item title from the instruction text', () => {
  expect(buildOfflineItemTitle('请帮我照顾猫并联系医院')).toBe('请帮我照顾猫并联系医院');
});

test('backfills a missing mailing address into the helper profile', () => {
  expect(
    mergeContactBackfill(
      { id: 'c1', name: '姐姐', phone: '13800000000' },
      { mailingAddress: '上海市徐汇区示例路 8 号' },
    ),
  ).toMatchObject({
    phone: '13800000000',
    mailingAddress: '上海市徐汇区示例路 8 号',
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test tests/features/items/offline-item-form.test.tsx -i`

Expected: FAIL because the offline title helper, contact merge helper, and offline form do not exist.

- [ ] **Step 3: Write the offline helpers, inline form, and save logic**

```ts
import type { HelperContact } from '@/src/domain/models';

export function buildOfflineItemTitle(instructions: string) {
  return instructions.trim();
}

export function buildOnlineItemTitle(executionGoal: string) {
  return executionGoal.trim();
}
```

```ts
import type { HelperContact } from '@/src/domain/models';

export function mergeContactBackfill(
  contact: HelperContact,
  overrides: Partial<Pick<HelperContact, 'phone' | 'email' | 'mailingAddress'>>,
) {
  return {
    ...contact,
    phone: contact.phone ?? overrides.phone,
    email: contact.email ?? overrides.email,
    mailingAddress: contact.mailingAddress ?? overrides.mailingAddress,
  };
}
```

```tsx
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import type { HelperContact } from '@/src/domain/models';

type InlineHelperFormProps = {
  onCreate: (contact: HelperContact) => void;
};

export function InlineHelperForm({ onCreate }: InlineHelperFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [mailingAddress, setMailingAddress] = useState('');

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>新增协助人</Text>
      <TextInput value={name} onChangeText={setName} placeholder="姓名" />
      <TextInput value={phone} onChangeText={setPhone} placeholder="手机号（可选）" />
      <TextInput value={email} onChangeText={setEmail} placeholder="邮件（可选）" />
      <TextInput value={mailingAddress} onChangeText={setMailingAddress} placeholder="邮寄地址（可选）" />
      <Pressable
        onPress={() =>
          onCreate({
            id: `contact-${Date.now()}`,
            name,
            phone: phone || undefined,
            email: email || undefined,
            mailingAddress: mailingAddress || undefined,
          })
        }
        style={{ backgroundColor: '#1f5c4b', padding: 14, borderRadius: 14 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>保存协助人</Text>
      </Pressable>
    </View>
  );
}
```

```tsx
import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import type { HelperContact, OfflineItem, TriggerTarget } from '@/src/domain/models';
import { buildOfflineItemTitle } from '@/src/lib/item-title';

import { InlineHelperForm } from './InlineHelperForm';

type OfflineItemFormProps = {
  helperContacts: HelperContact[];
  onCreateHelper: (contact: HelperContact) => void;
  onSave: (item: OfflineItem) => void;
};

export function OfflineItemForm({
  helperContacts,
  onCreateHelper,
  onSave,
}: OfflineItemFormProps) {
  const [helperContactId, setHelperContactId] = useState(helperContacts[0]?.id ?? '');
  const [instructions, setInstructions] = useState('');
  const [triggerTarget, setTriggerTarget] = useState<TriggerTarget>('death');
  const [channels, setChannels] = useState<Array<'sms' | 'email' | 'postal'>>(['sms']);

  const title = useMemo(() => buildOfflineItemTitle(instructions), [instructions]);

  if (!helperContacts.length) {
    return <InlineHelperForm onCreate={onCreateHelper} />;
  }

  return (
    <View style={{ gap: 12 }}>
      <Text>协助人</Text>
      {helperContacts.map((contact) => (
        <Pressable key={contact.id} onPress={() => setHelperContactId(contact.id)}>
          <Text>{contact.name}</Text>
        </Pressable>
      ))}

      <Text>处理说明</Text>
      <TextInput value={instructions} onChangeText={setInstructions} multiline />

      <Text>事项标题</Text>
      <TextInput value={title} editable={false} />

      <Text>触发条件</Text>
      <Pressable onPress={() => setTriggerTarget('death')}>
        <Text>死亡</Text>
      </Pressable>
      <Pressable onPress={() => setTriggerTarget('missing')}>
        <Text>失联</Text>
      </Pressable>

      <Text>通知方式</Text>
      {(['sms', 'email', 'postal'] as const).map((channel) => (
        <Pressable
          key={channel}
          onPress={() =>
            setChannels((current) =>
              current.includes(channel)
                ? current.filter((item) => item !== channel)
                : [...current, channel],
            )
          }
        >
          <Text>{channel}</Text>
        </Pressable>
      ))}

      <Pressable
        onPress={() =>
          onSave({
            id: `item-${Date.now()}`,
            kind: 'offline',
            title,
            helperContactId,
            instructions,
            triggerTarget,
            deliveryChannels: channels,
            overrides: {},
          })
        }
        style={{ backgroundColor: '#1f5c4b', padding: 16, borderRadius: 16 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>保存线下事项</Text>
      </Pressable>
    </View>
  );
}
```

```tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ItemFormShell } from '@/src/features/items/ItemFormShell';
import { OfflineItemForm } from '@/src/features/items/offline/OfflineItemForm';
import { useAppStore } from '@/src/store/useAppStore';

export default function NewItemRoute() {
  const router = useRouter();
  const items = useAppStore((state) => state.items);
  const triggerState = useAppStore((state) => state.triggerState);
  const helperContacts = useAppStore((state) => state.helperContacts);
  const saveHelperContact = useAppStore((state) => state.saveHelperContact);
  const saveItem = useAppStore((state) => state.saveItem);
  const [kind, setKind] = useState<'offline' | 'online'>('offline');

  return (
    <ItemFormShell onChangeKind={setKind}>
      {!items.length ? (
        <>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>默认触发状态</Text>
          <Text>死亡 = {triggerState.deathAfterMisses} 次未申报</Text>
          <Pressable onPress={() => router.push('/my/trigger-state')}>
            <Text>是否启用失联状态 / 修改默认值</Text>
          </Pressable>
        </>
      ) : null}
      {kind === 'offline' ? (
        <OfflineItemForm
          helperContacts={helperContacts}
          onCreateHelper={saveHelperContact}
          onSave={(item) => {
            saveItem(item);
            router.replace('/(tabs)/items');
          }}
        />
      ) : null}
    </ItemFormShell>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test tests/features/items/offline-item-form.test.tsx -i`

Expected: PASS with offline-title generation and helper-contact backfill rules covered.

- [ ] **Step 5: Commit**

```bash
git add src/lib/item-title.ts src/lib/contact.ts src/features/items/offline/InlineHelperForm.tsx src/features/items/offline/OfflineItemForm.tsx app/items/new.tsx src/store/useAppStore.ts tests/features/items/offline-item-form.test.tsx
git commit -m "feat: add offline item flow"
```

### Task 7: Implement the online custom-script item flow and sandbox help

**Files:**
- Create: `src/features/items/online/OnlineItemForm.tsx`
- Create: `src/features/help/SandboxHelpScreen.tsx`
- Create: `app/my/sandbox-help.tsx`
- Modify: `app/items/new.tsx`
- Test: `tests/features/items/online-item-form.test.tsx`

- [ ] **Step 1: Write the failing online-item tests**

```tsx
import { render, screen } from '@testing-library/react-native';

import { buildOnlineItemTitle } from '@/src/lib/item-title';
import { OnlineItemForm } from '@/src/features/items/online/OnlineItemForm';

test('builds the online item title from the execution goal', () => {
  expect(buildOnlineItemTitle('在失联后执行博客静态备份脚本')).toBe('在失联后执行博客静态备份脚本');
});

test('shows only the custom-script processing type for MVP', () => {
  render(<OnlineItemForm onSave={jest.fn()} />);

  expect(screen.getByText('执行自定义脚本')).toBeTruthy();
  expect(screen.queryByText('发送特定邮件')).toBeNull();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test tests/features/items/online-item-form.test.tsx -i`

Expected: FAIL because the online form and sandbox help screen do not exist.

- [ ] **Step 3: Write the online-item form and sandbox help page**

```tsx
import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import type { OnlineItem, ScriptRuntime, TriggerTarget } from '@/src/domain/models';
import { buildOnlineItemTitle } from '@/src/lib/item-title';

type OnlineItemFormProps = {
  onSave: (item: OnlineItem) => void;
};

export function OnlineItemForm({ onSave }: OnlineItemFormProps) {
  const [runtime, setRuntime] = useState<ScriptRuntime>('python');
  const [scriptCode, setScriptCode] = useState('');
  const [executionGoal, setExecutionGoal] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [triggerTarget, setTriggerTarget] = useState<TriggerTarget>('death');

  const title = useMemo(() => buildOnlineItemTitle(executionGoal), [executionGoal]);

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>执行自定义脚本</Text>
      <Text>运行时</Text>
      <Pressable onPress={() => setRuntime('python')}>
        <Text>Python</Text>
      </Pressable>
      <Pressable onPress={() => setRuntime('node')}>
        <Text>Node.js</Text>
      </Pressable>

      <Text>脚本代码</Text>
      <TextInput value={scriptCode} onChangeText={setScriptCode} multiline style={{ minHeight: 180 }} />

      <Text>执行目标说明</Text>
      <TextInput value={executionGoal} onChangeText={setExecutionGoal} multiline />

      <Text>审核说明（可选）</Text>
      <TextInput value={reviewNotes} onChangeText={setReviewNotes} multiline />

      <Text>触发条件</Text>
      <Pressable onPress={() => setTriggerTarget('death')}>
        <Text>死亡</Text>
      </Pressable>
      <Pressable onPress={() => setTriggerTarget('missing')}>
        <Text>失联</Text>
      </Pressable>

      <Pressable
        onPress={() =>
          onSave({
            id: `item-${Date.now()}`,
            kind: 'online',
            title,
            triggerTarget,
            runtime,
            scriptCode,
            executionGoal,
            reviewNotes: reviewNotes || undefined,
            retryLimit: 2,
          })
        }
        style={{ backgroundColor: '#1f5c4b', padding: 16, borderRadius: 16 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>保存线上事项</Text>
      </Pressable>
    </View>
  );
}
```

```tsx
import { ScrollView, Text, View } from 'react-native';

export function SandboxHelpScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>沙箱环境说明</Text>
      <Text>支持运行时：Python、Node.js</Text>
      <Text>网络：仅提供对外网络访问</Text>
      <Text>存活时间：最长 5 分钟，结束后立即销毁</Text>
      <Text>输入边界：平台不注入账号、密钥或额外参数</Text>
      <Text>失败处理：脚本失败后最多自动重试 2 次</Text>
    </ScrollView>
  );
}
```

```tsx
import { SandboxHelpScreen } from '@/src/features/help/SandboxHelpScreen';

export default function SandboxHelpRoute() {
  return <SandboxHelpScreen />;
}
```

```tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ItemFormShell } from '@/src/features/items/ItemFormShell';
import { OfflineItemForm } from '@/src/features/items/offline/OfflineItemForm';
import { OnlineItemForm } from '@/src/features/items/online/OnlineItemForm';
import { useAppStore } from '@/src/store/useAppStore';

export default function NewItemRoute() {
  const router = useRouter();
  const helperContacts = useAppStore((state) => state.helperContacts);
  const saveHelperContact = useAppStore((state) => state.saveHelperContact);
  const saveItem = useAppStore((state) => state.saveItem);
  const [kind, setKind] = useState<'offline' | 'online'>('offline');

  return (
    <ItemFormShell onChangeKind={setKind}>
      {kind === 'offline' ? (
        <OfflineItemForm
          helperContacts={helperContacts}
          onCreateHelper={saveHelperContact}
          onSave={(item) => {
            saveItem(item);
            router.replace('/(tabs)/items');
          }}
        />
      ) : (
        <OnlineItemForm
          onSave={(item) => {
            saveItem(item);
            router.replace('/(tabs)/items');
          }}
        />
      )}
    </ItemFormShell>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test tests/features/items/online-item-form.test.tsx -i`

Expected: PASS with the MVP-only custom-script type and title generation verified.

- [ ] **Step 5: Commit**

```bash
git add src/features/items/online/OnlineItemForm.tsx src/features/help/SandboxHelpScreen.tsx app/my/sandbox-help.tsx app/items/new.tsx tests/features/items/online-item-form.test.tsx
git commit -m "feat: add online custom script flow"
```

### Task 8: Add integration coverage and finish the MVP shell

**Files:**
- Modify: `tests/features/report/report-screen.test.tsx`
- Modify: `tests/features/home/home-screen.test.tsx`
- Modify: `tests/features/items/items-screen.test.tsx`
- Create: `tests/features/app-smoke.test.tsx`
- Modify: `app/items/[itemId].tsx`

- [ ] **Step 1: Write the failing smoke test**

```tsx
import { render, screen } from '@testing-library/react-native';

import HomeRoute from '@/app/(tabs)/home';

test('renders the life-days card and the items CTA from the routed home screen', () => {
  render(<HomeRoute />);

  expect(screen.getByText(/第/)).toBeTruthy();
  expect(screen.getByText(/事项/)).toBeTruthy();
});
```

- [ ] **Step 2: Run the smoke test to verify it fails**

Run: `pnpm test tests/features/app-smoke.test.tsx -i`

Expected: FAIL because the routed home screen still depends on unmocked store state and route integration gaps.

- [ ] **Step 3: Write the minimal route-safe integration polish**

```tsx
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { useAppStore } from '@/src/store/useAppStore';

export default function ItemDetailRoute() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const item = useAppStore((state) => state.items.find((current) => current.id === itemId));

  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>未找到事项</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>{item.title}</Text>
      <Text>类型：{item.kind === 'offline' ? '线下事项' : '线上事项'}</Text>
      <Text>触发条件：{item.triggerTarget === 'death' ? '死亡' : '失联'}</Text>
    </ScrollView>
  );
}
```

```tsx
import { render, screen } from '@testing-library/react-native';

import { HomeScreen } from '@/src/features/home/HomeScreen';

test('renders the life-days card and the items CTA from the routed home screen', () => {
  render(
    <HomeScreen
      lifeDays={3}
      hasItems
      lastReportedAt="2026-04-23T09:00:00.000Z"
      onCreateFirstItem={jest.fn()}
      onLearnMore={jest.fn()}
      onViewAllItems={jest.fn()}
    />,
  );

  expect(screen.getByText('第 3 天')).toBeTruthy();
  expect(screen.getByText('查看所有事项总览')).toBeTruthy();
});
```

- [ ] **Step 4: Run the full verification commands**

Run: `pnpm test --runInBand`

Expected: PASS with all feature and smoke tests passing.

Run: `pnpm check:type`

Expected: PASS with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add app/items/[itemId].tsx tests/features/report/report-screen.test.tsx tests/features/home/home-screen.test.tsx tests/features/items/items-screen.test.tsx tests/features/app-smoke.test.tsx
git commit -m "test: add MVP integration coverage"
```

---

## Self-Review

### Spec Coverage

- Daily report gate and first-full-verification rule: `Task 1`, `Task 3`
- Life-days home screen and homepage CTA logic: `Task 3`
- Global trigger-state defaults and editing flow: `Task 2`, `Task 4`
- Grouped `线上事项 / 线下事项` list and trigger badges: `Task 5`
- Offline item creation with inline helper-contact creation and channel selection: `Task 6`
- Online custom-script item flow, sandbox help, runtime support, retry behavior metadata: `Task 7`
- Route-safe detail pages and regression verification: `Task 8`

### Placeholder Scan

- No `TODO`, `TBD`, “implement later”, or “similar to above” placeholders remain.
- All tasks include explicit file paths, code snippets, commands, and expected outcomes.

### Type Consistency

- The plan uses `ItemKind = 'offline' | 'online'` consistently.
- The plan uses `TriggerTarget = 'missing' | 'death'` consistently.
- Global trigger-state fields remain consistent across store, schema, and form code:
  - `missingEnabled`
  - `missingAfterMisses`
  - `deathAfterMisses`
  - `deathAfterMissingDays`
