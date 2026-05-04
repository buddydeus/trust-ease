import { render, screen } from '../../support/render-app';

import { HomeScreen } from '../../../src/pages/home/HomeScreen';

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
        statusLabel: 'Today',
        heroTitle: 'Still living well today',
        streakLabel: 'Safe check-ins in a row',
        offlineLabel: 'Offline',
        onlineLabel: 'Online'
      }}
    />
  );

  expect(screen.getByText('Still living well today')).toBeTruthy();
  expect(screen.getByText('Offline')).toBeTruthy();
  expect(screen.getByText('Online')).toBeTruthy();
  expect(screen.getAllByText('3')).toHaveLength(2);
});
