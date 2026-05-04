import { router } from 'expo-router';

import React, { useCallback } from 'react';

import { useI18n } from '../i18n';
import { WelcomeScreen } from '../pages/welcome/WelcomeScreen';
import { applyFormalReport, saveHasSeenWelcome } from '../store';

/** 预留给将来路由自有 props（如分析 id、深链参数等）。 */
export interface IWelcomeRouteProps {}

/**
 * 首次欢迎路由：串联 i18n、引导持久化与导航。
 *
 * @returns 已 memo 的欢迎路由元素。
 */
const WelcomeRoute = React.memo<IWelcomeRouteProps>(() => {
  const { getMessage } = useI18n();

  const copy = {
    brand: getMessage('welcome.brand'),
    eyebrow: getMessage('welcome.eyebrow'),
    title: getMessage('welcome.title'),
    body: getMessage('welcome.body'),
    primaryButton: getMessage('welcome.primaryButton'),
    bookletRibbon: getMessage('welcome.bookletRibbon'),
    bookletLine1: getMessage('welcome.bookletLine1'),
    bookletLine2: getMessage('welcome.bookletLine2'),
    bookletLine3: getMessage('welcome.bookletLine3')
  };

  const handleStart = useCallback(async () => {
    const reportedAt = new Date().toISOString();

    await saveHasSeenWelcome(true);

    applyFormalReport(reportedAt);

    router.replace('/(tabs)/home');
  }, []);

  return <WelcomeScreen copy={copy} onStart={handleStart} />;
});

WelcomeRoute.displayName = 'WelcomeRoute';

export default WelcomeRoute;
