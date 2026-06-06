import { getActiveTrustedHelpers, getActiveTrustItems } from './selectors';
import type { ITrustDataSnapshot } from './types';

export type LocalReadinessStatus =
  | 'empty'
  | 'needs-attention'
  | 'ready-for-review';

export type LocalReadinessSectionStatus = 'complete' | 'needs-action';

export type LocalReadinessGap =
  | 'no-active-items'
  | 'no-active-helpers'
  | 'items-without-active-helper'
  | 'trigger-paused-or-not-rehearsed';

export type LocalReadinessNextAction =
  | 'create-item'
  | 'create-helper'
  | 'review-item-assignments'
  | 'review-trigger-rehearsal'
  | 'review-readiness';

export interface ILocalReadinessCounts {
  activeItemCount: number;
  activeHelperCount: number;
  coveredItemCount: number;
  uncoveredItemCount: number;
}

export interface ILocalReadinessSection {
  status: LocalReadinessSectionStatus;
}

export interface ILocalReadinessNextAction {
  id: LocalReadinessNextAction;
}

export interface ILocalReadinessSummary {
  status: LocalReadinessStatus;
  counts: ILocalReadinessCounts;
  gaps: LocalReadinessGap[];
  nextActions: ILocalReadinessNextAction[];
  sections: {
    items: ILocalReadinessSection;
    helpers: ILocalReadinessSection;
    assignments: ILocalReadinessSection;
    trigger: ILocalReadinessSection;
  };
  isLocalOnly: true;
}

const createSection = (complete: boolean): ILocalReadinessSection => ({
  status: complete ? 'complete' : 'needs-action'
});

const mapGapsToActions = (
  gaps: LocalReadinessGap[]
): ILocalReadinessNextAction[] => {
  const actions: ILocalReadinessNextAction[] = [];

  if (gaps.includes('items-without-active-helper')) {
    actions.push({ id: 'review-item-assignments' });
  }

  if (gaps.includes('no-active-items')) {
    actions.push({ id: 'create-item' });
  }

  if (gaps.includes('no-active-helpers')) {
    actions.push({ id: 'create-helper' });
  }

  if (gaps.includes('trigger-paused-or-not-rehearsed')) {
    actions.push({ id: 'review-trigger-rehearsal' });
  }

  return actions.length > 0 ? actions : [{ id: 'review-readiness' }];
};

export const deriveLocalReadinessSummary = (
  snapshot: ITrustDataSnapshot
): ILocalReadinessSummary => {
  const activeItems = getActiveTrustItems(snapshot);
  const activeHelpers = getActiveTrustedHelpers(snapshot);
  const activeHelperIds = new Set(activeHelpers.map(helper => helper.id));
  const coveredItemCount = activeItems.filter(item =>
    item.helperIds.some(helperId => activeHelperIds.has(helperId))
  ).length;
  const uncoveredItemCount = activeItems.length - coveredItemCount;
  const triggerComplete =
    snapshot.triggerPolicy.missingStateEnabled &&
    snapshot.triggerPolicy.simulationEnabled;
  const gaps: LocalReadinessGap[] = [];

  if (activeItems.length === 0) {
    gaps.push('no-active-items');
  }

  if (activeHelpers.length === 0) {
    gaps.push('no-active-helpers');
  }

  if (activeItems.length > 0 && uncoveredItemCount > 0) {
    gaps.push('items-without-active-helper');
  }

  if (!triggerComplete) {
    gaps.push('trigger-paused-or-not-rehearsed');
  }

  const status: LocalReadinessStatus =
    activeItems.length === 0 && activeHelpers.length === 0
      ? 'empty'
      : gaps.length === 0
        ? 'ready-for-review'
        : 'needs-attention';

  return {
    status,
    gaps,
    nextActions: mapGapsToActions(gaps),
    counts: {
      activeItemCount: activeItems.length,
      activeHelperCount: activeHelpers.length,
      coveredItemCount,
      uncoveredItemCount
    },
    sections: {
      items: createSection(activeItems.length > 0),
      helpers: createSection(activeHelpers.length > 0),
      assignments: createSection(
        activeItems.length > 0 && uncoveredItemCount === 0
      ),
      trigger: createSection(triggerComplete)
    },
    isLocalOnly: true
  };
};
