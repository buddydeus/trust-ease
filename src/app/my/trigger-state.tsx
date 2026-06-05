import React from 'react';

import { useI18n } from '../../i18n';
import { TriggerStateScreen } from '../../pages/trigger-state/TriggerStateScreen';
import {
  deriveTriggerSimulationStatus,
  loadTrustDataSnapshot,
  pauseTriggerPolicy,
  resetTriggerSimulation,
  resumeTriggerPolicy,
  saveTrustDataSnapshot,
  startTriggerSimulation
} from '../../store/trust';

import type {
  ITriggerStateScreenCopy,
  ITriggerStateScreenViewModel
} from '../../pages/trigger-state/TriggerStateScreen';
import type { ITrustDataSnapshot } from '../../store/trust';

export interface ITriggerStateRouteProps {}

const createViewModel = (
  snapshot: ITrustDataSnapshot
): ITriggerStateScreenViewModel => {
  const { triggerPolicy } = snapshot;
  const status = deriveTriggerSimulationStatus(triggerPolicy, {
    simulatedMissedCheckIns: triggerPolicy.simulationEnabled
      ? triggerPolicy.missedCheckInThreshold
      : 0
  });

  return {
    checkInIntervalDays: triggerPolicy.checkInIntervalDays,
    missedCheckInThreshold: triggerPolicy.missedCheckInThreshold,
    missingStateEnabled: triggerPolicy.missingStateEnabled,
    simulationEnabled: triggerPolicy.simulationEnabled,
    status: status.status,
    nextAction: status.nextAction,
    isLocalOnly: status.isLocalOnly
  };
};

const TriggerStateRoute = React.memo<ITriggerStateRouteProps>(() => {
  const { getMessage } = useI18n();
  const [snapshot, setSnapshot] =
    React.useState<ITrustDataSnapshot | null>(null);

  const copy: ITriggerStateScreenCopy = {
    title: getMessage('triggerState.title'),
    policySummary: getMessage('triggerState.policySummary'),
    checkInIntervalLabel: getMessage('triggerState.checkInIntervalLabel'),
    missedThresholdLabel: getMessage('triggerState.missedThresholdLabel'),
    statusLabel: getMessage('triggerState.statusLabel'),
    nextActionLabel: getMessage('triggerState.nextActionLabel'),
    localOnlyNotice: getMessage('triggerState.localOnlyNotice'),
    actionRehearse: getMessage('triggerState.action.rehearse'),
    actionPause: getMessage('triggerState.action.pause'),
    actionResume: getMessage('triggerState.action.resume'),
    actionReset: getMessage('triggerState.action.reset'),
    statusNormal: getMessage('triggerState.status.normal'),
    statusPaused: getMessage('triggerState.status.paused'),
    statusWarning: getMessage('triggerState.status.warning'),
    statusWaitingConfirmation: getMessage(
      'triggerState.status.waiting-confirmation'
    ),
    statusSimulatedReview: getMessage(
      'triggerState.status.simulated-review'
    ),
    nextActionResume: getMessage('triggerState.nextAction.resume'),
    nextActionRunRehearsal: getMessage(
      'triggerState.nextAction.run-rehearsal'
    ),
    nextActionConfirmOrPause: getMessage(
      'triggerState.nextAction.confirm-or-pause'
    ),
    nextActionReviewBeforeAnyEscalation: getMessage(
      'triggerState.nextAction.review-before-any-escalation'
    ),
    nextActionResetRehearsal: getMessage(
      'triggerState.nextAction.reset-rehearsal'
    )
  };

  React.useEffect(() => {
    let mounted = true;

    loadTrustDataSnapshot().then(loadedSnapshot => {
      if (mounted) {
        setSnapshot(loadedSnapshot);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const applySnapshotMutation = async (
    mutate: (
      currentSnapshot: ITrustDataSnapshot,
      now: string
    ) => { ok: true; snapshot: ITrustDataSnapshot } | { ok: false }
  ) => {
    const currentSnapshot = snapshot || (await loadTrustDataSnapshot());
    const result = mutate(currentSnapshot, new Date().toISOString());

    if (!result.ok) {
      return;
    }

    await saveTrustDataSnapshot(result.snapshot);
    setSnapshot(result.snapshot);
  };

  return (
    <TriggerStateScreen
      copy={copy}
      viewModel={snapshot ? createViewModel(snapshot) : undefined}
      onPause={() => applySnapshotMutation(pauseTriggerPolicy)}
      onResetSimulation={() =>
        applySnapshotMutation(resetTriggerSimulation)
      }
      onResume={() => applySnapshotMutation(resumeTriggerPolicy)}
      onStartSimulation={() =>
        applySnapshotMutation(startTriggerSimulation)
      }
    />
  );
});

TriggerStateRoute.displayName = 'TriggerStateRoute';

export default TriggerStateRoute;
