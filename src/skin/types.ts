/**
 * 带品牌的 `major.minor` 字符串，仅用于皮肤与应用的特性版本兼容判断。
 *
 * 通过品牌类型避免与任意字符串（如完整 semver）混用，又不必在每次比较时做运行时校验。
 */
export type FeatureVersion = string & { readonly __brand: 'FeatureVersion' };

/**
 * 每个皮肤清单必须提供的语义化调色板。
 */
export interface SkinPalette {
  /** 页面背景色。 */
  pageBg: string;
  /** 卡片表面背景色。 */
  cardBg: string;
  /** 卡片边框色。 */
  cardBorder: string;
  /** 主文本色。 */
  textPrimary: string;
  /** 次要/弱化文本色。 */
  textMuted: string;
  /** 主操作填充色。 */
  actionPrimary: string;
  /** 主操作上的文字/图标色。 */
  actionPrimaryText: string;
  /** 线下相关 UI 的强调色。 */
  offlineAccent: string;
  /** 线上相关 UI 的强调色。 */
  onlineAccent: string;
}

/**
 * 皮肤可控制的页面布局策略。
 */
export type PageLayoutMode =
  | 'hero-top'
  | 'stacked'
  | 'centered'
  | 'list-top'
  | 'settings-list';

/**
 * 皮肤可重排或显隐切换的一方子组件键。
 */
export type PageComponentKey =
  | 'brandHeader'
  | 'decorativeStack'
  | 'statusLabel'
  | 'heroTitle'
  | 'heroBody'
  | 'streakCard'
  | 'reportButton'
  | 'itemsSummary'
  | 'helpersSummary'
  | 'decorativeBackground'
  | 'filters'
  | 'list'
  | 'footerHint'
  | 'languageSection'
  | 'triggerSection'
  | 'identitySection'
  | 'primaryAction';

/**
 * 皮肤清单中单页的编排契约。
 */
export interface SkinPageConfig {
  /** 页面壳层布局模式。 */
  layoutMode: PageLayoutMode;
  /** 要渲染的组件键有序列表。 */
  componentOrder: PageComponentKey[];
  /** 各组件显隐覆盖（相对默认可见性）。 */
  componentVisibility: Partial<Record<PageComponentKey, boolean>>;
}

/**
 * 可由皮肤控制布局的应用路由键。
 */
export type SkinPageKey =
  | 'welcome'
  | 'home'
  | 'items'
  | 'report'
  | 'my'
  | 'new-item'
  | 'trigger-state'
  | 'tabs';

/**
 * 皮肤清单声明的静态资源项。
 */
export interface SkinAsset {
  /** 稳定资源标识。 */
  id: string;
  /** 相对或已解析的资源路径。 */
  path: string;
  /** 用于校验的完整性哈希。 */
  hash: string;
}

/**
 * 设备上可下载皮肤包的生命周期状态。
 */
export type SkinPackageState =
  | 'idle'
  | 'checking'
  | 'downloading'
  | 'ready'
  | 'failed'
  | 'incompatible';

/**
 * 运行时消费的皮肤清单解析结果。
 */
export interface SkinManifest {
  /** 皮肤标识（`skin-*`）。 */
  skinId: string;
  /** 选择器中展示的人类可读名称。 */
  displayName: string;
  /** 皮肤包自身的 semver 字符串。 */
  skinVersion: string;
  /** 运行此皮肤所需的最低应用特性版本（`major.minor`）。 */
  minFeatureVersion: FeatureVersion;
  /** 此皮肤支持的最高应用特性版本（可选）。 */
  maxFeatureVersion?: FeatureVersion;
  /** 整包内容的哈希，用于完整性校验。 */
  packageHash: string;
  /** 声明的静态资源列表。 */
  assets: SkinAsset[];
  /** 语义化调色板。 */
  palette: SkinPalette;
  /** 路由键到页面布局配置的部分映射。 */
  pages: Partial<Record<SkinPageKey, SkinPageConfig>>;
}

/**
 * 将清单中的特性版本边界与当前运行应用比对后的结果。
 */
export type SkinCompatibility =
  | { kind: 'compatible' }
  | {
      kind: 'incompatible';
      /** 用户需升级应用还是改选其他皮肤。 */
      reason: 'upgrade-app' | 'change-skin';
    };
