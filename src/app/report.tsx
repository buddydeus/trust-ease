import { router } from 'expo-router';

import { memo, useCallback } from 'react';

import { useI18n } from '../i18n';
import { ReportScreen } from '../pages/report/ReportScreen';
import { applyFormalReport, useAppStore } from '../store';

/** 与其它路由保持一致的 memo 占位 props。 */
export interface IReportRouteProps {}

/**
 * 每日申报路由：绑定本地化文案与报平安副作用。
 *
 * @returns 已 memo 的申报路由元素。
 */
const ReportRoute = memo<IReportRouteProps>(() => {
  const { getMessage } = useI18n();
  const lastReportedAt = useAppStore(state => state.homeSummary.lastReportedAt);

  const copy = {
    brand: getMessage('welcome.brand'),
    firstEntryLabel: getMessage('dailyReport.firstEntryLabel'),
    statusPending: getMessage('dailyReport.status.pending'),
    statusCompleted: getMessage('dailyReport.status.completed'),
    title: getMessage('dailyReport.title'),
    description: getMessage('dailyReport.description'),
    lastReportLabel: getMessage('dailyReport.lastReport'),
    waitingLabel: getMessage('dailyReport.waiting'),
    noLastReport: getMessage('dailyReport.noLastReport'),
    primaryButton: getMessage('dailyReport.primaryAction'),
    secondaryButton: getMessage('dailyReport.secondaryAction'),
    footerNote: getMessage('dailyReport.footerNote')
  };

  const handleSubmit = useCallback(async () => {
    await applyFormalReport(new Date().toISOString());
    // 使用 replace 避免用户多次申报时堆叠重复的首页历史记录。
    router.replace('/(tabs)/home');
  }, []);

  const handleSecondaryAction = useCallback(() => {
    router.replace('/(tabs)/home');
  }, []);

  return (
    <ReportScreen
      copy={copy}
      lastReportedAt={lastReportedAt}
      onSecondaryAction={handleSecondaryAction}
      onSubmit={handleSubmit}
    />
  );
});

ReportRoute.displayName = 'ReportRoute';

export default ReportRoute;
