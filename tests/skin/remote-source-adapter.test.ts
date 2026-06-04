import { coerceFeatureVersion } from '../../src/skin/featureVersion';
import { downloadSkinPackage } from '../../src/skin/downloader';
import { createSkinPackageKey } from '../../src/skin/initStateMachine';
import { calculateSkinPackageHash } from '../../src/skin/packageHash';
import {
  calculateRemoteSkinContentHash,
  createRemoteSkinPackageSource
} from '../../src/skin/remoteSourceAdapter';
import type { SkinDownloaderFileSystem } from '../../src/skin/downloader';
import type {
  IRemoteSkinPackageAdapterDependencies,
  IRemoteSkinPackageDescriptor,
  IRemoteSkinPackageProgress
} from '../../src/skin/remoteSourceAdapter';
import type { SkinStorageState } from '../../src/skin/storage';

const mockFileSystemModule = {
  documentDirectory: 'file:///app/document/' as string | null,
  makeDirectoryAsync: jest.fn(),
  deleteAsync: jest.fn(),
  moveAsync: jest.fn(),
  writeAsStringAsync: jest.fn()
};

jest.mock('expo-file-system/legacy', () => ({
  get documentDirectory() {
    return mockFileSystemModule.documentDirectory;
  },
  makeDirectoryAsync: (...args: unknown[]) =>
    mockFileSystemModule.makeDirectoryAsync(...args),
  deleteAsync: (...args: unknown[]) =>
    mockFileSystemModule.deleteAsync(...args),
  moveAsync: (...args: unknown[]) => mockFileSystemModule.moveAsync(...args),
  writeAsStringAsync: (...args: unknown[]) =>
    mockFileSystemModule.writeAsStringAsync(...args)
}));

const builtinKey = createSkinPackageKey({
  skinId: 'skin-001',
  skinVersion: '1.0.0'
});
const remoteDescriptor: IRemoteSkinPackageDescriptor = {
  skinId: 'skin-002',
  skinVersion: '1.1.0',
  manifestUrl: 'https://skins.example.com/skin-002/manifest.json',
  assetBaseUrl: 'https://cdn.example.com/skin-002/'
};
const remoteKey = createSkinPackageKey(remoteDescriptor);

const logoContent = 'logo-content';
const heroContent = 'hero-content';
const logoHash = calculateRemoteSkinContentHash(logoContent);
const heroHash = calculateRemoteSkinContentHash(heroContent);

const createManifestSource = (overrides: Record<string, unknown> = {}) => ({
  skinId: 'skin-002',
  displayName: 'Remote Skin',
  skinVersion: '1.1.0',
  minFeatureVersion: '0.0',
  maxFeatureVersion: '0.1',
  packageHash: 'pkg-ok',
  assets: [
    {
      id: 'logo',
      path: 'assets/logo.txt',
      hash: logoHash
    },
    {
      id: 'hero',
      path: 'images/hero.txt',
      hash: heroHash
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

const createDownloaderFileSystem = (): jest.Mocked<SkinDownloaderFileSystem> => ({
  makeDirectory: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  move: jest.fn().mockResolvedValue(undefined)
});

const createDependencies = (
  manifestSource = createManifestSource(),
  overrides: Partial<IRemoteSkinPackageAdapterDependencies> = {}
): jest.Mocked<IRemoteSkinPackageAdapterDependencies> => ({
  fetchManifest: jest.fn().mockResolvedValue(manifestSource),
  fetchAsset: jest.fn().mockImplementation(async (url: string) => {
    const content = url.includes('hero') ? heroContent : logoContent;

    return {
      content,
      hash: calculateRemoteSkinContentHash(content)
    };
  }),
  writeAsset: jest.fn().mockResolvedValue(undefined),
  makeDirectory: jest.fn().mockResolvedValue(undefined),
  wait: jest.fn().mockResolvedValue(undefined),
  calculatePackageHash: jest.fn().mockReturnValue('pkg-ok'),
  ...overrides
});

describe('remote skin source adapter', () => {
  beforeEach(() => {
    mockFileSystemModule.documentDirectory = 'file:///app/document/';
    jest.clearAllMocks();
  });

  test('fetches manifest and stages declared assets', async () => {
    const dependencies = createDependencies();
    const source = createRemoteSkinPackageSource(remoteDescriptor, {
      dependencies
    });

    const payload = await source.stage(
      'file:///app/document/skins/.staging/skin-002'
    );

    expect(dependencies.fetchManifest).toHaveBeenCalledWith(
      'https://skins.example.com/skin-002/manifest.json',
      { signal: undefined }
    );
    expect(dependencies.fetchAsset).toHaveBeenNthCalledWith(
      1,
      'https://cdn.example.com/skin-002/assets/logo.txt',
      { signal: undefined }
    );
    expect(dependencies.fetchAsset).toHaveBeenNthCalledWith(
      2,
      'https://cdn.example.com/skin-002/images/hero.txt',
      { signal: undefined }
    );
    expect(dependencies.makeDirectory).toHaveBeenCalledWith(
      'file:///app/document/skins/.staging/skin-002/assets'
    );
    expect(dependencies.writeAsset).toHaveBeenCalledWith(
      'file:///app/document/skins/.staging/skin-002/assets/logo.txt',
      {
        content: logoContent,
        hash: logoHash
      }
    );
    expect(payload.assetHashes).toEqual({
      'assets/logo.txt': logoHash,
      'images/hero.txt': heroHash
    });
    expect(payload.packageHash).toBe('pkg-ok');
  });

  test('resolves relative assets from the manifest URL when no asset base URL exists', async () => {
    const dependencies = createDependencies();
    const source = createRemoteSkinPackageSource(
      {
        ...remoteDescriptor,
        assetBaseUrl: undefined
      },
      { dependencies }
    );

    await source.stage('file:///app/document/skins/.staging/skin-002');

    expect(dependencies.fetchAsset).toHaveBeenNthCalledWith(
      1,
      'https://skins.example.com/skin-002/assets/logo.txt',
      { signal: undefined }
    );
  });

  test('reports manifest, asset, and completion progress', async () => {
    const dependencies = createDependencies();
    const progress: IRemoteSkinPackageProgress[] = [];
    const source = createRemoteSkinPackageSource(remoteDescriptor, {
      dependencies,
      onProgress: event => progress.push(event)
    });

    await source.stage('file:///app/document/skins/.staging/skin-002');

    expect(progress).toEqual([
      {
        phase: 'manifest',
        url: 'https://skins.example.com/skin-002/manifest.json',
        completedAssets: 0,
        totalAssets: 0
      },
      {
        phase: 'asset',
        url: 'https://cdn.example.com/skin-002/assets/logo.txt',
        assetPath: 'assets/logo.txt',
        completedAssets: 1,
        totalAssets: 2
      },
      {
        phase: 'asset',
        url: 'https://cdn.example.com/skin-002/images/hero.txt',
        assetPath: 'images/hero.txt',
        completedAssets: 2,
        totalAssets: 2
      },
      {
        phase: 'complete',
        url: 'https://skins.example.com/skin-002/manifest.json',
        completedAssets: 2,
        totalAssets: 2
      }
    ]);
  });

  test('uses canonical package hash when descriptor omits packageHash', async () => {
    const manifestSource = createManifestSource({
      packageHash: calculateSkinPackageHash({
        identity: {
          skinId: remoteDescriptor.skinId,
          skinVersion: remoteDescriptor.skinVersion
        },
        manifestSource: createManifestSource(),
        files: [
          {
            path: 'assets/logo.txt',
            hash: logoHash
          },
          {
            path: 'images/hero.txt',
            hash: heroHash
          }
        ]
      })
    });
    const dependencies = createDependencies(manifestSource, {
      calculatePackageHash: undefined
    });
    const source = createRemoteSkinPackageSource(remoteDescriptor, {
      dependencies
    });

    const payload = await source.stage(
      'file:///app/document/skins/.staging/skin-002'
    );

    expect(payload.packageHash).toBe(manifestSource.packageHash);
  });

  test('retries manifest fetch before failing', async () => {
    const dependencies = createDependencies();
    dependencies.fetchManifest.mockRejectedValue(new Error('offline'));
    const source = createRemoteSkinPackageSource(remoteDescriptor, {
      dependencies,
      retryPolicy: {
        retries: 1,
        delayMs: 25
      }
    });

    await expect(
      source.stage('file:///app/document/skins/.staging/skin-002')
    ).rejects.toThrow('offline');

    expect(dependencies.fetchManifest).toHaveBeenCalledTimes(2);
    expect(dependencies.wait).toHaveBeenCalledWith(25);
  });

  test('fails when a declared asset cannot be fetched', async () => {
    const dependencies = createDependencies();
    dependencies.fetchAsset.mockRejectedValueOnce(new Error('missing asset'));
    const source = createRemoteSkinPackageSource(remoteDescriptor, {
      dependencies
    });

    await expect(
      source.stage('file:///app/document/skins/.staging/skin-002')
    ).rejects.toThrow('missing asset');

    expect(dependencies.writeAsset).not.toHaveBeenCalled();
  });

  test('cancels before network work starts', async () => {
    const dependencies = createDependencies();
    const source = createRemoteSkinPackageSource(remoteDescriptor, {
      dependencies,
      signal: {
        aborted: true
      }
    });

    await expect(
      source.stage('file:///app/document/skins/.staging/skin-002')
    ).rejects.toThrow('cancelled');

    expect(dependencies.fetchManifest).not.toHaveBeenCalled();
    expect(dependencies.fetchAsset).not.toHaveBeenCalled();
  });

  test('integrates with downloader promotion for a valid remote package', async () => {
    const source = createRemoteSkinPackageSource(remoteDescriptor, {
      dependencies: createDependencies()
    });
    const fileSystem = createDownloaderFileSystem();

    const result = await downloadSkinPackage({
      state: createState(),
      source,
      fileSystem,
      currentFeatureVersion: coerceFeatureVersion('0.0')
    });

    expect(fileSystem.move).toHaveBeenCalledWith(
      'file:///app/document/skins/.staging/skin-002',
      'file:///app/document/skins/skin-002'
    );
    expect(result.operation.state).toBe('ready');
    expect(result.state.activeSkinId).toBe('skin-002');
    expect(result.state.lastReadySkinId).toBe('skin-002');
    expect(result.state.skinPackageStates[remoteKey]).toBe('ready');
  });

  test('preserves the previous ready skin when remote staging fails', async () => {
    const dependencies = createDependencies();
    dependencies.fetchManifest.mockRejectedValue(new Error('offline'));
    const source = createRemoteSkinPackageSource(remoteDescriptor, {
      dependencies
    });

    const result = await downloadSkinPackage({
      state: createState(),
      source,
      fileSystem: createDownloaderFileSystem(),
      currentFeatureVersion: coerceFeatureVersion('0.0')
    });

    expect(result.operation).toEqual({
      identity: {
        skinId: 'skin-002',
        skinVersion: '1.1.0'
      },
      state: 'failed',
      failureReason: 'source-unavailable'
    });
    expect(result.state.activeSkinId).toBe('skin-001');
    expect(result.state.lastReadySkinId).toBe('skin-001');
  });
});
