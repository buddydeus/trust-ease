import { render, screen } from '../../support/render-app';

import HomeRoute from '../../../src/app/(tabs)/home';
import zhCN from '../../../src/locals/zh-CN.json';
import { HomeScreen } from '../../../src/pages/home/HomeScreen';

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

test('home route reads the seeded summary from the store', () => {
  render(<HomeRoute />);

  expect(screen.getByText(zhCN['home.heroTitle'])).toBeTruthy();
  expect(screen.getByText('128')).toBeTruthy();
  expect(screen.getByText(zhCN['home.offlineLabel'])).toBeTruthy();
  expect(screen.getByText(zhCN['home.onlineLabel'])).toBeTruthy();
  expect(screen.getAllByText('3')).toHaveLength(2);
});
