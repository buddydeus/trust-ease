import { appVersion } from '../config/appVersion';

import type { FeatureVersion } from './types';

/**
 * 解析严格的 `major.minor` 特性版本字符串。
 *
 * @param version - 原始文本，期望匹配 `^\d+\.\d+$`。
 * @returns 带品牌的 `FeatureVersion`；格式非法时返回 `null`。
 */
export const parseFeatureVersion = (version: string): FeatureVersion | null => {
  const match = /^(\d+)\.(\d+)$/.exec(version);

  if (!match) {
    return null;
  }

  return `${match[1]}.${match[2]}` as FeatureVersion;
};

/**
 * 将无法解析的输入强制落到最低安全特性层级。
 *
 * @param version - 原始版本文本。
 * @returns 合法 `FeatureVersion`，解析失败时默认为 `0.0`。
 */
export const coerceFeatureVersion = (version: string): FeatureVersion => {
  return parseFeatureVersion(version) ?? ('0.0' as FeatureVersion);
};

/**
 * 将完整应用 semver 映射为 `major.minor` 形式的 `FeatureVersion`。
 *
 * @param version - 完整 semver（可含预发布与构建元数据）。
 * @returns 推导得到的 `FeatureVersion`。
 */
export const getFeatureVersionFromAppVersion = (
  version: string
): FeatureVersion => {
  const match =
    /^(\d+)\.(\d+)\.\d+(?:-[0-9A-Za-z-.]+)?(?:\+[0-9A-Za-z-.]+)?$/.exec(
      version
    );

  if (!match) {
    return coerceFeatureVersion('0.0');
  }

  return coerceFeatureVersion(`${match[1]}.${match[2]}`);
};

/**
 * 从 `appVersion` 读取当前应用特性版本。
 *
 * @returns 当前 `FeatureVersion`。
 */
export const getCurrentFeatureVersion = (): FeatureVersion => {
  return getFeatureVersionFromAppVersion(appVersion);
};
