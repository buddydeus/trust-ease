import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { calculateSkinContentHash } from '../../src/skin/contentHash';
import { calculateSkinPackageHash } from '../../src/skin/packageHash';
import { runSkinPackagePublishing } from '../../src/skin/publishingTool';

interface IFixtureInput {
  logoContent?: string;
  heroContent?: string;
  logoHash?: string;
  heroHash?: string;
  packageHash?: string;
  assetPath?: string;
  writeAssets?: boolean;
}

const createManifest = ({
  logoContent = 'logo-content',
  heroContent = 'hero-content',
  logoHash = calculateSkinContentHash(logoContent),
  heroHash = calculateSkinContentHash(heroContent),
  packageHash = 'fnv1a:stale',
  assetPath = 'assets/logo.txt'
}: IFixtureInput = {}) => ({
  skinId: 'skin-qa',
  displayName: 'QA Skin',
  skinVersion: '1.0.0',
  minFeatureVersion: '0.0',
  maxFeatureVersion: '0.1',
  packageHash,
  assets: [
    {
      id: 'logo',
      path: assetPath,
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
  pages: {}
});

const calculateManifestPackageHash = (
  manifest: ReturnType<typeof createManifest>,
  {
    logoContent = 'logo-content',
    heroContent = 'hero-content'
  }: IFixtureInput = {}
): string => {
  return calculateSkinPackageHash({
    identity: {
      skinId: manifest.skinId,
      skinVersion: manifest.skinVersion
    },
    manifestSource: manifest,
    files: [
      {
        path: manifest.assets[0].path,
        hash: calculateSkinContentHash(logoContent)
      },
      {
        path: manifest.assets[1].path,
        hash: calculateSkinContentHash(heroContent)
      }
    ]
  });
};

const writeFixture = async ({
  logoContent = 'logo-content',
  heroContent = 'hero-content',
  writeAssets = true,
  ...manifestInput
}: IFixtureInput = {}): Promise<{
  dir: string;
  manifestPath: string;
  manifest: ReturnType<typeof createManifest>;
}> => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'trust-ease-skin-'));
  const manifest = createManifest({
    logoContent,
    heroContent,
    ...manifestInput
  });
  const manifestPath = path.join(dir, 'manifest.json');

  if (writeAssets) {
    await fs.mkdir(path.join(dir, 'assets'), { recursive: true });
    await fs.mkdir(path.join(dir, 'images'), { recursive: true });
    await fs.writeFile(path.join(dir, 'assets/logo.txt'), logoContent, 'utf8');
    await fs.writeFile(path.join(dir, 'images/hero.txt'), heroContent, 'utf8');
  }

  await fs.writeFile(
    manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  );

  return {
    dir,
    manifestPath,
    manifest
  };
};

const readManifest = async (
  manifestPath: string
): Promise<ReturnType<typeof createManifest>> => {
  return JSON.parse(await fs.readFile(manifestPath, 'utf8')) as ReturnType<
    typeof createManifest
  >;
};

describe('skin package publishing tool', () => {
  const fixtureDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(
      fixtureDirs.map(dir => fs.rm(dir, { recursive: true, force: true }))
    );
    fixtureDirs.length = 0;
  });

  test('check mode passes for an up-to-date package without writing', async () => {
    const manifest = createManifest();
    manifest.packageHash = calculateManifestPackageHash(manifest);
    const fixture = await writeFixture({ packageHash: manifest.packageHash });
    fixtureDirs.push(fixture.dir);
    const before = await fs.readFile(fixture.manifestPath, 'utf8');

    const result = await runSkinPackagePublishing({
      mode: 'check',
      packageDir: fixture.dir
    });

    expect(result.ok).toBe(true);
    expect(result.updated).toBe(false);
    expect(result.issues).toEqual([]);
    await expect(fs.readFile(fixture.manifestPath, 'utf8')).resolves.toBe(
      before
    );
  });

  test('check mode fails for a stale asset hash without writing', async () => {
    const fixture = await writeFixture({ logoHash: 'fnv1a:stale' });
    fixtureDirs.push(fixture.dir);
    const before = await fs.readFile(fixture.manifestPath, 'utf8');

    const result = await runSkinPackagePublishing({
      mode: 'check',
      packageDir: fixture.dir
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'stale-asset-hash',
          path: 'assets/logo.txt'
        })
      ])
    );
    await expect(fs.readFile(fixture.manifestPath, 'utf8')).resolves.toBe(
      before
    );
  });

  test('check mode fails for a stale package hash without writing', async () => {
    const fixture = await writeFixture();
    fixtureDirs.push(fixture.dir);
    const before = await fs.readFile(fixture.manifestPath, 'utf8');

    const result = await runSkinPackagePublishing({
      mode: 'check',
      packageDir: fixture.dir
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'stale-package-hash'
        })
      ])
    );
    await expect(fs.readFile(fixture.manifestPath, 'utf8')).resolves.toBe(
      before
    );
  });

  test('update mode writes asset hashes and package hash', async () => {
    const fixture = await writeFixture({
      logoHash: 'fnv1a:stale',
      heroHash: 'fnv1a:stale',
      packageHash: 'fnv1a:stale'
    });
    fixtureDirs.push(fixture.dir);

    const result = await runSkinPackagePublishing({
      mode: 'update',
      packageDir: fixture.dir
    });
    const manifest = await readManifest(fixture.manifestPath);

    expect(result.ok).toBe(true);
    expect(result.updated).toBe(true);
    expect(manifest.assets[0].hash).toBe(calculateSkinContentHash('logo-content'));
    expect(manifest.assets[1].hash).toBe(calculateSkinContentHash('hero-content'));
    expect(manifest.packageHash).toBe(result.packageHash);
  });

  test('update mode is stable across repeated runs', async () => {
    const fixture = await writeFixture({ packageHash: 'fnv1a:stale' });
    fixtureDirs.push(fixture.dir);

    const firstResult = await runSkinPackagePublishing({
      mode: 'update',
      packageDir: fixture.dir
    });
    const firstContent = await fs.readFile(fixture.manifestPath, 'utf8');
    const secondResult = await runSkinPackagePublishing({
      mode: 'update',
      packageDir: fixture.dir
    });
    const secondContent = await fs.readFile(fixture.manifestPath, 'utf8');

    expect(firstResult.updated).toBe(true);
    expect(secondResult.updated).toBe(false);
    expect(secondResult.packageHash).toBe(firstResult.packageHash);
    expect(secondContent).toBe(firstContent);
  });

  test('fails clearly when a declared asset is missing', async () => {
    const fixture = await writeFixture({ writeAssets: false });
    fixtureDirs.push(fixture.dir);

    const result = await runSkinPackagePublishing({
      mode: 'update',
      packageDir: fixture.dir
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'missing-asset',
          path: 'assets/logo.txt'
        })
      ])
    );
  });

  test('fails clearly for unsafe paths without writing', async () => {
    const fixture = await writeFixture({ assetPath: '../logo.txt' });
    fixtureDirs.push(fixture.dir);
    const before = await fs.readFile(fixture.manifestPath, 'utf8');

    const result = await runSkinPackagePublishing({
      mode: 'update',
      packageDir: fixture.dir
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'unsafe-asset-path',
          path: '../logo.txt'
        })
      ])
    );
    await expect(fs.readFile(fixture.manifestPath, 'utf8')).resolves.toBe(
      before
    );
  });

  test('fails clearly for duplicate normalized paths', async () => {
    const fixture = await writeFixture();
    fixtureDirs.push(fixture.dir);
    const manifest = await readManifest(fixture.manifestPath);
    manifest.assets[1].path = 'assets\\logo.txt';
    await fs.writeFile(
      fixture.manifestPath,
      `${JSON.stringify(manifest, null, 2)}\n`,
      'utf8'
    );

    const result = await runSkinPackagePublishing({
      mode: 'update',
      packageDir: fixture.dir
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'unsafe-asset-path',
          path: 'assets\\logo.txt'
        })
      ])
    );
  });

  test('generated package hash matches calculateSkinPackageHash', async () => {
    const fixture = await writeFixture({ packageHash: 'fnv1a:stale' });
    fixtureDirs.push(fixture.dir);

    const result = await runSkinPackagePublishing({
      mode: 'update',
      packageDir: fixture.dir
    });
    const manifest = await readManifest(fixture.manifestPath);

    expect(result.packageHash).toBe(calculateManifestPackageHash(manifest));
  });
});
