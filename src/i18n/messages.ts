import enUS from '../locals/en-US.json';
import zhCN from '../locals/zh-CN.json';
import zhTW from '../locals/zh-TW.json';

import { LocaleType } from './types';

/**
 * 按 `LocaleType` 索引的静态消息表（构建期打包）。
 */
export const LOCALE_MESSAGES: Record<LocaleType, Record<string, string>> = {
  [LocaleType.ZH_CN]: zhCN,
  [LocaleType.ZH_TW]: zhTW,
  [LocaleType.EN_US]: enUS
};
