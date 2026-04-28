import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

import { router } from 'expo-router';

import HomeRoute from '@/app/(tabs)/home';
import { HomeScreen } from '@/src/features/home/HomeScreen';

test('renders the calm daily-safe home summary without next-check-in copy', () => {
  render(
    <HomeScreen
      summary={{
        streakDays: 128,
        itemCount: 6,
        helperCount: 3,
      }}
    />,
  );

  expect(screen.getByText('今天也好好生活着')).toBeTruthy();
  expect(screen.getByText('128')).toBeTruthy();
  expect(screen.getByText('6')).toBeTruthy();
  expect(screen.getByText('3')).toBeTruthy();
  expect(screen.getByText('查看本次确认')).toBeTruthy();
  expect(screen.queryByText('下一次确认')).toBeNull();
});

test('home route reads the seeded summary from the store', () => {
  const pushMock = router.push as jest.Mock;
  pushMock.mockClear();

  render(<HomeRoute />);

  expect(screen.getByText('今天也好好生活着')).toBeTruthy();
  expect(screen.getByText('128')).toBeTruthy();
  expect(screen.getByText('6')).toBeTruthy();
  expect(screen.getByText('3')).toBeTruthy();

  fireEvent.press(screen.getByRole('button', { name: '查看本次确认' }));

  expect(pushMock).toHaveBeenCalledWith('/report');
});
