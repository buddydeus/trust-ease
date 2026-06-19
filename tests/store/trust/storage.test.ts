import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  TRUST_DATA_SCHEMA_VERSION,
  clearTrustDataSnapshot,
  createDefaultTrustDataSnapshot,
  getActiveTrustedHelpers,
  getActiveTrustItems,
  getArchivedTrustItems,
  loadTrustDataSnapshot,
  saveTrustDataSnapshot
} from '../../../src/store/trust';
import type { ITrustDataSnapshot } from '../../../src/store/trust';

const STORAGE_KEY = 'trust-ease:trust-data:v1';

const createValidSnapshot = (): ITrustDataSnapshot => ({
  schemaVersion: TRUST_DATA_SCHEMA_VERSION,
  items: [
    {
      id: 'item-active',
      title: '宠物照料',
      kind: 'offline',
      summary: '把猫交给信任的人照看',
      helperIds: ['helper-active'],
      status: 'active',
      createdAt: '2026-06-05T00:00:00.000Z',
      updatedAt: '2026-06-05T00:00:00.000Z'
    },
    {
      id: 'item-archived',
      title: '旧事项',
      kind: 'online',
      summary: '已不再需要的安排',
      helperIds: ['helper-archived'],
      status: 'archived',
      createdAt: '2026-06-04T00:00:00.000Z',
      updatedAt: '2026-06-04T00:00:00.000Z'
    }
  ],
  helpers: [
    {
      id: 'helper-active',
      displayName: '林杉',
      relationship: '朋友',
      contactMethod: 'phone:13800000000',
      contactMethods: [
        {
          type: 'phone',
          value: '13800000000'
        },
        {
          type: 'email',
          value: 'lin@example.com'
        }
      ],
      notes: '优先联系',
      status: 'active',
      createdAt: '2026-06-05T00:00:00.000Z',
      updatedAt: '2026-06-05T00:00:00.000Z'
    },
    {
      id: 'helper-archived',
      displayName: '旧联系人',
      relationship: '同事',
      contactMethod: 'email:old@example.com',
      notes: '不再使用',
      status: 'archived',
      createdAt: '2026-06-04T00:00:00.000Z',
      updatedAt: '2026-06-04T00:00:00.000Z'
    }
  ],
  triggerPolicy: {
    missedCheckInThreshold: 3,
    checkInIntervalDays: 1,
    missingStateEnabled: false,
    simulationEnabled: false,
    updatedAt: '2026-06-05T00:00:00.000Z'
  },
  updatedAt: '2026-06-05T00:00:00.000Z'
});

describe('local trust data storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test('returns a complete default snapshot when storage is empty', async () => {
    await expect(loadTrustDataSnapshot()).resolves.toEqual(
      createDefaultTrustDataSnapshot()
    );
  });

  test('returns a default snapshot for malformed JSON without throwing', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, '{not-json');

    await expect(loadTrustDataSnapshot()).resolves.toEqual(
      createDefaultTrustDataSnapshot()
    );
  });

  test('returns a default snapshot for structurally invalid storage', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: TRUST_DATA_SCHEMA_VERSION,
        items: 'not-an-array',
        helpers: [],
        triggerPolicy: {}
      })
    );

    await expect(loadTrustDataSnapshot()).resolves.toEqual(
      createDefaultTrustDataSnapshot()
    );
  });

  test('round-trips a valid local trust snapshot', async () => {
    const snapshot = createValidSnapshot();

    await saveTrustDataSnapshot(snapshot);

    await expect(loadTrustDataSnapshot()).resolves.toEqual(snapshot);
  });

  test('returns a default snapshot for unsupported future versions', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...createValidSnapshot(),
        schemaVersion: TRUST_DATA_SCHEMA_VERSION + 1
      })
    );

    await expect(loadTrustDataSnapshot()).resolves.toEqual(
      createDefaultTrustDataSnapshot()
    );
  });

  test('filters active and archived records without mutating the snapshot', () => {
    const snapshot = createValidSnapshot();

    expect(getActiveTrustItems(snapshot).map(item => item.id)).toEqual([
      'item-active'
    ]);
    expect(getArchivedTrustItems(snapshot).map(item => item.id)).toEqual([
      'item-archived'
    ]);
    expect(getActiveTrustedHelpers(snapshot).map(helper => helper.id)).toEqual([
      'helper-active'
    ]);
    expect(snapshot.items).toHaveLength(2);
    expect(snapshot.helpers).toHaveLength(2);
  });

  test('clears the persisted local trust snapshot', async () => {
    await saveTrustDataSnapshot(createValidSnapshot());

    await clearTrustDataSnapshot();

    await expect(loadTrustDataSnapshot()).resolves.toEqual(
      createDefaultTrustDataSnapshot()
    );
  });
});
