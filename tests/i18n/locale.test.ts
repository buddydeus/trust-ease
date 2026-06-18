import { LOCALE_MESSAGES } from '../../src/i18n/messages';
import { resolveSupportedLocale } from '../../src/i18n/resolveLocale';

test('maps english system locale to en-US', () => {
  expect(resolveSupportedLocale('en-US')).toBe('en-US');
});

test('maps traditional chinese locales to zh-TW', () => {
  expect(resolveSupportedLocale('zh-Hant-HK')).toBe('zh-TW');
  expect(resolveSupportedLocale('zh-TW')).toBe('zh-TW');
});

test('falls back to zh-CN for unsupported locales', () => {
  expect(resolveSupportedLocale('fr-FR')).toBe('zh-CN');
});

test('contains translated home hero copy for all supported locales', () => {
  expect(LOCALE_MESSAGES['zh-CN']['home.heroTitle']).toBe('安心事项');
  expect(LOCALE_MESSAGES['zh-TW']['home.heroTitle']).toBe('安心事項');
  expect(LOCALE_MESSAGES['en-US']['home.heroTitle']).toBe('Anxin Items');
});

test('loads locale dictionaries as flat key value maps', () => {
  expect(LOCALE_MESSAGES['zh-CN']['dailyReport.primaryAction']).toBe(
    '我今天一切正常'
  );
  expect(LOCALE_MESSAGES['zh-TW']['items.title']).toBe('我的事項');
  expect(LOCALE_MESSAGES['en-US']['my.languageTitle']).toBe('Language');
  expect(LOCALE_MESSAGES['en-US']['my.skinTitle']).toBe('Style');
});
