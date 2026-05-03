import { render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

import HomeRoute from '@/app/(tabs)/home';
import ItemsRoute from '@/app/(tabs)/items';
import MyRoute from '@/app/(tabs)/my';

test('tab routes render their redesigned feature screens', () => {
  render(<HomeRoute />);
  expect(screen.getByText('今天也好好生活着')).toBeTruthy();

  render(<ItemsRoute />);
  expect(screen.getByText('重要事项')).toBeTruthy();

  render(<MyRoute />);
  expect(screen.getByText('我的')).toBeTruthy();
});
