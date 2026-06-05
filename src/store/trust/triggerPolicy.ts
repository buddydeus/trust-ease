import type { ILocalTriggerPolicy, ITrustDataSnapshot } from './types';

export type TriggerPolicyMutationFailureReason =
  | 'invalid-check-in-interval'
  | 'invalid-missed-check-in-threshold';

export type TriggerSimulationStatus =
  | 'normal'
  | 'paused'
  | 'warning'
  | 'waiting-confirmation'
  | 'simulated-review';

export type TriggerSimulationNextAction =
  | 'resume'
  | 'run-rehearsal'
  | 'confirm-or-pause'
  | 'review-before-any-escalation'
  | 'reset-rehearsal';

export interface IUpdateTriggerPolicyInput {
  missedCheckInThreshold: number;
  checkInIntervalDays: number;
  now: string;
}

export interface ITriggerSimulationInput {
  simulatedMissedCheckIns: number;
}

export interface ITriggerSimulationViewModel {
  status: TriggerSimulationStatus;
  nextAction: TriggerSimulationNextAction;
  isLocalOnly: true;
}

export type TriggerPolicyMutationResult =
  | {
      ok: true;
      snapshot: ITrustDataSnapshot;
      triggerPolicy: ILocalTriggerPolicy;
    }
  | {
      ok: false;
      reason: TriggerPolicyMutationFailureReason;
      snapshot: ITrustDataSnapshot;
    };

const isPositiveFiniteNumber = (value: number): boolean =>
  Number.isFinite(value) && value > 0;

const updatePolicy = (
  snapshot: ITrustDataSnapshot,
  policy: ILocalTriggerPolicy,
  now: string
): TriggerPolicyMutationResult => ({
  ok: true,
  triggerPolicy: policy,
  snapshot: {
    ...snapshot,
    triggerPolicy: policy,
    updatedAt: now
  }
});

export const updateTriggerPolicy = (
  snapshot: ITrustDataSnapshot,
  input: IUpdateTriggerPolicyInput
): TriggerPolicyMutationResult => {
  if (!isPositiveFiniteNumber(input.missedCheckInThreshold)) {
    return {
      ok: false,
      reason: 'invalid-missed-check-in-threshold',
      snapshot
    };
  }

  if (!isPositiveFiniteNumber(input.checkInIntervalDays)) {
    return {
      ok: false,
      reason: 'invalid-check-in-interval',
      snapshot
    };
  }

  return updatePolicy(
    snapshot,
    {
      ...snapshot.triggerPolicy,
      missedCheckInThreshold: input.missedCheckInThreshold,
      checkInIntervalDays: input.checkInIntervalDays,
      updatedAt: input.now
    },
    input.now
  );
};

export const pauseTriggerPolicy = (
  snapshot: ITrustDataSnapshot,
  now: string
): TriggerPolicyMutationResult =>
  updatePolicy(
    snapshot,
    {
      ...snapshot.triggerPolicy,
      missingStateEnabled: false,
      updatedAt: now
    },
    now
  );

export const resumeTriggerPolicy = (
  snapshot: ITrustDataSnapshot,
  now: string
): TriggerPolicyMutationResult =>
  updatePolicy(
    snapshot,
    {
      ...snapshot.triggerPolicy,
      missingStateEnabled: true,
      updatedAt: now
    },
    now
  );

export const startTriggerSimulation = (
  snapshot: ITrustDataSnapshot,
  now: string
): TriggerPolicyMutationResult =>
  updatePolicy(
    snapshot,
    {
      ...snapshot.triggerPolicy,
      simulationEnabled: true,
      updatedAt: now
    },
    now
  );

export const resetTriggerSimulation = (
  snapshot: ITrustDataSnapshot,
  now: string
): TriggerPolicyMutationResult =>
  updatePolicy(
    snapshot,
    {
      ...snapshot.triggerPolicy,
      simulationEnabled: false,
      updatedAt: now
    },
    now
  );

export const deriveTriggerSimulationStatus = (
  policy: ILocalTriggerPolicy,
  input: ITriggerSimulationInput
): ITriggerSimulationViewModel => {
  if (!policy.missingStateEnabled) {
    return {
      status: 'paused',
      nextAction: 'resume',
      isLocalOnly: true
    };
  }

  if (input.simulatedMissedCheckIns > policy.missedCheckInThreshold) {
    return {
      status: 'simulated-review',
      nextAction: 'reset-rehearsal',
      isLocalOnly: true
    };
  }

  if (input.simulatedMissedCheckIns === policy.missedCheckInThreshold) {
    return {
      status: 'waiting-confirmation',
      nextAction: 'review-before-any-escalation',
      isLocalOnly: true
    };
  }

  if (input.simulatedMissedCheckIns >= policy.missedCheckInThreshold - 1) {
    return {
      status: 'warning',
      nextAction: 'confirm-or-pause',
      isLocalOnly: true
    };
  }

  return {
    status: 'normal',
    nextAction: 'run-rehearsal',
    isLocalOnly: true
  };
};
