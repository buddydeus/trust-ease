import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('@expo/ui/jetpack-compose', () => {
  const React = require('react');
  const { Pressable } = require('react-native');

  return {
    Switch: ({
      value,
      onCheckedChange,
    }: {
      value: boolean;
      onCheckedChange?: (value: boolean) => void;
    }) =>
      React.createElement(Pressable, {
        accessibilityRole: 'switch',
        accessibilityState: { checked: value },
        onPress: () => onCheckedChange?.(!value),
      }),
  };
});

import TriggerStateRoute from '@/app/my/trigger-state';
import { TriggerStateScreen } from '@/src/features/trigger-state/TriggerStateScreen';

test('renders the calm trigger-state summary without immediate-execution copy', () => {
  render(<TriggerStateScreen />);

  expect(screen.getByText('触发状态')).toBeTruthy();
  expect(screen.getByText('死亡 = 3 次未申报')).toBeTruthy();
  expect(screen.getByText('失联状态')).toBeTruthy();
  expect(screen.getByText('启用失联')).toBeTruthy();
  expect(screen.queryByText('立即执行')).toBeNull();
  expect(screen.getByRole('switch')).toBeTruthy();
});

test('trigger-state screen toggles the expo ui switch state', () => {
  render(<TriggerStateScreen />);

  const toggle = screen.getByRole('switch');
  expect(toggle.props.accessibilityState.checked).toBe(false);

  fireEvent.press(toggle);

  expect(screen.getByRole('switch').props.accessibilityState.checked).toBe(true);
});

test('trigger-state route renders the settings title', () => {
  render(<TriggerStateRoute />);

  expect(screen.getByText('触发状态')).toBeTruthy();
});
