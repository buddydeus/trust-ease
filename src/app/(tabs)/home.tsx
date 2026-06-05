import React from 'react';

import { router } from 'expo-router';

import { useI18n } from '../../i18n';
import { HomeScreen } from '../../pages/home/HomeScreen';
import {
  deriveLocalReadinessSummary,
  getPreviewHomeSummary,
  loadTrustDataSnapshot,
  useAppStore,
  usePreviewConfig
} from '../../store';

import type {
  ITrustDataSnapshot,
  LocalReadinessNextAction
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
  const [trustSnapshot, setTrustSnapshot] =
    React.useState<ITrustDataSnapshot | null>(null);

  const { getMessage } = useI18n();

  const preview = usePreviewConfig();

  const copy = {
    statusLabel: getMessage('home.statusLabel'),
    heroTitle: getMessage('home.heroTitle'),
    streakLabel: getMessage('home.streakLabel'),
    offlineLabel: getMessage('home.offlineLabel'),
    onlineLabel: getMessage('home.onlineLabel')
  };
  const readiness = trustSnapshot
    ? deriveLocalReadinessSummary(trustSnapshot)
    : null;
  const readinessCounts = readiness?.counts ?? {
    activeItemCount: 0,
    activeHelperCount: 0,
    coveredItemCount: 0,
    uncoveredItemCount: 0
  };
  const readinessCopy = {
    heading: getMessage('home.readiness.heading'),
    statusLabels: {
      empty: getMessage('home.readiness.status.empty'),
      'needs-attention': getMessage('home.readiness.status.needsAttention'),
      'ready-for-review': getMessage('home.readiness.status.readyForReview')
    },
    localOnlyNotice: getMessage('home.readiness.localOnlyNotice'),
    sectionLabels: {
      items: getMessage('home.readiness.section.items'),
      helpers: getMessage('home.readiness.section.helpers'),
      assignments: getMessage('home.readiness.section.assignments'),
      trigger: getMessage('home.readiness.section.trigger')
    },
    sectionStatusLabels: {
      complete: getMessage('home.readiness.sectionStatus.complete'),
      'needs-action': getMessage('home.readiness.sectionStatus.needsAction')
    },
    countLabels: {
      items: getMessage('home.readiness.count.items', {
        fallback: '{count} items'
      }).replace('{count}', String(readinessCounts.activeItemCount)),
      helpers: getMessage('home.readiness.count.helpers', {
        fallback: '{count} helpers'
      }).replace('{count}', String(readinessCounts.activeHelperCount)),
      coverage: getMessage('home.readiness.count.coverage', {
        fallback: '{covered} covered / {uncovered} to review'
      })
        .replace('{covered}', String(readinessCounts.coveredItemCount))
        .replace('{uncovered}', String(readinessCounts.uncoveredItemCount))
    },
    actionLabels: {
      'create-item': getMessage('home.readiness.action.createItem'),
      'create-helper': getMessage('home.readiness.action.createHelper'),
      'review-item-assignments': getMessage(
        'home.readiness.action.reviewAssignments'
      ),
      'review-trigger-rehearsal': getMessage(
        'home.readiness.action.reviewTrigger'
      ),
      'review-readiness': getMessage('home.readiness.action.reviewReadiness')
    }
  };

  const summary = preview.enabled
    ? getPreviewHomeSummary(preview.homeState)
    : homeSummary;

  React.useEffect(() => {
    let mounted = true;

    void loadTrustDataSnapshot().then(snapshot => {
      if (mounted) {
        setTrustSnapshot(snapshot);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleReadinessAction = React.useCallback(
    (action: LocalReadinessNextAction) => {
      if (action === 'create-item') {
        router.push('/items/new');
        return;
      }

      if (action === 'create-helper') {
        router.push('/helpers/new' as never);
        return;
      }

      if (action === 'review-item-assignments') {
        router.push('/items' as never);
        return;
      }

      router.push('/my/trigger-state');
    },
    []
  );

  return (
    <HomeScreen
      copy={copy}
      onReadinessAction={handleReadinessAction}
      readiness={readiness ?? undefined}
      readinessCopy={readinessCopy}
      summary={summary}
    />
  );
});

HomeRoute.displayName = 'HomeRoute';

export default HomeRoute;
