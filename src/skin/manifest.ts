/**
 * 皮肤清单以未类型化 JSON 到达（当前为内置，未来可能为远程）。
 *
 * 在此严格解析并在错误信息中带路径，避免残缺对象进入布局层后难以排查或造成 UI 不一致。
 */
import { parseFeatureVersion } from './featureVersion';
import { SkinManifestParseError } from './manifestError';
import { isRecord, readOptionalString, readString } from './manifestReaders';
import { parseAsset, parsePages, parsePalette } from './manifestSections';
import type { SkinManifest } from './types';

export { SkinManifestParseError } from './manifestError';

/**
 * 解析并校验整份皮肤清单 JSON 文档。
 *
 * @param raw - 未知 JSON 根（期望为对象）。
 * @returns 强类型的 `SkinManifest`。
 * @throws {SkinManifestParseError} 必填字段、枚举或数组不合法时抛出。
 */
export const parseSkinManifest = (raw: unknown): SkinManifest => {
  if (!isRecord(raw)) {
    throw new SkinManifestParseError('manifest 必须为对象');
  }

  const minFeatureVersionRaw = readString(raw, 'minFeatureVersion', 'manifest');
  const maxFeatureVersionRaw = readOptionalString(
    raw,
    'maxFeatureVersion',
    'manifest'
  );
  const minFeatureVersion = parseFeatureVersion(minFeatureVersionRaw);
  const parsedMaxFeatureVersion = maxFeatureVersionRaw
    ? parseFeatureVersion(maxFeatureVersionRaw)
    : null;

  if (!minFeatureVersion) {
    throw new SkinManifestParseError(
      'manifest.minFeatureVersion 必须为 major.minor 形式'
    );
  }

  if (maxFeatureVersionRaw && !parsedMaxFeatureVersion) {
    throw new SkinManifestParseError(
      'manifest.maxFeatureVersion 必须为 major.minor 形式'
    );
  }

  const assets = raw.assets;
  if (!Array.isArray(assets)) {
    throw new SkinManifestParseError('manifest.assets 必须为数组');
  }

  return {
    skinId: readString(raw, 'skinId', 'manifest'),
    displayName: readString(raw, 'displayName', 'manifest'),
    skinVersion: readString(raw, 'skinVersion', 'manifest'),
    minFeatureVersion,
    maxFeatureVersion: parsedMaxFeatureVersion ?? void 0,
    packageHash: readString(raw, 'packageHash', 'manifest'),
    assets: assets.map(parseAsset),
    palette: parsePalette(raw.palette),
    pages: parsePages(raw.pages)
  };
};
