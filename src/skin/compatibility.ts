import { parseFeatureVersion } from './featureVersion';
import type { FeatureVersion, SkinCompatibility, SkinManifest } from './types';

/**
 * 将特性版本转为可排序的数值二元组。
 *
 * @param version - 带品牌的特性版本。
 * @returns `[major, minor]`；解析失败时为 `null`。
 */
const toTuple = (version: FeatureVersion): [number, number] | null => {
  const parsed = parseFeatureVersion(version);
  if (!parsed) {
    return null;
  }

  const [major, minor] = parsed.split('.');
  return [Number(major), Number(minor)];
};

/**
 * 比较两个 `major.minor` 特性版本。
 *
 * @param left - 左侧版本。
 * @param right - 右侧版本。
 * @returns `left < right` 为负，`left > right` 为正，相等为 0；任一侧不可解析则为 `NaN`。
 */
const compareFeatureVersions = (
  left: FeatureVersion,
  right: FeatureVersion
): number => {
  const leftParsed = toTuple(left);
  const rightParsed = toTuple(right);

  if (!leftParsed || !rightParsed) {
    return Number.NaN;
  }

  const [leftMajor, leftMinor] = leftParsed;
  const [rightMajor, rightMinor] = rightParsed;

  if (leftMajor !== rightMajor) {
    return leftMajor - rightMajor;
  }

  return leftMinor - rightMinor;
};

/**
 * 判断皮肤清单是否与当前运行应用版本兼容。
 *
 * @param manifest - 已解析的皮肤清单。
 * @param currentFeatureVersion - 待比对的应用特性版本。
 * @returns 兼容判别及升级/换肤提示原因（若不相容）。
 */
export const isSkinCompatible = (
  manifest: SkinManifest,
  currentFeatureVersion: FeatureVersion
): SkinCompatibility => {
  const minComparison = compareFeatureVersions(
    currentFeatureVersion,
    manifest.minFeatureVersion
  );

  if (Number.isNaN(minComparison)) {
    return { kind: 'incompatible', reason: 'change-skin' };
  }

  if (minComparison < 0) {
    return { kind: 'incompatible', reason: 'upgrade-app' };
  }

  if (manifest.maxFeatureVersion) {
    const maxComparison = compareFeatureVersions(
      currentFeatureVersion,
      manifest.maxFeatureVersion
    );

    if (Number.isNaN(maxComparison) || maxComparison > 0) {
      return { kind: 'incompatible', reason: 'change-skin' };
    }
  }

  return { kind: 'compatible' };
};
