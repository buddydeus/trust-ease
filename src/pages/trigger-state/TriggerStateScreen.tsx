import React from 'react';

import { AppScreen } from '../../components';
import { useI18n } from '../../i18n';
import {
  CaptionMutedText,
  CardTitleText,
  ScreenTitleText
} from '../../theme';

import {
  ActionButton,
  ActionGrid,
  ActionLabel,
  LocalOnlyNotice,
  MetricRow,
  MetricValue,
  PolicySummaryCard,
  StatusCard
} from './trigger-state.styled';

export type TriggerStateScreenStatus =
  | 'normal'
  | 'paused'
  | 'warning'
  | 'waiting-confirmation'
  | 'simulated-review';

export type TriggerStateScreenNextAction =
  | 'resume'
  | 'run-rehearsal'
  | 'confirm-or-pause'
  | 'review-before-any-escalation'
  | 'reset-rehearsal';

export interface ITriggerStateScreenViewModel {
  checkInIntervalDays: number;
  missedCheckInThreshold: number;
  missingStateEnabled: boolean;
  simulationEnabled: boolean;
  status: TriggerStateScreenStatus;
  nextAction: TriggerStateScreenNextAction;
  isLocalOnly: boolean;
}

export interface ITriggerStateScreenCopy {
  title: string;
  policySummary: string;
  checkInIntervalLabel: string;
  missedThresholdLabel: string;
  statusLabel: string;
  nextActionLabel: string;
  localOnlyNotice: string;
  actionRehearse: string;
  actionPause: string;
  actionResume: string;
  actionReset: string;
  statusNormal: string;
  statusPaused: string;
  statusWarning: string;
  statusWaitingConfirmation: string;
  statusSimulatedReview: string;
  nextActionResume: string;
  nextActionRunRehearsal: string;
  nextActionConfirmOrPause: string;
  nextActionReviewBeforeAnyEscalation: string;
  nextActionResetRehearsal: string;
}

export interface ITriggerStateScreenProps {
  viewModel?: ITriggerStateScreenViewModel;
  onStartSimulation?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onResetSimulation?: () => void;
  copy?: ITriggerStateScreenCopy;
}

const defaultViewModel: ITriggerStateScreenViewModel = {
  checkInIntervalDays: 1,
  missedCheckInThreshold: 3,
  missingStateEnabled: false,
  simulationEnabled: false,
  status: 'paused',
  nextAction: 'resume',
  isLocalOnly: true
};

const statusCopyMap: Record<
  TriggerStateScreenStatus,
  keyof ITriggerStateScreenCopy
> = {
  normal: 'statusNormal',
  paused: 'statusPaused',
  warning: 'statusWarning',
  'waiting-confirmation': 'statusWaitingConfirmation',
  'simulated-review': 'statusSimulatedReview'
};

const nextActionCopyMap: Record<
  TriggerStateScreenNextAction,
  keyof ITriggerStateScreenCopy
> = {
  resume: 'nextActionResume',
  'run-rehearsal': 'nextActionRunRehearsal',
  'confirm-or-pause': 'nextActionConfirmOrPause',
  'review-before-any-escalation': 'nextActionReviewBeforeAnyEscalation',
  'reset-rehearsal': 'nextActionResetRehearsal'
};

export const TriggerStateScreen = React.memo<ITriggerStateScreenProps>(
  ({
    viewModel = defaultViewModel,
    onStartSimulation,
    onPause,
    onResume,
    onResetSimulation,
    copy
  } = {}) => {
    const { getMessage } = useI18n();
    const statusKey = `triggerState.status.${viewModel.status}`;
    const nextActionKey = `triggerState.nextAction.${viewModel.nextAction}`;

    return (
      <AppScreen>
        <ScreenTitleText>
          {copy?.title || getMessage('triggerState.title')}
        </ScreenTitleText>
        <PolicySummaryCard>
          <CaptionMutedText>
            {copy?.policySummary || getMessage('triggerState.policySummary')}
          </CaptionMutedText>
          <MetricRow>
            <CaptionMutedText>
              {copy?.checkInIntervalLabel ||
                getMessage('triggerState.checkInIntervalLabel')}
            </CaptionMutedText>
            <MetricValue>{viewModel.checkInIntervalDays}</MetricValue>
          </MetricRow>
          <MetricRow>
            <CaptionMutedText>
              {copy?.missedThresholdLabel ||
                getMessage('triggerState.missedThresholdLabel')}
            </CaptionMutedText>
            <MetricValue>{viewModel.missedCheckInThreshold}</MetricValue>
          </MetricRow>
        </PolicySummaryCard>
        <StatusCard>
          <CaptionMutedText>
            {copy?.statusLabel || getMessage('triggerState.statusLabel')}
          </CaptionMutedText>
          <CardTitleText>
            {copy?.[statusCopyMap[viewModel.status]] ||
              getMessage(statusKey)}
          </CardTitleText>
          <CaptionMutedText>
            {copy?.nextActionLabel ||
              getMessage('triggerState.nextActionLabel')}
          </CaptionMutedText>
          <CardTitleText>
            {copy?.[nextActionCopyMap[viewModel.nextAction]] ||
              getMessage(nextActionKey)}
          </CardTitleText>
          <LocalOnlyNotice>
            {copy?.localOnlyNotice ||
              getMessage('triggerState.localOnlyNotice')}
          </LocalOnlyNotice>
        </StatusCard>
        <ActionGrid>
          <ActionButton
            accessibilityRole="button"
            onPress={onStartSimulation}
          >
            <ActionLabel>
              {copy?.actionRehearse ||
                getMessage('triggerState.action.rehearse')}
            </ActionLabel>
          </ActionButton>
          <ActionButton accessibilityRole="button" onPress={onPause}>
            <ActionLabel>
              {copy?.actionPause || getMessage('triggerState.action.pause')}
            </ActionLabel>
          </ActionButton>
          <ActionButton accessibilityRole="button" onPress={onResume}>
            <ActionLabel>
              {copy?.actionResume || getMessage('triggerState.action.resume')}
            </ActionLabel>
          </ActionButton>
          <ActionButton
            accessibilityRole="button"
            onPress={onResetSimulation}
          >
            <ActionLabel>
              {copy?.actionReset || getMessage('triggerState.action.reset')}
            </ActionLabel>
          </ActionButton>
        </ActionGrid>
      </AppScreen>
    );
  }
);

TriggerStateScreen.displayName = 'TriggerStateScreen';
