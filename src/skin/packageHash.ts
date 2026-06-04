import { calculateSkinContentHash } from './contentHash';
import type { SkinPackageIdentity } from './types';

export interface ISkinPackageHashFile {
  path: string;
  hash: string;
}

export interface ISkinPackageHashInput {
  identity: SkinPackageIdentity;
  manifestSource: unknown;
  files: ISkinPackageHashFile[];
}

interface ICanonicalSkinPackageFile {
  path: string;
  hash: string;
}

const HASH_FORMAT = 'trust-ease.skin-package-hash.v1';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const normalizeSkinPackageHashPath = (path: string): string => {
  const normalized = path.replace(/\\/g, '/');
  const segments = normalized.split('/');

  if (
    normalized === '' ||
    normalized.startsWith('/') ||
    normalized.includes('//') ||
    /^[a-z][a-z0-9+.-]*:/i.test(normalized) ||
    segments.some(
      segment => segment === '' || segment === '.' || segment === '..'
    )
  ) {
    throw new Error(`Invalid skin package path: ${path}`);
  }

  return normalized;
};

const normalizeFiles = (
  files: ISkinPackageHashFile[]
): ICanonicalSkinPackageFile[] => {
  const seenPaths = new Set<string>();

  return files
    .map(file => {
      const normalizedPath = normalizeSkinPackageHashPath(file.path);

      if (seenPaths.has(normalizedPath)) {
        throw new Error(`Invalid skin package path: ${file.path}`);
      }

      seenPaths.add(normalizedPath);

      return {
        path: normalizedPath,
        hash: file.hash
      };
    })
    .sort((left, right) => left.path.localeCompare(right.path));
};

const canonicalizeManifestValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(canonicalizeManifestValue);
  }

  if (isRecord(value)) {
    return Object.keys(value)
      .filter(key => key !== 'packageHash')
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = canonicalizeManifestValue(value[key]);
        return result;
      }, {});
  }

  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  return null;
};

const stableStringify = (value: unknown): string => {
  return JSON.stringify(value);
};

export const calculateSkinPackageHash = ({
  identity,
  manifestSource,
  files
}: ISkinPackageHashInput): string => {
  return calculateSkinContentHash(
    stableStringify({
      format: HASH_FORMAT,
      identity: {
        skinId: identity.skinId,
        skinVersion: identity.skinVersion
      },
      manifest: canonicalizeManifestValue(manifestSource),
      files: normalizeFiles(files)
    })
  );
};
