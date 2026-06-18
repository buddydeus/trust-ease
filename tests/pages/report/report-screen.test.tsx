import { fireEvent, render, screen } from '../../support/render-app';

import zhCN from '../../../src/locals/zh-CN.json';
import { ReportScreen } from '../../../src/pages/report/ReportScreen';

test('renders the daily report status page and submits from the primary action', () => {
  const onSubmit = jest.fn();

  render(<ReportScreen onSubmit={onSubmit} />);

  expect(screen.getByText(zhCN['dailyReport.firstEntryLabel'])).toBeTruthy();
  expect(screen.getByText(zhCN['dailyReport.encouragement'])).toBeTruthy();
  expect(screen.getByText(zhCN['dailyReport.hint'])).toBeTruthy();
  expect(screen.queryByText(zhCN['dailyReport.title'])).toBeNull();
  expect(screen.queryByText(zhCN['dailyReport.description'])).toBeNull();
  expect(
    screen.getByRole('button', { name: zhCN['dailyReport.primaryAction'] })
  ).toBeTruthy();

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['dailyReport.primaryAction'] })
  );

  expect(onSubmit).toHaveBeenCalledTimes(1);
});
