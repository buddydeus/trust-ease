import { router } from 'expo-router';

import React from 'react';

import { useI18n } from '../../i18n';
import { MyScreen } from '../../pages/my/MyScreen';
import { loadConfiguredBundledSkinPackages } from '../../skin';
import { useAppStore } from '../../store';

/** 预留给个人页深链扩展，无需改动 `MyScreen` props 形状。 */
export interface IMyRouteProps {}

/**
 * 「我的」Tab 路由：语言操作、皮肤选择数据与跳转。
 *
 * @returns 已 memo 的我的页路由元素。
 */
const MyRoute = React.memo<IMyRouteProps>(() => {
  const { getMessage, setManualLocale, useSystemLocale } = useI18n();

  const activeSkinId = useAppStore(state => state.activeSkinId);
  const skinInitStatus = useAppStore(state => state.skinInitStatus);
  const skinInitUsedFallback = useAppStore(
    state => state.skinInitUsedFallback
  );
  const skinPackageStates = useAppStore(state => state.skinPackageStates);
  const setActiveSkinId = useAppStore(state => state.setActiveSkinId);

  const copy = {
    title: getMessage('my.title'),
    statusLabel: getMessage('my.statusLabel'),
    statusValue: getMessage('my.statusValue'),
    triggerStateTitle: getMessage('my.triggerStateTitle'),
    triggerStateSummary: getMessage('my.triggerStateSummary'),
    identityTitle: getMessage('my.identityTitle'),
    identitySummary: getMessage('my.identitySummary'),
    languageTitle: getMessage('my.languageTitle'),
    languageSummary: getMessage('my.languageSummary'),
    skinTitle: getMessage('my.skinTitle'),
    skinSummary: getMessage('my.skinSummary'),
    skinPickerOpen: getMessage('my.skinPickerOpen'),
    skinPickerClose: getMessage('my.skinPickerClose'),
    skinCurrent: getMessage('my.skinCurrent'),
    skinUpgradeRequired: getMessage('my.skinUpgradeRequired'),
    skinUnavailable: getMessage('my.skinUnavailable'),
    skinRuntimeTitle: getMessage('my.skinRuntimeTitle'),
    skinRuntimeActive: getMessage('my.skinRuntimeActive'),
    skinRuntimeInitStatus: getMessage('my.skinRuntimeInitStatus'),
    skinRuntimeFallback: getMessage('my.skinRuntimeFallback'),
    skinRuntimePackageStates: getMessage('my.skinRuntimePackageStates'),
    skinRuntimeStatusIdle: getMessage('my.skinRuntimeStatusIdle'),
    skinRuntimeStatusInitializing: getMessage(
      'my.skinRuntimeStatusInitializing'
    ),
    skinRuntimeStatusReady: getMessage('my.skinRuntimeStatusReady'),
    skinRuntimeStatusFallback: getMessage('my.skinRuntimeStatusFallback'),
    skinRuntimeStatusFailed: getMessage('my.skinRuntimeStatusFailed'),
    skinPackageStateIdle: getMessage('my.skinPackageStateIdle'),
    skinPackageStateChecking: getMessage('my.skinPackageStateChecking'),
    skinPackageStateDownloading: getMessage('my.skinPackageStateDownloading'),
    skinPackageStateReady: getMessage('my.skinPackageStateReady'),
    skinPackageStateFailed: getMessage('my.skinPackageStateFailed'),
    skinPackageStateIncompatible: getMessage('my.skinPackageStateIncompatible'),
    openTriggerState: getMessage('my.openTriggerState'),
    followSystem: getMessage('my.followSystem'),
    simplifiedChinese: getMessage('my.simplifiedChinese'),
    traditionalChinese: getMessage('my.traditionalChinese'),
    english: getMessage('my.english')
  };

  /** 将内置皮肤包映射为「我的」页选择器选项。 */
  const skinOptions = loadConfiguredBundledSkinPackages().map(skinPackage => ({
    skinId: skinPackage.manifest.skinId,
    displayName: skinPackage.manifest.displayName,
    compatibility: skinPackage.compatibility
  }));

  /**
   * 打开堆叠的触发状态设置页。
   *
   * @returns void
   */
  const handleOpenTriggerState = () => {
    router.push('/my/trigger-state');
  };

  return (
    <MyScreen
      copy={copy}
      onOpenTriggerState={handleOpenTriggerState}
      onSetManualLocale={setManualLocale}
      onUseSystemLocale={useSystemLocale}
      activeSkinId={activeSkinId}
      skinRuntimeStatus={{
        activeSkinId,
        skinInitStatus,
        skinInitUsedFallback,
        skinPackageStates
      }}
      skinOptions={skinOptions}
      onSetActiveSkin={setActiveSkinId}
    />
  );
});

MyRoute.displayName = 'MyRoute';

export default MyRoute;
