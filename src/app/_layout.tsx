/* eslint-disable jshow/sort-import */

import '../global.css';

import { Stack, router, usePathname } from 'expo-router';

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { ThemeProvider } from 'styled-components/native';

import { loadSkinStorageState, saveSkinStorageState } from '../skin/storage';
import { useAppStore, usePreviewConfig } from '../store';
import { appTheme } from '../theme';

/**
 * 故意留空：为将来根级路由参数预留稳定具名 props 位，避免路由膨胀时反复改写 `React.memo` 泛型。
 */
export interface IRootLayoutProps {}

/**
 * 根 Stack 布局：协调预览跳转与截图就绪标记。
 *
 * @returns 已 memo 的根布局元素。
 */
const RootLayout = React.memo<IRootLayoutProps>(() => {
  const pathname = usePathname();
  const preview = usePreviewConfig();

  useEffect(() => {
    if (!preview.enabled || !preview.route) {
      return;
    }

    if (pathname === preview.route) {
      return;
    }

    router.replace(preview.route);
  }, [pathname, preview.enabled, preview.route]);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    loadSkinStorageState().then(snapshot => {
      if (!active) {
        return;
      }

      useAppStore.setState({
        selectedSkinId: snapshot.selectedSkinId,
        activeSkinId: snapshot.activeSkinId,
        lastReadySkinId: snapshot.lastReadySkinId,
        skinPackageStates: snapshot.skinPackageStates
      });

      unsubscribe = useAppStore.subscribe((state, prev) => {
        if (
          state.selectedSkinId === prev.selectedSkinId &&
          state.activeSkinId === prev.activeSkinId &&
          state.lastReadySkinId === prev.lastReadySkinId &&
          state.skinPackageStates === prev.skinPackageStates
        ) {
          return;
        }

        void saveSkinStorageState({
          selectedSkinId: state.selectedSkinId,
          activeSkinId: state.activeSkinId,
          lastReadySkinId: state.lastReadySkinId,
          skinPackageStates: state.skinPackageStates
        });
      });
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    if (!preview.enabled) {
      delete document.body.dataset.previewReady;
      delete document.body.dataset.previewRoute;
      delete document.body.dataset.previewLocale;
      return;
    }

    document.body.dataset.previewReady = '0';
    document.body.dataset.previewRoute = pathname;
    document.body.dataset.previewLocale = preview.locale ?? '';

    // 推迟标记 previewReady，使无头截图在布局 effect 冲刷后再读取布局。
    const frameId = requestAnimationFrame(() => {
      document.body.dataset.previewReady = '1';
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [pathname, preview.enabled, preview.locale]);

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
