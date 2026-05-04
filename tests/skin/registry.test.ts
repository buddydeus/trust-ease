import {
  loadConfiguredBundledSkinPackages,
  loadBundledSkinPackage,
  loadDefaultBundledSkinPackage
} from '../../src/skin/registry';
import { appSkinConfig } from '../../src/skin/appConfig';

test('declares the default and switchable app skins from config', () => {
  expect(appSkinConfig).toEqual({
    defaultSkinId: 'skin-001',
    availableSkinIds: ['skin-001']
  });
});

test('loads bundled skin-001 from json manifest', () => {
  const skinPackage = loadDefaultBundledSkinPackage();

  expect(skinPackage.manifest.skinId).toBe('skin-001');
  expect(skinPackage.manifest.displayName).toBe('海盐蓝绿');
  expect(skinPackage.manifest.assets).toEqual([]);
  expect(skinPackage.compatibility).toEqual({ kind: 'compatible' });
});

test('loads configured switchable bundled skins', () => {
  expect(
    loadConfiguredBundledSkinPackages().map(skinPackage => ({
      skinId: skinPackage.manifest.skinId,
      compatibility: skinPackage.compatibility
    }))
  ).toEqual([
    {
      skinId: 'skin-001',
      compatibility: { kind: 'compatible' }
    }
  ]);
});

test('returns null for missing bundled skin ids', () => {
  expect(loadBundledSkinPackage('skin-missing')).toBeNull();
});
