import { NativeModules, Platform } from 'react-native';

/**
 * 从原生模块读取设备语言（iOS/Android 路径不同）。
 *
 * @returns 若能检测到主语言则返回其字符串；否则 `undefined`。
 */
export const readSystemLocale = (): string | void => {
  const settingsManager = NativeModules.SettingsManager;
  if (settingsManager?.settings?.AppleLocale) {
    return settingsManager.settings.AppleLocale;
  }
  if (Array.isArray(settingsManager?.settings?.AppleLanguages)) {
    return settingsManager.settings.AppleLanguages[0];
  }

  const i18nManager = NativeModules.I18nManager;
  if (typeof i18nManager?.localeIdentifier === 'string') {
    return i18nManager.localeIdentifier;
  }

  if (
    Platform.OS === 'android' &&
    typeof NativeModules?.I18nManager?.localeIdentifier === 'string'
  ) {
    return NativeModules.I18nManager.localeIdentifier;
  }
};
