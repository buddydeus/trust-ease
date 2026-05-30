import { isSkinCompatible } from './compatibility';
import { getCurrentFeatureVersion } from './featureVersion';
import { parseSkinManifest, SkinManifestParseError } from './manifest';
import type {
  FeatureVersion,
  SkinCompatibility,
  SkinManifest,
  SkinPackageFailureReason,
  SkinPackageState
} from './types';

/**
 * 下载包验证输入。
 */
export interface SkinPackageValidationInput {
  /** 用户或配置请求的目标皮肤 id。 */
  requestedSkinId: string;
  /** 未信任的 manifest JSON。 */
  manifestSource: unknown;
  /** 以资源 path 为键的实际资源 hash。 */
  assetHashes: Record<string, string>;
  /** 实际计算得到的包级 hash。 */
  packageHash: string;
  /** 当前 app featureVersion；测试可注入。 */
  currentFeatureVersion?: FeatureVersion;
}

/**
 * 下载包验证成功结果。
 */
export interface SkinPackageValidationSuccess {
  /** 判别字段。 */
  ok: true;
  /** 已解析 manifest。 */
  manifest: SkinManifest;
  /** 兼容性结论。 */
  compatibility: SkinCompatibility;
}

/**
 * 下载包验证失败结果。
 */
export interface SkinPackageValidationFailure {
  /** 判别字段。 */
  ok: false;
  /** 失败后应写入的包状态。 */
  state: Extract<SkinPackageState, 'failed' | 'incompatible'>;
  /** 可恢复失败原因。 */
  failureReason: SkinPackageFailureReason;
}

/**
 * 下载包验证结果。
 */
export type SkinPackageValidationResult =
  | SkinPackageValidationSuccess
  | SkinPackageValidationFailure;

const fail = (
  failureReason: SkinPackageFailureReason,
  state: Extract<SkinPackageState, 'failed' | 'incompatible'> = 'failed'
): SkinPackageValidationFailure => ({
  ok: false,
  state,
  failureReason
});

/**
 * 验证下载或 staged 皮肤包是否可进入 ready。
 *
 * @param input - manifest、hash 与兼容性输入。
 * @returns 可进入 ready 的 manifest，或可持久化的失败状态。
 */
export const validateSkinPackage = (
  input: SkinPackageValidationInput
): SkinPackageValidationResult => {
  let manifest: SkinManifest;

  try {
    manifest = parseSkinManifest(input.manifestSource);
  } catch (error) {
    if (error instanceof SkinManifestParseError) {
      return fail('manifest-invalid');
    }

    throw error;
  }

  if (manifest.skinId !== input.requestedSkinId) {
    return fail('skin-id-mismatch');
  }

  for (const asset of manifest.assets) {
    if (input.assetHashes[asset.path] !== asset.hash) {
      return fail('asset-hash-mismatch');
    }
  }

  if (input.packageHash !== manifest.packageHash) {
    return fail('package-hash-mismatch');
  }

  const compatibility = isSkinCompatible(
    manifest,
    input.currentFeatureVersion ?? getCurrentFeatureVersion()
  );

  if (compatibility.kind !== 'compatible') {
    return fail('incompatible', 'incompatible');
  }

  return {
    ok: true,
    manifest,
    compatibility
  };
};
