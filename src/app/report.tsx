import { router } from 'expo-router';

import { memo, useCallback } from 'react';

import { useI18n } from '../i18n';
import { ReportScreen } from '../pages/report/ReportScreen';
import { applyFormalReport } from '../store';

/** 与其它路由保持一致的 memo 占位 props。 */
export interface IReportRouteProps {}

/**
 * 每日申报路由：绑定本地化文案与报平安副作用。
 *
 * @returns 已 memo 的申报路由元素。
 */
const ReportRoute = memo<IReportRouteProps>(() => {
  const { getMessage } = useI18n();

  const copy = {
    streakTitle: getMessage('report.streakTitle'),
    body: getMessage('report.body'),
    primaryButton: getMessage('report.primaryButton')
  };

  const handleSubmit = useCallback(() => {
    applyFormalReport(new Date().toISOString());
    // 使用 replace 避免用户多次申报时堆叠重复的首页历史记录。
    router.replace('/(tabs)/home');
  }, []);

  return <ReportScreen copy={copy} onSubmit={handleSubmit} />;
});

ReportRoute.displayName = 'ReportRoute';

export default ReportRoute;
