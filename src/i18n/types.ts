/**
 * 以静态 JSON 包形式随应用分发的界面语言枚举。
 */
export enum LocaleType {
  /** 简体中文（中国大陆），未知系统语言时的默认回退。 */
  ZH_CN = 'zh-CN',
  /** 繁体中文（台港澳语系归并）。 */
  ZH_TW = 'zh-TW',
  /** 美式英语。 */
  EN_US = 'en-US'
}

/**
 * 供守卫与遍历使用的 `LocaleType` 有序列表。
 */
export const SupportedLocales = [
  LocaleType.ZH_CN,
  LocaleType.ZH_TW,
  LocaleType.EN_US
];

/**
 * 控制 `LocaleType` 跟随系统还是使用已持久化的手动选择。
 */
export type LocaleMode = 'system' | 'manual';

/**
 * `getMessage` 查找时的可选参数。
 */
export interface IGetMessageOptions {
  /** 当前词典缺少键时的兜底文案。 */
  fallback?: string;
}

/**
 * 按扁平消息键取本地化字符串。
 *
 * @param key - 消息键。
 * @param options - 缺键时的可选兜底。
 * @returns 解析后的本地化字符串。
 */
export type I18nGetMessage = (
  key: string,
  options?: IGetMessageOptions
) => string;

/**
 * `useI18n` 钩子对外暴露的契约。
 */
export interface ILocaleResult {
  /** 经系统/手动/预览解析后的有效语言。 */
  locale: LocaleType;
  /** 当前为跟随系统还是手动语言。 */
  localeMode: LocaleMode;
  /**
   * 持久化手动语言并将模式切为 `manual`。
   *
   * @param locale - 要写入的目标语言。
   * @returns void
   */
  setManualLocale: (locale: LocaleType) => void;
  /**
   * 恢复为跟随系统语言。
   *
   * @returns void
   */
  useSystemLocale: () => void;
  /** 绑定当前语言词典的取文案函数。 */
  getMessage: I18nGetMessage;
}
