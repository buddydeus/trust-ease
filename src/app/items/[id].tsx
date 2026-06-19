import { router, useLocalSearchParams } from 'expo-router';

import { memo, useEffect, useState } from 'react';

import { useI18n } from '../../i18n';
import {
  ItemFormScreen,
  type IItemFormValues
} from '../../pages/items/ItemFormScreen';
import {
  type ITrustDataSnapshot,
  getActiveTrustedHelpers,
  loadTrustDataSnapshot,
  saveTrustDataSnapshot,
  updateTrustItem
} from '../../store/trust';

/** 由 Expo Router 注入的编辑事项路由参数。 */
export interface IEditItemRouteParams {
  id?: string | string[];
}

/** 预留给未来由父级路由注入的编辑事项参数。 */
export interface IEditItemRouteProps {}

const resolveRouteItemId = (params: IEditItemRouteParams): string | null => {
  if (Array.isArray(params.id)) {
    return params.id[0] ?? null;
  }

  return params.id ?? null;
};

/**
 * 编辑本地事项路由：读取本地 snapshot 预填表单，并把保存动作写回同一条事项。
 *
 * @returns 已 memo 的编辑事项路由元素。
 */
const EditItemRoute = memo<IEditItemRouteProps>(() => {
  const { getMessage } = useI18n();
  const params = useLocalSearchParams();
  const itemId = resolveRouteItemId({ id: params.id });
  const [snapshot, setSnapshot] = useState<ITrustDataSnapshot | null>(null);

  const copy = {
    title: getMessage('itemForm.title'),
    typeLabel: getMessage('itemForm.typeLabel'),
    titleLabel: getMessage('itemForm.titleLabel'),
    titlePlaceholder: getMessage('itemForm.titlePlaceholder'),
    summaryLabel: getMessage('itemForm.summaryLabel'),
    summaryPlaceholder: getMessage('itemForm.summaryPlaceholder'),
    onlineSummaryLabel: getMessage('itemForm.onlineSummaryLabel'),
    onlineSummaryPlaceholder: getMessage('itemForm.onlineSummaryPlaceholder'),
    offlineTitle: getMessage('itemForm.offlineTitle'),
    offlineSummary: getMessage('itemForm.offlineSummary'),
    onlineTitle: getMessage('itemForm.onlineTitle'),
    onlineSummary: getMessage('itemForm.onlineSummary'),
    stepLabel: getMessage('itemForm.stepLabel'),
    stepValue: getMessage('itemForm.stepValue'),
    helperSectionLabel: getMessage('itemForm.helperSectionLabel'),
    onlineHelperSectionLabel: getMessage('itemForm.onlineHelperSectionLabel'),
    helperEmptyText: getMessage('itemForm.helperEmptyText'),
    addHelperAction: getMessage('itemForm.addHelperAction'),
    onlineTemplateTitle: getMessage('itemForm.onlineTemplateTitle'),
    onlineTemplateBody: getMessage('itemForm.onlineTemplateBody'),
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

  const currentItem = snapshot?.items.find(item => item.id === itemId);
  const initialValues = currentItem
    ? {
        title: currentItem.title,
        kind: currentItem.kind,
        summary: currentItem.summary,
        helperIds: currentItem.helperIds
      }
    : void 0;
  const helperChoices = snapshot
    ? getActiveTrustedHelpers(snapshot).map(helper => ({
        id: helper.id,
        displayName: helper.displayName,
        relationship: helper.relationship
      }))
    : [];

  const handleSubmit = async (values: IItemFormValues) => {
    if (!itemId) {
      return;
    }

    const currentSnapshot = snapshot || (await loadTrustDataSnapshot());
    const result = updateTrustItem(currentSnapshot, itemId, {
      ...values,
      now: new Date().toISOString()
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
      initialValues={initialValues}
      onBack={() => router.back()}
      onCreateHelper={() => router.push('/helpers/new' as never)}
      onSubmit={handleSubmit}
    />
  );
});

EditItemRoute.displayName = 'EditItemRoute';

export default EditItemRoute;
