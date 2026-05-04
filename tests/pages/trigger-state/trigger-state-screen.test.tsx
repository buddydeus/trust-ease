import { fireEvent, render, screen } from '../../support/render-app';

import TriggerStateRoute from '../../../src/app/my/trigger-state';
import zhCN from '../../../src/locals/zh-CN.json';
import { TriggerStateScreen } from '../../../src/pages/trigger-state/TriggerStateScreen';

test('renders the calm trigger-state summary without immediate-execution copy', () => {
  render(<TriggerStateScreen />);

  expect(screen.getByText(zhCN['triggerState.title'])).toBeTruthy();
  expect(screen.getByText(zhCN['triggerState.currentValue'])).toBeTruthy();
  expect(screen.getByText(zhCN['triggerState.missingLabel'])).toBeTruthy();
  expect(screen.getByText(zhCN['triggerState.missingToggle'])).toBeTruthy();
  expect(screen.queryByText('Execute immediately')).toBeNull();
  expect(screen.getByRole('switch')).toBeTruthy();
});

test('trigger-state screen toggles the switch state', () => {
  render(<TriggerStateScreen />);

  const toggle = screen.getByRole('switch');
  expect(toggle.props.accessibilityState.checked).toBe(false);

  fireEvent(toggle, 'valueChange', true);

  expect(screen.getByRole('switch').props.accessibilityState.checked).toBe(
    true
  );
});

test('trigger-state route renders the settings title', () => {
  render(<TriggerStateRoute />);

  expect(screen.getByText(zhCN['triggerState.title'])).toBeTruthy();
});
