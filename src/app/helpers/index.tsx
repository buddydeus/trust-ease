import { router } from 'expo-router';

import { memo, useEffect, useMemo, useState } from 'react';

import { useI18n } from '../../i18n';
import {
  HelpersScreen,
  type IHelpersScreenHelper
} from '../../pages/helpers/HelpersScreen';
import {
  type ITrustDataSnapshot,
  archiveTrustedHelper,
  getActiveTrustedHelpers,
  loadTrustDataSnapshot,
  saveTrustDataSnapshot
} from '../../store/trust';

export interface IHelpersRouteProps {}

const HelpersRoute = memo<IHelpersRouteProps>(() => {
  const { getMessage } = useI18n();
  const [snapshot, setSnapshot] = useState<ITrustDataSnapshot | null>(null);

  const copy = {
    title: getMessage('helpers.title'),
    createLabel: getMessage('helpers.createLabel'),
    emptyTitle: getMessage('helpers.emptyTitle'),
    emptyBody: getMessage('helpers.emptyBody'),
    localOnlyNotice: getMessage('helpers.localOnlyNotice'),
    editAction: getMessage('helpers.editAction'),
    archiveAction: getMessage('helpers.archiveAction'),
    ungroupedRelationship: getMessage('helpers.ungroupedRelationship'),
    groupCountLabel: getMessage('helpers.groupCountLabel'),
    contactMethodTypes: {
      phone: getMessage('helpers.contactType.phone'),
      email: getMessage('helpers.contactType.email')
    }
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

  const helpers = useMemo<IHelpersScreenHelper[]>(
    () =>
      snapshot
        ? getActiveTrustedHelpers(snapshot).map(helper => ({
            id: helper.id,
            displayName: helper.displayName,
            relationship: helper.relationship,
            contactMethod: helper.contactMethod,
            contactMethods: helper.contactMethods,
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
      onBack={() => router.back()}
      onCreateHelper={handleCreateHelper}
      onEditHelper={handleEditHelper}
    />
  );
});

HelpersRoute.displayName = 'HelpersRoute';

export default HelpersRoute;
