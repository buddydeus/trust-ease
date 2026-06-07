import { router, type Href } from 'expo-router';

import { memo, useEffect, useMemo, useState } from 'react';

import { useI18n } from '../../i18n';
import {
  ItemsScreen,
  type IItemsScreenItem
} from '../../pages/items/ItemsScreen';
import {
  type ITrustDataSnapshot,
  archiveTrustItem,
  getActiveTrustItems,
  loadTrustDataSnapshot,
  saveTrustDataSnapshot
} from '../../store/trust';

/** 预留给将来由路由参数驱动的列表筛选。 */
export interface IItemsRouteProps {}

/**
 * 事项 Tab 路由：注入 i18n 文案并导航至新建流程。
 *
 * @returns 已 memo 的事项路由元素。
 */
const ItemsRoute = memo<IItemsRouteProps>(() => {
  const { getMessage } = useI18n();
  const [snapshot, setSnapshot] = useState<ITrustDataSnapshot | null>(null);

  const copy = {
    title: getMessage('items.title'),
    createLabel: getMessage('items.createLabel'),
    filterAll: getMessage('items.filterAll'),
    filterOffline: getMessage('items.filterOffline'),
    itemOneTitle: getMessage('items.itemOneTitle'),
    itemOneMeta: getMessage('items.itemOneMeta'),
    itemTwoTitle: getMessage('items.itemTwoTitle'),
    itemTwoMeta: getMessage('items.itemTwoMeta'),
    hint: getMessage('items.hint'),
    emptyTitle: getMessage('items.emptyTitle'),
    emptyBody: getMessage('items.emptyBody'),
    kindOnline: getMessage('items.kindOnline'),
    editAction: getMessage('items.editAction'),
    archiveAction: getMessage('items.archiveAction')
  };

  useEffect(() => {
    let mounted = true;

    loadTrustDataSnapshot().then(loadedSnapshot => {
      if (mounted) {
        setSnapshot(loadedSnapshot);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const items = useMemo<IItemsScreenItem[]>(
    () =>
      snapshot
        ? getActiveTrustItems(snapshot).map(item => ({
            id: item.id,
            title: item.title,
            kind: item.kind,
            summary: item.summary
          }))
        : [],
    [snapshot]
  );

  /**
   * 进入堆叠的新建事项页。
   *
   * @returns void
   */
  const handleCreateItem = () => {
    router.push('/items/new');
  };

  const handleEditItem = (itemId: string) => {
    router.push({
      pathname: '/items/[id]',
      params: { id: itemId }
    } as unknown as Href);
  };

  const handleArchiveItem = async (itemId: string) => {
    const currentSnapshot = snapshot || (await loadTrustDataSnapshot());
    const result = archiveTrustItem(
      currentSnapshot,
      itemId,
      new Date().toISOString()
    );

    if (!result.ok) {
      return;
    }

    await saveTrustDataSnapshot(result.snapshot);
    setSnapshot(result.snapshot);
  };

  return (
    <ItemsScreen
      copy={copy}
      items={items}
      onArchiveItem={handleArchiveItem}
      onCreateItem={handleCreateItem}
      onEditItem={handleEditItem}
    />
  );
});

ItemsRoute.displayName = 'ItemsRoute';

export default ItemsRoute;
