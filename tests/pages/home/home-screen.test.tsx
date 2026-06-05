import { fireEvent, render, screen } from '../../support/render-app';
import { waitFor } from '../../support/render-app';

import { router } from 'expo-router';
import HomeRoute from '../../../src/app/(tabs)/home';
import zhCN from '../../../src/locals/zh-CN.json';
import { HomeScreen } from '../../../src/pages/home/HomeScreen';
import {
  clearTrustDataSnapshot,
  deriveLocalReadinessSummary,
  saveTrustDataSnapshot
} from '../../../src/store/trust';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn()
  }
}));

beforeEach(async () => {
  await clearTrustDataSnapshot();
  (router.push as jest.Mock).mockClear();
});

test('renders the calm daily-safe home summary without next-check-in copy', () => {
  render(
    <HomeScreen
      summary={{
        streakDays: 128,
        offlineItemCount: 3,
        onlineItemCount: 3,
        isReportedToday: true,
        lastReportedAt: '2026-05-05T09:30:00.000Z'
      }}
    />
  );

  expect(screen.getByText(zhCN['home.heroTitle'])).toBeTruthy();
  expect(screen.getByText('128')).toBeTruthy();
  expect(screen.getByText(zhCN['home.offlineLabel'])).toBeTruthy();
  expect(screen.getByText(zhCN['home.onlineLabel'])).toBeTruthy();
  expect(screen.getAllByText('3')).toHaveLength(2);
  expect(screen.queryByText('Legacy same-day check label')).toBeNull();
  expect(screen.queryByText('Legacy next check label')).toBeNull();
});

test('renders advisory local readiness summary and actions from props', () => {
  const onReadinessAction = jest.fn();
  const readiness = deriveLocalReadinessSummary({
    schemaVersion: 1,
    items: [],
    helpers: [],
    triggerPolicy: {
      missedCheckInThreshold: 3,
      checkInIntervalDays: 1,
      missingStateEnabled: false,
      simulationEnabled: false,
      updatedAt: null
    },
    updatedAt: null
  });

  render(
    <HomeScreen
      summary={{
        streakDays: 128,
        offlineItemCount: 3,
        onlineItemCount: 3,
        isReportedToday: true,
        lastReportedAt: '2026-05-05T09:30:00.000Z'
      }}
      readiness={readiness}
      readinessCopy={{
        heading: 'Local readiness',
        statusLabels: {
          empty: 'Start with the first local plan',
          'needs-attention': 'Some local pieces need review',
          'ready-for-review': 'Ready for a local review'
        },
        localOnlyNotice:
          'Local advisory summary. It does not notify helpers or create legal authority.',
        sectionLabels: {
          items: 'Important items',
          helpers: 'Trusted helpers',
          assignments: 'Helper coverage',
          trigger: 'Local rehearsal'
        },
        sectionStatusLabels: {
          complete: 'Recorded',
          'needs-action': 'Worth adding'
        },
        countLabels: {
          items: '0 items',
          helpers: '0 helpers',
          coverage: '0 covered / 0 to review'
        },
        actionLabels: {
          'create-item': 'Add item',
          'create-helper': 'Add helper',
          'review-item-assignments': 'Review assignments',
          'review-trigger-rehearsal': 'Review rehearsal',
          'review-readiness': 'Review summary'
        }
      }}
      onReadinessAction={onReadinessAction}
    />
  );

  expect(screen.getByText('Local readiness')).toBeTruthy();
  expect(screen.getByText('Start with the first local plan')).toBeTruthy();
  expect(screen.getByText('Important items')).toBeTruthy();
  expect(screen.getByText('Trusted helpers')).toBeTruthy();
  expect(screen.getByText('Local rehearsal')).toBeTruthy();
  expect(
    screen.getByText(
      'Local advisory summary. It does not notify helpers or create legal authority.'
    )
  ).toBeTruthy();
  expect(screen.queryByText(/score/i)).toBeNull();
  expect(screen.queryByText(/automatic delivery/i)).toBeNull();
  expect(screen.queryByText(/notarization/i)).toBeNull();

  fireEvent.press(screen.getByText('Add item'));

  expect(onReadinessAction).toHaveBeenCalledWith('create-item');
});

test('home route reads the seeded summary from the store', async () => {
  render(<HomeRoute />);

  expect(screen.getByText(zhCN['home.heroTitle'])).toBeTruthy();
  expect(screen.getByText('128')).toBeTruthy();
  expect(screen.getByText(zhCN['home.offlineLabel'])).toBeTruthy();
  expect(screen.getByText(zhCN['home.onlineLabel'])).toBeTruthy();
  expect(screen.getAllByText('3')).toHaveLength(2);

  await waitFor(() => {
    expect(screen.getByText(zhCN['home.readiness.heading'])).toBeTruthy();
  });
});

test('home route renders readiness from local trust data and maps actions', async () => {
  await saveTrustDataSnapshot({
    schemaVersion: 1,
    items: [
      {
        id: 'item-1',
        title: '保险箱',
        kind: 'offline',
        summary: '家中抽屉',
        helperIds: ['helper-1'],
        status: 'active',
        createdAt: '2026-06-05T08:00:00.000Z',
        updatedAt: '2026-06-05T08:00:00.000Z'
      }
    ],
    helpers: [
      {
        id: 'helper-1',
        displayName: '家人',
        relationship: '亲属',
        contactMethod: '电话',
        notes: '',
        status: 'active',
        createdAt: '2026-06-05T08:00:00.000Z',
        updatedAt: '2026-06-05T08:00:00.000Z'
      }
    ],
    triggerPolicy: {
      missedCheckInThreshold: 3,
      checkInIntervalDays: 1,
      missingStateEnabled: true,
      simulationEnabled: true,
      updatedAt: '2026-06-05T08:00:00.000Z'
    },
    updatedAt: '2026-06-05T08:00:00.000Z'
  });

  render(<HomeRoute />);

  await waitFor(() => {
    expect(screen.getByText('可以做一次本地复核')).toBeTruthy();
  });

  expect(screen.getByText('1 项重要事项')).toBeTruthy();
  expect(screen.getByText('1 位协助人')).toBeTruthy();
  expect(screen.getByText('1 项已关联 / 0 项待确认')).toBeTruthy();

  fireEvent.press(screen.getByText('查看摘要'));

  expect(router.push).toHaveBeenCalledWith('/my/trigger-state');
});
