import { router, useLocalSearchParams } from 'expo-router';

import { memo, useState, useEffect } from 'react';

import { useI18n } from '../../i18n';
import {
  HelperFormScreen,
  type IHelperFormValues
} from '../../pages/helpers/HelperFormScreen';
import {
  type ITrustDataSnapshot,
  loadTrustDataSnapshot,
  saveTrustDataSnapshot,
  updateTrustedHelper
} from '../../store/trust';

export interface IEditHelperRouteParams {
  id?: string | string[];
}

export interface IEditHelperRouteProps {}

const resolveRouteHelperId = (
  params: IEditHelperRouteParams
): string | null => {
  if (Array.isArray(params.id)) {
    return params.id[0] ?? null;
  }

  return params.id ?? null;
};

const EditHelperRoute = memo<IEditHelperRouteProps>(() => {
  const { getMessage } = useI18n();
  const params = useLocalSearchParams();
  const helperId = resolveRouteHelperId({ id: params.id });
  const [snapshot, setSnapshot] = useState<ITrustDataSnapshot | null>(null);

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

  const currentHelper = snapshot?.helpers.find(
    helper => helper.id === helperId
  );
  const initialValues = currentHelper
    ? {
        displayName: currentHelper.displayName,
        relationship: currentHelper.relationship,
        contactMethod: currentHelper.contactMethod,
        contactMethods: currentHelper.contactMethods,
        notes: currentHelper.notes
      }
    : void 0;

  const handleSubmit = async (values: IHelperFormValues) => {
    if (!helperId) {
      return;
    }

    const currentSnapshot = snapshot || (await loadTrustDataSnapshot());
    const result = updateTrustedHelper(currentSnapshot, helperId, {
      ...values,
      now: new Date().toISOString()
    });

    if (!result.ok) {
      return;
    }

    await saveTrustDataSnapshot(result.snapshot);
    router.replace('/helpers' as never);
  };

  return (
    <HelperFormScreen
      copy={copy}
      initialValues={initialValues}
      onBack={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
});

EditHelperRoute.displayName = 'EditHelperRoute';

export default EditHelperRoute;
