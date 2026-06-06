import type { ITrustedHelper, ITrustDataSnapshot, ITrustItem } from './types';

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
  contactMethod: string;
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

const normalizeHelperInput = ({
  displayName,
  relationship,
  contactMethod,
  notes
}: ITrustedHelperInput):
  | {
      ok: true;
      displayName: string;
      relationship: string;
      contactMethod: string;
      notes: string;
    }
  | { ok: false; reason: TrustedHelperMutationFailureReason } => {
  const normalizedDisplayName = displayName.trim();
  const normalizedContactMethod = contactMethod.trim();

  if (!normalizedDisplayName) {
    return { ok: false, reason: 'display-name-required' };
  }

  if (!normalizedContactMethod) {
    return { ok: false, reason: 'contact-method-required' };
  }

  return {
    ok: true,
    displayName: normalizedDisplayName,
    relationship: relationship.trim(),
    contactMethod: normalizedContactMethod,
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
