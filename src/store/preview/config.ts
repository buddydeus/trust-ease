import { Platform } from 'react-native';

import { defaultHomeSummary, type HomeSummary } from '../../constants';
import { SupportedLocales, type LocaleType } from '../../i18n/types';

/**
 * 预览 URL 中 `locale` 查询参数的类型守卫。
 *
 * @param value - 原始查询串或 `null`。
 * @returns 是否为受支持的 `LocaleType` 成员。
 */
export const isSupportedLocale = (
  value: string | null
): value is LocaleType => {
  return SupportedLocales.includes(value as unknown as LocaleType);
};

/**
 * 预览模式下支持的 `homeState` 取值。
 */
export type PreviewHomeState = 'unreported';

/**
 * 从 `?preview=1` 解析出的截图自动化标志（仅 Web 有意义）。
 */
export interface PreviewConfig {
  /** 是否启用预览模式。 */
  enabled: boolean;
  /** 合法时强制使用的语言；否则为 `null`。 */
  locale: LocaleType | null;
  /** 合法时强制使用的初始路由；否则为 `null`。 */
  route: string | null;
  /** 可选的首页摘要变体；否则为 `null`。 */
  homeState: PreviewHomeState | null;
}

const DEFAULT_PREVIEW_CONFIG: PreviewConfig = {
  enabled: false,
  locale: null,
  route: null,
  homeState: null
};

/**
 * `homeState` 查询参数的类型守卫。
 *
 * @param value - 原始查询串或 `null`。
 * @returns 是否为受支持的 `PreviewHomeState`。
 */
const isPreviewHomeState = (
  value: string | null
): value is PreviewHomeState => {
  return value === 'unreported';
};

/**
 * 校验预览路由查询参数。
 *
 * @param value - 原始查询串或 `null`。
 * @returns 是否为允许的站内绝对路径（以 `/` 开头）。
 */
const isPreviewRoute = (value: string | null): value is string => {
  if (typeof value !== 'string' || !value.startsWith('/')) {
    return false;
  }

  // 拒绝 `//host` 协议相对 URL 与含显式 scheme 的值，避免预览参数劫持导航。
  if (value.startsWith('//') || value.includes('://')) {
    return false;
  }

  return true;
};

/**
 * 从 URL 查询串解析预览标志。
 *
 * @param search - 查询串（是否含前导 `?` 均可，交由 `URLSearchParams` 处理）。
 * @returns `PreviewConfig` 快照；关闭预览时返回默认对象的浅拷贝。
 */
export const getPreviewConfigFromSearch = (search: string): PreviewConfig => {
  const params = new URLSearchParams(search);
  const enabled = params.get('preview') === '1';

  if (!enabled) {
    return { ...DEFAULT_PREVIEW_CONFIG };
  }

  const localeParam = params.get('locale');
  const routeParam = params.get('route');
  const homeStateParam = params.get('homeState');

  return {
    enabled: true,
    locale: isSupportedLocale(localeParam) ? localeParam : null,
    route: isPreviewRoute(routeParam) ? routeParam : null,
    homeState: isPreviewHomeState(homeStateParam) ? homeStateParam : null
  };
};

/**
 * 在 Web 上从 `window.location` 读取预览配置。
 *
 * @returns `PreviewConfig`；在原生环境或无 `window` 时返回禁用态默认对象。
 */
export const getPreviewConfig = (): PreviewConfig => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return { ...DEFAULT_PREVIEW_CONFIG };
  }

  return getPreviewConfigFromSearch(window.location.search);
};

/**
 * 按预览 `homeState` 构造首页摘要覆盖。
 *
 * @param homeState - 预览变体；为 `null` 时仅克隆默认摘要。
 * @returns 对应变体后的 `HomeSummary` 浅拷贝。
 */
export const getPreviewHomeSummary = (
  homeState: PreviewHomeState | null
): HomeSummary => {
  if (homeState === 'unreported') {
    return {
      ...defaultHomeSummary,
      offlineItemCount: 0,
      onlineItemCount: 0,
      isReportedToday: false,
      lastReportedAt: null
    };
  }

  return { ...defaultHomeSummary };
};
