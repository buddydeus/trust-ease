import { render, screen } from '../../support/render-app';

import { HomeScreen } from '../../../src/pages/home/HomeScreen';
import { deriveLocalReadinessSummary } from '../../../src/store/trust';

test('renders english home copy when english strings are passed in', () => {
  render(
    <HomeScreen
      summary={{
        streakDays: 128,
        offlineItemCount: 3,
        onlineItemCount: 3,
        isReportedToday: true,
        lastReportedAt: '2026-05-05T09:30:00.000Z'
      }}
      copy={{
        statusLabel: 'Current plan',
        heroTitle: 'Trusted handoff',
        heroBody:
          'Keep the important things organized first, then add details step by step.',
        streakLabel: 'Local readiness summary',
        offlineLabel: 'Offline clues',
        onlineLabel: 'Online notes',
        dailyStatusPending: 'Not reported today',
        dailyStatusCompleted: 'Reported today',
        dailyStatusLastReport: 'Last report',
        dailyStatusNoRecord: 'No record'
      }}
      readiness={deriveLocalReadinessSummary({
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
      })}
      readinessCopy={{
        heading: 'Local readiness',
        statusLabels: {
          empty: 'Start with the first local plan',
          'needs-attention': 'Some local pieces need review',
          'ready-for-review': 'Ready for a local review'
        },
        localOnlyNotice:
          'This is a local advisory summary. It will not notify helpers or create legal authority.',
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
          items: '0 important items',
          helpers: '0 trusted helpers',
          coverage: '0 linked / 0 to review'
        },
        actionLabels: {
          'create-item': 'Add item',
          'create-helper': 'Add helper',
          'review-item-assignments': 'Review assignments',
          'review-trigger-rehearsal': 'Review rehearsal',
          'review-readiness': 'Review summary'
        }
      }}
    />
  );

  expect(screen.getByText('Reported today')).toBeTruthy();
  expect(screen.getByText('Trusted handoff')).toBeTruthy();
  expect(screen.getByText('Offline clues')).toBeTruthy();
  expect(screen.getByText('Online notes')).toBeTruthy();
  expect(screen.getByText('Local readiness')).toBeTruthy();
  expect(screen.getByText('Start with the first local plan')).toBeTruthy();
  expect(
    screen.getByText(
      'This is a local advisory summary. It will not notify helpers or create legal authority.'
    )
  ).toBeTruthy();
  expect(screen.getAllByText('3')).toHaveLength(2);
});
