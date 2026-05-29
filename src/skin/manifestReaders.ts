import { SkinManifestParseError } from './manifestError';

/**
 * 将未知 JSON 片段收窄为普通对象记录。
 *
 * @param value - 未知 JSON 片段。
 * @returns 是否为字符串键对象记录的类型谓词。
 */
export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/**
 * 读取必填非空字符串字段。
 *
 * @param source - 已解析的对象记录。
 * @param key - `source` 上的属性名。
 * @param path - 错误信息中使用的前缀路径。
 * @returns 去首尾空白后的非空字符串。
 * @throws {SkinManifestParseError} 缺失、类型错误或空字符串时抛出。
 */
export const readString = (
  source: Record<string, unknown>,
  key: string,
  path: string
): string => {
  const value = source[key];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new SkinManifestParseError(`${path}.${key} 必须为非空字符串`);
  }

  return value;
};

/**
 * 读取可选非空字符串字段。
 *
 * @param source - 已解析的对象记录。
 * @param key - `source` 上的属性名。
 * @param path - 错误信息中使用的前缀路径。
 * @returns 字符串值；缺失或为 `null` 时返回 `undefined`。
 * @throws {SkinManifestParseError} 存在但非非空字符串时抛出。
 */
export const readOptionalString = (
  source: Record<string, unknown>,
  key: string,
  path: string
): string | void => {
  const value = source[key];

  if (value == null) return;

  if (typeof value !== 'string' || value.trim() === '') {
    throw new SkinManifestParseError(`${path}.${key} 必须为非空字符串`);
  }

  return value;
};
