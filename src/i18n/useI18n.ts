import { useAppStore, usePreviewConfig } from '../store';

import { LOCALE_MESSAGES } from './messages';
import { resolveSupportedLocale } from './resolveLocale';
import { readSystemLocale } from './systemLocale';
import {
  type IGetMessageOptions,
  type ILocaleResult,
  type LocaleMode,
  type LocaleType
} from './types';

/**
 * 根据持久化模式与系统语言解析当前有效语言。
 *
 * @param locale - 存储中的手动语言。
 * @param localeMode - `manual` 时固定返回 `locale`；`system` 时从系统解析。
 * @returns 生效的 `LocaleType`。
 */
const getActiveLocale = (
  locale: LocaleType,
  localeMode: LocaleMode = 'system'
): LocaleType => {
  if (localeMode === 'manual') {
    return locale;
  }

  return resolveSupportedLocale(readSystemLocale());
};

/**
 * 在扁平词典中查找文案，支持缺键兜底。
 *
 * @param dictionary - 当前语言的键值表。
 * @param key - 消息键。
 * @param options - 缺键时的可选兜底。
 * @returns 解析后的字符串（无兜底且缺键时可能返回键名本身）。
 */
const getMessage = (
  dictionary: Record<string, string>,
  key: string,
  options: IGetMessageOptions = {}
): string => {
  return dictionary[key] ?? options.fallback ?? key;
};

/**
 * 暴露语言状态、切换动作及当前语言下的 `getMessage`。
 *
 * @returns 当前渲染对应的 `IUseI18nResult`。
 */
export const useI18n = (): ILocaleResult => {
  const locale = useAppStore(state => state.locale);
  const localeMode = useAppStore(state => state.localeMode);
  const setManualLocale = useAppStore(state => state.setManualLocale);
  const useSystemLocale = useAppStore(state => state.useSystemLocale);
  const preview = usePreviewConfig();

  const activeLocale =
    preview.enabled && preview.locale
      ? preview.locale
      : getActiveLocale(locale, localeMode);

  const activeMessages = LOCALE_MESSAGES[activeLocale];

  return {
    locale: activeLocale,
    localeMode,
    setManualLocale,
    useSystemLocale,
    getMessage: (key: string, options: IGetMessageOptions = {}) =>
      getMessage(activeMessages, key, options)
  };
};
