import { calculateSkinPackageHash } from '../../src/skin/packageHash';

const createManifestSource = (overrides: Record<string, unknown> = {}) => ({
  skinId: 'skin-002',
  displayName: 'Remote Skin',
  skinVersion: '1.1.0',
  minFeatureVersion: '0.0',
  maxFeatureVersion: '0.1',
  packageHash: 'fnv1a:ignored',
  assets: [
    {
      id: 'logo',
      path: 'assets/logo.txt',
      hash: 'asset-logo'
    },
    {
      id: 'hero',
      path: 'images/hero.txt',
      hash: 'asset-hero'
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

const createPackageHashInput = (
  overrides: Partial<Parameters<typeof calculateSkinPackageHash>[0]> = {}
): Parameters<typeof calculateSkinPackageHash>[0] => ({
  identity: {
    skinId: 'skin-002',
    skinVersion: '1.1.0'
  },
  manifestSource: createManifestSource(),
  files: [
    {
      path: 'assets/logo.txt',
      hash: 'asset-logo'
    },
    {
      path: 'images/hero.txt',
      hash: 'asset-hero'
    }
  ],
  ...overrides
});

describe('skin package hash canonicalization', () => {
  test('uses a stable algorithm prefix', () => {
    expect(calculateSkinPackageHash(createPackageHashInput())).toMatch(
      /^fnv1a:[0-9a-f]{8}$/
    );
  });

  test('normalizes Windows and POSIX path separators', () => {
    const posixHash = calculateSkinPackageHash(createPackageHashInput());
    const windowsHash = calculateSkinPackageHash(
      createPackageHashInput({
        files: [
          {
            path: 'assets\\logo.txt',
            hash: 'asset-logo'
          },
          {
            path: 'images\\hero.txt',
            hash: 'asset-hero'
          }
        ]
      })
    );

    expect(windowsHash).toBe(posixHash);
  });

  test('sorts file entries before hashing', () => {
    const orderedHash = calculateSkinPackageHash(createPackageHashInput());
    const reversedHash = calculateSkinPackageHash(
      createPackageHashInput({
        files: [
          {
            path: 'images/hero.txt',
            hash: 'asset-hero'
          },
          {
            path: 'assets/logo.txt',
            hash: 'asset-logo'
          }
        ]
      })
    );

    expect(reversedHash).toBe(orderedHash);
  });

  test('sorts manifest object keys recursively', () => {
    const manifestA = createManifestSource({
      nested: {
        alpha: 1,
        beta: 2
      }
    });
    const manifestB = {
      ...createManifestSource(),
      nested: {
        beta: 2,
        alpha: 1
      }
    };

    expect(
      calculateSkinPackageHash(
        createPackageHashInput({ manifestSource: manifestB })
      )
    ).toBe(
      calculateSkinPackageHash(
        createPackageHashInput({ manifestSource: manifestA })
      )
    );
  });

  test('omits manifest packageHash from canonical manifest input', () => {
    const firstHash = calculateSkinPackageHash(
      createPackageHashInput({
        manifestSource: createManifestSource({
          packageHash: 'fnv1a:first'
        })
      })
    );
    const secondHash = calculateSkinPackageHash(
      createPackageHashInput({
        manifestSource: createManifestSource({
          packageHash: 'fnv1a:second'
        })
      })
    );

    expect(secondHash).toBe(firstHash);
  });

  test.each([
    [''],
    ['../secret.txt'],
    ['assets/../secret.txt'],
    ['/absolute/logo.txt'],
    ['C:\\absolute\\logo.txt'],
    ['https://example.com/logo.txt']
  ])('rejects invalid package path %s', invalidPath => {
    expect(() =>
      calculateSkinPackageHash(
        createPackageHashInput({
          files: [
            {
              path: invalidPath,
              hash: 'asset-logo'
            }
          ]
        })
      )
    ).toThrow('Invalid skin package path');
  });
});
