import {
  parseSkinManifest,
  SkinManifestParseError
} from '../../src/skin/manifest';

const rawManifest = {
  skinId: 'skin-test',
  displayName: '测试皮肤',
  skinVersion: '1.0.0',
  minFeatureVersion: '0.0',
  maxFeatureVersion: '0.1',
  packageHash: 'sha256:test',
  assets: [
    {
      id: 'background',
      path: 'assets/background.png',
      hash: 'sha256:asset'
    }
  ],
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
  pages: {
    home: {
      layoutMode: 'hero-top',
      componentOrder: ['heroTitle', 'primaryAction'],
      componentVisibility: {
        heroTitle: true,
        primaryAction: true
      }
    }
  }
};

test('parses a json skin manifest into the runtime manifest contract', () => {
  const manifest = parseSkinManifest(rawManifest);

  expect(manifest.skinId).toBe('skin-test');
  expect(manifest.displayName).toBe('测试皮肤');
  expect(manifest.minFeatureVersion).toBe('0.0');
  expect(manifest.assets[0]).toEqual({
    id: 'background',
    path: 'assets/background.png',
    hash: 'sha256:asset'
  });
  expect(manifest.pages.home?.componentOrder).toEqual([
    'heroTitle',
    'primaryAction'
  ]);
});

test('parses welcome page config from skin manifest', () => {
  const manifest = parseSkinManifest({
    ...rawManifest,
    pages: {
      ...rawManifest.pages,
      welcome: {
        layoutMode: 'stacked',
        componentOrder: [
          'brandHeader',
          'decorativeStack',
          'heroTitle',
          'heroBody',
          'primaryAction'
        ],
        componentVisibility: {
          brandHeader: true,
          decorativeStack: true,
          heroTitle: true,
          heroBody: true,
          primaryAction: true
        }
      }
    }
  });

  expect(manifest.pages.welcome?.componentOrder).toEqual([
    'brandHeader',
    'decorativeStack',
    'heroTitle',
    'heroBody',
    'primaryAction'
  ]);
});

test('rejects malformed feature versions before runtime creation', () => {
  expect(() =>
    parseSkinManifest({
      ...rawManifest,
      minFeatureVersion: '0.0.1'
    })
  ).toThrow(SkinManifestParseError);
});

test('rejects unsupported page component keys', () => {
  expect(() =>
    parseSkinManifest({
      ...rawManifest,
      pages: {
        home: {
          layoutMode: 'hero-top',
          componentOrder: ['unknownBlock'],
          componentVisibility: {}
        }
      }
    })
  ).toThrow(SkinManifestParseError);
});
