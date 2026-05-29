import type {
  PageComponentKey,
  PageLayoutMode,
  SkinPageKey,
  SkinPalette
} from './types';

/**
 * JSON 清单允许的 `layoutMode` 字符串白名单。
 * @constant
 */
export const layoutModes = new Set<PageLayoutMode>([
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
export const componentKeys = new Set<PageComponentKey>([
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
export const pageKeys = new Set<SkinPageKey>([
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
export const paletteKeys: Array<keyof SkinPalette> = [
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
