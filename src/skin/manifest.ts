/**
 * 皮肤清单以未类型化 JSON 到达（当前为内置，未来可能为远程）。
 *
 * 在此严格解析并在错误信息中带路径，避免残缺对象进入布局层后难以排查或造成 UI 不一致。
 */
import { parseFeatureVersion } from './featureVersion';
import type {
  PageComponentKey,
  PageLayoutMode,
  SkinAsset,
  SkinManifest,
  SkinPageConfig,
  SkinPageKey,
  SkinPalette
} from './types';

/**
 * 当皮肤清单 JSON 未通过模式校验时抛出。
 */
export class SkinManifestParseError extends Error {
  /**
   * @param message - 解析错误说明，通常包含 JSON 路径上下文。
   */
  constructor(message: string) {
    super(message);
    this.name = 'SkinManifestParseError';
  }
}

/**
 * JSON 清单允许的 `layoutMode` 字符串白名单。
 * @constant
 */
const layoutModes = new Set<PageLayoutMode>([
  'hero-top',
  'stacked',
  'centered',
  'list-top',
  'settings-list'
]);

/**
 * `componentOrder` / `componentVisibility` 中允许的组件键白名单。
 * @constant
 */
const componentKeys = new Set<PageComponentKey>([
  'brandHeader',
  'decorativeStack',
  'statusLabel',
  'heroTitle',
  'heroBody',
  'streakCard',
  'reportButton',
  'itemsSummary',
  'helpersSummary',
  'decorativeBackground',
  'filters',
  'list',
  'footerHint',
  'languageSection',
  'triggerSection',
  'identitySection',
  'primaryAction'
]);

/**
 * `manifest.pages` 下允许的路由键白名单。
 * @constant
 */
const pageKeys = new Set<SkinPageKey>([
  'welcome',
  'home',
  'items',
  'report',
  'my',
  'new-item',
  'trigger-state',
  'tabs'
]);

/**
 * `manifest.palette` 对象必须具备的键列表。
 * @constant
 */
const paletteKeys: Array<keyof SkinPalette> = [
  'pageBg',
  'cardBg',
  'cardBorder',
  'textPrimary',
  'textMuted',
  'actionPrimary',
  'actionPrimaryText',
  'offlineAccent',
  'onlineAccent'
];

/**
 * 将未知 JSON 片段收窄为普通对象记录。
 *
 * @param value - 未知 JSON 片段。
 * @returns 是否为字符串键对象记录的类型谓词。
 */
const isRecord = (value: unknown): value is Record<string, unknown> => {
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
const readString = (
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
const readOptionalString = (
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

/**
 * 将 `manifest.palette` 解析为 `SkinPalette`。
 *
 * @param value - 原始 `palette` JSON 值。
 * @returns 校验后的调色板对象。
 * @throws {SkinManifestParseError} 形状或键不符合要求时抛出。
 */
const parsePalette = (value: unknown): SkinPalette => {
  if (!isRecord(value)) {
    throw new SkinManifestParseError('manifest.palette 必须为对象');
  }

  return Object.fromEntries(
    paletteKeys.map(key => [key, readString(value, key, 'manifest.palette')])
  ) as unknown as SkinPalette;
};

/**
 * 解析 `manifest.assets[]` 中的一项。
 *
 * @param value - 原始资源对象。
 * @param index - 用于错误信息的数组下标。
 * @returns 校验后的 `SkinAsset`。
 * @throws {SkinManifestParseError} 形状或字段不符合要求时抛出。
 */
const parseAsset = (value: unknown, index: number): SkinAsset => {
  if (!isRecord(value)) {
    throw new SkinManifestParseError(`manifest.assets[${index}] 必须为对象`);
  }

  return {
    id: readString(value, 'id', `manifest.assets[${index}]`),
    path: readString(value, 'path', `manifest.assets[${index}]`),
    hash: readString(value, 'hash', `manifest.assets[${index}]`)
  };
};

/**
 * 将 `manifest.pages[pageKey]` 解析为 `SkinPageConfig`。
 *
 * @param value - 原始页面对象。
 * @param pageKey - 正在解析的路由键（用于错误路径）。
 * @returns 校验后的页面配置。
 * @throws {SkinManifestParseError} 布局、组件或类型不受支持时抛出。
 */
const parsePageConfig = (value: unknown, pageKey: string): SkinPageConfig => {
  if (!isRecord(value)) {
    throw new SkinManifestParseError(`manifest.pages.${pageKey} 必须为对象`);
  }

  const layoutMode = readString(
    value,
    'layoutMode',
    `manifest.pages.${pageKey}`
  );
  if (!layoutModes.has(layoutMode as PageLayoutMode)) {
    throw new SkinManifestParseError(
      `manifest.pages.${pageKey}.layoutMode 不受支持`
    );
  }

  const componentOrder = value.componentOrder;
  if (!Array.isArray(componentOrder)) {
    throw new SkinManifestParseError(
      `manifest.pages.${pageKey}.componentOrder 必须为数组`
    );
  }

  const parsedComponentOrder = componentOrder.map((component, index) => {
    if (
      typeof component !== 'string' ||
      !componentKeys.has(component as PageComponentKey)
    ) {
      throw new SkinManifestParseError(
        `manifest.pages.${pageKey}.componentOrder[${index}] 不受支持`
      );
    }

    return component as PageComponentKey;
  });

  const componentVisibility = value.componentVisibility;
  if (!isRecord(componentVisibility)) {
    throw new SkinManifestParseError(
      `manifest.pages.${pageKey}.componentVisibility 必须为对象`
    );
  }

  const parsedVisibility: SkinPageConfig['componentVisibility'] = {};
  for (const [component, visible] of Object.entries(componentVisibility)) {
    if (!componentKeys.has(component as PageComponentKey)) {
      throw new SkinManifestParseError(
        `manifest.pages.${pageKey}.componentVisibility.${component} 不受支持`
      );
    }

    if (typeof visible !== 'boolean') {
      throw new SkinManifestParseError(
        `manifest.pages.${pageKey}.componentVisibility.${component} 必须为布尔值`
      );
    }

    parsedVisibility[component as PageComponentKey] = visible;
  }

  return {
    layoutMode: layoutMode as PageLayoutMode,
    componentOrder: parsedComponentOrder,
    componentVisibility: parsedVisibility
  };
};

/**
 * 解析 `manifest.pages` 映射。
 *
 * @param value - 原始 `pages` JSON 对象。
 * @returns `SkinPageKey` 到 `SkinPageConfig` 的映射。
 * @throws {SkinManifestParseError} 出现未知页面键或嵌套解析错误时抛出。
 */
const parsePages = (value: unknown): SkinManifest['pages'] => {
  if (!isRecord(value)) {
    throw new SkinManifestParseError('manifest.pages 必须为对象');
  }

  const pages: SkinManifest['pages'] = {};
  for (const [pageKey, pageConfig] of Object.entries(value)) {
    if (!pageKeys.has(pageKey as SkinPageKey)) {
      throw new SkinManifestParseError(`manifest.pages.${pageKey} 不受支持`);
    }

    pages[pageKey as SkinPageKey] = parsePageConfig(pageConfig, pageKey);
  }

  return pages;
};

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
