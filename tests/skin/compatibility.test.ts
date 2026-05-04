import { coerceFeatureVersion } from '../../src/skin/featureVersion';
import { isSkinCompatible } from '../../src/skin/compatibility';
import type { SkinManifest } from '../../src/skin/types';

const manifest: SkinManifest = {
  skinId: 'skin-001',
  displayName: '海盐蓝绿',
  skinVersion: '1.0.0',
  minFeatureVersion: coerceFeatureVersion('0.0'),
  maxFeatureVersion: coerceFeatureVersion('0.1'),
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
    onlineAccent: '#EADFDB'
  },
  pages: {}
};

test('marks compatible feature versions as usable', () => {
  expect(isSkinCompatible(manifest, coerceFeatureVersion('0.0')).kind).toBe(
    'compatible'
  );
});

test('blocks skins that require a newer feature version', () => {
  expect(
    isSkinCompatible(
      { ...manifest, minFeatureVersion: coerceFeatureVersion('0.2') },
      coerceFeatureVersion('0.0')
    )
  ).toEqual({
    kind: 'incompatible',
    reason: 'upgrade-app'
  });
});

test('blocks skins whose max feature version is below the current app', () => {
  expect(
    isSkinCompatible(
      { ...manifest, maxFeatureVersion: coerceFeatureVersion('0.0') },
      coerceFeatureVersion('0.1')
    )
  ).toEqual({
    kind: 'incompatible',
    reason: 'change-skin'
  });
});

test('accepts equality on min and max feature version bounds', () => {
  expect(
    isSkinCompatible(
      {
        ...manifest,
        minFeatureVersion: coerceFeatureVersion('0.0'),
        maxFeatureVersion: coerceFeatureVersion('0.0')
      },
      coerceFeatureVersion('0.0')
    )
  ).toEqual({
    kind: 'compatible'
  });
});

test('treats malformed manifest feature versions as incompatible', () => {
  const malformedManifest = {
    ...manifest,
    minFeatureVersion: 'bad.version'
  } as unknown as SkinManifest;

  expect(
    isSkinCompatible(malformedManifest, coerceFeatureVersion('0.0'))
  ).toEqual({
    kind: 'incompatible',
    reason: 'change-skin'
  });
});
