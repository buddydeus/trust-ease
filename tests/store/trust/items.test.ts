import {
  TRUST_DATA_SCHEMA_VERSION,
  archiveTrustItem,
  createDefaultTrustDataSnapshot,
  createTrustItem,
  updateTrustItem
} from '../../../src/store/trust';
import type { ITrustDataSnapshot } from '../../../src/store/trust';

const baseSnapshot = (): ITrustDataSnapshot => ({
  ...createDefaultTrustDataSnapshot(),
  helpers: [
    {
      id: 'helper-1',
      displayName: '林杉',
      relationship: '朋友',
      contactMethod: 'phone:13800000000',
      notes: '',
      status: 'active',
      createdAt: '2026-06-05T08:00:00.000Z',
      updatedAt: '2026-06-05T08:00:00.000Z'
    }
  ],
  triggerPolicy: {
    missedCheckInThreshold: 4,
    checkInIntervalDays: 2,
    missingStateEnabled: true,
    simulationEnabled: false,
    updatedAt: '2026-06-05T08:00:00.000Z'
  },
  updatedAt: '2026-06-05T08:00:00.000Z'
});

const snapshotWithItem = (): ITrustDataSnapshot => ({
  ...baseSnapshot(),
  items: [
    {
      id: 'item-1',
      title: '原事项',
      kind: 'offline',
      summary: '原摘要',
      helperIds: ['helper-1'],
      status: 'active',
      createdAt: '2026-06-05T08:00:00.000Z',
      updatedAt: '2026-06-05T08:00:00.000Z'
    },
    {
      id: 'item-2',
      title: '另一个事项',
      kind: 'online',
      summary: '保持不变',
      helperIds: [],
      status: 'active',
      createdAt: '2026-06-05T08:10:00.000Z',
      updatedAt: '2026-06-05T08:10:00.000Z'
    }
  ]
});

describe('trust item mutation helpers', () => {
  test('creates an active item with durable metadata', () => {
    const snapshot = baseSnapshot();

    const result = createTrustItem(snapshot, {
      id: 'item-new',
      now: '2026-06-05T09:00:00.000Z',
      title: '  宠物照料  ',
      kind: 'offline',
      summary: '  请联系林杉  '
    });

    expect(result.ok).toBe(true);
    expect(result.snapshot.items).toEqual([
      {
        id: 'item-new',
        title: '宠物照料',
        kind: 'offline',
        summary: '请联系林杉',
        helperIds: [],
        status: 'active',
        createdAt: '2026-06-05T09:00:00.000Z',
        updatedAt: '2026-06-05T09:00:00.000Z'
      }
    ]);
    expect(result.snapshot.helpers).toBe(snapshot.helpers);
    expect(result.snapshot.triggerPolicy).toBe(snapshot.triggerPolicy);
    expect(result.snapshot.updatedAt).toBe('2026-06-05T09:00:00.000Z');
    expect(snapshot.items).toEqual([]);
  });

  test('rejects empty title without mutating the snapshot', () => {
    const snapshot = baseSnapshot();

    const result = createTrustItem(snapshot, {
      id: 'item-new',
      now: '2026-06-05T09:00:00.000Z',
      title: '   ',
      kind: 'offline',
      summary: '摘要'
    });

    expect(result).toEqual({
      ok: false,
      reason: 'title-required',
      snapshot
    });
  });

  test('rejects unsupported item kind without mutating the snapshot', () => {
    const snapshot = baseSnapshot();

    const result = createTrustItem(snapshot, {
      id: 'item-new',
      now: '2026-06-05T09:00:00.000Z',
      title: '事项',
      kind: 'vault',
      summary: '摘要'
    });

    expect(result).toEqual({
      ok: false,
      reason: 'invalid-kind',
      snapshot
    });
  });

  test('updates only the target item and preserves unrelated data', () => {
    const snapshot = snapshotWithItem();

    const result = updateTrustItem(snapshot, 'item-1', {
      now: '2026-06-05T10:00:00.000Z',
      title: '更新事项',
      kind: 'online',
      summary: '更新摘要'
    });

    expect(result.ok).toBe(true);
    expect(result.snapshot).toMatchObject({
      schemaVersion: TRUST_DATA_SCHEMA_VERSION,
      helpers: snapshot.helpers,
      triggerPolicy: snapshot.triggerPolicy,
      updatedAt: '2026-06-05T10:00:00.000Z'
    });
    expect(result.snapshot.items[0]).toEqual({
      id: 'item-1',
      title: '更新事项',
      kind: 'online',
      summary: '更新摘要',
      helperIds: ['helper-1'],
      status: 'active',
      createdAt: '2026-06-05T08:00:00.000Z',
      updatedAt: '2026-06-05T10:00:00.000Z'
    });
    expect(result.snapshot.items[1]).toBe(snapshot.items[1]);
  });

  test('does not create replacements when updating a missing item', () => {
    const snapshot = snapshotWithItem();

    const result = updateTrustItem(snapshot, 'missing', {
      now: '2026-06-05T10:00:00.000Z',
      title: '更新事项',
      kind: 'online',
      summary: '更新摘要'
    });

    expect(result).toEqual({
      ok: false,
      reason: 'not-found',
      snapshot
    });
  });

  test('archives an item without hard deleting it', () => {
    const snapshot = snapshotWithItem();

    const result = archiveTrustItem(
      snapshot,
      'item-1',
      '2026-06-05T11:00:00.000Z'
    );

    expect(result.ok).toBe(true);
    expect(result.snapshot.items).toHaveLength(2);
    expect(result.snapshot.items[0]).toEqual({
      ...snapshot.items[0],
      status: 'archived',
      updatedAt: '2026-06-05T11:00:00.000Z'
    });
    expect(result.snapshot.items[1]).toBe(snapshot.items[1]);
    expect(result.snapshot.updatedAt).toBe('2026-06-05T11:00:00.000Z');
  });
});
