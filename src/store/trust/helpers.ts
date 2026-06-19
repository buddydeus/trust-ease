import type {
  ITrustedHelper,
  ITrustedHelperContactMethod,
  ITrustDataSnapshot,
  ITrustItem
} from './types';

export type TrustedHelperMutationFailureReason =
  | 'display-name-required'
  | 'contact-method-required'
  | 'not-found';

export type TrustItemHelperAssignmentFailureReason =
  | 'item-not-found'
  | 'helper-not-found'
  | 'helper-archived';

export interface ITrustedHelperInput {
  displayName: string;
  relationship: string;
  contactMethod?: string;
  contactMethods?: ITrustedHelperContactMethod[];
  notes: string;
}

export interface ICreateTrustedHelperInput extends ITrustedHelperInput {
  id: string;
  now: string;
}

export interface IUpdateTrustedHelperInput extends ITrustedHelperInput {
  now: string;
}

export interface IAssignTrustItemHelpersInput {
  helperIds: string[];
  now: string;
}

export type TrustedHelperMutationResult =
  | {
      ok: true;
      snapshot: ITrustDataSnapshot;
      helper: ITrustedHelper;
    }
  | {
      ok: false;
      reason: TrustedHelperMutationFailureReason;
      snapshot: ITrustDataSnapshot;
    };

export type TrustItemHelperAssignmentResult =
  | {
      ok: true;
      snapshot: ITrustDataSnapshot;
      item: ITrustItem;
    }
  | {
      ok: false;
      reason: TrustItemHelperAssignmentFailureReason;
      snapshot: ITrustDataSnapshot;
    };

const splitContactMethodString = (
  value: string
): ITrustedHelperContactMethod => {
  const separatorIndex = value.indexOf(':');

  if (separatorIndex > 0) {
    return {
      type: value.slice(0, separatorIndex).trim() || 'phone',
      value: value.slice(separatorIndex + 1).trim()
    };
  }

  return {
    type: value.includes('@') ? 'email' : 'phone',
    value
  };
};

const trimContactMethodValue = (type: string, value: string): string => {
  const normalizedType = type.trim() || 'phone';
  const normalizedValue = value.trim();
  const separatorIndex = normalizedValue.indexOf(':');

  if (separatorIndex > 0) {
    const prefix = normalizedValue.slice(0, separatorIndex);

    if (prefix === normalizedType) {
      return normalizedValue.slice(separatorIndex + 1).trim();
    }
  }

  return normalizedValue;
};

const buildContactMethodString = (
  method: ITrustedHelperContactMethod
): string => {
  const normalizedValue = method.value.trim();
  const separatorIndex = normalizedValue.indexOf(':');

  if (separatorIndex > 0) {
    const prefix = normalizedValue.slice(0, separatorIndex);

    if (prefix === method.type) {
      return normalizedValue;
    }
  }

  return `${method.type.trim() || 'phone'}:${normalizedValue}`;
};

const normalizeHelperInput = ({
  displayName,
  relationship,
  contactMethod,
  contactMethods,
  notes
}: ITrustedHelperInput):
  | {
      ok: true;
      displayName: string;
      relationship: string;
      contactMethod: string;
      contactMethods: ITrustedHelperContactMethod[];
      notes: string;
    }
  | { ok: false; reason: TrustedHelperMutationFailureReason } => {
  const normalizedDisplayName = displayName.trim();
  const normalizedContactMethods =
    contactMethods
      ?.map(method => ({
        type: method.type.trim() || 'phone',
        value: trimContactMethodValue(method.type, method.value)
      }))
      .filter(method => method.value.length > 0) ?? [];
  const normalizedContactMethod = normalizedContactMethods[0]
    ? buildContactMethodString(normalizedContactMethods[0])
    : '';
  const legacyContactMethod = contactMethod?.trim() ?? '';

  if (!normalizedDisplayName) {
    return { ok: false, reason: 'display-name-required' };
  }

  if (!normalizedContactMethod && !legacyContactMethod) {
    return { ok: false, reason: 'contact-method-required' };
  }

  const resolvedContactMethods =
    normalizedContactMethods.length > 0
      ? normalizedContactMethods
      : [splitContactMethodString(legacyContactMethod)];

  return {
    ok: true,
    displayName: normalizedDisplayName,
    relationship: relationship.trim(),
    contactMethod: normalizedContactMethod || legacyContactMethod,
    contactMethods: resolvedContactMethods,
    notes: notes.trim()
  };
};

const dedupeIds = (ids: string[]): string[] => {
  const seen = new Set<string>();

  return ids.filter(id => {
    if (seen.has(id)) {
      return false;
    }

    seen.add(id);
    return true;
  });
};

export const createTrustedHelper = (
  snapshot: ITrustDataSnapshot,
  input: ICreateTrustedHelperInput
): TrustedHelperMutationResult => {
  const normalized = normalizeHelperInput(input);

  if (!normalized.ok) {
    return {
      ok: false,
      reason: normalized.reason,
      snapshot
    };
  }

  const helper: ITrustedHelper = {
    id: input.id,
    displayName: normalized.displayName,
    relationship: normalized.relationship,
    contactMethod: normalized.contactMethod,
    contactMethods: normalized.contactMethods,
    notes: normalized.notes,
    status: 'active',
    createdAt: input.now,
    updatedAt: input.now
  };

  return {
    ok: true,
    helper,
    snapshot: {
      ...snapshot,
      helpers: [...snapshot.helpers, helper],
      updatedAt: input.now
    }
  };
};

export const updateTrustedHelper = (
  snapshot: ITrustDataSnapshot,
  helperId: string,
  input: IUpdateTrustedHelperInput
): TrustedHelperMutationResult => {
  const helperIndex = snapshot.helpers.findIndex(
    helper => helper.id === helperId
  );

  if (helperIndex === -1) {
    return {
      ok: false,
      reason: 'not-found',
      snapshot
    };
  }

  const normalized = normalizeHelperInput(input);

  if (!normalized.ok) {
    return {
      ok: false,
      reason: normalized.reason,
      snapshot
    };
  }

  const helper: ITrustedHelper = {
    ...snapshot.helpers[helperIndex],
    displayName: normalized.displayName,
    relationship: normalized.relationship,
    contactMethod: normalized.contactMethod,
    contactMethods: normalized.contactMethods,
    notes: normalized.notes,
    updatedAt: input.now
  };
  const helpers = [...snapshot.helpers];
  helpers[helperIndex] = helper;

  return {
    ok: true,
    helper,
    snapshot: {
      ...snapshot,
      helpers,
      updatedAt: input.now
    }
  };
};

export const archiveTrustedHelper = (
  snapshot: ITrustDataSnapshot,
  helperId: string,
  now: string
): TrustedHelperMutationResult => {
  const helperIndex = snapshot.helpers.findIndex(
    helper => helper.id === helperId
  );

  if (helperIndex === -1) {
    return {
      ok: false,
      reason: 'not-found',
      snapshot
    };
  }

  const helper: ITrustedHelper = {
    ...snapshot.helpers[helperIndex],
    status: 'archived',
    updatedAt: now
  };
  const helpers = [...snapshot.helpers];
  helpers[helperIndex] = helper;

  return {
    ok: true,
    helper,
    snapshot: {
      ...snapshot,
      helpers,
      updatedAt: now
    }
  };
};

export const assignTrustItemHelpers = (
  snapshot: ITrustDataSnapshot,
  itemId: string,
  input: IAssignTrustItemHelpersInput
): TrustItemHelperAssignmentResult => {
  const itemIndex = snapshot.items.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    return {
      ok: false,
      reason: 'item-not-found',
      snapshot
    };
  }

  const helperIds = dedupeIds(input.helperIds);

  for (const helperId of helperIds) {
    const helper = snapshot.helpers.find(
      candidate => candidate.id === helperId
    );

    if (!helper) {
      return {
        ok: false,
        reason: 'helper-not-found',
        snapshot
      };
    }

    if (helper.status === 'archived') {
      return {
        ok: false,
        reason: 'helper-archived',
        snapshot
      };
    }
  }

  const item: ITrustItem = {
    ...snapshot.items[itemIndex],
    helperIds,
    updatedAt: input.now
  };
  const items = [...snapshot.items];
  items[itemIndex] = item;

  return {
    ok: true,
    item,
    snapshot: {
      ...snapshot,
      items,
      updatedAt: input.now
    }
  };
};
