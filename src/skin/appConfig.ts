import rawSkinConfig from '../config/skins.json';

/**
 * 校验前从 `skins.json` 读到的原始形状。
 */
interface IRawSkinConfig {
  /** JSON 中的可选默认皮肤 id。 */
  defaultSkinId?: unknown;
  /** JSON 中的可选额外内置皮肤 id 列表。 */
  availableSkinIds?: unknown;
}

/**
 * 本构建中可用的已校验皮肤 id 集合。
 */
export interface AppSkinConfig {
  /** 无持久化数据时冷启动使用的默认皮肤 id。 */
  defaultSkinId: string;
  /** 唯一内置皮肤 id 列表（含默认项）。 */
  availableSkinIds: string[];
}

/**
 * `skin-*` 形式的皮肤 id 类型守卫。
 *
 * @param value - 任意 JSON 值。
 * @returns 是否为合法皮肤 id 字符串。
 */
const isSkinId = (value: unknown): value is string => {
  return typeof value === 'string' && /^skin-[0-9A-Za-z-]+$/.test(value);
};

/**
 * 解析并规范化应用级皮肤配置。
 *
 * @param raw - 未知 JSON 根（通常为导入的 `skins.json`）。
 * @returns 校验后的 `AppSkinConfig`。
 */
export const parseAppSkinConfig = (raw: unknown): AppSkinConfig => {
  const source = raw as IRawSkinConfig;
  const defaultSkinId = isSkinId(source.defaultSkinId)
    ? source.defaultSkinId
    : 'skin-001';
  const configuredSkinIds = Array.isArray(source.availableSkinIds)
    ? source.availableSkinIds.filter(isSkinId)
    : [];
  const availableSkinIds = Array.from(
    new Set([defaultSkinId, ...configuredSkinIds])
  );

  return {
    defaultSkinId,
    availableSkinIds
  };
};

/**
 * 本包单例皮肤配置（模块加载时解析一次）。
 */
export const appSkinConfig = parseAppSkinConfig(rawSkinConfig);
