import { router } from 'expo-router';

import { memo, useEffect, useMemo, useState } from 'react';

import { useI18n } from '../../i18n';
import {
  ItemFormScreen,
  type IItemFormValues
} from '../../pages/items/ItemFormScreen';
import {
  type ITrustDataSnapshot,
  createTrustItem,
  getActiveTrustedHelpers,
  loadTrustDataSnapshot,
  saveTrustDataSnapshot
} from '../../store/trust';

/** 预留给向导多步后由路由传入的步骤参数。 */
export interface INewItemRouteProps {}

/**
 * 新建事项路由：向表单页注入本地化文案。
 *
 * @returns 已 memo 的新建事项路由元素。
 */
const NewItemRoute = memo<INewItemRouteProps>(() => {
  const { getMessage } = useI18n();
  const [snapshot, setSnapshot] = useState<ITrustDataSnapshot | null>(null);

  const copy = {
    title: getMessage('itemForm.title'),
    typeLabel: getMessage('itemForm.typeLabel'),
    titleLabel: getMessage('itemForm.titleLabel'),
    titlePlaceholder: getMessage('itemForm.titlePlaceholder'),
    summaryLabel: getMessage('itemForm.summaryLabel'),
    summaryPlaceholder: getMessage('itemForm.summaryPlaceholder'),
    offlineTitle: getMessage('itemForm.offlineTitle'),
    offlineSummary: getMessage('itemForm.offlineSummary'),
    onlineTitle: getMessage('itemForm.onlineTitle'),
    onlineSummary: getMessage('itemForm.onlineSummary'),
    stepLabel: getMessage('itemForm.stepLabel'),
    stepValue: getMessage('itemForm.stepValue'),
    saveAction: getMessage('itemForm.saveAction'),
    titleRequired: getMessage('itemForm.titleRequired')
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

  const helperChoices = useMemo(
    () =>
      snapshot
        ? getActiveTrustedHelpers(snapshot).map(helper => ({
            id: helper.id,
            displayName: helper.displayName,
            relationship: helper.relationship
          }))
        : [],
    [snapshot]
  );

  const handleSubmit = async (values: IItemFormValues) => {
    const now = new Date().toISOString();
    const snapshot = await loadTrustDataSnapshot();
    const result = createTrustItem(snapshot, {
      ...values,
      id: `item-${Date.now()}`,
      now
    });

    if (!result.ok) {
      return;
    }

    await saveTrustDataSnapshot(result.snapshot);
    router.replace('/items');
  };

  return (
    <ItemFormScreen
      copy={copy}
      helperChoices={helperChoices}
      onBack={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
});

NewItemRoute.displayName = 'NewItemRoute';

export default NewItemRoute;
