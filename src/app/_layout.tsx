/* eslint-disable jshow/sort-import */

import '../global.css';

import { Stack, usePathname } from 'expo-router';

import { memo } from 'react';
import { View } from 'react-native';
import { ThemeProvider } from 'styled-components/native';

import { usePreviewConfig } from '../store';
import { appTheme } from '../theme';

import { usePreviewReadyMarker } from './usePreviewReadyMarker';
import { usePreviewRouteSync } from './usePreviewRouteSync';
import { useSkinStorageSync } from './useSkinStorageSync';

/**
 * 故意留空：为将来根级路由参数预留稳定具名 props 位，避免路由膨胀时反复改写 `React.memo` 泛型。
 */
export interface IRootLayoutProps {}

/**
 * 根 Stack 布局：协调预览跳转与截图就绪标记。
 *
 * @returns 已 memo 的根布局元素。
 */
const RootLayout = memo<IRootLayoutProps>(() => {
  const pathname = usePathname();
  const preview = usePreviewConfig();

  usePreviewRouteSync({
    pathname,
    enabled: preview.enabled,
    route: preview.route
  });
  useSkinStorageSync();
  usePreviewReadyMarker({
    pathname,
    enabled: preview.enabled,
    locale: preview.locale
  });

  return (
    <View className="flex-1 bg-page">
      {preview.enabled ? (
        <View
          nativeID="preview-ready-marker"
          className="absolute h-px w-px opacity-0"
        />
      ) : null}
      <ThemeProvider theme={appTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="report" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </View>
  );
});

RootLayout.displayName = 'RootLayout';

export default RootLayout;
