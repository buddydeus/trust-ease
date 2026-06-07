import {
  createDefaultTrustDataSnapshot,
  deriveLocalReadinessSummary
} from '../../../src/store/trust';

import type {
  ITrustedHelper,
  ITrustDataSnapshot,
  ITrustItem
} from '../../../src/store/trust';

const NOW = '2026-06-05T08:00:00.000Z';

const createItem = (overrides: Partial<ITrustItem> = {}): ITrustItem => ({
  id: 'item-1',
  title: 'Important file',
  kind: 'offline',
  summary: 'Stored at home',
  helperIds: [],
  status: 'active',
  createdAt: NOW,
  updatedAt: NOW,
  ...overrides
});

const createHelper = (
  overrides: Partial<ITrustedHelper> = {}
): ITrustedHelper => ({
  id: 'helper-1',
  displayName: 'Alex',
  relationship: 'Family',
  contactMethod: 'Phone',
  notes: '',
  status: 'active',
  createdAt: NOW,
  updatedAt: NOW,
  ...overrides
});

const createSnapshot = (
  overrides: Partial<ITrustDataSnapshot> = {}
): ITrustDataSnapshot => ({
  ...createDefaultTrustDataSnapshot(),
  ...overrides
});

test('derives local gaps and actions from an empty snapshot', () => {
  const summary = deriveLocalReadinessSummary(createDefaultTrustDataSnapshot());

  expect(summary.status).toBe('empty');
  expect(summary.isLocalOnly).toBe(true);
  expect(summary.counts.activeItemCount).toBe(0);
  expect(summary.counts.activeHelperCount).toBe(0);
  expect(summary.gaps).toEqual([
    'no-active-items',
    'no-active-helpers',
    'trigger-paused-or-not-rehearsed'
  ]);
  expect(summary.nextActions.map(action => action.id)).toEqual([
    'create-item',
    'create-helper',
    'review-trigger-rehearsal'
  ]);
});

test('counts active records and excludes archived records from readiness', () => {
  const snapshot = createSnapshot({
    items: [
      createItem({ id: 'active-item' }),
      createItem({ id: 'archived-item', status: 'archived' })
    ],
    helpers: [
      createHelper({ id: 'active-helper' }),
      createHelper({ id: 'archived-helper', status: 'archived' })
    ]
  });

  const summary = deriveLocalReadinessSummary(snapshot);

  expect(summary.counts.activeItemCount).toBe(1);
  expect(summary.counts.activeHelperCount).toBe(1);
  expect(summary.sections.items.status).toBe('complete');
  expect(summary.sections.helpers.status).toBe('complete');
});

test('uses only active helpers for item assignment coverage', () => {
  const snapshot = createSnapshot({
    items: [
      createItem({ id: 'covered', helperIds: ['active-helper'] }),
      createItem({ id: 'uncovered', helperIds: [] }),
      createItem({
        id: 'archived-only',
        helperIds: ['archived-helper']
      })
    ],
    helpers: [
      createHelper({ id: 'active-helper' }),
      createHelper({ id: 'archived-helper', status: 'archived' })
    ],
    triggerPolicy: {
      ...createDefaultTrustDataSnapshot().triggerPolicy,
      missingStateEnabled: true,
      simulationEnabled: true
    }
  });

  const summary = deriveLocalReadinessSummary(snapshot);

  expect(summary.status).toBe('needs-attention');
  expect(summary.counts.coveredItemCount).toBe(1);
  expect(summary.counts.uncoveredItemCount).toBe(2);
  expect(summary.gaps).toContain('items-without-active-helper');
  expect(summary.nextActions[0].id).toBe('review-item-assignments');
});

test('marks readiness ready for review when local pieces are covered', () => {
  const snapshot = createSnapshot({
    items: [createItem({ helperIds: ['helper-1'] })],
    helpers: [createHelper()],
    triggerPolicy: {
      ...createDefaultTrustDataSnapshot().triggerPolicy,
      missingStateEnabled: true,
      simulationEnabled: true
    }
  });

  const summary = deriveLocalReadinessSummary(snapshot);

  expect(summary.status).toBe('ready-for-review');
  expect(summary.gaps).toEqual([]);
  expect(summary.sections.trigger.status).toBe('complete');
  expect(summary.nextActions.map(action => action.id)).toEqual([
    'review-readiness'
  ]);
});

test('does not mutate the input snapshot', () => {
  const snapshot = createSnapshot({
    items: [createItem({ helperIds: ['helper-1'] })],
    helpers: [createHelper()],
    triggerPolicy: {
      ...createDefaultTrustDataSnapshot().triggerPolicy,
      missingStateEnabled: true,
      simulationEnabled: true
    },
    updatedAt: NOW
  });
  const before = JSON.stringify(snapshot);

  deriveLocalReadinessSummary(snapshot);

  expect(JSON.stringify(snapshot)).toBe(before);
});
