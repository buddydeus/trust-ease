import { loadDefaultBundledSkinPackage } from '../../src/skin/registry';
import { createSkinRuntime } from '../../src/skin/runtime';

test('creates runtime from skin-001 manifest', () => {
  const runtime = createSkinRuntime(loadDefaultBundledSkinPackage().manifest);

  expect(runtime.skinId).toBe('skin-001');
  expect(runtime.displayName).toBe('海盐蓝绿');
  expect(runtime.palette.actionPrimary).toBe('#86B1A2');
});

test('returns default visible component order for home', () => {
  const runtime = createSkinRuntime(loadDefaultBundledSkinPackage().manifest);

  expect(runtime.getPage('home').componentOrder).toEqual([
    'statusLabel',
    'heroTitle',
    'streakCard',
    'reportButton',
    'itemsSummary',
    'helpersSummary'
  ]);
});

test('returns welcome page config from the bundled runtime manifest', () => {
  const runtime = createSkinRuntime(loadDefaultBundledSkinPackage().manifest);

  expect(runtime.getPage('welcome').componentOrder).toEqual([
    'brandHeader',
    'decorativeStack',
    'heroTitle',
    'heroBody',
    'primaryAction'
  ]);
});

test('does not expose shared mutable runtime config by reference', () => {
  const runtime = createSkinRuntime(loadDefaultBundledSkinPackage().manifest);

  (runtime.palette as { actionPrimary: string }).actionPrimary = '#000000';
  (runtime.manifest as { displayName: string }).displayName = 'changed';
  (runtime.getPage('home').componentOrder as string[]).push('primaryAction');

  expect(runtime.palette.actionPrimary).toBe('#86B1A2');
  expect(runtime.manifest.displayName).toBe('海盐蓝绿');
  expect(runtime.getPage('home').componentOrder).toEqual([
    'statusLabel',
    'heroTitle',
    'streakCard',
    'reportButton',
    'itemsSummary',
    'helpersSummary'
  ]);
});
