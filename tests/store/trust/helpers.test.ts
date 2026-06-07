import {
  assignTrustItemHelpers,
  archiveTrustedHelper,
  createDefaultTrustDataSnapshot,
  createTrustedHelper,
  updateTrustedHelper
} from '../../../src/store/trust';

import type { ITrustDataSnapshot } from '../../../src/store/trust';

const baseSnapshot = (): ITrustDataSnapshot => ({
  ...createDefaultTrustDataSnapshot(),
  items: [
    {
      id: 'item-1',
      title: '宠物照料',
      kind: 'offline',
      summary: '把猫交给林杉照看',
      helperIds: [],
      status: 'active',
      createdAt: '2026-06-05T08:00:00.000Z',
      updatedAt: '2026-06-05T08:00:00.000Z'
    },
    {
      id: 'item-2',
      title: '资料备份',
      kind: 'online',
      summary: '保持不变',
      helperIds: ['helper-active'],
      status: 'active',
      createdAt: '2026-06-05T08:10:00.000Z',
      updatedAt: '2026-06-05T08:10:00.000Z'
    }
  ],
  helpers: [
    {
      id: 'helper-active',
      displayName: '林杉',
      relationship: '朋友',
      contactMethod: 'phone:13800000000',
      notes: '优先联系',
      status: 'active',
      createdAt: '2026-06-05T08:00:00.000Z',
      updatedAt: '2026-06-05T08:00:00.000Z'
    },
    {
      id: 'helper-archived',
      displayName: '旧联系人',
      relationship: '同事',
      contactMethod: 'email:old@example.com',
      notes: '不再使用',
      status: 'archived',
      createdAt: '2026-06-04T08:00:00.000Z',
      updatedAt: '2026-06-04T08:00:00.000Z'
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

describe('trusted helper mutation helpers', () => {
  test('creates an active helper with durable metadata', () => {
    const snapshot = baseSnapshot();

    const result = createTrustedHelper(snapshot, {
      id: 'helper-new',
      now: '2026-06-05T09:00:00.000Z',
      displayName: '  周宁  ',
      relationship: '  家人  ',
      contactMethod: '  phone:13900000000  ',
      notes: '  可以协助处理宠物照料  '
    });

    expect(result.ok).toBe(true);
    expect(result.helper).toEqual({
      id: 'helper-new',
      displayName: '周宁',
      relationship: '家人',
      contactMethod: 'phone:13900000000',
      notes: '可以协助处理宠物照料',
      status: 'active',
      createdAt: '2026-06-05T09:00:00.000Z',
      updatedAt: '2026-06-05T09:00:00.000Z'
    });
    expect(result.snapshot.helpers).toEqual([
      ...snapshot.helpers,
      result.helper
    ]);
    expect(result.snapshot.items).toBe(snapshot.items);
    expect(result.snapshot.triggerPolicy).toBe(snapshot.triggerPolicy);
    expect(result.snapshot.updatedAt).toBe('2026-06-05T09:00:00.000Z');
    expect(snapshot.helpers).toHaveLength(2);
  });

  test('rejects empty display name and contact method without mutation', () => {
    const snapshot = baseSnapshot();

    expect(
      createTrustedHelper(snapshot, {
        id: 'helper-new',
        now: '2026-06-05T09:00:00.000Z',
        displayName: ' ',
        relationship: '朋友',
        contactMethod: 'phone:13900000000',
        notes: ''
      })
    ).toEqual({
      ok: false,
      reason: 'display-name-required',
      snapshot
    });

    expect(
      createTrustedHelper(snapshot, {
        id: 'helper-new',
        now: '2026-06-05T09:00:00.000Z',
        displayName: '周宁',
        relationship: '朋友',
        contactMethod: ' ',
        notes: ''
      })
    ).toEqual({
      ok: false,
      reason: 'contact-method-required',
      snapshot
    });
  });

  test('updates only the target helper and preserves unrelated data', () => {
    const snapshot = baseSnapshot();

    const result = updateTrustedHelper(snapshot, 'helper-active', {
      now: '2026-06-05T10:00:00.000Z',
      displayName: '林杉更新',
      relationship: '挚友',
      contactMethod: 'email:lin@example.com',
      notes: '先联系此人'
    });

    expect(result.ok).toBe(true);
    expect(result.snapshot.helpers[0]).toEqual({
      id: 'helper-active',
      displayName: '林杉更新',
      relationship: '挚友',
      contactMethod: 'email:lin@example.com',
      notes: '先联系此人',
      status: 'active',
      createdAt: '2026-06-05T08:00:00.000Z',
      updatedAt: '2026-06-05T10:00:00.000Z'
    });
    expect(result.snapshot.helpers[1]).toBe(snapshot.helpers[1]);
    expect(result.snapshot.items).toBe(snapshot.items);
    expect(result.snapshot.triggerPolicy).toBe(snapshot.triggerPolicy);
  });

  test('does not create replacements when updating or archiving missing helpers', () => {
    const snapshot = baseSnapshot();

    expect(
      updateTrustedHelper(snapshot, 'missing', {
        now: '2026-06-05T10:00:00.000Z',
        displayName: '周宁',
        relationship: '朋友',
        contactMethod: 'phone:13900000000',
        notes: ''
      })
    ).toEqual({
      ok: false,
      reason: 'not-found',
      snapshot
    });

    expect(
      archiveTrustedHelper(snapshot, 'missing', '2026-06-05T11:00:00.000Z')
    ).toEqual({
      ok: false,
      reason: 'not-found',
      snapshot
    });
  });

  test('archives a helper without hard deleting it', () => {
    const snapshot = baseSnapshot();

    const result = archiveTrustedHelper(
      snapshot,
      'helper-active',
      '2026-06-05T11:00:00.000Z'
    );

    expect(result.ok).toBe(true);
    expect(result.snapshot.helpers).toHaveLength(2);
    expect(result.snapshot.helpers[0]).toEqual({
      ...snapshot.helpers[0],
      status: 'archived',
      updatedAt: '2026-06-05T11:00:00.000Z'
    });
    expect(result.snapshot.items).toBe(snapshot.items);
    expect(result.snapshot.updatedAt).toBe('2026-06-05T11:00:00.000Z');
  });
});

describe('item helper assignment helper', () => {
  test('assigns active helpers to an item and deduplicates selected ids', () => {
    const snapshot = baseSnapshot();

    const result = assignTrustItemHelpers(snapshot, 'item-1', {
      helperIds: ['helper-active', 'helper-active'],
      now: '2026-06-05T12:00:00.000Z'
    });

    expect(result.ok).toBe(true);
    expect(result.item).toEqual({
      ...snapshot.items[0],
      helperIds: ['helper-active'],
      updatedAt: '2026-06-05T12:00:00.000Z'
    });
    expect(result.snapshot.items[1]).toBe(snapshot.items[1]);
    expect(result.snapshot.helpers).toBe(snapshot.helpers);
    expect(result.snapshot.triggerPolicy).toBe(snapshot.triggerPolicy);
  });

  test('rejects missing items, unknown helpers, and archived helpers', () => {
    const snapshot = baseSnapshot();

    expect(
      assignTrustItemHelpers(snapshot, 'missing', {
        helperIds: ['helper-active'],
        now: '2026-06-05T12:00:00.000Z'
      })
    ).toEqual({
      ok: false,
      reason: 'item-not-found',
      snapshot
    });

    expect(
      assignTrustItemHelpers(snapshot, 'item-1', {
        helperIds: ['helper-missing'],
        now: '2026-06-05T12:00:00.000Z'
      })
    ).toEqual({
      ok: false,
      reason: 'helper-not-found',
      snapshot
    });

    expect(
      assignTrustItemHelpers(snapshot, 'item-1', {
        helperIds: ['helper-archived'],
        now: '2026-06-05T12:00:00.000Z'
      })
    ).toEqual({
      ok: false,
      reason: 'helper-archived',
      snapshot
    });
  });
});
