import { LocaleType } from './types';

/**
 * 将操作系统语言标签映射到受支持的 `LocaleType`。
 *
 * @param locale - 平台提供的可选 BCP-47 风格语言标签。
 * @returns 最接近的受支持 `LocaleType`。
 */
export const resolveSupportedLocale = (
  locale?: string | null | void
): LocaleType => {
  if (!locale) {
    return LocaleType.ZH_CN;
  }

  const normalized = locale.toLowerCase();

  if (
    normalized.startsWith('zh-hant') ||
    normalized.startsWith('zh-tw') ||
    normalized.startsWith('zh-hk') ||
    normalized.startsWith('zh-mo')
  ) {
    return LocaleType.ZH_TW;
  }

  if (normalized.startsWith('zh')) {
    return LocaleType.ZH_CN;
  }

  if (normalized.startsWith('en')) {
    return LocaleType.EN_US;
  }

  return LocaleType.ZH_CN;
};
