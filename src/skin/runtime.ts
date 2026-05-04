import { loadDefaultBundledSkinPackage } from './registry';
import type { SkinManifest, SkinPageConfig, SkinPageKey } from './types';

/**
 * 当清单未声明某路由时的空布局回退配置。
 */
const fallbackPageConfig: SkinPageConfig = {
  layoutMode: 'stacked',
  componentOrder: [],
  componentVisibility: {}
};

/**
 * 克隆可变的 `SkinPageConfig` 快照。
 *
 * @param page - 源页面配置。
 * @returns 可安全被外部修改的深拷贝结果。
 */
const clonePageConfig = (page: SkinPageConfig): SkinPageConfig => {
  return {
    layoutMode: page.layoutMode,
    componentOrder: [...page.componentOrder],
    componentVisibility: { ...page.componentVisibility }
  };
};

/**
 * 克隆完整 `SkinManifest`（含嵌套集合）。
 *
 * @param manifest - 源清单。
 * @returns 与内部状态隔离的副本。
 */
const cloneManifest = (manifest: SkinManifest): SkinManifest => {
  return {
    ...manifest,
    assets: manifest.assets.map(asset => ({ ...asset })),
    palette: { ...manifest.palette },
    pages: Object.fromEntries(
      Object.entries(manifest.pages).map(([pageKey, pageConfig]) => [
        pageKey,
        pageConfig ? clonePageConfig(pageConfig) : pageConfig
      ])
    ) as SkinManifest['pages']
  };
};

/**
 * `SkinRuntime.getPage` 返回的只读页面配置视图。
 */
export interface IReadonlySkinPageConfig {
  /** 页面布局模式。 */
  readonly layoutMode: SkinPageConfig['layoutMode'];
  /** 有序的组件键列表。 */
  readonly componentOrder: ReadonlyArray<
    SkinPageConfig['componentOrder'][number]
  >;
  /** 显隐覆盖表。 */
  readonly componentVisibility: Readonly<SkinPageConfig['componentVisibility']>;
}

/**
 * `SkinRuntime.manifest` 暴露的只读清单快照类型。
 */
export type ReadonlySkinManifest = Readonly<
  Omit<SkinManifest, 'assets' | 'palette' | 'pages'>
> & {
  readonly assets: ReadonlyArray<Readonly<SkinManifest['assets'][number]>>;
  readonly palette: Readonly<SkinManifest['palette']>;
  readonly pages: Readonly<
    Partial<Record<SkinPageKey, IReadonlySkinPageConfig>>
  >;
};

/**
 * 供 UI 消费的不可变皮肤运行时 API。
 */
export interface SkinRuntime {
  /** 当前皮肤 id。 */
  readonly skinId: SkinManifest['skinId'];
  /** 选择器展示名。 */
  readonly displayName: SkinManifest['displayName'];
  /** 当前调色板（每次读取均克隆）。 */
  readonly palette: Readonly<SkinManifest['palette']>;
  /** 完整清单快照（每次读取均克隆）。 */
  readonly manifest: ReadonlySkinManifest;
  /**
   * 返回给定路由键对应页面配置的克隆副本。
   *
   * @param page - 要解析的路由键。
   * @returns 只读页面配置；未定义时返回回退配置。
   */
  readonly getPage: (page: SkinPageKey) => IReadonlySkinPageConfig;
}

/**
 * 在已解析清单外包裹防御性 `SkinRuntime`。
 *
 * @param manifest - 源清单（内部会再拷贝一份）。
 * @returns 每次读取都会克隆对外数据的运行时访问器。
 */
export const createSkinRuntime = (manifest: SkinManifest): SkinRuntime => {
  const manifestCopy = cloneManifest(manifest);

  return {
    skinId: manifestCopy.skinId,
    displayName: manifestCopy.displayName,
    get palette() {
      return { ...manifestCopy.palette };
    },
    get manifest() {
      return cloneManifest(manifestCopy);
    },
    getPage(page) {
      const pageConfig = manifestCopy.pages[page];
      return pageConfig
        ? clonePageConfig(pageConfig)
        : clonePageConfig(fallbackPageConfig);
    }
  };
};

/**
 * 由默认内置皮肤清单构建的默认运行时实例。
 */
export const defaultSkinRuntime = createSkinRuntime(
  loadDefaultBundledSkinPackage().manifest
);
