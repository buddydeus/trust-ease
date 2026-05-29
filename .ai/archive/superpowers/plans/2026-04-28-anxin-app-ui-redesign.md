# 安心 App UI 重设计 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Expo-based `安心 App` MVP UI using the confirmed redesign direction: calm daily-safety home, lighter item management, guided item creation, and low-pressure settings/trigger-state pages with Expo UI-first controls.

**Architecture:** Keep the existing MVP app architecture from the earlier spec: Expo Router for navigation, Zustand + AsyncStorage for local persisted state, and feature folders under `src/features/*`. Add a thin UI layer under `src/ui/*` for shared page shells, cards, pills, floating actions, and typography so the redesigned look is consistent while form controls still come from Expo UI.

**Tech Stack:** React Native, Expo, Expo Router, TypeScript, pnpm, Zustand, AsyncStorage, Zod, React Hook Form, Jest, Testing Library for React Native, `@expo/ui`

---

## File Structure

- `package.json`
  App dependencies, scripts, and Expo UI package install target.
- `app/_layout.tsx`
  Root stack with hidden headers and app-wide background.
- `app/index.tsx`
  Redirect to `/report`.
- `app/report.tsx`
  Report entry route.
- `app/(tabs)/_layout.tsx`
  Tabs for `home`, `items`, and `my`.
- `app/(tabs)/home.tsx`
  Home route wrapper.
- `app/(tabs)/items.tsx`
  Items route wrapper.
- `app/items/new.tsx`
  New item route wrapper.
- `app/(tabs)/my.tsx`
  My route wrapper.
- `app/my/trigger-state.tsx`
  Trigger-state route wrapper.
- `src/design/tokens.ts`
  Color, spacing, radius, and typography tokens for the redesign.
- `src/ui/AppScreen.tsx`
  Shared page container with safe-area padding and background.
- `src/ui/AppCard.tsx`
  Shared rounded card shell.
- `src/ui/AppText.tsx`
  Shared text primitive for title/body/caption density.
- `src/ui/AppPill.tsx`
  Shared compact pill used by items filters.
- `src/ui/FloatingAddButton.tsx`
  Shared circular `+` action used on the items screen.
- `src/ui/SectionHint.tsx`
  Shared centered helper text like “向下滚动后继续查看其他事项”.
- `src/domain/models.ts`
  Shared types for report state, items, helper contacts, and trigger state.
- `src/domain/defaults.ts`
  Seed data and default trigger-state values.
- `src/store/useAppStore.ts`
  Persisted app store.
- `src/features/report/ReportScreen.tsx`
  Daily report gate UI.
- `src/features/home/HomeScreen.tsx`
  Redesigned home screen.
- `src/features/items/ItemsScreen.tsx`
  Redesigned items list screen.
- `src/features/items/ItemFormScreen.tsx`
  Guided new-item screen shell.
- `src/features/my/MyScreen.tsx`
  My page with status summary and settings groups.
- `src/features/trigger-state/TriggerStateScreen.tsx`
  Calm trigger-state settings UI.
- `tests/features/report/report-screen.test.tsx`
  Report gate behavior tests.
- `tests/features/home/home-screen.test.tsx`
  Home screen content tests.
- `tests/features/items/items-screen.test.tsx`
  Items list screen content and action placement tests.
- `tests/features/items/item-form-screen.test.tsx`
  Guided creation screen tests.
- `tests/features/my/my-screen.test.tsx`
  My screen content tests.
- `tests/features/trigger-state/trigger-state-screen.test.tsx`
  Trigger-state screen content tests.
- `tests/features/routes/tab-routes.test.tsx`
  Smoke test for the tab route wrappers.

---

### Task 1: Bootstrap the Expo app shell with Expo UI and the report gate

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

test('renders the daily safety gate and submits from the primary action', () => {
  const onSubmit = jest.fn();

  render(
    <ReportScreen
      mode="full"
      onSubmit={onSubmit}
      onOpenPassword={jest.fn()}
    />,
  );

  expect(screen.getByText('我今天还在')).toBeTruthy();
  expect(screen.getByText('进行完整确认')).toBeTruthy();

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
    "@expo/ui": "latest",
    "@react-native-async-storage/async-storage": "^1.24.0",
    "expo": "^53.0.0",
    "expo-router": "^5.0.0",
    "expo-status-bar": "^2.0.0",
    "react": "^19.0.0",
    "react-hook-form": "^7.53.0",
    "react-native": "^0.79.0",
    "react-native-safe-area-context": "^5.0.0",
    "zod": "^3.23.0",
    "zustand": "^5.0.0"
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

```json
{
  "expo": {
    "name": "安心",
    "slug": "anxin-app",
    "scheme": "anxin",
    "plugins": ["expo-router"],
    "experiments": {
      "typedRoutes": true
    }
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
}: ReportScreenProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>
        {mode === 'full' ? '进行完整确认' : '快速确认'}
      </Text>
      <Pressable onPress={onSubmit}>
        <Text style={{ fontSize: 24 }}>我今天还在</Text>
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test tests/features/report/report-screen.test.tsx -i`

Expected: PASS with 1 passing test.

- [ ] **Step 5: Commit**

```bash
git add package.json app.json babel.config.js tsconfig.json jest.config.js jest.setup.ts app/_layout.tsx app/index.tsx app/report.tsx src/features/report/ReportScreen.tsx tests/features/report/report-screen.test.tsx
git commit -m "feat: bootstrap expo app shell"
```

---

### Task 2: Add redesign tokens, shared UI primitives, and the calm home screen

**Files:**
- Create: `src/design/tokens.ts`
- Create: `src/ui/AppScreen.tsx`
- Create: `src/ui/AppCard.tsx`
- Create: `src/ui/AppText.tsx`
- Create: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/home.tsx`
- Create: `src/domain/models.ts`
- Create: `src/domain/defaults.ts`
- Create: `src/store/useAppStore.ts`
- Create: `src/features/home/HomeScreen.tsx`
- Test: `tests/features/home/home-screen.test.tsx`

- [ ] **Step 1: Write the failing home screen test**

```tsx
import { render, screen } from '@testing-library/react-native';

import { HomeScreen } from '@/src/features/home/HomeScreen';

test('renders the encouraging daily-safe hero without next-check reminder copy', () => {
  render(
    <HomeScreen
      summary={{
        streakDays: 128,
        itemCount: 6,
        helperCount: 3,
      }}
    />,
  );

  expect(screen.getByText('今天也好好生活着')).toBeTruthy();
  expect(screen.getByText('128')).toBeTruthy();
  expect(screen.queryByText('下一次确认')).toBeNull();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test tests/features/home/home-screen.test.tsx -i`

Expected: FAIL because `HomeScreen` and the shared UI primitives do not exist yet.

- [ ] **Step 3: Create redesign tokens and shared page primitives**

```ts
export const colors = {
  page: '#F7FBFA',
  card: '#FFFFFF',
  border: '#DEEBE6',
  muted: '#6F837D',
  text: '#243F39',
  accent: '#86B1A2',
  accentSoft: '#EEF5F2',
  offlineRibbon: '#DBEAE6',
  onlineRibbon: '#EADFDB',
};

export const radius = {
  screen: 28,
  card: 24,
  pill: 999,
};

export const type = {
  title: 23,
  section: 15,
  body: 15,
  caption: 12,
};
```

```tsx
import { SafeAreaView, View, type ViewProps } from 'react-native';

import { colors } from '@/src/design/tokens';

export function AppScreen(props: ViewProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }}>
      <View style={{ flex: 1, padding: 22 }} {...props} />
    </SafeAreaView>
  );
}
```

```tsx
import { View, type ViewProps } from 'react-native';

import { colors, radius } from '@/src/design/tokens';

export function AppCard(props: ViewProps) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.card,
        padding: 18,
      }}
      {...props}
    />
  );
}
```

```tsx
import { Text, type TextProps } from 'react-native';

import { colors, type } from '@/src/design/tokens';

export function AppText({
  style,
  ...props
}: TextProps) {
  return (
    <Text
      style={[{ color: colors.text, fontSize: type.body }, style]}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Implement tabs, seed state, and the redesigned home screen**

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

```ts
export type HomeSummary = {
  streakDays: number;
  itemCount: number;
  helperCount: number;
};
```

```ts
import { create } from 'zustand';

export const defaultHomeSummary = {
  streakDays: 128,
  itemCount: 6,
  helperCount: 3,
};

type AppState = {
  homeSummary: typeof defaultHomeSummary;
};

export const useAppStore = create<AppState>(() => ({
  homeSummary: defaultHomeSummary,
}));
```

```tsx
import { Pressable, View } from 'react-native';

import { AppCard } from '@/src/ui/AppCard';
import { AppScreen } from '@/src/ui/AppScreen';
import { AppText } from '@/src/ui/AppText';
import { colors, type } from '@/src/design/tokens';

import type { HomeSummary } from '@/src/domain/models';

export function HomeScreen({ summary }: { summary: HomeSummary }) {
  return (
    <AppScreen>
      <AppCard>
        <AppText style={{ fontSize: type.caption, color: colors.muted }}>
          今日状态
        </AppText>
        <AppText style={{ fontSize: 30, fontWeight: '700', marginTop: 8 }}>
          今天也好好生活着
        </AppText>
        <View
          style={{
            marginTop: 18,
            padding: 16,
            backgroundColor: colors.accentSoft,
            borderRadius: 20,
          }}
        >
          <AppText style={{ fontSize: type.caption, color: colors.muted }}>
            已连续平安记录
          </AppText>
          <AppText style={{ fontSize: 38, fontWeight: '700', marginTop: 8 }}>
            {summary.streakDays}
          </AppText>
        </View>
        <Pressable
          style={{
            marginTop: 16,
            backgroundColor: colors.accent,
            borderRadius: 18,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <AppText style={{ color: '#FFFFFF' }}>查看本次确认</AppText>
        </Pressable>
      </AppCard>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
        <AppCard style={{ flex: 1 }}>
          <AppText style={{ fontSize: type.caption, color: colors.muted }}>
            事项
          </AppText>
          <AppText style={{ fontSize: 24, fontWeight: '700', marginTop: 8 }}>
            {summary.itemCount}
          </AppText>
        </AppCard>
        <AppCard style={{ flex: 1 }}>
          <AppText style={{ fontSize: type.caption, color: colors.muted }}>
            协助人
          </AppText>
          <AppText style={{ fontSize: 24, fontWeight: '700', marginTop: 8 }}>
            {summary.helperCount}
          </AppText>
        </AppCard>
      </View>
    </AppScreen>
  );
}
```

- [ ] **Step 5: Run the home test to verify it passes**

Run: `pnpm test tests/features/home/home-screen.test.tsx -i`

Expected: PASS with the encouraging home hero and no “下一次确认” copy.

- [ ] **Step 6: Commit**

```bash
git add app/\(tabs\)/_layout.tsx app/\(tabs\)/home.tsx src/design/tokens.ts src/ui/AppScreen.tsx src/ui/AppCard.tsx src/ui/AppText.tsx src/domain/models.ts src/domain/defaults.ts src/store/useAppStore.ts src/features/home/HomeScreen.tsx tests/features/home/home-screen.test.tsx
git commit -m "feat: add redesigned home screen"
```

---

### Task 3: Build the lighter items list and the guided new-item screen

**Files:**
- Create: `src/ui/AppPill.tsx`
- Create: `src/ui/FloatingAddButton.tsx`
- Create: `src/ui/SectionHint.tsx`
- Create: `app/(tabs)/items.tsx`
- Create: `app/items/new.tsx`
- Create: `src/features/items/ItemsScreen.tsx`
- Create: `src/features/items/ItemFormScreen.tsx`
- Test: `tests/features/items/items-screen.test.tsx`
- Test: `tests/features/items/item-form-screen.test.tsx`

- [ ] **Step 1: Write the failing items screen and item-form tests**

```tsx
import { render, screen } from '@testing-library/react-native';

import { ItemsScreen } from '@/src/features/items/ItemsScreen';

test('renders the clean items header with a circular add action and no total count', () => {
  render(<ItemsScreen />);

  expect(screen.getByText('重要事项')).toBeTruthy();
  expect(screen.queryByText('ITEMS')).toBeNull();
  expect(screen.queryByText('共 6 项')).toBeNull();
  expect(screen.getByText('向下滚动后继续查看其他事项')).toBeTruthy();
});
```

```tsx
import { render, screen } from '@testing-library/react-native';

import { ItemFormScreen } from '@/src/features/items/ItemFormScreen';

test('renders the guided creation flow instead of a long raw form', () => {
  render(<ItemFormScreen />);

  expect(screen.getByText('先写第一件事')).toBeTruthy();
  expect(screen.getByText('事项类型')).toBeTruthy();
  expect(screen.getByText('选择协助人')).toBeTruthy();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test tests/features/items/items-screen.test.tsx tests/features/items/item-form-screen.test.tsx -i`

Expected: FAIL because the items feature files do not exist yet.

- [ ] **Step 3: Add shared item-page primitives**

```tsx
import { View } from 'react-native';

import { colors } from '@/src/design/tokens';
import { AppText } from '@/src/ui/AppText';

export function AppPill({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: active ? colors.accent : '#FFFFFF',
        borderWidth: active ? 0 : 1,
        borderColor: colors.border,
      }}
    >
      <AppText style={{ color: active ? '#FFFFFF' : '#466059', fontSize: 12 }}>
        {label}
      </AppText>
    </View>
  );
}
```

```tsx
import { Pressable } from 'react-native';

export function FloatingAddButton() {
  return (
    <Pressable
      accessibilityLabel="新建事项"
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#86B1A2',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}
```

```tsx
import { AppText } from '@/src/ui/AppText';

export function SectionHint({ text }: { text: string }) {
  return (
    <AppText
      style={{
        textAlign: 'center',
        fontSize: 12,
        color: '#728680',
        marginTop: 18,
      }}
    >
      {text}
    </AppText>
  );
}
```

- [ ] **Step 4: Implement the items list and guided creation screens**

```tsx
import { router } from 'expo-router';
import { View } from 'react-native';

import { AppCard } from '@/src/ui/AppCard';
import { AppPill } from '@/src/ui/AppPill';
import { AppScreen } from '@/src/ui/AppScreen';
import { AppText } from '@/src/ui/AppText';
import { FloatingAddButton } from '@/src/ui/FloatingAddButton';
import { SectionHint } from '@/src/ui/SectionHint';

export function ItemsScreen() {
  return (
    <AppScreen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={{ fontSize: 23, fontWeight: '700' }}>重要事项</AppText>
        <View onTouchEnd={() => router.push('/items/new')}>
          <FloatingAddButton />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
        <AppPill label="全部" active />
        <AppPill label="线下事项" />
      </View>
      <View style={{ marginTop: 24, gap: 18 }}>
        <AppCard>
          <AppText style={{ fontSize: 15, fontWeight: '600' }}>
            把宠物交给林杉照料
          </AppText>
          <AppText style={{ fontSize: 12, color: '#6B817B', marginTop: 9 }}>
            线下事项 · 协助人 1 位
          </AppText>
        </AppCard>
        <AppCard>
          <AppText style={{ fontSize: 15, fontWeight: '600' }}>
            导出私有仓库备份脚本
          </AppText>
          <AppText style={{ fontSize: 12, color: '#6B817B', marginTop: 9 }}>
            线上事项 · 自定义脚本
          </AppText>
        </AppCard>
      </View>
      <SectionHint text="向下滚动后继续查看其他事项" />
    </AppScreen>
  );
}
```

```tsx
import { View } from 'react-native';

import { AppCard } from '@/src/ui/AppCard';
import { AppScreen } from '@/src/ui/AppScreen';
import { AppText } from '@/src/ui/AppText';

export function ItemFormScreen() {
  return (
    <AppScreen>
      <AppText style={{ fontSize: 23, fontWeight: '700' }}>
        先写第一件事
      </AppText>
      <AppCard style={{ marginTop: 18 }}>
        <AppText style={{ fontSize: 12, color: '#6F837D' }}>事项类型</AppText>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
          <AppCard style={{ flex: 1, backgroundColor: '#EEF6F2' }}>
            <AppText style={{ fontSize: 15, fontWeight: '600' }}>线下事项</AppText>
            <AppText style={{ fontSize: 12, color: '#73867F', marginTop: 6 }}>
              交代给某个人处理
            </AppText>
          </AppCard>
          <AppCard style={{ flex: 1 }}>
            <AppText style={{ fontSize: 15, fontWeight: '600' }}>线上事项</AppText>
            <AppText style={{ fontSize: 12, color: '#73867F', marginTop: 6 }}>
              触发后执行脚本
            </AppText>
          </AppCard>
        </View>
      </AppCard>
      <AppCard style={{ marginTop: 14 }}>
        <AppText style={{ fontSize: 12, color: '#6F837D' }}>当前步骤</AppText>
        <AppText style={{ fontSize: 15, fontWeight: '600', marginTop: 8 }}>
          选择协助人
        </AppText>
      </AppCard>
    </AppScreen>
  );
}
```

- [ ] **Step 5: Run the feature tests to verify they pass**

Run: `pnpm test tests/features/items/items-screen.test.tsx tests/features/items/item-form-screen.test.tsx -i`

Expected: PASS with a lightweight items header and the guided creation copy.

- [ ] **Step 6: Commit**

```bash
git add src/ui/AppPill.tsx src/ui/FloatingAddButton.tsx src/ui/SectionHint.tsx app/\(tabs\)/items.tsx app/items/new.tsx src/features/items/ItemsScreen.tsx src/features/items/ItemFormScreen.tsx tests/features/items/items-screen.test.tsx tests/features/items/item-form-screen.test.tsx
git commit -m "feat: add redesigned items flows"
```

---

### Task 4: Build the calm My page and trigger-state settings page

**Files:**
- Create: `app/(tabs)/my.tsx`
- Create: `app/my/trigger-state.tsx`
- Create: `src/features/my/MyScreen.tsx`
- Create: `src/features/trigger-state/TriggerStateScreen.tsx`
- Test: `tests/features/my/my-screen.test.tsx`
- Test: `tests/features/trigger-state/trigger-state-screen.test.tsx`

- [ ] **Step 1: Write the failing My page and trigger-state tests**

```tsx
import { render, screen } from '@testing-library/react-native';

import { MyScreen } from '@/src/features/my/MyScreen';

test('renders trigger-state inside the My page instead of as a top-level tab', () => {
  render(<MyScreen />);

  expect(screen.getByText('我的')).toBeTruthy();
  expect(screen.getByText('触发状态')).toBeTruthy();
  expect(screen.getByText('身份与安全')).toBeTruthy();
});
```

```tsx
import { render, screen } from '@testing-library/react-native';

import { TriggerStateScreen } from '@/src/features/trigger-state/TriggerStateScreen';

test('renders the trigger-state screen as a calm settings page', () => {
  render(<TriggerStateScreen />);

  expect(screen.getByText('触发状态')).toBeTruthy();
  expect(screen.getByText('死亡 = 3 次未申报')).toBeTruthy();
  expect(screen.queryByText('立即执行')).toBeNull();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test tests/features/my/my-screen.test.tsx tests/features/trigger-state/trigger-state-screen.test.tsx -i`

Expected: FAIL because the My and trigger-state feature files do not exist yet.

- [ ] **Step 3: Implement the My screen and trigger-state screen**

```tsx
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppCard } from '@/src/ui/AppCard';
import { AppScreen } from '@/src/ui/AppScreen';
import { AppText } from '@/src/ui/AppText';

export function MyScreen() {
  return (
    <AppScreen>
      <AppText style={{ fontSize: 23, fontWeight: '700' }}>我的</AppText>
      <AppCard style={{ marginTop: 22 }}>
        <AppText style={{ fontSize: 12, color: '#6F837D' }}>当前状态</AppText>
        <AppText style={{ fontSize: 15, fontWeight: '600', marginTop: 8 }}>
          今天已完成确认
        </AppText>
      </AppCard>
      <View style={{ marginTop: 18, gap: 14 }}>
        <Pressable onPress={() => router.push('/my/trigger-state')}>
          <AppCard>
            <AppText style={{ fontSize: 15, fontWeight: '600' }}>触发状态</AppText>
            <AppText style={{ fontSize: 12, color: '#6F837D', marginTop: 8 }}>
              死亡：3 次未申报
            </AppText>
          </AppCard>
        </Pressable>
        <AppCard>
          <AppText style={{ fontSize: 15, fontWeight: '600' }}>身份与安全</AppText>
          <AppText style={{ fontSize: 12, color: '#6F837D', marginTop: 8 }}>
            实名、密码与恢复方式
          </AppText>
        </AppCard>
      </View>
    </AppScreen>
  );
}
```

```tsx
import { View } from 'react-native';
import { Switch } from '@expo/ui';

import { AppCard } from '@/src/ui/AppCard';
import { AppScreen } from '@/src/ui/AppScreen';
import { AppText } from '@/src/ui/AppText';

export function TriggerStateScreen() {
  return (
    <AppScreen>
      <AppText style={{ fontSize: 23, fontWeight: '700' }}>触发状态</AppText>
      <AppCard style={{ marginTop: 20 }}>
        <AppText style={{ fontSize: 12, color: '#6F837D' }}>当前生效</AppText>
        <AppText style={{ fontSize: 15, fontWeight: '600', marginTop: 8 }}>
          死亡 = 3 次未申报
        </AppText>
      </AppCard>
      <AppCard style={{ marginTop: 18 }}>
        <AppText style={{ fontSize: 12, color: '#6F837D' }}>失联状态</AppText>
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <AppText style={{ fontSize: 15 }}>启用失联</AppText>
          <Switch value={false} />
        </View>
      </AppCard>
    </AppScreen>
  );
}
```

- [ ] **Step 4: Run the feature tests to verify they pass**

Run: `pnpm test tests/features/my/my-screen.test.tsx tests/features/trigger-state/trigger-state-screen.test.tsx -i`

Expected: PASS with trigger-state nested under My and no “立即执行” copy.

- [ ] **Step 5: Commit**

```bash
git add app/\(tabs\)/my.tsx app/my/trigger-state.tsx src/features/my/MyScreen.tsx src/features/trigger-state/TriggerStateScreen.tsx tests/features/my/my-screen.test.tsx tests/features/trigger-state/trigger-state-screen.test.tsx
git commit -m "feat: add redesigned settings screens"
```

---

### Task 5: Integrate routes, tighten copy density, and run the full verification pass

**Files:**
- Modify: `app/report.tsx`
- Modify: `app/(tabs)/home.tsx`
- Modify: `app/(tabs)/items.tsx`
- Modify: `app/items/new.tsx`
- Modify: `app/(tabs)/my.tsx`
- Modify: `app/my/trigger-state.tsx`
- Modify: `src/features/report/ReportScreen.tsx`
- Modify: `src/features/home/HomeScreen.tsx`
- Modify: `src/features/items/ItemsScreen.tsx`
- Modify: `src/features/items/ItemFormScreen.tsx`
- Modify: `src/features/my/MyScreen.tsx`
- Modify: `src/features/trigger-state/TriggerStateScreen.tsx`
- Test: `tests/features/report/report-screen.test.tsx`
- Test: `tests/features/home/home-screen.test.tsx`
- Test: `tests/features/items/items-screen.test.tsx`
- Test: `tests/features/items/item-form-screen.test.tsx`
- Test: `tests/features/my/my-screen.test.tsx`
- Test: `tests/features/trigger-state/trigger-state-screen.test.tsx`

- [ ] **Step 1: Add a lightweight route smoke test for the tab wrappers**

```tsx
import { render, screen } from '@testing-library/react-native';

import HomeRoute from '@/app/(tabs)/home';
import ItemsRoute from '@/app/(tabs)/items';
import MyRoute from '@/app/(tabs)/my';

test('tab routes render their redesigned feature screens', () => {
  render(<HomeRoute />);
  expect(screen.getByText('今天也好好生活着')).toBeTruthy();

  render(<ItemsRoute />);
  expect(screen.getByText('重要事项')).toBeTruthy();

  render(<MyRoute />);
  expect(screen.getByText('我的')).toBeTruthy();
});
```

- [ ] **Step 2: Run the smoke test to verify it fails**

Run: `pnpm test tests/features/routes/tab-routes.test.tsx -i`

Expected: FAIL because the route wrappers are still placeholders or do not exist.

- [ ] **Step 3: Wire the route wrappers and make copy density match the confirmed spec**

```tsx
import { useAppStore } from '@/src/store/useAppStore';
import { HomeScreen } from '@/src/features/home/HomeScreen';

export default function HomeRoute() {
  const summary = useAppStore((state) => state.homeSummary);

  return <HomeScreen summary={summary} />;
}
```

```tsx
import { ItemsScreen } from '@/src/features/items/ItemsScreen';

export default function ItemsRoute() {
  return <ItemsScreen />;
}
```

```tsx
import { ItemFormScreen } from '@/src/features/items/ItemFormScreen';

export default function NewItemRoute() {
  return <ItemFormScreen />;
}
```

```tsx
import { MyScreen } from '@/src/features/my/MyScreen';

export default function MyRoute() {
  return <MyScreen />;
}
```

```tsx
import { TriggerStateScreen } from '@/src/features/trigger-state/TriggerStateScreen';

export default function TriggerStateRoute() {
  return <TriggerStateScreen />;
}
```

- [ ] **Step 4: Run the full test suite and type check**

Run: `pnpm test -i`

Expected: PASS with all feature tests green.

Run: `pnpm check:type`

Expected: PASS with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add app/\(tabs\)/home.tsx app/\(tabs\)/items.tsx app/items/new.tsx app/\(tabs\)/my.tsx app/my/trigger-state.tsx tests/features/routes/tab-routes.test.tsx
git commit -m "feat: wire redesigned app routes"
```

---

## Implementation Notes

- Use `@expo/ui` form controls where there is user input or toggle behavior. Do not replace simple layout shells (`View`, `Text`, `Pressable`) that are only structural.
- Keep the report gate and redesigned tabs visually related through shared tokens, but do not add decorative copy or heavy illustrations.
- Do not reintroduce “下一次确认”, item totals on the items page header, or default multi-select behavior.
- Keep item cards sparse: title, one metadata line, and a subtle state indicator only.
- Keep trigger-state language neutral and settings-like; avoid red danger banners.

## Verification Checklist

- Home screen hero uses encouraging copy and has no next-check reminder.
- Items page header shows only the Chinese title and a circular `+` action.
- Items page footer hint is centered.
- New item screen uses the same smaller text density as the items page.
- Trigger-state is reachable from `我的`, not from a top-level tab.
- Expo UI controls are used for toggles and other editable controls.
