import type { ITrustedHelper, ITrustDataSnapshot, ITrustItem } from './types';

export const getActiveTrustItems = (
  snapshot: ITrustDataSnapshot
): ITrustItem[] => snapshot.items.filter(item => item.status === 'active');

export const getArchivedTrustItems = (
  snapshot: ITrustDataSnapshot
): ITrustItem[] => snapshot.items.filter(item => item.status === 'archived');

export const getActiveTrustedHelpers = (
  snapshot: ITrustDataSnapshot
): ITrustedHelper[] =>
  snapshot.helpers.filter(helper => helper.status === 'active');
