import {
  createDefaultTrustDataSnapshot,
  deriveTriggerSimulationStatus,
  pauseTriggerPolicy,
  resetTriggerSimulation,
  resumeTriggerPolicy,
  startTriggerSimulation,
  updateTriggerPolicy
} from '../../../src/store/trust';

import type { ITrustDataSnapshot } from '../../../src/store/trust';

const baseSnapshot = (): ITrustDataSnapshot => ({
  ...createDefaultTrustDataSnapshot(),
  items: [
    {
      id: 'item-1',
      title: 'Important document',
      kind: 'offline',
      summary: 'Keep the paper copy available',
      helperIds: ['helper-1'],
      status: 'active',
      createdAt: '2026-06-05T08:00:00.000Z',
      updatedAt: '2026-06-05T08:00:00.000Z'
    }
  ],
  helpers: [
    {
      id: 'helper-1',
      displayName: 'Lin',
      relationship: 'Friend',
      contactMethod: 'phone:13800000000',
      notes: 'Can help review the plan',
      status: 'active',
      createdAt: '2026-06-05T08:00:00.000Z',
      updatedAt: '2026-06-05T08:00:00.000Z'
    }
  ],
  triggerPolicy: {
    missedCheckInThreshold: 3,
    checkInIntervalDays: 1,
    missingStateEnabled: true,
    simulationEnabled: false,
    updatedAt: '2026-06-05T08:00:00.000Z'
  },
  updatedAt: '2026-06-05T08:00:00.000Z'
});

describe('trigger policy mutation helpers', () => {
  test('updates valid trigger policy numbers and preserves unrelated data', () => {
    const snapshot = baseSnapshot();

    const result = updateTriggerPolicy(snapshot, {
      missedCheckInThreshold: 5,
      checkInIntervalDays: 2,
      now: '2026-06-05T09:00:00.000Z'
    });

    expect(result.ok).toBe(true);
    expect(result.snapshot.triggerPolicy).toEqual({
      missedCheckInThreshold: 5,
      checkInIntervalDays: 2,
      missingStateEnabled: true,
      simulationEnabled: false,
      updatedAt: '2026-06-05T09:00:00.000Z'
    });
    expect(result.snapshot.items).toBe(snapshot.items);
    expect(result.snapshot.helpers).toBe(snapshot.helpers);
    expect(result.snapshot.updatedAt).toBe('2026-06-05T09:00:00.000Z');
    expect(snapshot.triggerPolicy.missedCheckInThreshold).toBe(3);
  });

  test('rejects invalid trigger policy numbers without mutation', () => {
    const snapshot = baseSnapshot();

    expect(
      updateTriggerPolicy(snapshot, {
        missedCheckInThreshold: 0,
        checkInIntervalDays: 2,
        now: '2026-06-05T09:00:00.000Z'
      })
    ).toEqual({
      ok: false,
      reason: 'invalid-missed-check-in-threshold',
      snapshot
    });

    expect(
      updateTriggerPolicy(snapshot, {
        missedCheckInThreshold: 3,
        checkInIntervalDays: Number.POSITIVE_INFINITY,
        now: '2026-06-05T09:00:00.000Z'
      })
    ).toEqual({
      ok: false,
      reason: 'invalid-check-in-interval',
      snapshot
    });
  });

  test('pauses and resumes missing-state semantics without touching items or helpers', () => {
    const snapshot = baseSnapshot();

    const paused = pauseTriggerPolicy(snapshot, '2026-06-05T10:00:00.000Z');

    expect(paused.ok).toBe(true);
    expect(paused.snapshot.triggerPolicy).toEqual({
      ...snapshot.triggerPolicy,
      missingStateEnabled: false,
      updatedAt: '2026-06-05T10:00:00.000Z'
    });
    expect(paused.snapshot.items).toBe(snapshot.items);
    expect(paused.snapshot.helpers).toBe(snapshot.helpers);

    const resumed = resumeTriggerPolicy(
      paused.snapshot,
      '2026-06-05T11:00:00.000Z'
    );

    expect(resumed.ok).toBe(true);
    expect(resumed.snapshot.triggerPolicy.missingStateEnabled).toBe(true);
    expect(resumed.snapshot.triggerPolicy.updatedAt).toBe(
      '2026-06-05T11:00:00.000Z'
    );
    expect(resumed.snapshot.items).toBe(snapshot.items);
    expect(resumed.snapshot.helpers).toBe(snapshot.helpers);
  });

  test('starts and resets local simulation without changing plan records', () => {
    const snapshot = baseSnapshot();

    const started = startTriggerSimulation(
      snapshot,
      '2026-06-05T12:00:00.000Z'
    );

    expect(started.ok).toBe(true);
    expect(started.snapshot.triggerPolicy).toEqual({
      ...snapshot.triggerPolicy,
      simulationEnabled: true,
      updatedAt: '2026-06-05T12:00:00.000Z'
    });
    expect(started.snapshot.items).toBe(snapshot.items);
    expect(started.snapshot.helpers).toBe(snapshot.helpers);

    const reset = resetTriggerSimulation(
      started.snapshot,
      '2026-06-05T13:00:00.000Z'
    );

    expect(reset.ok).toBe(true);
    expect(reset.snapshot.triggerPolicy.simulationEnabled).toBe(false);
    expect(reset.snapshot.triggerPolicy.updatedAt).toBe(
      '2026-06-05T13:00:00.000Z'
    );
    expect(reset.snapshot.items).toBe(snapshot.items);
    expect(reset.snapshot.helpers).toBe(snapshot.helpers);
  });
});

describe('trigger simulation status resolver', () => {
  test('derives paused status when missing-state semantics are disabled', () => {
    const status = deriveTriggerSimulationStatus(
      {
        ...baseSnapshot().triggerPolicy,
        missingStateEnabled: false
      },
      { simulatedMissedCheckIns: 0 }
    );

    expect(status).toEqual({
      status: 'paused',
      nextAction: 'resume',
      isLocalOnly: true
    });
  });

  test('derives normal, warning, waiting-confirmation, and review statuses', () => {
    const policy = {
      ...baseSnapshot().triggerPolicy,
      missedCheckInThreshold: 3,
      missingStateEnabled: true,
      simulationEnabled: true
    };

    expect(
      deriveTriggerSimulationStatus(policy, { simulatedMissedCheckIns: 0 })
    ).toMatchObject({
      status: 'normal',
      nextAction: 'run-rehearsal',
      isLocalOnly: true
    });
    expect(
      deriveTriggerSimulationStatus(policy, { simulatedMissedCheckIns: 2 })
    ).toMatchObject({
      status: 'warning',
      nextAction: 'confirm-or-pause',
      isLocalOnly: true
    });
    expect(
      deriveTriggerSimulationStatus(policy, { simulatedMissedCheckIns: 3 })
    ).toMatchObject({
      status: 'waiting-confirmation',
      nextAction: 'review-before-any-escalation',
      isLocalOnly: true
    });
    expect(
      deriveTriggerSimulationStatus(policy, { simulatedMissedCheckIns: 4 })
    ).toEqual({
      status: 'simulated-review',
      nextAction: 'reset-rehearsal',
      isLocalOnly: true
    });
  });
});
