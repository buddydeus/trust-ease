import * as FileSystem from 'expo-file-system/legacy';

import { createSkinPackageKey } from './initStateMachine';
import { validateSkinPackage } from './packageValidation';
import {
  ensureRuntimeSkinsDirectory,
  getRuntimeSkinPackageDirectoryUri,
  getRuntimeSkinPackageStagingDirectoryUri
} from './paths';
import type { SkinStorageState } from './storage';
import type {
  FeatureVersion,
  SkinManifest,
  SkinPackageFailureReason,
  SkinPackageIdentity,
  SkinPackageOperationResult,
  SkinPackageState
} from './types';

/**
 * source adapter 写入 staging 后交给 downloader 验证的数据。
 */
export interface SkinPackageSourcePayload {
  /** 未信任 manifest JSON。 */
  manifestSource: unknown;
  /** 以资源 path 为键的实际资源 hash。 */
  assetHashes: Record<string, string>;
  /** 实际包级 hash。 */
  packageHash: string;
}

/**
 * 下载器第一版使用的 source adapter。未来可由网络下载实现。
 */
export interface SkinPackageSourceAdapter {
  /** source 声明的皮肤包身份。 */
  identity: SkinPackageIdentity;
  /**
   * 将包内容写入 staging 目录，并返回验证输入。
   *
   * @param stagingUri - 运行时 staging 目录。
   * @returns 验证所需的 manifest 与 hash。
   */
  stage: (stagingUri: string) => Promise<SkinPackageSourcePayload>;
}

/**
 * 下载器文件系统依赖，测试可替换。
 */
export interface SkinDownloaderFileSystem {
  /** 创建目录。 */
  makeDirectory: (uri: string) => Promise<void>;
  /** 删除目录或文件。 */
  delete: (uri: string) => Promise<void>;
  /** 移动 staging 到 ready 目录。 */
  move: (fromUri: string, toUri: string) => Promise<void>;
}

/**
 * 下载器输入。
 */
export interface SkinDownloadInput {
  /** 当前持久化/store 皮肤状态。 */
  state: SkinStorageState;
  /** source adapter。 */
  source: SkinPackageSourceAdapter;
  /** 当前 app featureVersion；测试可注入。 */
  currentFeatureVersion?: FeatureVersion;
  /** 文件系统依赖；测试可注入。 */
  fileSystem?: SkinDownloaderFileSystem;
}

/**
 * 下载器输出。
 */
export interface SkinDownloadResult {
  /** 操作后可写回 store/storage 的状态。 */
  state: SkinStorageState;
  /** 包操作结果。 */
  operation: SkinPackageOperationResult;
  /** 成功 ready 时的 manifest。 */
  manifest?: SkinManifest;
  /** 记录状态流转，便于测试和诊断。 */
  transitions: SkinPackageState[];
}

const defaultFileSystem: SkinDownloaderFileSystem = {
  makeDirectory: async uri => {
    await FileSystem.makeDirectoryAsync(uri, { intermediates: true });
  },
  delete: async uri => {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  },
  move: async (fromUri, toUri) => {
    await FileSystem.moveAsync({ from: fromUri, to: toUri });
  }
};

const applyPackageState = (
  state: SkinStorageState,
  packageKey: string,
  packageState: SkinPackageState
): SkinStorageState => {
  return {
    ...state,
    skinPackageStates: {
      ...state.skinPackageStates,
      [packageKey]: packageState
    }
  };
};

const applyFailure = (
  state: SkinStorageState,
  identity: SkinPackageIdentity,
  packageKey: string,
  packageState: Extract<SkinPackageState, 'failed' | 'incompatible'>,
  failureReason: SkinPackageFailureReason,
  transitions: SkinPackageState[]
): SkinDownloadResult => ({
  state: applyPackageState(state, packageKey, packageState),
  operation: {
    identity,
    state: packageState,
    failureReason
  },
  transitions: [...transitions, packageState]
});

/**
 * 将 source adapter 提供的皮肤包写入 staging，验证后 promote 为 ready。
 *
 * @param input - 当前状态、source 和依赖。
 * @returns 操作后的状态和结果。
 */
export const downloadSkinPackage = async ({
  state,
  source,
  currentFeatureVersion,
  fileSystem = defaultFileSystem
}: SkinDownloadInput): Promise<SkinDownloadResult> => {
  const packageKey = createSkinPackageKey(source.identity);
  const transitions: SkinPackageState[] = [];
  const pushState = (packageState: SkinPackageState): void => {
    transitions.push(packageState);
    state = applyPackageState(state, packageKey, packageState);
  };

  pushState('checking');

  let stagingUri: string;
  let readyUri: string;

  try {
    await ensureRuntimeSkinsDirectory();
    stagingUri = getRuntimeSkinPackageStagingDirectoryUri(
      source.identity.skinId
    );
    readyUri = getRuntimeSkinPackageDirectoryUri(source.identity.skinId);

    await fileSystem.delete(stagingUri);
    await fileSystem.makeDirectory(stagingUri);
  } catch {
    return applyFailure(
      state,
      source.identity,
      packageKey,
      'failed',
      'storage-unavailable',
      transitions
    );
  }

  let payload: SkinPackageSourcePayload;
  try {
    pushState('downloading');
    payload = await source.stage(stagingUri);
  } catch {
    return applyFailure(
      state,
      source.identity,
      packageKey,
      'failed',
      'source-unavailable',
      transitions
    );
  }

  pushState('checking');
  const validation = validateSkinPackage({
    requestedSkinId: source.identity.skinId,
    manifestSource: payload.manifestSource,
    assetHashes: payload.assetHashes,
    packageHash: payload.packageHash,
    currentFeatureVersion
  });

  if (!validation.ok) {
    return applyFailure(
      state,
      source.identity,
      packageKey,
      validation.state,
      validation.failureReason,
      transitions
    );
  }

  try {
    await fileSystem.delete(readyUri);
    await fileSystem.move(stagingUri, readyUri);
  } catch {
    return applyFailure(
      state,
      source.identity,
      packageKey,
      'failed',
      'promotion-failed',
      transitions
    );
  }

  pushState('ready');

  return {
    state: {
      ...state,
      selectedSkinId: source.identity.skinId,
      activeSkinId: source.identity.skinId,
      lastReadySkinId: source.identity.skinId
    },
    operation: {
      identity: source.identity,
      state: 'ready'
    },
    manifest: validation.manifest,
    transitions
  };
};
