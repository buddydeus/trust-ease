import { appSkinConfig } from './appConfig';
import { isSkinCompatible } from './compatibility';
import { getCurrentFeatureVersion } from './featureVersion';
import { parseSkinManifest } from './manifest';
import type { SkinCompatibility, SkinManifest } from './types';

/**
 * 内置清单与对当前构建的兼容性结果打包。
 */
export interface IBundledSkinPackage {
  /** 已解析清单。 */
  manifest: SkinManifest;
  /** 相对当前应用的兼容结论。 */
  compatibility: SkinCompatibility;
}

/** 以皮肤 id 为键的内置 JSON 清单源。 */
const bundledManifestSources: Record<string, unknown> = {
  'skin-001': require('../../skins/skin-001/manifest.json')
};

/**
 * 按 id 加载一个内置皮肤并计算兼容性。
 *
 * @param skinId - 存在于 `bundledManifestSources` 中的皮肤 id。
 * @returns 包描述；未知 id 时返回 `null`。
 */
export const loadBundledSkinPackage = (
  skinId: string
): IBundledSkinPackage | null => {
  const source = bundledManifestSources[skinId];

  if (!source) {
    return null;
  }

  const manifest = parseSkinManifest(source);

  return {
    manifest,
    compatibility: isSkinCompatible(manifest, getCurrentFeatureVersion())
  };
};

/**
 * 加载配置中的默认内置皮肤（必须存在）。
 *
 * @returns 对应 `appSkinConfig.defaultSkinId` 的非空包。
 * @throws {Error} 当二进制中缺少默认皮肤包时抛出。
 */
export const loadDefaultBundledSkinPackage = (): IBundledSkinPackage => {
  const skinPackage = loadBundledSkinPackage(appSkinConfig.defaultSkinId);

  if (!skinPackage) {
    throw new Error(
      `Missing bundled skin package: ${appSkinConfig.defaultSkinId}`
    );
  }

  return skinPackage;
};

/**
 * 加载 `appSkinConfig.availableSkinIds` 列出的全部内置皮肤。
 *
 * @returns 成功解析的包数组（缺失 id 会被过滤掉）。
 */
export const loadConfiguredBundledSkinPackages = (): IBundledSkinPackage[] => {
  return appSkinConfig.availableSkinIds
    .map(loadBundledSkinPackage)
    .filter((skinPackage): skinPackage is IBundledSkinPackage =>
      Boolean(skinPackage)
    );
};
