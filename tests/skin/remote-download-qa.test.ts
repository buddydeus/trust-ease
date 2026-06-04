import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { coerceFeatureVersion } from '../../src/skin/featureVersion';
import { downloadSkinPackage } from '../../src/skin/downloader';
import { createSkinPackageKey } from '../../src/skin/initStateMachine';
import { calculateSkinPackageHash } from '../../src/skin/packageHash';
import { runSkinPackagePublishing } from '../../src/skin/publishingTool';
import {
  calculateRemoteSkinContentHash,
  createRemoteSkinPackageSource
} from '../../src/skin/remoteSourceAdapter';
import type { SkinDownloaderFileSystem } from '../../src/skin/downloader';
import type {
  IRemoteSkinFetchedAsset,
  IRemoteSkinFetchInput,
  IRemoteSkinPackageAdapterDependencies,
  IRemoteSkinPackageDescriptor
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

interface IRemoteQaFixture {
  dir: string;
  manifestPath: string;
  manifest: Record<string, unknown>;
}

interface IFixtureOptions {
  staleAssetHash?: boolean;
}

const builtinKey = createSkinPackageKey({
  skinId: 'skin-001',
  skinVersion: '1.0.0'
});
const qaIdentity = {
  skinId: 'skin-qa-remote',
  skinVersion: '1.0.0'
};
const qaPackageKey = createSkinPackageKey(qaIdentity);
const logoContent = 'remote-logo-content';
const heroContent = 'remote-hero-content';
const manifestUrl =
  'https://skins.example.com/skin-qa-remote/manifest.json';
const assetBaseUrl = 'https://cdn.example.com/skin-qa-remote/';

const createDownloaderFileSystem = (): jest.Mocked<SkinDownloaderFileSystem> => ({
  makeDirectory: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  move: jest.fn().mockResolvedValue(undefined)
});

const createState = (): SkinStorageState => ({
  selectedSkinId: 'skin-001',
  activeSkinId: 'skin-001',
  lastReadySkinId: 'skin-001',
  skinPackageStates: {
    [builtinKey]: 'ready'
  }
});

const createManifestSource = (): Record<string, unknown> => ({
  skinId: qaIdentity.skinId,
  displayName: 'Remote QA Skin',
  skinVersion: qaIdentity.skinVersion,
  minFeatureVersion: '0.0',
  maxFeatureVersion: '0.1',
  packageHash: 'fnv1a:stale-package',
  assets: [
    {
      id: 'logo',
      path: 'assets/logo.txt',
      hash: 'fnv1a:stale-logo'
    },
    {
      id: 'hero',
      path: 'images/hero.txt',
      hash: 'fnv1a:stale-hero'
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
  pages: {}
});

const writeRemoteQaFixture = async ({
  staleAssetHash = false
}: IFixtureOptions = {}): Promise<IRemoteQaFixture> => {
  const dir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'trust-ease-remote-skin-qa-')
  );
  const manifestPath = path.join(dir, 'manifest.json');

  await fs.mkdir(path.join(dir, 'assets'), { recursive: true });
  await fs.mkdir(path.join(dir, 'images'), { recursive: true });
  await fs.writeFile(path.join(dir, 'assets/logo.txt'), logoContent, 'utf8');
  await fs.writeFile(path.join(dir, 'images/hero.txt'), heroContent, 'utf8');
  await fs.writeFile(
    manifestPath,
    `${JSON.stringify(createManifestSource(), null, 2)}\n`,
    'utf8'
  );

  const publishResult = await runSkinPackagePublishing({
    mode: 'update',
    packageDir: dir
  });

  if (!publishResult.ok) {
    throw new Error(
      publishResult.issues.map(issue => issue.message).join('\n')
    );
  }

  const manifest = JSON.parse(
    await fs.readFile(manifestPath, 'utf8')
  ) as Record<string, unknown>;

  if (staleAssetHash) {
    const assets = manifest.assets as Array<Record<string, unknown>>;
    assets[0].hash = 'fnv1a:stale-logo';
  }

  return {
    dir,
    manifestPath,
    manifest
  };
};

const createDescriptor = (
  overrides: Partial<IRemoteSkinPackageDescriptor> = {}
): IRemoteSkinPackageDescriptor => ({
  ...qaIdentity,
  manifestUrl,
  assetBaseUrl,
  ...overrides
});

const resolveFixtureAssetPath = (fixtureDir: string, url: string): string => {
  const assetPath = new URL(url).pathname
    .replace('/skin-qa-remote/', '')
    .replace(/^\/+/, '');

  return path.join(fixtureDir, assetPath);
};

const createDependencies = (
  fixture: IRemoteQaFixture
): jest.Mocked<IRemoteSkinPackageAdapterDependencies> => ({
  fetchManifest: jest.fn().mockResolvedValue(fixture.manifest),
  fetchAsset: jest.fn(
    async (
      url: string,
      _input: IRemoteSkinFetchInput
    ): Promise<IRemoteSkinFetchedAsset> => {
      const content = await fs.readFile(
        resolveFixtureAssetPath(fixture.dir, url),
        'utf8'
      );

      return {
        content,
        hash: calculateRemoteSkinContentHash(content)
      };
    }
  ),
  writeAsset: jest.fn().mockResolvedValue(undefined),
  makeDirectory: jest.fn().mockResolvedValue(undefined),
  wait: jest.fn().mockResolvedValue(undefined),
  calculatePackageHash: jest.fn(({ descriptor, manifestSource, assetHashes }) =>
    descriptor.packageHash ??
    calculateSkinPackageHash({
      identity: {
        skinId: descriptor.skinId,
        skinVersion: descriptor.skinVersion
      },
      manifestSource,
      files: Object.entries(assetHashes).map(([assetPath, hash]) => ({
        path: assetPath,
        hash
      }))
    })
  )
});

const expectFixtureIsLocalOnly = (fixtureDir: string): void => {
  const resolvedFixtureDir = path.resolve(fixtureDir).toLowerCase();
  const resolvedTempDir = path.resolve(os.tmpdir()).toLowerCase();
  const resolvedProjectSkinsDir = path
    .resolve(process.cwd(), 'skins')
    .toLowerCase();

  expect(resolvedFixtureDir.startsWith(resolvedTempDir)).toBe(true);
  expect(resolvedFixtureDir.startsWith(resolvedProjectSkinsDir)).toBe(false);
};

describe('remote skin download QA entry', () => {
  const fixtureDirs: string[] = [];

  beforeEach(() => {
    mockFileSystemModule.documentDirectory = 'file:///app/document/';
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await Promise.all(
      fixtureDirs.map(dir => fs.rm(dir, { recursive: true, force: true }))
    );
    fixtureDirs.length = 0;
  });

  test('prepares a local-only remote QA fixture with publishing hashes', async () => {
    const fixture = await writeRemoteQaFixture();
    fixtureDirs.push(fixture.dir);
    const assets = fixture.manifest.assets as Array<Record<string, unknown>>;

    expectFixtureIsLocalOnly(fixture.dir);
    expect(assets[0].hash).toBe(calculateRemoteSkinContentHash(logoContent));
    expect(assets[1].hash).toBe(calculateRemoteSkinContentHash(heroContent));
    expect(fixture.manifest.packageHash).toMatch(/^fnv1a:/);
  });

  test('stages a valid remote fixture and promotes it to ready', async () => {
    const fixture = await writeRemoteQaFixture();
    fixtureDirs.push(fixture.dir);
    const dependencies = createDependencies(fixture);
    const fileSystem = createDownloaderFileSystem();
    const source = createRemoteSkinPackageSource(createDescriptor(), {
      dependencies
    });

    const result = await downloadSkinPackage({
      state: createState(),
      source,
      fileSystem,
      currentFeatureVersion: coerceFeatureVersion('0.0')
    });

    expectFixtureIsLocalOnly(fixture.dir);
    expect(dependencies.fetchManifest).toHaveBeenCalledWith(manifestUrl, {
      signal: undefined
    });
    expect(dependencies.fetchAsset).toHaveBeenCalledWith(
      'https://cdn.example.com/skin-qa-remote/assets/logo.txt',
      { signal: undefined }
    );
    expect(fileSystem.move).toHaveBeenCalledWith(
      'file:///app/document/skins/.staging/skin-qa-remote',
      'file:///app/document/skins/skin-qa-remote'
    );
    expect(result.operation.state).toBe('ready');
    expect(result.state.activeSkinId).toBe('skin-qa-remote');
    expect(result.state.lastReadySkinId).toBe('skin-qa-remote');
    expect(result.state.skinPackageStates[qaPackageKey]).toBe('ready');
  });

  test('keeps the previous ready skin when package hash is stale', async () => {
    const fixture = await writeRemoteQaFixture();
    fixtureDirs.push(fixture.dir);
    const fileSystem = createDownloaderFileSystem();
    const source = createRemoteSkinPackageSource(
      createDescriptor({
        packageHash: 'fnv1a:stale-package'
      }),
      {
        dependencies: createDependencies(fixture)
      }
    );

    const result = await downloadSkinPackage({
      state: createState(),
      source,
      fileSystem,
      currentFeatureVersion: coerceFeatureVersion('0.0')
    });

    expect(fileSystem.move).not.toHaveBeenCalled();
    expect(result.operation.state).toBe('failed');
    expect(result.operation.failureReason).toBe('package-hash-mismatch');
    expect(result.state.activeSkinId).toBe('skin-001');
    expect(result.state.lastReadySkinId).toBe('skin-001');
    expect(result.state.skinPackageStates[qaPackageKey]).toBe('failed');
  });

  test('keeps the previous ready skin when an asset hash is stale', async () => {
    const fixture = await writeRemoteQaFixture({ staleAssetHash: true });
    fixtureDirs.push(fixture.dir);
    const fileSystem = createDownloaderFileSystem();
    const source = createRemoteSkinPackageSource(createDescriptor(), {
      dependencies: createDependencies(fixture)
    });

    const result = await downloadSkinPackage({
      state: createState(),
      source,
      fileSystem,
      currentFeatureVersion: coerceFeatureVersion('0.0')
    });

    expect(fileSystem.move).not.toHaveBeenCalled();
    expect(result.operation.state).toBe('failed');
    expect(result.operation.failureReason).toBe('asset-hash-mismatch');
    expect(result.state.activeSkinId).toBe('skin-001');
    expect(result.state.lastReadySkinId).toBe('skin-001');
    expect(result.state.skinPackageStates[qaPackageKey]).toBe('failed');
  });
});
