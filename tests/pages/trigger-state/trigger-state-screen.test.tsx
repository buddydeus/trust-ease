import AsyncStorage from '@react-native-async-storage/async-storage';

import { fireEvent, render, screen, waitFor } from '../../support/render-app';

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn()
  }
}));

import { router } from 'expo-router';

import TriggerStateRoute from '../../../src/app/my/trigger-state';
import zhCN from '../../../src/locals/zh-CN.json';
import {
  type ITriggerStateScreenViewModel,
  TriggerStateScreen
} from '../../../src/pages/trigger-state/TriggerStateScreen';
import {
  createDefaultTrustDataSnapshot,
  loadTrustDataSnapshot,
  saveTrustDataSnapshot
} from '../../../src/store/trust';

const baseViewModel: ITriggerStateScreenViewModel = {
  checkInIntervalDays: 1,
  missedCheckInThreshold: 3,
  missingStateEnabled: true,
  simulationEnabled: false,
  status: 'normal',
  nextAction: 'run-rehearsal',
  isLocalOnly: true
};

beforeEach(async () => {
  await AsyncStorage.clear();
  (router.back as jest.Mock).mockClear();
});

test('renders local trigger policy status without immediate-execution copy', () => {
  render(<TriggerStateScreen viewModel={baseViewModel} />);

  expect(screen.getByText(zhCN['triggerState.title'])).toBeTruthy();
  expect(screen.getByText(zhCN['triggerState.policySummary'])).toBeTruthy();
  expect(screen.getByText('1')).toBeTruthy();
  expect(screen.getByText('3')).toBeTruthy();
  expect(screen.getByText(zhCN['triggerState.status.normal'])).toBeTruthy();
  expect(screen.getByText(zhCN['triggerState.localOnlyNotice'])).toBeTruthy();
  expect(screen.queryByText('死亡 = 3 次未申报')).toBeNull();
  expect(screen.queryByText('Death = 3 missed check-ins')).toBeNull();
});

test('renders rehearsal, pause, resume, and reset actions', () => {
  const onStartSimulation = jest.fn();
  const onPause = jest.fn();
  const onResume = jest.fn();
  const onResetSimulation = jest.fn();

  render(
    <TriggerStateScreen
      viewModel={{
        ...baseViewModel,
        status: 'paused',
        missingStateEnabled: false,
        simulationEnabled: true
      }}
      onPause={onPause}
      onResetSimulation={onResetSimulation}
      onResume={onResume}
      onStartSimulation={onStartSimulation}
    />
  );

  fireEvent.press(screen.getByText(zhCN['triggerState.action.rehearse']));
  fireEvent.press(screen.getByText(zhCN['triggerState.action.pause']));
  fireEvent.press(screen.getByText(zhCN['triggerState.action.resume']));
  fireEvent.press(screen.getByText(zhCN['triggerState.action.reset']));

  expect(onStartSimulation).toHaveBeenCalledTimes(1);
  expect(onPause).toHaveBeenCalledTimes(1);
  expect(onResume).toHaveBeenCalledTimes(1);
  expect(onResetSimulation).toHaveBeenCalledTimes(1);
});

test('trigger state screen exposes a back action when provided', () => {
  const onBack = jest.fn();

  render(<TriggerStateScreen onBack={onBack} viewModel={baseViewModel} />);

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['navigation.back'] })
  );

  expect(onBack).toHaveBeenCalledTimes(1);
});

test('renders every local simulation status with a next action', () => {
  const statuses: Array<ITriggerStateScreenViewModel['status']> = [
    'normal',
    'paused',
    'warning',
    'waiting-confirmation',
    'simulated-review'
  ];

  statuses.forEach(status => {
    render(
      <TriggerStateScreen
        viewModel={{
          ...baseViewModel,
          status
        }}
      />
    );

    expect(
      screen.getByText(zhCN[`triggerState.status.${status}`])
    ).toBeTruthy();
    expect(
      screen.getAllByText(zhCN['triggerState.nextActionLabel']).length
    ).toBeGreaterThan(0);
  });
});

test('trigger-state route loads local policy and persists pause/resume/rehearsal actions', async () => {
  const snapshot = {
    ...createDefaultTrustDataSnapshot(),
    triggerPolicy: {
      missedCheckInThreshold: 4,
      checkInIntervalDays: 2,
      missingStateEnabled: true,
      simulationEnabled: false,
      updatedAt: '2026-06-05T08:00:00.000Z'
    },
    updatedAt: '2026-06-05T08:00:00.000Z'
  };

  await saveTrustDataSnapshot(snapshot);

  render(<TriggerStateRoute />);

  await waitFor(() => {
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
  });

  fireEvent.press(screen.getByText(zhCN['triggerState.action.pause']));

  await waitFor(async () => {
    expect(
      (await loadTrustDataSnapshot()).triggerPolicy.missingStateEnabled
    ).toBe(false);
  });

  fireEvent.press(screen.getByText(zhCN['triggerState.action.resume']));

  await waitFor(async () => {
    expect(
      (await loadTrustDataSnapshot()).triggerPolicy.missingStateEnabled
    ).toBe(true);
  });

  fireEvent.press(screen.getByText(zhCN['triggerState.action.rehearse']));

  await waitFor(async () => {
    expect(
      (await loadTrustDataSnapshot()).triggerPolicy.simulationEnabled
    ).toBe(true);
  });

  fireEvent.press(screen.getByText(zhCN['triggerState.action.reset']));

  await waitFor(async () => {
    expect(
      (await loadTrustDataSnapshot()).triggerPolicy.simulationEnabled
    ).toBe(false);
  });
});
