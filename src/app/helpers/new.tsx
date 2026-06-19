import { router, useLocalSearchParams } from 'expo-router';

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

const resolveReturnTo = (value: string | string[] | undefined): string => {
  const rawValue = Array.isArray(value) ? value[0] : value;

  return rawValue === '/items/new' ? rawValue : '/helpers';
};

const NewHelperRoute = memo<INewHelperRouteProps>(() => {
  const { getMessage } = useI18n();
  const params = useLocalSearchParams();
  const returnTo = resolveReturnTo(params.returnTo);

  const copy = {
    title: getMessage('helpers.formTitle'),
    displayNameLabel: getMessage('helpers.displayNameLabel'),
    displayNamePlaceholder: getMessage('helpers.displayNamePlaceholder'),
    relationshipLabel: getMessage('helpers.relationshipLabel'),
    relationshipPlaceholder: getMessage('helpers.relationshipPlaceholder'),
    relationshipSelectPlaceholder: getMessage(
      'helpers.relationshipSelectPlaceholder'
    ),
    relationshipOptions: [
      getMessage('helpers.relationship.family'),
      getMessage('helpers.relationship.friend'),
      getMessage('helpers.relationship.trusted'),
      getMessage('helpers.relationship.special')
    ],
    contactMethodLabel: getMessage('helpers.contactMethodLabel'),
    contactMethodPlaceholder: getMessage('helpers.contactMethodPlaceholder'),
    contactMethodTypes: [
      { type: 'phone', label: getMessage('helpers.contactType.phone') },
      { type: 'email', label: getMessage('helpers.contactType.email') }
    ],
    addContactMethodAction: getMessage('helpers.addContactMethodAction'),
    removeContactMethodAction: getMessage('helpers.removeContactMethodAction'),
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
    router.replace(returnTo as never);
  };

  return (
    <HelperFormScreen
      copy={copy}
      onBack={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
});

NewHelperRoute.displayName = 'NewHelperRoute';

export default NewHelperRoute;
