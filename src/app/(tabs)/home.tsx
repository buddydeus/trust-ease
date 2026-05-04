import React from 'react';

import { useI18n } from '../../i18n';
import { HomeScreen } from '../../pages/home/HomeScreen';
import {
  getPreviewHomeSummary,
  useAppStore,
  usePreviewConfig
} from '../../store';

/** 预留给将来影响首页组件的深链参数。 */
export interface IHomeRouteProps {}

/**
 * 首页 Tab 路由：绑定 store、预览覆盖与本地化文案。
 *
 * @returns 已 memo 的首页路由元素。
 */
const HomeRoute = React.memo<IHomeRouteProps>(() => {
  const homeSummary = useAppStore(state => state.homeSummary);

  const { getMessage } = useI18n();

  const preview = usePreviewConfig();

  const copy = {
    statusLabel: getMessage('home.statusLabel'),
    heroTitle: getMessage('home.heroTitle'),
    streakLabel: getMessage('home.streakLabel'),
    offlineLabel: getMessage('home.offlineLabel'),
    onlineLabel: getMessage('home.onlineLabel')
  };

  const summary = preview.enabled
    ? getPreviewHomeSummary(preview.homeState)
    : homeSummary;

  return <HomeScreen copy={copy} summary={summary} />;
});

HomeRoute.displayName = 'HomeRoute';

export default HomeRoute;
