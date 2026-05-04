import React from 'react';

import { useI18n } from '../../i18n';
import { TriggerStateScreen } from '../../pages/trigger-state/TriggerStateScreen';

/** 预留给将来经导航参数传入的策略开关等。 */
export interface ITriggerStateRouteProps {}

/**
 * 触发状态设置路由：将 i18n 文案接入触发设置页。
 *
 * @returns 已 memo 的触发状态路由元素。
 */
const TriggerStateRoute = React.memo<ITriggerStateRouteProps>(() => {
  const { getMessage } = useI18n();

  const copy = {
    title: getMessage('triggerState.title'),
    currentLabel: getMessage('triggerState.currentLabel'),
    currentValue: getMessage('triggerState.currentValue'),
    missingLabel: getMessage('triggerState.missingLabel'),
    missingToggle: getMessage('triggerState.missingToggle')
  };

  return <TriggerStateScreen copy={copy} />;
});

TriggerStateRoute.displayName = 'TriggerStateRoute';

export default TriggerStateRoute;
