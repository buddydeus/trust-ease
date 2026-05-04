import React from 'react';

import { useI18n } from '../../i18n';
import { ItemFormScreen } from '../../pages/items/ItemFormScreen';

/** 预留给向导多步后由路由传入的步骤参数。 */
export interface INewItemRouteProps {}

/**
 * 新建事项路由：向表单页注入本地化文案。
 *
 * @returns 已 memo 的新建事项路由元素。
 */
const NewItemRoute = React.memo<INewItemRouteProps>(() => {
  const { getMessage } = useI18n();

  const copy = {
    title: getMessage('itemForm.title'),
    typeLabel: getMessage('itemForm.typeLabel'),
    offlineTitle: getMessage('itemForm.offlineTitle'),
    offlineSummary: getMessage('itemForm.offlineSummary'),
    onlineTitle: getMessage('itemForm.onlineTitle'),
    onlineSummary: getMessage('itemForm.onlineSummary'),
    stepLabel: getMessage('itemForm.stepLabel'),
    stepValue: getMessage('itemForm.stepValue')
  };

  return <ItemFormScreen copy={copy} />;
});

NewItemRoute.displayName = 'NewItemRoute';

export default NewItemRoute;
