import { promises as fs } from 'node:fs';
import path from 'node:path';

import { calculateSkinContentHash } from './contentHash';
import { parseSkinManifest } from './manifest';
import {
  calculateSkinPackageHash,
  normalizeSkinPackageHashPath
} from './packageHash';
import type { SkinManifest } from './types';

export type SkinPackagePublishingMode = 'check' | 'update';

export type SkinPackagePublishingIssueCode =
  | 'invalid-manifest'
  | 'missing-asset'
  | 'stale-asset-hash'
  | 'stale-package-hash'
  | 'unsafe-asset-path';

export interface ISkinPackagePublishingIssue {
  code: SkinPackagePublishingIssueCode;
  message: string;
  path?: string;
  expected?: string;
  actual?: string;
}

export interface ISkinPackagePublishingInput {
  mode: SkinPackagePublishingMode;
  packageDir: string;
}

export interface ISkinPackagePublishingResult {
  ok: boolean;
  mode: SkinPackagePublishingMode;
  packageDir: string;
  manifestPath: string;
  updated: boolean;
  assetHashes: Record<string, string>;
  packageHash: string | null;
  issues: ISkinPackagePublishingIssue[];
}

interface IPreparedManifest {
  manifest: SkinManifest;
  manifestSource: Record<string, unknown>;
  assetHashes: Record<string, string>;
  packageHash: string;
}

const manifestFileName = 'manifest.json';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const cloneJsonRecord = (value: Record<string, unknown>): Record<string, unknown> => {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
};

const createResult = ({
  input,
  manifestPath,
  assetHashes = {},
  packageHash = null,
  issues,
  updated = false
}: {
  input: ISkinPackagePublishingInput;
  manifestPath: string;
  assetHashes?: Record<string, string>;
  packageHash?: string | null;
  issues: ISkinPackagePublishingIssue[];
  updated?: boolean;
}): ISkinPackagePublishingResult => ({
  ok: issues.length === 0,
  mode: input.mode,
  packageDir: input.packageDir,
  manifestPath,
  updated,
  assetHashes,
  packageHash,
  issues
});

const safeReadManifestSource = async (
  manifestPath: string
): Promise<
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; issue: ISkinPackagePublishingIssue }
> => {
  try {
    const content = (await fs.readFile(manifestPath, 'utf8')).replace(
      /^\uFEFF/,
      ''
    );
    const parsed = JSON.parse(content) as unknown;

    if (!isRecord(parsed)) {
      return {
        ok: false,
        issue: {
          code: 'invalid-manifest',
          message: 'manifest.json must contain a JSON object'
        }
      };
    }

    return {
      ok: true,
      value: parsed
    };
  } catch (error) {
    return {
      ok: false,
      issue: {
        code: 'invalid-manifest',
        message:
          error instanceof Error
            ? `Unable to read manifest.json: ${error.message}`
            : 'Unable to read manifest.json'
      }
    };
  }
};

const getMutableAssets = (
  manifestSource: Record<string, unknown>
): Array<Record<string, unknown>> => {
  const assets = manifestSource.assets;

  if (!Array.isArray(assets)) {
    return [];
  }

  return assets.filter(isRecord);
};

const collectAssetHashes = async (
  input: ISkinPackagePublishingInput,
  manifest: SkinManifest
): Promise<
  | {
      ok: true;
      assetHashes: Record<string, string>;
      files: Array<{ path: string; hash: string }>;
    }
  | { ok: false; issues: ISkinPackagePublishingIssue[] }
> => {
  const assetHashes: Record<string, string> = {};
  const files: Array<{ path: string; hash: string }> = [];
  const issues: ISkinPackagePublishingIssue[] = [];
  const seenPaths = new Set<string>();

  for (const asset of manifest.assets) {
    let normalizedPath: string;

    try {
      normalizedPath = normalizeSkinPackageHashPath(asset.path);
    } catch (error) {
      issues.push({
        code: 'unsafe-asset-path',
        path: asset.path,
        message:
          error instanceof Error
            ? error.message
            : `Invalid skin package asset path: ${asset.path}`
      });
      continue;
    }

    if (seenPaths.has(normalizedPath)) {
      issues.push({
        code: 'unsafe-asset-path',
        path: asset.path,
        message: `Duplicate skin package asset path: ${asset.path}`
      });
      continue;
    }

    seenPaths.add(normalizedPath);

    const assetPath = path.join(input.packageDir, normalizedPath);

    try {
      const content = await fs.readFile(assetPath, 'utf8');
      const hash = calculateSkinContentHash(content);

      assetHashes[normalizedPath] = hash;
      files.push({
        path: normalizedPath,
        hash
      });
    } catch (error) {
      issues.push({
        code: 'missing-asset',
        path: asset.path,
        message:
          error instanceof Error
            ? `Unable to read asset ${asset.path}: ${error.message}`
            : `Unable to read asset ${asset.path}`
      });
    }
  }

  if (issues.length > 0) {
    return {
      ok: false,
      issues
    };
  }

  return {
    ok: true,
    assetHashes,
    files
  };
};

const prepareManifest = async (
  input: ISkinPackagePublishingInput,
  manifestSource: Record<string, unknown>
): Promise<
  | { ok: true; value: IPreparedManifest }
  | { ok: false; issues: ISkinPackagePublishingIssue[] }
> => {
  let manifest: SkinManifest;

  try {
    manifest = parseSkinManifest(manifestSource);
  } catch (error) {
    return {
      ok: false,
      issues: [
        {
          code: 'invalid-manifest',
          message:
            error instanceof Error
              ? `Invalid skin manifest: ${error.message}`
              : 'Invalid skin manifest'
        }
      ]
    };
  }

  const assetResult = await collectAssetHashes(input, manifest);

  if (!assetResult.ok) {
    return assetResult;
  }

  const nextManifestSource = cloneJsonRecord(manifestSource);
  const mutableAssets = getMutableAssets(nextManifestSource);

  for (const asset of mutableAssets) {
    if (typeof asset.path === 'string') {
      const normalizedPath = normalizeSkinPackageHashPath(asset.path);
      asset.hash = assetResult.assetHashes[normalizedPath];
    }
  }

  const packageHash = calculateSkinPackageHash({
    identity: {
      skinId: manifest.skinId,
      skinVersion: manifest.skinVersion
    },
    manifestSource: nextManifestSource,
    files: assetResult.files
  });

  nextManifestSource.packageHash = packageHash;

  return {
    ok: true,
    value: {
      manifest,
      manifestSource: nextManifestSource,
      assetHashes: assetResult.assetHashes,
      packageHash
    }
  };
};

const collectCheckIssues = (
  manifest: SkinManifest,
  assetHashes: Record<string, string>,
  packageHash: string
): ISkinPackagePublishingIssue[] => {
  const issues: ISkinPackagePublishingIssue[] = [];

  for (const asset of manifest.assets) {
    const normalizedPath = normalizeSkinPackageHashPath(asset.path);
    const expectedHash = assetHashes[normalizedPath];

    if (asset.hash !== expectedHash) {
      issues.push({
        code: 'stale-asset-hash',
        path: asset.path,
        expected: expectedHash,
        actual: asset.hash,
        message: `Asset hash is stale: ${asset.path}`
      });
    }
  }

  if (manifest.packageHash !== packageHash) {
    issues.push({
      code: 'stale-package-hash',
      expected: packageHash,
      actual: manifest.packageHash,
      message: 'Package hash is stale'
    });
  }

  return issues;
};

export const runSkinPackagePublishing = async (
  input: ISkinPackagePublishingInput
): Promise<ISkinPackagePublishingResult> => {
  const manifestPath = path.join(input.packageDir, manifestFileName);
  const manifestResult = await safeReadManifestSource(manifestPath);

  if (!manifestResult.ok) {
    return createResult({
      input,
      manifestPath,
      issues: [manifestResult.issue]
    });
  }

  const prepared = await prepareManifest(input, manifestResult.value);

  if (!prepared.ok) {
    return createResult({
      input,
      manifestPath,
      issues: prepared.issues
    });
  }

  if (input.mode === 'check') {
    return createResult({
      input,
      manifestPath,
      assetHashes: prepared.value.assetHashes,
      packageHash: prepared.value.packageHash,
      issues: collectCheckIssues(
        prepared.value.manifest,
        prepared.value.assetHashes,
        prepared.value.packageHash
      )
    });
  }

  const nextContent = `${JSON.stringify(prepared.value.manifestSource, null, 2)}\n`;
  const currentContent = await fs.readFile(manifestPath, 'utf8');

  if (currentContent !== nextContent) {
    await fs.writeFile(manifestPath, nextContent, 'utf8');
  }

  return createResult({
    input,
    manifestPath,
    assetHashes: prepared.value.assetHashes,
    packageHash: prepared.value.packageHash,
    issues: [],
    updated: currentContent !== nextContent
  });
};
