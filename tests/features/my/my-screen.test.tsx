import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

import { router } from 'expo-router';

import MyRoute from '@/app/(tabs)/my';
import { MyScreen } from '@/src/features/my/MyScreen';

test('renders the calm my page with trigger-state and identity sections', () => {
  render(<MyScreen />);

  expect(screen.getByText('我的')).toBeTruthy();
  expect(screen.getByText('触发状态')).toBeTruthy();
  expect(screen.getByText('身份与安全')).toBeTruthy();
});

test('my route opens the trigger-state settings page', () => {
  const pushMock = router.push as jest.Mock;
  pushMock.mockClear();

  render(<MyRoute />);

  fireEvent.press(screen.getByRole('button', { name: '打开触发状态' }));

  expect(pushMock).toHaveBeenCalledWith('/my/trigger-state');
});
