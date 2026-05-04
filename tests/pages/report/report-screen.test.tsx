import { fireEvent, render, screen } from '../../support/render-app';

import zhCN from '../../../src/locals/zh-CN.json';
import { ReportScreen } from '../../../src/pages/report/ReportScreen';

test('renders the unreported home state and submits from the primary action', () => {
  const onSubmit = jest.fn();

  render(<ReportScreen onSubmit={onSubmit} />);

  expect(screen.getByText(zhCN['report.streakTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['report.body'])).toBeTruthy();
  expect(
    screen.getByRole('button', { name: zhCN['report.primaryButton'] })
  ).toBeTruthy();

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['report.primaryButton'] })
  );

  expect(onSubmit).toHaveBeenCalledTimes(1);
});
