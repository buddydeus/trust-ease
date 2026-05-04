import { router } from 'expo-router';

import React from 'react';

import { useI18n } from '../../i18n';
import { ItemsScreen } from '../../pages/items/ItemsScreen';

/** 预留给将来由路由参数驱动的列表筛选。 */
export interface IItemsRouteProps {}

/**
 * 事项 Tab 路由：注入 i18n 文案并导航至新建流程。
 *
 * @returns 已 memo 的事项路由元素。
 */
const ItemsRoute = React.memo<IItemsRouteProps>(() => {
  const { getMessage } = useI18n();

  const copy = {
    title: getMessage('items.title'),
    createLabel: getMessage('items.createLabel'),
    filterAll: getMessage('items.filterAll'),
    filterOffline: getMessage('items.filterOffline'),
    itemOneTitle: getMessage('items.itemOneTitle'),
    itemOneMeta: getMessage('items.itemOneMeta'),
    itemTwoTitle: getMessage('items.itemTwoTitle'),
    itemTwoMeta: getMessage('items.itemTwoMeta'),
    hint: getMessage('items.hint')
  };

  /**
   * 进入堆叠的新建事项页。
   *
   * @returns void
   */
  const handleCreateItem = () => {
    router.push('/items/new');
  };

  return <ItemsScreen copy={copy} onCreateItem={handleCreateItem} />;
});

ItemsRoute.displayName = 'ItemsRoute';

export default ItemsRoute;
