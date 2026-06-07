import * as FileSystem from 'expo-file-system/legacy';

import { calculateSkinContentHash } from './contentHash';
import type {
  SkinPackageSourceAdapter,
  SkinPackageSourcePayload
} from './downloader';
import { calculateSkinPackageHash } from './packageHash';
import type { SkinPackageIdentity } from './types';

export type RemoteSkinPackageProgressPhase = 'manifest' | 'asset' | 'complete';

export interface IRemoteSkinAbortSignal {
  readonly aborted: boolean;
}

export interface IRemoteSkinFetchInput {
  signal?: IRemoteSkinAbortSignal;
}

export interface IRemoteSkinFetchedAsset {
  content: string;
  hash: string;
}

export interface IRemoteSkinPackageDescriptor extends SkinPackageIdentity {
  manifestUrl: string;
  assetBaseUrl?: string;
  packageHash?: string;
  displayName?: string;
}

export interface IRemoteSkinPackageProgress {
  phase: RemoteSkinPackageProgressPhase;
  url: string;
  assetPath?: string;
  completedAssets: number;
  totalAssets: number;
}

export interface IRemoteSkinPackageRetryInput {
  error: unknown;
  attempt: number;
  url: string;
}

export interface IRemoteSkinPackageRetryPolicy {
  retries?: number;
  delayMs?: number;
  shouldRetry?: (input: IRemoteSkinPackageRetryInput) => boolean;
}

export interface IRemoteSkinPackageHashInput {
  descriptor: IRemoteSkinPackageDescriptor;
  manifestSource: unknown;
  assetHashes: Record<string, string>;
}

export interface IRemoteSkinPackageAdapterDependencies {
  fetchManifest: (
    url: string,
    input: IRemoteSkinFetchInput
  ) => Promise<unknown>;
  fetchAsset: (
    url: string,
    input: IRemoteSkinFetchInput
  ) => Promise<IRemoteSkinFetchedAsset>;
  writeAsset: (uri: string, asset: IRemoteSkinFetchedAsset) => Promise<void>;
  makeDirectory: (uri: string) => Promise<void>;
  wait: (ms: number) => Promise<void>;
  calculatePackageHash: (input: IRemoteSkinPackageHashInput) => string;
}

export interface IRemoteSkinPackageSourceOptions {
  dependencies?: Partial<IRemoteSkinPackageAdapterDependencies>;
  retryPolicy?: IRemoteSkinPackageRetryPolicy;
  signal?: IRemoteSkinAbortSignal;
  onProgress?: (progress: IRemoteSkinPackageProgress) => void;
}

interface IRemoteFetchResponse {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
}

const joinUri = (baseUri: string, path: string): string => {
  return `${baseUri.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const ensureNotCancelled = (signal?: IRemoteSkinAbortSignal): void => {
  if (signal?.aborted) {
    throw new Error('Remote skin download cancelled');
  }
};

export const calculateRemoteSkinContentHash = (content: string): string => {
  return calculateSkinContentHash(content);
};

const calculateDefaultPackageHash = ({
  descriptor,
  manifestSource,
  assetHashes
}: IRemoteSkinPackageHashInput): string => {
  return (
    descriptor.packageHash ??
    calculateSkinPackageHash({
      identity: {
        skinId: descriptor.skinId,
        skinVersion: descriptor.skinVersion
      },
      manifestSource,
      files: Object.entries(assetHashes).map(([path, hash]) => ({
        path,
        hash
      }))
    })
  );
};

const getFetch = (): ((
  url: string,
  init?: Record<string, unknown>
) => Promise<IRemoteFetchResponse>) => {
  const remoteFetch = globalThis.fetch as
    | ((
        url: string,
        init?: Record<string, unknown>
      ) => Promise<IRemoteFetchResponse>)
    | undefined;

  if (!remoteFetch) {
    throw new Error('Remote skin fetch is unavailable');
  }

  return remoteFetch;
};

const fetchManifest = async (
  url: string,
  input: IRemoteSkinFetchInput
): Promise<unknown> => {
  const response = await getFetch()(url, {
    signal: input.signal
  });

  if (!response.ok) {
    throw new Error(`Remote skin manifest request failed: ${response.status}`);
  }

  return response.json();
};

const fetchAsset = async (
  url: string,
  input: IRemoteSkinFetchInput
): Promise<IRemoteSkinFetchedAsset> => {
  const response = await getFetch()(url, {
    signal: input.signal
  });

  if (!response.ok) {
    throw new Error(`Remote skin asset request failed: ${response.status}`);
  }

  const content = await response.text();

  return {
    content,
    hash: calculateRemoteSkinContentHash(content)
  };
};

const writeAsset = async (
  uri: string,
  asset: IRemoteSkinFetchedAsset
): Promise<void> => {
  await FileSystem.writeAsStringAsync(uri, asset.content);
};

const makeDirectory = async (uri: string): Promise<void> => {
  await FileSystem.makeDirectoryAsync(uri, { intermediates: true });
};

const wait = async (ms: number): Promise<void> => {
  await new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
};

const createDefaultDependencies =
  (): IRemoteSkinPackageAdapterDependencies => ({
    fetchManifest,
    fetchAsset,
    writeAsset,
    makeDirectory,
    wait,
    calculatePackageHash: calculateDefaultPackageHash
  });

const mergeDependencies = (
  overrides?: Partial<IRemoteSkinPackageAdapterDependencies>
): IRemoteSkinPackageAdapterDependencies => {
  const dependencies = createDefaultDependencies();

  if (!overrides) {
    return dependencies;
  }

  for (const key of Object.keys(overrides) as Array<
    keyof IRemoteSkinPackageAdapterDependencies
  >) {
    const override = overrides[key];

    if (override) {
      Object.assign(dependencies, {
        [key]: override
      });
    }
  }

  return dependencies;
};

const normalizeAssetPath = (path: string): string => {
  const normalized = path.replace(/\\/g, '/').replace(/^\/+/, '');

  if (
    normalized === '' ||
    normalized.includes('../') ||
    normalized.startsWith('../') ||
    /^[a-z][a-z0-9+.-]*:/i.test(normalized)
  ) {
    throw new Error(`Invalid remote skin asset path: ${path}`);
  }

  return normalized;
};

const readAssetPaths = (manifestSource: unknown): string[] => {
  if (!isRecord(manifestSource)) {
    return [];
  }

  const assets = manifestSource.assets;

  if (!Array.isArray(assets)) {
    return [];
  }

  return assets.map((asset, index) => {
    if (!isRecord(asset) || typeof asset.path !== 'string') {
      throw new Error(`Invalid remote skin manifest asset at index ${index}`);
    }

    return normalizeAssetPath(asset.path);
  });
};

const resolveAssetUrl = (
  descriptor: IRemoteSkinPackageDescriptor,
  assetPath: string
): string => {
  const baseUrl = descriptor.assetBaseUrl ?? descriptor.manifestUrl;
  const normalizedBase =
    descriptor.assetBaseUrl && !descriptor.assetBaseUrl.endsWith('/')
      ? `${descriptor.assetBaseUrl}/`
      : baseUrl;

  return new URL(assetPath, normalizedBase).toString();
};

const getParentDirectoryUri = (uri: string): string => {
  const lastSeparator = uri.lastIndexOf('/');

  if (lastSeparator <= 0) {
    return uri;
  }

  return uri.slice(0, lastSeparator);
};

const shouldRetry = (
  policy: IRemoteSkinPackageRetryPolicy,
  input: IRemoteSkinPackageRetryInput
): boolean => {
  return policy.shouldRetry?.(input) ?? true;
};

const runWithRetry = async <T>(
  url: string,
  signal: IRemoteSkinAbortSignal | undefined,
  dependencies: IRemoteSkinPackageAdapterDependencies,
  retryPolicy: IRemoteSkinPackageRetryPolicy,
  operation: () => Promise<T>
): Promise<T> => {
  const retries = retryPolicy.retries ?? 0;
  const delayMs = retryPolicy.delayMs ?? 0;

  for (let attempt = 0; ; attempt += 1) {
    ensureNotCancelled(signal);

    try {
      const result = await operation();
      ensureNotCancelled(signal);
      return result;
    } catch (error) {
      ensureNotCancelled(signal);

      if (
        attempt >= retries ||
        !shouldRetry(retryPolicy, {
          error,
          attempt,
          url
        })
      ) {
        throw error;
      }

      if (delayMs > 0) {
        await dependencies.wait(delayMs);
      }
    }
  }
};

export const createRemoteSkinPackageSource = (
  descriptor: IRemoteSkinPackageDescriptor,
  options: IRemoteSkinPackageSourceOptions = {}
): SkinPackageSourceAdapter => {
  const dependencies = mergeDependencies(options.dependencies);
  const retryPolicy = options.retryPolicy ?? {};

  return {
    identity: {
      skinId: descriptor.skinId,
      skinVersion: descriptor.skinVersion
    },
    stage: async (stagingUri: string): Promise<SkinPackageSourcePayload> => {
      ensureNotCancelled(options.signal);

      const manifestSource = await runWithRetry(
        descriptor.manifestUrl,
        options.signal,
        dependencies,
        retryPolicy,
        () =>
          dependencies.fetchManifest(descriptor.manifestUrl, {
            signal: options.signal
          })
      );

      options.onProgress?.({
        phase: 'manifest',
        url: descriptor.manifestUrl,
        completedAssets: 0,
        totalAssets: 0
      });

      const assetPaths = readAssetPaths(manifestSource);
      const assetHashes: Record<string, string> = {};

      for (const [index, assetPath] of assetPaths.entries()) {
        ensureNotCancelled(options.signal);

        const assetUrl = resolveAssetUrl(descriptor, assetPath);
        const asset = await runWithRetry(
          assetUrl,
          options.signal,
          dependencies,
          retryPolicy,
          () =>
            dependencies.fetchAsset(assetUrl, {
              signal: options.signal
            })
        );
        const targetUri = joinUri(stagingUri, assetPath);

        await dependencies.makeDirectory(getParentDirectoryUri(targetUri));
        await dependencies.writeAsset(targetUri, asset);
        assetHashes[assetPath] = asset.hash;

        options.onProgress?.({
          phase: 'asset',
          url: assetUrl,
          assetPath,
          completedAssets: index + 1,
          totalAssets: assetPaths.length
        });
      }

      options.onProgress?.({
        phase: 'complete',
        url: descriptor.manifestUrl,
        completedAssets: assetPaths.length,
        totalAssets: assetPaths.length
      });

      return {
        manifestSource,
        assetHashes,
        packageHash: dependencies.calculatePackageHash({
          descriptor,
          manifestSource,
          assetHashes
        })
      };
    }
  };
};
