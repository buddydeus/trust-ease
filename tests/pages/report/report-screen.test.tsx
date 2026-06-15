import { fireEvent, render, screen } from '../../support/render-app';

import zhCN from '../../../src/locals/zh-CN.json';
import { ReportScreen } from '../../../src/pages/report/ReportScreen';

test('renders the daily report status page and submits from the primary action', () => {
  const onSubmit = jest.fn();

  render(<ReportScreen onSubmit={onSubmit} />);

  expect(screen.getByText(zhCN['dailyReport.title'])).toBeTruthy();
  expect(screen.getByText(zhCN['dailyReport.description'])).toBeTruthy();
  expect(
    screen.getAllByText(zhCN['dailyReport.status.pending']).length
  ).toBeGreaterThanOrEqual(1);
  expect(screen.getByText(zhCN['dailyReport.waiting'])).toBeTruthy();
  expect(
    screen.getByRole('button', { name: zhCN['dailyReport.primaryAction'] })
  ).toBeTruthy();

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['dailyReport.primaryAction'] })
  );

  expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('calls the secondary plan action without submitting a report', () => {
  const onSubmit = jest.fn();
  const onSecondaryAction = jest.fn();

  render(
    <ReportScreen onSecondaryAction={onSecondaryAction} onSubmit={onSubmit} />
  );

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['dailyReport.secondaryAction'] })
  );

  expect(onSecondaryAction).toHaveBeenCalledTimes(1);
  expect(onSubmit).not.toHaveBeenCalled();
});
