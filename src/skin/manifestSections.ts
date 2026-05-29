import { SkinManifestParseError } from './manifestError';
import {
  componentKeys,
  layoutModes,
  pageKeys,
  paletteKeys
} from './manifestKeys';
import { isRecord, readString } from './manifestReaders';
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
 * 将 `manifest.palette` 解析为 `SkinPalette`。
 *
 * @param value - 原始 `palette` JSON 值。
 * @returns 校验后的调色板对象。
 * @throws {SkinManifestParseError} 形状或键不符合要求时抛出。
 */
export const parsePalette = (value: unknown): SkinPalette => {
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
export const parseAsset = (value: unknown, index: number): SkinAsset => {
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
export const parsePages = (value: unknown): SkinManifest['pages'] => {
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
