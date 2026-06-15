import { Redirect } from 'expo-router';

import { memo, useEffect, useState } from 'react';

import { loadFormalReportState, loadHasSeenWelcome } from '../store';

/** 与其它 expo-router 文件保持一致的 memo 路由占位 props 类型。 */
export interface IIndexRouteProps {}

/**
 * 应用入口：根据是否完成欢迎流程重定向。
 *
 * @returns 已 memo 的重定向门（加载中为 `null`）。
 */
const IndexRoute = memo<IIndexRouteProps>(() => {
  const [target, setTarget] = useState<
    '/(tabs)/home' | '/report' | '/welcome' | null
  >(null);

  useEffect(() => {
    let active = true;

    const resolveTarget = async (): Promise<void> => {
      const hasSeenWelcome = await loadHasSeenWelcome();

      // 若在 AsyncStorage 异步期间路由已卸载，则忽略迟到的 Promise 结果。
      if (!active) {
        return;
      }

      if (!hasSeenWelcome) {
        setTarget('/welcome');
        return;
      }

      const reportState = await loadFormalReportState();

      if (!active) {
        return;
      }

      setTarget(reportState.isReportedToday ? '/(tabs)/home' : '/report');
    };

    void resolveTarget();

    return () => {
      active = false;
    };
  }, []);

  if (!target) {
    return null;
  }

  return <Redirect href={target} />;
});

IndexRoute.displayName = 'IndexRoute';

export default IndexRoute;
