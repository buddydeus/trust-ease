# Welcome First Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-launch-only welcome page that matches the current skin style and records a real daily report when the user taps `开始设置`.

**Architecture:** Add one boot gate for first-launch state, one dedicated welcome route/screen, and one shared report action that both the welcome page and the report page use. Extend the skin manifest/runtime to include the welcome page so its layout and colors remain skin-driven instead of hard-coded as a one-off screen.

**Tech Stack:** Expo Router, React Native, Zustand, AsyncStorage, JSON locale files, Jest, Testing Library

---

## File Structure

- Modify: `src/app/index.tsx`
  - Replace the unconditional redirect with a boot gate that chooses `welcome` or the main flow.
- Create: `src/app/welcome.tsx`
  - Route wrapper for the welcome screen.
- Create: `src/features/welcome/WelcomeScreen.tsx`
  - Visual welcome page implementation based on the approved design.
- Create: `src/onboarding/storage.ts`
  - Persist and read the `hasSeenWelcome` flag.
- Create: `src/reporting/actions.ts`
  - Shared action that applies a formal report to store state.
- Modify: `src/store/useAppStore.ts`
  - Add state/actions required to apply a formal report and expose first-launch-safe home summary updates.
- Modify: `src/domain/models.ts`
  - Add any required report metadata fields if the current summary shape is too small.
- Modify: `src/domain/defaults.ts`
  - Seed the default “not yet reported today” shape if needed by the new flow.
- Modify: `src/app/report.tsx`
  - Use the shared report action instead of a route-only redirect.
- Modify: `src/app/_layout.tsx`
  - Register the new `welcome` screen in the root stack.
- Modify: `src/skin/types.ts`
  - Add `welcome` page key and welcome component keys.
- Modify: `src/skin/manifest.ts`
  - Accept the new `welcome` page/component ids in JSON manifests.
- Modify: `skins/skin-001/manifest.json`
  - Add `pages.welcome` configuration.
- Modify: `src/locals/zh-CN.json`
- Modify: `src/locals/zh-TW.json`
- Modify: `src/locals/en-US.json`
  - Add welcome-page copy keys.
- Modify: `scripts/capture_runtime_thumbs.js`
  - Add welcome capture if the runtime thumbs set should include first-launch state.
- Modify: `README.md`
  - Document the new route and first-launch behavior.

- Test: `tests/features/welcome/welcome-screen.test.tsx`
- Test: `tests/app/index-route.test.tsx`
- Test: `tests/onboarding/storage.test.ts`
- Test: `tests/reporting/actions.test.ts`
- Modify: `tests/skin/manifest.test.ts`
- Modify: `tests/skin/runtime.test.ts`
- Modify: `tests/i18n/check-locals.test.ts`
- Modify: `tests/support/thumbs-export.test.ts`

---

### Task 1: Persist First-Launch Welcome State

**Files:**
- Create: `src/onboarding/storage.ts`
- Test: `tests/onboarding/storage.test.ts`

- [ ] **Step 1: Write the failing storage test**

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('welcome onboarding storage', () => {
  beforeEach(async () => {
    jest.resetModules();
    await AsyncStorage.clear();
  });

  test('defaults to not seen on first install', async () => {
    const { loadHasSeenWelcome } = require('../../src/onboarding/storage');

    await expect(loadHasSeenWelcome()).resolves.toBe(false);
  });

  test('persists the seen flag after completion', async () => {
    const { loadHasSeenWelcome, saveHasSeenWelcome } = require('../../src/onboarding/storage');

    await saveHasSeenWelcome(true);

    await expect(loadHasSeenWelcome()).resolves.toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/onboarding/storage.test.ts --runInBand`

Expected: FAIL because `src/onboarding/storage.ts` does not exist yet.

- [ ] **Step 3: Write the minimal storage implementation**

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'trust-ease:onboarding';

interface IOnboardingSnapshot {
  hasSeenWelcome?: boolean;
}

export async function loadHasSeenWelcome(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return false;
  }

  try {
    const snapshot = JSON.parse(raw) as IOnboardingSnapshot;
    return snapshot.hasSeenWelcome === true;
  } catch {
    return false;
  }
}

export async function saveHasSeenWelcome(value: boolean): Promise<void> {
  const snapshot: IOnboardingSnapshot = { hasSeenWelcome: value };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/onboarding/storage.test.ts --runInBand`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/onboarding/storage.test.ts src/onboarding/storage.ts
git commit -m "feat: persist first-launch welcome state"
```

### Task 2: Add Shared Formal Report Action

**Files:**
- Create: `src/reporting/actions.ts`
- Modify: `src/store/useAppStore.ts`
- Modify: `src/domain/models.ts`
- Modify: `src/domain/defaults.ts`
- Test: `tests/reporting/actions.test.ts`

- [ ] **Step 1: Write the failing report-action test**

```ts
import { useAppStore } from '../../src/store/useAppStore';

describe('reporting actions', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('applies a formal report timestamp and keeps the day reported', () => {
    const { applyFormalReport } = require('../../src/reporting/actions');
    const reportedAt = '2026-05-05T09:30:00.000Z';

    applyFormalReport(reportedAt);

    const state = useAppStore.getState();
    expect(state.homeSummary.lastReportedAt).toBe(reportedAt);
    expect(state.homeSummary.isReportedToday).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/reporting/actions.test.ts --runInBand`

Expected: FAIL because `applyFormalReport` and/or summary fields do not exist yet.

- [ ] **Step 3: Write the minimal state and action implementation**

```ts
export interface HomeSummary {
  streakDays: number;
  itemCount: number;
  helperCount: number;
  isReportedToday: boolean;
  lastReportedAt: string | null;
}
```

```ts
export const defaultHomeSummary: HomeSummary = {
  streakDays: 128,
  itemCount: 6,
  helperCount: 3,
  isReportedToday: false,
  lastReportedAt: null,
};
```

```ts
export interface AppState {
  // existing fields...
  applyFormalReport: (reportedAt: string) => void;
}
```

```ts
applyFormalReport: (reportedAt) =>
  set((state) => ({
    homeSummary: {
      ...state.homeSummary,
      isReportedToday: true,
      lastReportedAt: reportedAt,
    },
  })),
```

```ts
import { useAppStore } from '../store/useAppStore';

export function applyFormalReport(reportedAt: string): void {
  useAppStore.getState().applyFormalReport(reportedAt);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/reporting/actions.test.ts --runInBand`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/reporting/actions.test.ts src/reporting/actions.ts src/store/useAppStore.ts src/domain/models.ts src/domain/defaults.ts
git commit -m "feat: add shared formal report action"
```

### Task 3: Gate the Entry Route on First Launch

**Files:**
- Modify: `src/app/index.tsx`
- Test: `tests/app/index-route.test.tsx`

- [ ] **Step 1: Write the failing route-gate test**

```tsx
jest.mock('../../src/onboarding/storage', () => ({
  loadHasSeenWelcome: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => href,
}));

import { render, screen, waitFor } from '@testing-library/react-native';
import { loadHasSeenWelcome } from '../../src/onboarding/storage';
import IndexRoute from '../../src/app/index';

test('redirects first launch to welcome', async () => {
  (loadHasSeenWelcome as jest.Mock).mockResolvedValue(false);

  render(<IndexRoute />);

  await waitFor(() => {
    expect(screen.getByText('/welcome')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/app/index-route.test.tsx --runInBand`

Expected: FAIL because `index` still always redirects to `/report`.

- [ ] **Step 3: Write the minimal gated route implementation**

```tsx
import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';

import { loadHasSeenWelcome } from '../onboarding/storage';

export interface IIndexRouteProps {}

const IndexRoute = React.memo(({}: IIndexRouteProps) => {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    loadHasSeenWelcome().then((hasSeenWelcome) => {
      if (!active) {
        return;
      }

      setTarget(hasSeenWelcome ? '/report' : '/welcome');
    });

    return () => {
      active = false;
    };
  }, []);

  if (!target) {
    return null;
  }

  return <Redirect href={target} />;
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/app/index-route.test.tsx --runInBand`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/app/index-route.test.tsx src/app/index.tsx
git commit -m "feat: gate entry route with welcome screen"
```

### Task 4: Build the Welcome Screen and Route

**Files:**
- Create: `src/features/welcome/WelcomeScreen.tsx`
- Create: `src/app/welcome.tsx`
- Modify: `src/app/_layout.tsx`
- Modify: `src/locals/zh-CN.json`
- Modify: `src/locals/zh-TW.json`
- Modify: `src/locals/en-US.json`
- Test: `tests/features/welcome/welcome-screen.test.tsx`

- [ ] **Step 1: Write the failing welcome-screen test**

```tsx
import { fireEvent, render, screen } from '@testing-library/react-native';

import { WelcomeScreen } from '../../../src/features/welcome/WelcomeScreen';

test('renders welcome copy and triggers start action', () => {
  const onStart = jest.fn();

  render(
    <WelcomeScreen
      onStart={onStart}
      copy={{
        brand: '安心',
        eyebrow: '提前交代，事后有序',
        title: '先把重要的事，安静地交代好',
        body: '意外、失联或无法亲自处理时，你写下的事项会按约定被看见。',
        primaryButton: '开始设置',
      }}
    />,
  );

  expect(screen.getByText('安心')).toBeTruthy();
  expect(screen.getByText('开始设置')).toBeTruthy();

  fireEvent.press(screen.getByRole('button', { name: '开始设置' }));
  expect(onStart).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/features/welcome/welcome-screen.test.tsx --runInBand`

Expected: FAIL because the screen and route do not exist yet.

- [ ] **Step 3: Write the minimal screen, route, and locale implementation**

```tsx
export interface IWelcomeScreenCopy {
  brand: string;
  eyebrow: string;
  title: string;
  body: string;
  primaryButton: string;
}

export interface IWelcomeScreenProps {
  copy: IWelcomeScreenCopy;
  onStart: () => void;
}
```

```tsx
export const WelcomeScreen = React.memo(({
  copy,
  onStart,
}: IWelcomeScreenProps) => (
  <AppScreen style={{ justifyContent: 'space-between' }}>
    {/* brand */}
    {/* decorative stacked cards */}
    {/* hero copy */}
    <Pressable accessibilityRole="button" onPress={onStart}>
      <AppText>{copy.primaryButton}</AppText>
    </Pressable>
  </AppScreen>
));
```

```tsx
const WelcomeRoute = React.memo(({}: IWelcomeRouteProps) => {
  const { messages } = useI18n();
  return <WelcomeScreen copy={messages.welcome} onStart={() => {}} />;
});
```

```tsx
<Stack.Screen name="welcome" />
```

```json
"welcome": {
  "brand": "安心",
  "eyebrow": "提前交代，事后有序",
  "title": "先把重要的事，安静地交代好",
  "body": "意外、失联或无法亲自处理时，你写下的事项会按约定被看见。",
  "primaryButton": "开始设置"
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/features/welcome/welcome-screen.test.tsx --runInBand`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/features/welcome/welcome-screen.test.tsx src/features/welcome/WelcomeScreen.tsx src/app/welcome.tsx src/app/_layout.tsx src/locals/zh-CN.json src/locals/zh-TW.json src/locals/en-US.json
git commit -m "feat: add first-launch welcome screen"
```

### Task 5: Wire Welcome Start to Real Reporting and Home Navigation

**Files:**
- Modify: `src/app/welcome.tsx`
- Modify: `src/app/report.tsx`
- Modify: `tests/features/report/report-screen.test.tsx`
- Create or Modify: `tests/app/welcome-route.test.tsx`

- [ ] **Step 1: Write the failing welcome-route behavior test**

```tsx
jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}));

jest.mock('../../src/onboarding/storage', () => ({
  saveHasSeenWelcome: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../src/reporting/actions', () => ({
  applyFormalReport: jest.fn(),
}));

import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { applyFormalReport } from '../../src/reporting/actions';
import { saveHasSeenWelcome } from '../../src/onboarding/storage';
import WelcomeRoute from '../../src/app/welcome';

test('start button persists welcome state, reports formally, and routes home', async () => {
  render(<WelcomeRoute />);

  fireEvent.press(screen.getByRole('button', { name: '开始设置' }));

  await waitFor(() => {
    expect(saveHasSeenWelcome).toHaveBeenCalledWith(true);
    expect(applyFormalReport).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/app/welcome-route.test.tsx --runInBand`

Expected: FAIL because the welcome route does not yet apply report state or navigation.

- [ ] **Step 3: Write the minimal route wiring**

```tsx
import React from 'react';
import { router } from 'expo-router';

import { WelcomeScreen } from '../features/welcome/WelcomeScreen';
import { useI18n } from '../i18n/useI18n';
import { saveHasSeenWelcome } from '../onboarding/storage';
import { applyFormalReport } from '../reporting/actions';

const WelcomeRoute = React.memo(({}: IWelcomeRouteProps) => {
  const { messages } = useI18n();

  return (
    <WelcomeScreen
      copy={messages.welcome}
      onStart={async () => {
        const reportedAt = new Date().toISOString();
        await saveHasSeenWelcome(true);
        applyFormalReport(reportedAt);
        router.replace('/(tabs)/home');
      }}
    />
  );
});
```

```tsx
<ReportScreen
  copy={messages.report}
  onSubmit={() => {
    applyFormalReport(new Date().toISOString());
    router.replace('/(tabs)/home');
  }}
/>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test tests/app/welcome-route.test.tsx tests/features/report/report-screen.test.tsx --runInBand`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/app/welcome-route.test.tsx tests/features/report/report-screen.test.tsx src/app/welcome.tsx src/app/report.tsx
git commit -m "feat: treat welcome start as formal report"
```

### Task 6: Extend Skin Runtime for Welcome Page

**Files:**
- Modify: `src/skin/types.ts`
- Modify: `src/skin/manifest.ts`
- Modify: `skins/skin-001/manifest.json`
- Modify: `tests/skin/manifest.test.ts`
- Modify: `tests/skin/runtime.test.ts`

- [ ] **Step 1: Write the failing skin manifest/runtime tests**

```ts
test('parses welcome page config from skin manifest', () => {
  const manifest = parseSkinManifest({
    ...rawManifest,
    pages: {
      welcome: {
        layoutMode: 'stacked',
        componentOrder: ['brandHeader', 'decorativeStack', 'heroTitle', 'heroBody', 'primaryAction'],
        componentVisibility: {
          brandHeader: true,
          decorativeStack: true,
          heroTitle: true,
          heroBody: true,
          primaryAction: true,
        },
      },
    },
  });

  expect(manifest.pages.welcome?.componentOrder).toEqual([
    'brandHeader',
    'decorativeStack',
    'heroTitle',
    'heroBody',
    'primaryAction',
  ]);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test tests/skin/manifest.test.ts tests/skin/runtime.test.ts --runInBand`

Expected: FAIL because `welcome` page and component keys are unsupported.

- [ ] **Step 3: Write the minimal skin support**

```ts
export type SkinPageKey =
  | 'welcome'
  | 'home'
  | 'items'
  | 'report'
  | 'my'
  | 'new-item'
  | 'trigger-state'
  | 'tabs';
```

```ts
export type PageComponentKey =
  | 'brandHeader'
  | 'decorativeStack'
  | 'heroTitle'
  | 'heroBody'
  | 'primaryAction'
  // existing keys...
```

```json
"welcome": {
  "layoutMode": "stacked",
  "componentOrder": [
    "brandHeader",
    "decorativeStack",
    "heroTitle",
    "heroBody",
    "primaryAction"
  ],
  "componentVisibility": {
    "brandHeader": true,
    "decorativeStack": true,
    "heroTitle": true,
    "heroBody": true,
    "primaryAction": true
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test tests/skin/manifest.test.ts tests/skin/runtime.test.ts --runInBand`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/skin/manifest.test.ts tests/skin/runtime.test.ts src/skin/types.ts src/skin/manifest.ts skins/skin-001/manifest.json
git commit -m "feat: add welcome page to skin runtime"
```

### Task 7: Align Welcome Visuals with Skin-001 Palette and Runtime Copy

**Files:**
- Modify: `src/features/welcome/WelcomeScreen.tsx`
- Modify: `tests/features/welcome/welcome-screen.test.tsx`

- [ ] **Step 1: Write a failing visual-structure test**

```tsx
test('renders the decorative stack and single primary action only', () => {
  render(
    <WelcomeScreen
      onStart={() => {}}
      copy={defaultCopy}
    />,
  );

  expect(screen.getByText('开始设置')).toBeTruthy();
  expect(screen.queryByText('先了解怎么运作')).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails for the final intended structure**

Run: `pnpm test tests/features/welcome/welcome-screen.test.tsx --runInBand`

Expected: FAIL if any secondary action or mismatched structure still exists.

- [ ] **Step 3: Refine the screen to match the approved design**

```tsx
// Use AppScreen/AppText primitives and the active semantic palette.
// Build the layered-card illustration in code instead of importing a static image.
// Keep one wide primary button at the bottom.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/features/welcome/welcome-screen.test.tsx --runInBand`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/features/welcome/welcome-screen.test.tsx src/features/welcome/WelcomeScreen.tsx
git commit -m "feat: align welcome screen with skin-001 design"
```

### Task 8: Update Runtime Thumbs, Locale Checks, and Documentation

**Files:**
- Modify: `scripts/capture_runtime_thumbs.js`
- Modify: `tests/support/thumbs-export.test.ts`
- Modify: `tests/i18n/check-locals.test.ts`
- Modify: `README.md`

- [ ] **Step 1: Write the failing support-layer assertions**

```ts
test('thumb export includes welcome route for first-launch coverage', () => {
  const source = fs.readFileSync(
    path.join(root, 'scripts/capture_runtime_thumbs.js'),
    'utf-8',
  );

  expect(source).toContain("slug: 'welcome'");
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test tests/support/thumbs-export.test.ts tests/i18n/check-locals.test.ts --runInBand`

Expected: FAIL because the capture list and locale usage expectations do not include welcome yet.

- [ ] **Step 3: Write the minimal support updates**

```js
const CAPTURES = [
  { slug: 'welcome', route: '/welcome' },
  { slug: 'report', route: '/report' },
  { slug: 'home', route: '/home' },
  // existing captures...
];
```

```md
- 首次安装第一次打开时会先进入 `welcome`
- 点击 `开始设置` 会直接完成一次正式申报并进入 `home`
```

- [ ] **Step 4: Run tests and checks to verify they pass**

Run: `pnpm test tests/support/thumbs-export.test.ts tests/i18n/check-locals.test.ts --runInBand`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/support/thumbs-export.test.ts tests/i18n/check-locals.test.ts scripts/capture_runtime_thumbs.js README.md
git commit -m "docs: document first-launch welcome flow"
```

### Task 9: Final Verification

**Files:**
- Verify only

- [ ] **Step 1: Run focused feature tests**

Run:

```bash
pnpm test tests/onboarding/storage.test.ts tests/reporting/actions.test.ts tests/app/index-route.test.tsx tests/app/welcome-route.test.tsx tests/features/welcome/welcome-screen.test.tsx tests/features/report/report-screen.test.tsx tests/skin/manifest.test.ts tests/skin/runtime.test.ts tests/support/thumbs-export.test.ts tests/i18n/check-locals.test.ts --runInBand
```

Expected: PASS

- [ ] **Step 2: Run broader regression tests**

Run:

```bash
pnpm test tests/features/home/home-screen.test.tsx tests/features/home/home-screen.i18n.test.tsx tests/features/items/items-screen.test.tsx tests/features/items/item-form-screen.test.tsx tests/features/my/my-screen.test.tsx tests/features/my/my-screen.i18n.test.tsx tests/features/routes/tab-routes.test.tsx tests/features/trigger-state/trigger-state-screen.test.tsx tests/skin/feature-version.test.ts tests/skin/compatibility.test.ts tests/skin/registry.test.ts tests/skin/storage.test.ts tests/support/preview-config.test.ts tests/support/export-scripts.test.ts --runInBand
```

Expected: PASS

- [ ] **Step 3: Run type check**

Run:

```bash
pnpm check:type
```

Expected: PASS

- [ ] **Step 4: Regenerate real runtime thumbs if the test suite is green**

Run:

```bash
pnpm thumbs
```

Expected: Runtime screenshots include the new `welcome` page and still reflect real app output.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: add first-launch welcome flow"
```

---

## Self-Review

- Spec coverage:
  - First-launch-only visibility: Task 1 + Task 3
  - Single-action welcome page: Task 4 + Task 7
  - Welcome action equals formal report: Task 2 + Task 5
  - Jump to `home` after welcome: Task 5
  - Skin support: Task 6 + Task 7
  - Locale and screenshot support: Task 4 + Task 8
- Placeholder scan:
  - No `TBD` / `TODO` / “later” placeholders remain.
- Type consistency:
  - Route name is consistently `welcome`
  - Shared report action is consistently `applyFormalReport`
  - Persisted flag is consistently `hasSeenWelcome`
