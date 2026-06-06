import type { ITrustDataSnapshot, ITrustItem, TrustItemKind } from './types';

export type TrustItemMutationFailureReason =
  | 'title-required'
  | 'invalid-kind'
  | 'not-found';

export interface ITrustItemInput {
  title: string;
  kind: string;
  summary: string;
  helperIds?: string[];
}

export interface ICreateTrustItemInput extends ITrustItemInput {
  id: string;
  now: string;
}

export interface IUpdateTrustItemInput extends ITrustItemInput {
  now: string;
}

export type TrustItemMutationResult =
  | {
      ok: true;
      snapshot: ITrustDataSnapshot;
      item: ITrustItem;
    }
  | {
      ok: false;
      reason: TrustItemMutationFailureReason;
      snapshot: ITrustDataSnapshot;
    };

const supportedKinds = new Set<TrustItemKind>(['offline', 'online']);

const normalizeInput = ({
  title,
  kind,
  summary
}: ITrustItemInput):
  | { ok: true; title: string; kind: TrustItemKind; summary: string }
  | { ok: false; reason: TrustItemMutationFailureReason } => {
  const normalizedTitle = title.trim();

  if (!normalizedTitle) {
    return { ok: false, reason: 'title-required' };
  }

  if (!supportedKinds.has(kind as TrustItemKind)) {
    return { ok: false, reason: 'invalid-kind' };
  }

  return {
    ok: true,
    title: normalizedTitle,
    kind: kind as TrustItemKind,
    summary: summary.trim()
  };
};

export const createTrustItem = (
  snapshot: ITrustDataSnapshot,
  input: ICreateTrustItemInput
): TrustItemMutationResult => {
  const normalized = normalizeInput(input);

  if (!normalized.ok) {
    return {
      ok: false,
      reason: normalized.reason,
      snapshot
    };
  }

  const item: ITrustItem = {
    id: input.id,
    title: normalized.title,
    kind: normalized.kind,
    summary: normalized.summary,
    helperIds: input.helperIds ?? [],
    status: 'active',
    createdAt: input.now,
    updatedAt: input.now
  };

  return {
    ok: true,
    item,
    snapshot: {
      ...snapshot,
      items: [...snapshot.items, item],
      updatedAt: input.now
    }
  };
};

export const updateTrustItem = (
  snapshot: ITrustDataSnapshot,
  itemId: string,
  input: IUpdateTrustItemInput
): TrustItemMutationResult => {
  const itemIndex = snapshot.items.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    return {
      ok: false,
      reason: 'not-found',
      snapshot
    };
  }

  const normalized = normalizeInput(input);

  if (!normalized.ok) {
    return {
      ok: false,
      reason: normalized.reason,
      snapshot
    };
  }

  const item: ITrustItem = {
    ...snapshot.items[itemIndex],
    title: normalized.title,
    kind: normalized.kind,
    summary: normalized.summary,
    helperIds: input.helperIds ?? snapshot.items[itemIndex].helperIds,
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

export const archiveTrustItem = (
  snapshot: ITrustDataSnapshot,
  itemId: string,
  now: string
): TrustItemMutationResult => {
  const itemIndex = snapshot.items.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    return {
      ok: false,
      reason: 'not-found',
      snapshot
    };
  }

  const item: ITrustItem = {
    ...snapshot.items[itemIndex],
    status: 'archived',
    updatedAt: now
  };
  const items = [...snapshot.items];
  items[itemIndex] = item;

  return {
    ok: true,
    item,
    snapshot: {
      ...snapshot,
      items,
      updatedAt: now
    }
  };
};
