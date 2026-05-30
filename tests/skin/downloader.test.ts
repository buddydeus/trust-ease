import { coerceFeatureVersion } from '../../src/skin/featureVersion';
import { downloadSkinPackage } from '../../src/skin/downloader';
import { createSkinPackageKey } from '../../src/skin/initStateMachine';
import type {
  SkinDownloaderFileSystem,
  SkinPackageSourceAdapter
} from '../../src/skin/downloader';
import type { SkinStorageState } from '../../src/skin/storage';

const mockFileSystemModule = {
  documentDirectory: 'file:///app/document/' as string | null,
  makeDirectoryAsync: jest.fn(),
  deleteAsync: jest.fn(),
  moveAsync: jest.fn()
};

jest.mock('expo-file-system/legacy', () => ({
  get documentDirectory() {
    return mockFileSystemModule.documentDirectory;
  },
  makeDirectoryAsync: (...args: unknown[]) =>
    mockFileSystemModule.makeDirectoryAsync(...args),
  deleteAsync: (...args: unknown[]) =>
    mockFileSystemModule.deleteAsync(...args),
  moveAsync: (...args: unknown[]) => mockFileSystemModule.moveAsync(...args)
}));

const builtinKey = createSkinPackageKey({
  skinId: 'skin-001',
  skinVersion: '1.0.0'
});
const downloadedIdentity = {
  skinId: 'skin-002',
  skinVersion: '1.1.0'
};
const downloadedKey = createSkinPackageKey(downloadedIdentity);

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

const createState = (): SkinStorageState => ({
  selectedSkinId: 'skin-001',
  activeSkinId: 'skin-001',
  lastReadySkinId: 'skin-001',
  skinPackageStates: {
    [builtinKey]: 'ready'
  }
});

const createSource = (
  overrides: Partial<SkinPackageSourceAdapter> = {}
): SkinPackageSourceAdapter => ({
  identity: downloadedIdentity,
  stage: jest.fn().mockResolvedValue({
    manifestSource: createManifestSource(),
    assetHashes: {
      'assets/logo.png': 'asset-ok'
    },
    packageHash: 'pkg-ok'
  }),
  ...overrides
});

const createFileSystem = (): jest.Mocked<SkinDownloaderFileSystem> => ({
  makeDirectory: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  move: jest.fn().mockResolvedValue(undefined)
});

describe('skin downloader lifecycle', () => {
  beforeEach(() => {
    mockFileSystemModule.documentDirectory = 'file:///app/document/';
  });

  test('stages, validates, promotes, and marks a package ready', async () => {
    const source = createSource();
    const fileSystem = createFileSystem();

    const result = await downloadSkinPackage({
      state: createState(),
      source,
      fileSystem,
      currentFeatureVersion: coerceFeatureVersion('0.0')
    });

    expect(source.stage).toHaveBeenCalledWith(
      'file:///app/document/skins/.staging/skin-002'
    );
    expect(fileSystem.move).toHaveBeenCalledWith(
      'file:///app/document/skins/.staging/skin-002',
      'file:///app/document/skins/skin-002'
    );
    expect(result.transitions).toEqual([
      'checking',
      'downloading',
      'checking',
      'ready'
    ]);
    expect(result.state.activeSkinId).toBe('skin-002');
    expect(result.state.lastReadySkinId).toBe('skin-002');
    expect(result.state.skinPackageStates[downloadedKey]).toBe('ready');
  });

  test('marks source failure without changing the active skin', async () => {
    const source = createSource({
      stage: jest.fn().mockRejectedValue(new Error('missing package'))
    });

    const result = await downloadSkinPackage({
      state: createState(),
      source,
      fileSystem: createFileSystem(),
      currentFeatureVersion: coerceFeatureVersion('0.0')
    });

    expect(result.operation).toEqual({
      identity: downloadedIdentity,
      state: 'failed',
      failureReason: 'source-unavailable'
    });
    expect(result.state.activeSkinId).toBe('skin-001');
    expect(result.state.lastReadySkinId).toBe('skin-001');
    expect(result.state.skinPackageStates[downloadedKey]).toBe('failed');
  });

  test('marks validation failure without promoting staged files', async () => {
    const source = createSource({
      stage: jest.fn().mockResolvedValue({
        manifestSource: createManifestSource(),
        assetHashes: {
          'assets/logo.png': 'wrong'
        },
        packageHash: 'pkg-ok'
      })
    });
    const fileSystem = createFileSystem();

    const result = await downloadSkinPackage({
      state: createState(),
      source,
      fileSystem,
      currentFeatureVersion: coerceFeatureVersion('0.0')
    });

    expect(fileSystem.move).not.toHaveBeenCalled();
    expect(result.operation.failureReason).toBe('asset-hash-mismatch');
    expect(result.state.skinPackageStates[downloadedKey]).toBe('failed');
  });

  test('marks incompatible package without changing last ready skin', async () => {
    const source = createSource({
      stage: jest.fn().mockResolvedValue({
        manifestSource: createManifestSource({
          minFeatureVersion: '9.0'
        }),
        assetHashes: {
          'assets/logo.png': 'asset-ok'
        },
        packageHash: 'pkg-ok'
      })
    });

    const result = await downloadSkinPackage({
      state: createState(),
      source,
      fileSystem: createFileSystem(),
      currentFeatureVersion: coerceFeatureVersion('0.0')
    });

    expect(result.operation.state).toBe('incompatible');
    expect(result.operation.failureReason).toBe('incompatible');
    expect(result.state.activeSkinId).toBe('skin-001');
    expect(result.state.lastReadySkinId).toBe('skin-001');
  });

  test('marks promotion failure without treating staged files as ready', async () => {
    const fileSystem = createFileSystem();
    fileSystem.move.mockRejectedValueOnce(new Error('move failed'));

    const result = await downloadSkinPackage({
      state: createState(),
      source: createSource(),
      fileSystem,
      currentFeatureVersion: coerceFeatureVersion('0.0')
    });

    expect(result.operation).toEqual({
      identity: downloadedIdentity,
      state: 'failed',
      failureReason: 'promotion-failed'
    });
    expect(result.state.activeSkinId).toBe('skin-001');
    expect(result.state.skinPackageStates[downloadedKey]).toBe('failed');
  });

  test('fails safely when runtime storage is unavailable', async () => {
    mockFileSystemModule.documentDirectory = null;

    const result = await downloadSkinPackage({
      state: createState(),
      source: createSource(),
      fileSystem: createFileSystem(),
      currentFeatureVersion: coerceFeatureVersion('0.0')
    });

    expect(result.operation.state).toBe('failed');
    expect(result.operation.failureReason).toBe('storage-unavailable');
    expect(result.state.activeSkinId).toBe('skin-001');
  });
});
