import { router } from 'expo-router';

import { memo } from 'react';

import { useI18n } from '../../i18n';
import {
  HelperFormScreen,
  type IHelperFormValues
} from '../../pages/helpers/HelperFormScreen';
import {
  createTrustedHelper,
  loadTrustDataSnapshot,
  saveTrustDataSnapshot
} from '../../store/trust';

export interface INewHelperRouteProps {}

const NewHelperRoute = memo<INewHelperRouteProps>(() => {
  const { getMessage } = useI18n();

  const copy = {
    title: getMessage('helpers.formTitle'),
    displayNameLabel: getMessage('helpers.displayNameLabel'),
    displayNamePlaceholder: getMessage('helpers.displayNamePlaceholder'),
    relationshipLabel: getMessage('helpers.relationshipLabel'),
    relationshipPlaceholder: getMessage('helpers.relationshipPlaceholder'),
    contactMethodLabel: getMessage('helpers.contactMethodLabel'),
    contactMethodPlaceholder: getMessage('helpers.contactMethodPlaceholder'),
    notesLabel: getMessage('helpers.notesLabel'),
    notesPlaceholder: getMessage('helpers.notesPlaceholder'),
    localOnlyNotice: getMessage('helpers.localOnlyNotice'),
    saveAction: getMessage('helpers.saveAction'),
    displayNameRequired: getMessage('helpers.displayNameRequired'),
    contactMethodRequired: getMessage('helpers.contactMethodRequired')
  };

  const handleSubmit = async (values: IHelperFormValues) => {
    const now = new Date().toISOString();
    const snapshot = await loadTrustDataSnapshot();
    const result = createTrustedHelper(snapshot, {
      ...values,
      id: `helper-${Date.now()}`,
      now
    });

    if (!result.ok) {
      return;
    }

    await saveTrustDataSnapshot(result.snapshot);
    router.replace('/helpers' as never);
  };

  return <HelperFormScreen copy={copy} onSubmit={handleSubmit} />;
});

NewHelperRoute.displayName = 'NewHelperRoute';

export default NewHelperRoute;
