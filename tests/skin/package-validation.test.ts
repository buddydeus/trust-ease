import { coerceFeatureVersion } from '../../src/skin/featureVersion';
import { validateSkinPackage } from '../../src/skin/packageValidation';

const createManifestSource = (overrides: Record<string, unknown> = {}) => ({
  skinId: 'skin-002',
  displayName: 'Test Skin',
  skinVersion: '1.1.0',
  minFeatureVersion: '0.0',
  maxFeatureVersion: '0.1',
  packageHash: 'pkg-ok',
  assets: [
    {
      id: 'logo',
      path: 'assets/logo.png',
      hash: 'asset-ok'
    }
  ],
  palette: {
    pageBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardBorder: '#EEEEEE',
    textPrimary: '#111111',
    textMuted: '#666666',
    actionPrimary: '#0055AA',
    actionPrimaryText: '#FFFFFF',
    offlineAccent: '#CCCCCC',
    onlineAccent: '#DDDDDD'
  },
  pages: {},
  ...overrides
});

describe('skin package validation', () => {
  test('accepts valid manifest, package hash, asset hashes, and compatibility', () => {
    const result = validateSkinPackage({
      requestedSkinId: 'skin-002',
      manifestSource: createManifestSource(),
      assetHashes: {
        'assets/logo.png': 'asset-ok'
      },
      packageHash: 'pkg-ok',
      currentFeatureVersion: coerceFeatureVersion('0.0')
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.manifest.skinId).toBe('skin-002');
      expect(result.compatibility).toEqual({ kind: 'compatible' });
    }
  });

  test('rejects invalid manifest shape', () => {
    expect(
      validateSkinPackage({
        requestedSkinId: 'skin-002',
        manifestSource: { skinId: 'skin-002' },
        assetHashes: {},
        packageHash: 'pkg-ok',
        currentFeatureVersion: coerceFeatureVersion('0.0')
      })
    ).toEqual({
      ok: false,
      state: 'failed',
      failureReason: 'manifest-invalid'
    });
  });

  test('rejects skin id mismatch', () => {
    expect(
      validateSkinPackage({
        requestedSkinId: 'skin-expected',
        manifestSource: createManifestSource(),
        assetHashes: {
          'assets/logo.png': 'asset-ok'
        },
        packageHash: 'pkg-ok',
        currentFeatureVersion: coerceFeatureVersion('0.0')
      })
    ).toEqual({
      ok: false,
      state: 'failed',
      failureReason: 'skin-id-mismatch'
    });
  });

  test('rejects asset hash mismatch', () => {
    expect(
      validateSkinPackage({
        requestedSkinId: 'skin-002',
        manifestSource: createManifestSource(),
        assetHashes: {
          'assets/logo.png': 'wrong'
        },
        packageHash: 'pkg-ok',
        currentFeatureVersion: coerceFeatureVersion('0.0')
      })
    ).toEqual({
      ok: false,
      state: 'failed',
      failureReason: 'asset-hash-mismatch'
    });
  });

  test('rejects package hash mismatch', () => {
    expect(
      validateSkinPackage({
        requestedSkinId: 'skin-002',
        manifestSource: createManifestSource(),
        assetHashes: {
          'assets/logo.png': 'asset-ok'
        },
        packageHash: 'wrong',
        currentFeatureVersion: coerceFeatureVersion('0.0')
      })
    ).toEqual({
      ok: false,
      state: 'failed',
      failureReason: 'package-hash-mismatch'
    });
  });

  test('marks incompatible packages without treating them as failed download', () => {
    expect(
      validateSkinPackage({
        requestedSkinId: 'skin-002',
        manifestSource: createManifestSource({
          minFeatureVersion: '9.0'
        }),
        assetHashes: {
          'assets/logo.png': 'asset-ok'
        },
        packageHash: 'pkg-ok',
        currentFeatureVersion: coerceFeatureVersion('0.0')
      })
    ).toEqual({
      ok: false,
      state: 'incompatible',
      failureReason: 'incompatible'
    });
  });
});
