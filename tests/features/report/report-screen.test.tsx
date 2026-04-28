import { fireEvent, render, screen } from '@testing-library/react-native';

import { ReportScreen } from '@/src/features/report/ReportScreen';

test('renders the daily safety gate and submits from the primary action', () => {
  const onSubmit = jest.fn();

  render(
    <ReportScreen
      mode="full"
      onSubmit={onSubmit}
      onOpenPassword={jest.fn()}
    />,
  );

  expect(screen.getByRole('button', { name: '我今天还在' })).toBeTruthy();
  expect(screen.getByRole('button', { name: '进行完整确认' })).toBeTruthy();

  fireEvent.press(screen.getByRole('button', { name: '我今天还在' }));

  expect(onSubmit).toHaveBeenCalledTimes(1);
});
