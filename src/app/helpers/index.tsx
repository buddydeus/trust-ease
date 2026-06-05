import { router } from 'expo-router';

import React from 'react';

import { useI18n } from '../../i18n';
import {
  HelpersScreen,
  type IHelpersScreenHelper
} from '../../pages/helpers/HelpersScreen';
import {
  archiveTrustedHelper,
  getActiveTrustedHelpers,
  loadTrustDataSnapshot,
  saveTrustDataSnapshot
} from '../../store/trust';

import type { ITrustDataSnapshot } from '../../store/trust';

export interface IHelpersRouteProps {}

const HelpersRoute = React.memo<IHelpersRouteProps>(() => {
  const { getMessage } = useI18n();
  const [snapshot, setSnapshot] =
    React.useState<ITrustDataSnapshot | null>(null);

  const copy = {
    title: getMessage('helpers.title'),
    createLabel: getMessage('helpers.createLabel'),
    emptyTitle: getMessage('helpers.emptyTitle'),
    emptyBody: getMessage('helpers.emptyBody'),
    localOnlyNotice: getMessage('helpers.localOnlyNotice'),
    editAction: getMessage('helpers.editAction'),
    archiveAction: getMessage('helpers.archiveAction')
  };

  React.useEffect(() => {
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

  const helpers = React.useMemo<IHelpersScreenHelper[]>(
    () =>
      snapshot
        ? getActiveTrustedHelpers(snapshot).map(helper => ({
            id: helper.id,
            displayName: helper.displayName,
            relationship: helper.relationship,
            contactMethod: helper.contactMethod,
            notes: helper.notes
          }))
        : [],
    [snapshot]
  );

  const handleCreateHelper = () => {
    router.push('/helpers/new' as never);
  };

  const handleEditHelper = (helperId: string) => {
    router.push({
      pathname: '/helpers/[id]',
      params: { id: helperId }
    } as never);
  };

  const handleArchiveHelper = async (helperId: string) => {
    const currentSnapshot = snapshot || (await loadTrustDataSnapshot());
    const result = archiveTrustedHelper(
      currentSnapshot,
      helperId,
      new Date().toISOString()
    );

    if (!result.ok) {
      return;
    }

    await saveTrustDataSnapshot(result.snapshot);
    setSnapshot(result.snapshot);
  };

  return (
    <HelpersScreen
      copy={copy}
      helpers={helpers}
      onArchiveHelper={handleArchiveHelper}
      onCreateHelper={handleCreateHelper}
      onEditHelper={handleEditHelper}
    />
  );
});

HelpersRoute.displayName = 'HelpersRoute';

export default HelpersRoute;
