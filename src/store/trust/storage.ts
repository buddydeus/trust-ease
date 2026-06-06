import AsyncStorage from '@react-native-async-storage/async-storage';

import { createDefaultTrustDataSnapshot } from './defaults';
import {
  type ILocalTriggerPolicy,
  type ITrustDataSnapshot,
  type ITrustedHelper,
  type ITrustItem,
  type TrustItemKind,
  type TrustRecordStatus,
  TRUST_DATA_SCHEMA_VERSION
} from './types';

const STORAGE_KEY = 'trust-ease:trust-data:v1';
const recordStatuses = new Set<TrustRecordStatus>(['active', 'archived']);
const itemKinds = new Set<TrustItemKind>(['offline', 'online']);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';

const isNullableString = (value: unknown): value is string | null =>
  value === null || isString(value);

const isPositiveNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean';

const parseStatus = (value: unknown): TrustRecordStatus | null =>
  isString(value) && recordStatuses.has(value as TrustRecordStatus)
    ? (value as TrustRecordStatus)
    : null;

const parseItemKind = (value: unknown): TrustItemKind | null =>
  isString(value) && itemKinds.has(value as TrustItemKind)
    ? (value as TrustItemKind)
    : null;

const parseTrustItem = (value: unknown): ITrustItem | null => {
  if (!isRecord(value)) {
    return null;
  }

  const kind = parseItemKind(value.kind);
  const status = parseStatus(value.status);

  if (
    !isString(value.id) ||
    !isString(value.title) ||
    !kind ||
    !isString(value.summary) ||
    !Array.isArray(value.helperIds) ||
    !value.helperIds.every(isString) ||
    !status ||
    !isString(value.createdAt) ||
    !isString(value.updatedAt)
  ) {
    return null;
  }

  return {
    id: value.id,
    title: value.title,
    kind,
    summary: value.summary,
    helperIds: [...value.helperIds],
    status,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt
  };
};

const parseTrustedHelper = (value: unknown): ITrustedHelper | null => {
  if (!isRecord(value)) {
    return null;
  }

  const status = parseStatus(value.status);

  if (
    !isString(value.id) ||
    !isString(value.displayName) ||
    !isString(value.relationship) ||
    !isString(value.contactMethod) ||
    !isString(value.notes) ||
    !status ||
    !isString(value.createdAt) ||
    !isString(value.updatedAt)
  ) {
    return null;
  }

  return {
    id: value.id,
    displayName: value.displayName,
    relationship: value.relationship,
    contactMethod: value.contactMethod,
    notes: value.notes,
    status,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt
  };
};

const parseTriggerPolicy = (value: unknown): ILocalTriggerPolicy | null => {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !isPositiveNumber(value.missedCheckInThreshold) ||
    !isPositiveNumber(value.checkInIntervalDays) ||
    !isBoolean(value.missingStateEnabled) ||
    !isBoolean(value.simulationEnabled) ||
    !isNullableString(value.updatedAt)
  ) {
    return null;
  }

  return {
    missedCheckInThreshold: value.missedCheckInThreshold,
    checkInIntervalDays: value.checkInIntervalDays,
    missingStateEnabled: value.missingStateEnabled,
    simulationEnabled: value.simulationEnabled,
    updatedAt: value.updatedAt
  };
};

export const parseTrustDataSnapshot = (value: unknown): ITrustDataSnapshot => {
  const defaultSnapshot = createDefaultTrustDataSnapshot();

  if (!isRecord(value) || value.schemaVersion !== TRUST_DATA_SCHEMA_VERSION) {
    return defaultSnapshot;
  }

  if (
    !Array.isArray(value.items) ||
    !Array.isArray(value.helpers) ||
    !isNullableString(value.updatedAt)
  ) {
    return defaultSnapshot;
  }

  const items = value.items.map(parseTrustItem);
  const helpers = value.helpers.map(parseTrustedHelper);
  const triggerPolicy = parseTriggerPolicy(value.triggerPolicy);

  if (
    items.some(item => item === null) ||
    helpers.some(helper => helper === null) ||
    !triggerPolicy
  ) {
    return defaultSnapshot;
  }

  return {
    schemaVersion: TRUST_DATA_SCHEMA_VERSION,
    items: items as ITrustItem[],
    helpers: helpers as ITrustedHelper[],
    triggerPolicy,
    updatedAt: value.updatedAt
  };
};

export const loadTrustDataSnapshot = async (): Promise<ITrustDataSnapshot> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return createDefaultTrustDataSnapshot();
  }

  try {
    return parseTrustDataSnapshot(JSON.parse(raw));
  } catch {
    return createDefaultTrustDataSnapshot();
  }
};

export const saveTrustDataSnapshot = async (
  snapshot: ITrustDataSnapshot
): Promise<void> => {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(parseTrustDataSnapshot(snapshot))
  );
};

export const clearTrustDataSnapshot = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
