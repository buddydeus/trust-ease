# Skin Runtime v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a skin runtime that downloads and validates full local skin packages, blocks incomplete or incompatible skins, and lets controlled page layouts and semantic colors come from `skin-001 / 海盐蓝绿`.

**Architecture:** Introduce a typed skin manifest/runtime layer, persist skin package state in the app store plus local storage, and route all base UI tokens through the active skin. Pages keep local controlled components, but each page reads skin-provided component order, visibility, and layout mode instead of hardcoded structure.

**Tech Stack:** Expo Router, React Native, Zustand, AsyncStorage, TypeScript, Jest

---

## File Map

### New files

- `src/skin/types.ts`
  Defines manifest, semantic color palette, page layout enums, package state, and compatibility types.
- `src/skin/featureVersion.ts`
  Reads app version and derives `major.minor` feature version.
- `src/skin/compatibility.ts`
  Compares current feature version with skin manifest constraints.
- `src/skin/default-skins/skin-001.ts`
  Bundles the first built-in skin manifest and semantic palette.
- `src/skin/runtime.ts`
  Resolves the active skin into runtime helpers for UI and pages.
- `src/skin/storage.ts`
  Reads and writes cached skin metadata/index using AsyncStorage.
- `src/skin/downloader.ts`
  Coordinates full-package download, temporary staging, validation, and atomic ready state.
- `src/skin/useSkin.ts`
  Hook that exposes active skin runtime, skin state, and initialization actions.
- `tests/skin/feature-version.test.ts`
  Tests feature version derivation.
- `tests/skin/compatibility.test.ts`
  Tests compatible/incompatible skin behavior.
- `tests/skin/runtime.test.ts`
  Tests semantic color and page config resolution.
- `tests/skin/storage.test.ts`
  Tests local persistence and incomplete package behavior.
- `tests/skin/downloader.test.ts`
  Tests full-package-only readiness and failed download handling.
- `tests/features/home/home-screen.skin.test.tsx`
  Tests controlled visibility/order/layout behavior on `home`.
- `tests/features/items/items-screen.skin.test.tsx`
  Tests controlled visibility/order/layout behavior on `items`.

### Modified files

- `package.json`
  Keep version as the feature-version source and add/adjust test ergonomics only if needed.
- `src/store/useAppStore.ts`
  Add selected/active skin state, initialization state, and actions.
- `src/design/tokens.ts`
  Replace static token exports with skin-aware semantic token readers or thin wrappers.
- `src/ui/AppScreen.tsx`
  Read page background from active skin runtime.
- `src/ui/AppCard.tsx`
  Read card colors and radius from active skin runtime.
- `src/ui/AppText.tsx`
  Read default text color and base type scale from active skin runtime.
- `src/ui/AppPill.tsx`
  Read active/inactive pill colors from active skin runtime.
- `src/ui/FloatingAddButton.tsx`
  Read accent colors from active skin runtime.
- `app/_layout.tsx`
  Initialize skin runtime before normal navigation render.
- `app/(tabs)/_layout.tsx`
  Read tab styling/layout config from active skin runtime.
- `src/features/home/HomeScreen.tsx`
  Render sections/components based on skin page config.
- `src/features/items/ItemsScreen.tsx`
  Render sections/components based on skin page config.
- `src/features/items/ItemFormScreen.tsx`
  Respect skin page config and semantic color usage.
- `src/features/report/ReportScreen.tsx`
  Respect skin page config and semantic color usage.
- `src/features/my/MyScreen.tsx`
  Respect skin page config and surface skin compatibility/download status.
- `src/features/trigger-state/TriggerStateScreen.tsx`
  Respect skin page config and semantic color usage.

---

### Task 1: Define Skin Types And Feature Version Rules

**Files:**
- Create: `src/skin/types.ts`
- Create: `src/config/appVersion.ts`
- Create: `src/skin/featureVersion.ts`
- Create: `src/skin/compatibility.ts`
- Test: `tests/skin/feature-version.test.ts`
- Test: `tests/skin/compatibility.test.ts`

- [ ] **Step 1: Write the failing feature-version test**

```ts
import { getFeatureVersionFromAppVersion } from '@/src/skin/featureVersion';

test('derives major.minor feature version from semver', () => {
  expect(getFeatureVersionFromAppVersion('0.0.1')).toBe('0.0');
  expect(getFeatureVersionFromAppVersion('1.7.9')).toBe('1.7');
});

test('falls back to 0.0 for malformed versions', () => {
  expect(getFeatureVersionFromAppVersion('invalid')).toBe('0.0');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/skin/feature-version.test.ts --runInBand`
Expected: FAIL with module-not-found for `@/src/skin/featureVersion`

- [ ] **Step 3: Write the failing compatibility test**

```ts
import { isSkinCompatible } from '@/src/skin/compatibility';
import type { SkinManifest } from '@/src/skin/types';

const manifest: SkinManifest = {
  skinId: 'skin-001',
  displayName: '海盐蓝绿',
  skinVersion: '1.0.0',
  minFeatureVersion: '0.0',
  maxFeatureVersion: '0.1',
  packageHash: 'sha256:test',
  assets: [],
  palette: {
    pageBg: '#F7FBFA',
    cardBg: '#FFFFFF',
    cardBorder: '#DEEBE6',
    textPrimary: '#243F39',
    textMuted: '#6F837D',
    actionPrimary: '#86B1A2',
    actionPrimaryText: '#FFFFFF',
    offlineAccent: '#DBEAE6',
    onlineAccent: '#EADFDB',
  },
  pages: {},
};

test('marks compatible feature versions as usable', () => {
  expect(isSkinCompatible(manifest, '0.0').kind).toBe('compatible');
});

test('blocks skins that require a newer feature version', () => {
  expect(isSkinCompatible({ ...manifest, minFeatureVersion: '0.2' }, '0.0')).toEqual({
    kind: 'incompatible',
    reason: 'upgrade-app',
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `pnpm test -- tests/skin/compatibility.test.ts --runInBand`
Expected: FAIL with module-not-found for `@/src/skin/compatibility`

- [ ] **Step 5: Write minimal type and compatibility implementation**

```ts
// src/skin/types.ts
export type FeatureVersion = `${number}.${number}`;

export type SkinPalette = {
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textMuted: string;
  actionPrimary: string;
  actionPrimaryText: string;
  offlineAccent: string;
  onlineAccent: string;
};

export type PageLayoutMode =
  | 'hero-top'
  | 'stacked'
  | 'centered'
  | 'list-top'
  | 'settings-list';

export type PageComponentKey =
  | 'statusLabel'
  | 'heroTitle'
  | 'streakCard'
  | 'reportButton'
  | 'itemsSummary'
  | 'helpersSummary'
  | 'decorativeBackground'
  | 'filters'
  | 'list'
  | 'footerHint'
  | 'languageSection'
  | 'triggerSection'
  | 'identitySection'
  | 'primaryAction';

export type SkinPageConfig = {
  layoutMode: PageLayoutMode;
  componentOrder: PageComponentKey[];
  componentVisibility: Partial<Record<PageComponentKey, boolean>>;
};

export type SkinManifest = {
  skinId: string;
  displayName: string;
  skinVersion: string;
  minFeatureVersion: FeatureVersion;
  maxFeatureVersion?: FeatureVersion;
  packageHash: string;
  assets: Array<{ id: string; path: string; hash: string }>;
  palette: SkinPalette;
  pages: Partial<Record<'home' | 'items' | 'report' | 'my' | 'new-item' | 'trigger-state' | 'tabs', SkinPageConfig>>;
};
```

```ts
// src/config/appVersion.ts
export const appVersion = '0.0.1';
```

```ts
// src/skin/featureVersion.ts
import { appVersion } from '@/src/config/appVersion';
import type { FeatureVersion } from '@/src/skin/types';

export function getFeatureVersionFromAppVersion(version: string): FeatureVersion {
  const match = /^(\d+)\.(\d+)\.\d+/.exec(version);
  if (!match) {
    return '0.0';
  }
  return `${Number(match[1])}.${Number(match[2])}` as FeatureVersion;
}

export function getCurrentFeatureVersion(): FeatureVersion {
  return getFeatureVersionFromAppVersion(appVersion);
}
```

```ts
// src/skin/compatibility.ts
import type { FeatureVersion, SkinManifest } from '@/src/skin/types';

function toTuple(version: FeatureVersion): [number, number] {
  const [major, minor] = version.split('.').map(Number);
  return [major, minor];
}

function compare(a: FeatureVersion, b: FeatureVersion): number {
  const [amaj, amin] = toTuple(a);
  const [bmaj, bmin] = toTuple(b);
  if (amaj !== bmaj) return amaj - bmaj;
  return amin - bmin;
}

export function isSkinCompatible(manifest: SkinManifest, current: FeatureVersion) {
  if (compare(current, manifest.minFeatureVersion) < 0) {
    return { kind: 'incompatible' as const, reason: 'upgrade-app' as const };
  }

  if (manifest.maxFeatureVersion && compare(current, manifest.maxFeatureVersion) > 0) {
    return { kind: 'incompatible' as const, reason: 'change-skin' as const };
  }

  return { kind: 'compatible' as const };
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm test -- tests/skin/feature-version.test.ts tests/skin/compatibility.test.ts --runInBand`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/config/appVersion.ts src/skin/types.ts src/skin/featureVersion.ts src/skin/compatibility.ts tests/skin/feature-version.test.ts tests/skin/compatibility.test.ts
git commit -m "feat: add skin version compatibility types"
```

### Task 2: Add Built-In skin-001 And Runtime Resolver

**Files:**
- Create: `src/skin/default-skins/skin-001.ts`
- Create: `src/skin/runtime.ts`
- Test: `tests/skin/runtime.test.ts`

- [ ] **Step 1: Write the failing runtime test**

```ts
import { skin001 } from '@/src/skin/default-skins/skin-001';
import { createSkinRuntime } from '@/src/skin/runtime';

test('creates runtime from skin-001 manifest', () => {
  const runtime = createSkinRuntime(skin001);

  expect(runtime.skinId).toBe('skin-001');
  expect(runtime.displayName).toBe('海盐蓝绿');
  expect(runtime.palette.actionPrimary).toBe('#86B1A2');
});

test('returns default visible component order for home', () => {
  const runtime = createSkinRuntime(skin001);

  expect(runtime.getPage('home').componentOrder).toEqual([
    'statusLabel',
    'heroTitle',
    'streakCard',
    'reportButton',
    'itemsSummary',
    'helpersSummary',
  ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/skin/runtime.test.ts --runInBand`
Expected: FAIL with module-not-found for runtime/default skin files

- [ ] **Step 3: Implement built-in skin and runtime**

```ts
// src/skin/default-skins/skin-001.ts
import type { SkinManifest } from '@/src/skin/types';

export const skin001: SkinManifest = {
  skinId: 'skin-001',
  displayName: '海盐蓝绿',
  skinVersion: '1.0.0',
  minFeatureVersion: '0.0',
  maxFeatureVersion: '0.1',
  packageHash: 'builtin:skin-001@1.0.0',
  assets: [],
  palette: {
    pageBg: '#F7FBFA',
    cardBg: '#FFFFFF',
    cardBorder: '#DEEBE6',
    textPrimary: '#243F39',
    textMuted: '#6F837D',
    actionPrimary: '#86B1A2',
    actionPrimaryText: '#FFFFFF',
    offlineAccent: '#DBEAE6',
    onlineAccent: '#EADFDB',
  },
  pages: {
    home: {
      layoutMode: 'hero-top',
      componentOrder: ['statusLabel', 'heroTitle', 'streakCard', 'reportButton', 'itemsSummary', 'helpersSummary'],
      componentVisibility: {
        statusLabel: true,
        heroTitle: true,
        streakCard: true,
        reportButton: true,
        itemsSummary: true,
        helpersSummary: true,
      },
    },
    items: {
      layoutMode: 'list-top',
      componentOrder: ['primaryAction', 'filters', 'list', 'footerHint'],
      componentVisibility: { primaryAction: true, filters: true, list: true, footerHint: true },
    },
    report: {
      layoutMode: 'centered',
      componentOrder: ['heroTitle', 'primaryAction'],
      componentVisibility: { heroTitle: true, primaryAction: true },
    },
    my: {
      layoutMode: 'settings-list',
      componentOrder: ['triggerSection', 'identitySection', 'languageSection'],
      componentVisibility: { triggerSection: true, identitySection: true, languageSection: true },
    },
  },
};
```

```ts
// src/skin/runtime.ts
import { skin001 } from '@/src/skin/default-skins/skin-001';
import type { SkinManifest } from '@/src/skin/types';

export function createSkinRuntime(manifest: SkinManifest) {
  return {
    skinId: manifest.skinId,
    displayName: manifest.displayName,
    palette: manifest.palette,
    manifest,
    getPage(page: keyof SkinManifest['pages']) {
      return manifest.pages[page] ?? { layoutMode: 'stacked', componentOrder: [], componentVisibility: {} };
    },
  };
}

export const defaultSkinRuntime = createSkinRuntime(skin001);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- tests/skin/runtime.test.ts --runInBand`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/skin/default-skins/skin-001.ts src/skin/runtime.ts tests/skin/runtime.test.ts
git commit -m "feat: add built-in skin runtime"
```

### Task 3: Persist Skin Package State And Block Incomplete Packages

**Files:**
- Create: `src/skin/storage.ts`
- Test: `tests/skin/storage.test.ts`
- Modify: `src/store/useAppStore.ts`

- [ ] **Step 1: Write the failing storage test**

```ts
import { loadSkinState, saveSkinState } from '@/src/skin/storage';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

test('persists selected and active skin ids', async () => {
  await saveSkinState({
    selectedSkinId: 'skin-001',
    activeSkinId: 'skin-001',
    lastReadySkinId: 'skin-001',
    packageStates: {
      'skin-001@1.0.0': 'ready',
    },
  });

  await expect(loadSkinState()).resolves.toEqual({
    selectedSkinId: 'skin-001',
    activeSkinId: 'skin-001',
    lastReadySkinId: 'skin-001',
    packageStates: {
      'skin-001@1.0.0': 'ready',
    },
  });
});

test('treats incomplete packages as not ready to activate', async () => {
  await saveSkinState({
    selectedSkinId: 'skin-001',
    activeSkinId: 'skin-001',
    lastReadySkinId: 'skin-001',
    packageStates: {
      'skin-001@1.0.0': 'downloading',
    },
  });

  const state = await loadSkinState();
  expect(state.packageStates['skin-001@1.0.0']).not.toBe('ready');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/skin/storage.test.ts --runInBand`
Expected: FAIL with module-not-found for storage

- [ ] **Step 3: Implement storage and expand app store state**

```ts
// src/skin/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const SKIN_STATE_KEY = 'skin-runtime-state';

export type PersistedSkinState = {
  selectedSkinId: string;
  activeSkinId: string;
  lastReadySkinId: string;
  packageStates: Record<string, 'idle' | 'checking' | 'downloading' | 'ready' | 'failed' | 'incompatible'>;
};

const defaultState: PersistedSkinState = {
  selectedSkinId: 'skin-001',
  activeSkinId: 'skin-001',
  lastReadySkinId: 'skin-001',
  packageStates: {
    'skin-001@1.0.0': 'ready',
  },
};

export async function loadSkinState(): Promise<PersistedSkinState> {
  const raw = await AsyncStorage.getItem(SKIN_STATE_KEY);
  if (!raw) return defaultState;
  return { ...defaultState, ...JSON.parse(raw) };
}

export async function saveSkinState(state: PersistedSkinState) {
  await AsyncStorage.setItem(SKIN_STATE_KEY, JSON.stringify(state));
}
```

```ts
// src/store/useAppStore.ts
type SkinPackageState = 'idle' | 'checking' | 'downloading' | 'ready' | 'failed' | 'incompatible';

type AppState = {
  // existing fields...
  selectedSkinId: string;
  activeSkinId: string;
  lastReadySkinId: string;
  skinPackageStates: Record<string, SkinPackageState>;
  setSelectedSkinId: (skinId: string) => void;
  setActiveSkinId: (skinId: string) => void;
  setSkinPackageState: (packageKey: string, state: SkinPackageState) => void;
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- tests/skin/storage.test.ts --runInBand`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/skin/storage.ts src/store/useAppStore.ts tests/skin/storage.test.ts
git commit -m "feat: persist skin package state"
```

### Task 4: Add Full-Package Downloader And Initialization State Machine

**Files:**
- Create: `src/skin/downloader.ts`
- Create: `src/skin/useSkin.ts`
- Test: `tests/skin/downloader.test.ts`
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Write the failing downloader test**

```ts
import { prepareSkinPackage } from '@/src/skin/downloader';
import { skin001 } from '@/src/skin/default-skins/skin-001';

test('marks package ready only after manifest and all assets validate', async () => {
  const result = await prepareSkinPackage(skin001, {
    downloadAsset: async () => ({ ok: true }),
    validatePackage: async () => true,
  });

  expect(result).toEqual({ kind: 'ready', packageKey: 'skin-001@1.0.0' });
});

test('does not activate incomplete packages', async () => {
  const result = await prepareSkinPackage(skin001, {
    downloadAsset: async () => ({ ok: false }),
    validatePackage: async () => false,
  });

  expect(result.kind).toBe('failed');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/skin/downloader.test.ts --runInBand`
Expected: FAIL with module-not-found for downloader

- [ ] **Step 3: Implement minimal downloader and hook**

```ts
// src/skin/downloader.ts
import type { SkinManifest } from '@/src/skin/types';

export async function prepareSkinPackage(
  manifest: SkinManifest,
  deps: {
    downloadAsset: (asset: SkinManifest['assets'][number]) => Promise<{ ok: boolean }>;
    validatePackage: (manifest: SkinManifest) => Promise<boolean>;
  },
) {
  const packageKey = `${manifest.skinId}@${manifest.skinVersion}`;

  for (const asset of manifest.assets) {
    const result = await deps.downloadAsset(asset);
    if (!result.ok) {
      return { kind: 'failed' as const, packageKey };
    }
  }

  const valid = await deps.validatePackage(manifest);
  if (!valid) {
    return { kind: 'failed' as const, packageKey };
  }

  return { kind: 'ready' as const, packageKey };
}
```

```ts
// src/skin/useSkin.ts
import { useEffect } from 'react';

import { isSkinCompatible } from '@/src/skin/compatibility';
import { skin001 } from '@/src/skin/default-skins/skin-001';
import { getCurrentFeatureVersion } from '@/src/skin/featureVersion';
import { defaultSkinRuntime } from '@/src/skin/runtime';
import { loadSkinState } from '@/src/skin/storage';
import { useAppStore } from '@/src/store/useAppStore';

export function useSkin() {
  const activeSkinId = useAppStore((state) => state.activeSkinId);
  const setActiveSkinId = useAppStore((state) => state.setActiveSkinId);

  useEffect(() => {
    void loadSkinState().then((state) => {
      const compatibility = isSkinCompatible(skin001, getCurrentFeatureVersion());
      if (compatibility.kind === 'compatible') {
        setActiveSkinId(state.activeSkinId ?? 'skin-001');
      } else {
        setActiveSkinId('skin-001');
      }
    });
  }, [setActiveSkinId]);

  return {
    activeSkinId,
    runtime: defaultSkinRuntime,
  };
}
```

```tsx
// app/_layout.tsx
import { useSkin } from '@/src/skin/useSkin';

export default function RootLayout() {
  useSkin();

  return (
    <View style={{ flex: 1, backgroundColor: '#f7fbfa' }}>
      {/* existing Stack */}
    </View>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- tests/skin/downloader.test.ts --runInBand`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/skin/downloader.ts src/skin/useSkin.ts app/_layout.tsx tests/skin/downloader.test.ts
git commit -m "feat: initialize skin runtime with package readiness"
```

### Task 5: Route Base UI Tokens Through Active Skin

**Files:**
- Modify: `src/design/tokens.ts`
- Modify: `src/ui/AppScreen.tsx`
- Modify: `src/ui/AppCard.tsx`
- Modify: `src/ui/AppText.tsx`
- Modify: `src/ui/AppPill.tsx`
- Modify: `src/ui/FloatingAddButton.tsx`
- Test: `tests/skin/runtime.test.ts`

- [ ] **Step 1: Write the failing token test**

```ts
import { defaultSkinRuntime } from '@/src/skin/runtime';
import { createDesignTokens } from '@/src/design/tokens';

test('maps semantic palette into design tokens', () => {
  const tokens = createDesignTokens(defaultSkinRuntime);

  expect(tokens.colors.page).toBe('#F7FBFA');
  expect(tokens.colors.accent).toBe('#86B1A2');
  expect(tokens.colors.text).toBe('#243F39');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/skin/runtime.test.ts --runInBand`
Expected: FAIL because `createDesignTokens` is missing

- [ ] **Step 3: Implement token resolver and update base UI**

```ts
// src/design/tokens.ts
import { defaultSkinRuntime } from '@/src/skin/runtime';

export function createDesignTokens(runtime = defaultSkinRuntime) {
  return {
    colors: {
      page: runtime.palette.pageBg,
      card: runtime.palette.cardBg,
      border: runtime.palette.cardBorder,
      muted: runtime.palette.textMuted,
      text: runtime.palette.textPrimary,
      accent: runtime.palette.actionPrimary,
      accentSoft: '#EEF5F2',
      offlineRibbon: runtime.palette.offlineAccent,
      onlineRibbon: runtime.palette.onlineAccent,
    },
    radius: {
      screen: 28,
      card: 24,
      pill: 999,
    },
    type: {
      title: 23,
      section: 15,
      body: 15,
      caption: 12,
    },
  };
}

const tokens = createDesignTokens();
export const colors = tokens.colors;
export const radius = tokens.radius;
export const type = tokens.type;
```

Update each UI file to read from the resolved tokens helper instead of fixed color literals where applicable.

- [ ] **Step 4: Run targeted tests**

Run: `pnpm test -- tests/skin/runtime.test.ts tests/features/home/home-screen.test.ts --runInBand`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/design/tokens.ts src/ui/AppScreen.tsx src/ui/AppCard.tsx src/ui/AppText.tsx src/ui/AppPill.tsx src/ui/FloatingAddButton.tsx tests/skin/runtime.test.ts
git commit -m "feat: route base ui tokens through skin runtime"
```

### Task 6: Make Home Page Respect Skin Component Order And Visibility

**Files:**
- Modify: `src/features/home/HomeScreen.tsx`
- Modify: `app/(tabs)/home.tsx`
- Test: `tests/features/home/home-screen.skin.test.tsx`

- [ ] **Step 1: Write the failing home skin test**

```ts
import { render, screen } from '@testing-library/react-native';

import { HomeScreen } from '@/src/features/home/HomeScreen';

test('hides home summary cards when skin disables them', () => {
  render(
    <HomeScreen
      summary={{ streakDays: 128, itemCount: 6, helperCount: 3 }}
      skinPage={{
        layoutMode: 'centered',
        componentOrder: ['heroTitle', 'reportButton'],
        componentVisibility: {
          statusLabel: false,
          streakCard: false,
          itemsSummary: false,
          helpersSummary: false,
          heroTitle: true,
          reportButton: true,
        },
      }}
    />,
  );

  expect(screen.getByText('今天也好好生活着')).toBeTruthy();
  expect(screen.queryByText('今日状态')).toBeNull();
  expect(screen.queryByText('事项')).toBeNull();
  expect(screen.queryByText('协助人')).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/features/home/home-screen.skin.test.tsx --runInBand`
Expected: FAIL because `skinPage` prop is unsupported

- [ ] **Step 3: Implement controlled rendering**

```tsx
// In HomeScreen props
skinPage?: {
  layoutMode: string;
  componentOrder: string[];
  componentVisibility: Record<string, boolean | undefined>;
};
```

Render each block through a small `isVisible(key)` helper and use `componentOrder` to build the section list instead of always rendering the hardcoded order.

- [ ] **Step 4: Run targeted tests**

Run: `pnpm test -- tests/features/home/home-screen.skin.test.tsx tests/features/home/home-screen.test.tsx --runInBand`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/home/HomeScreen.tsx app/\(tabs\)/home.tsx tests/features/home/home-screen.skin.test.tsx
git commit -m "feat: make home page layout skin-driven"
```

### Task 7: Make Items Page Respect Skin Layout Controls

**Files:**
- Modify: `src/features/items/ItemsScreen.tsx`
- Modify: `app/(tabs)/items.tsx`
- Test: `tests/features/items/items-screen.skin.test.tsx`

- [ ] **Step 1: Write the failing items skin test**

```ts
import { render, screen } from '@testing-library/react-native';

import { ItemsScreen } from '@/src/features/items/ItemsScreen';

test('hides footer hint when skin disables it', () => {
  render(
    <ItemsScreen
      skinPage={{
        layoutMode: 'list-top',
        componentOrder: ['primaryAction', 'filters', 'list'],
        componentVisibility: { footerHint: false, primaryAction: true, filters: true, list: true },
      }}
    />,
  );

  expect(screen.queryByText('向下滚动后继续查看其他事项')).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/features/items/items-screen.skin.test.tsx --runInBand`
Expected: FAIL because `skinPage` prop is unsupported

- [ ] **Step 3: Implement controlled rendering for items**

Use the same pattern as `HomeScreen`: `skinPage`, `isVisible`, `componentOrder`, and layout-mode-based wrappers.

- [ ] **Step 4: Run targeted tests**

Run: `pnpm test -- tests/features/items/items-screen.skin.test.tsx --runInBand`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/items/ItemsScreen.tsx app/\(tabs\)/items.tsx tests/features/items/items-screen.skin.test.tsx
git commit -m "feat: make items page layout skin-driven"
```

### Task 8: Wire Remaining Pages And Tabs To Skin Runtime

**Files:**
- Modify: `src/features/items/ItemFormScreen.tsx`
- Modify: `src/features/report/ReportScreen.tsx`
- Modify: `src/features/my/MyScreen.tsx`
- Modify: `src/features/trigger-state/TriggerStateScreen.tsx`
- Modify: `app/(tabs)/_layout.tsx`
- Modify: `app/report.tsx`
- Modify: `app/items/new.tsx`
- Modify: `app/my/trigger-state.tsx`

- [ ] **Step 1: Write one failing integration test for tabs styling/page config consumption**

```ts
import { render } from '@testing-library/react-native';

import TabsLayout from '@/app/(tabs)/_layout';

test('renders tabs while consuming i18n titles and skin runtime', () => {
  expect(() => render(<TabsLayout />)).not.toThrow();
});
```

- [ ] **Step 2: Run test to verify it fails if skin runtime assumptions are wrong**

Run: `pnpm test -- tests/features/routes/tab-routes.test.tsx --runInBand`
Expected: FAIL only if tab runtime integration breaks existing route setup

- [ ] **Step 3: Implement skin runtime consumption across remaining pages**

For each route component, read `runtime.getPage('<page-key>')` and pass it into the feature component.

- [ ] **Step 4: Run route and feature tests**

Run: `pnpm test -i`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/items/ItemFormScreen.tsx src/features/report/ReportScreen.tsx src/features/my/MyScreen.tsx src/features/trigger-state/TriggerStateScreen.tsx app/\(tabs\)/_layout.tsx app/report.tsx app/items/new.tsx app/my/trigger-state.tsx
git commit -m "feat: wire remaining pages to skin runtime"
```

### Task 9: Final Verification

**Files:**
- No code changes required unless verification uncovers issues

- [ ] **Step 1: Run full type check**

Run: `pnpm check:type`
Expected: PASS

- [ ] **Step 2: Run full test suite**

Run: `pnpm test -i`
Expected: PASS

- [ ] **Step 3: Manually verify startup behavior**

Run: `pnpm start`
Expected:
- App boots with `skin-001`
- No crash in root layout
- Existing pages still render

- [ ] **Step 4: Commit any final fixes if needed**

```bash
git add .
git commit -m "chore: finalize skin runtime v1 verification"
```
