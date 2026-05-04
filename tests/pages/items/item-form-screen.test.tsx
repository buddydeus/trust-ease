import { render, screen } from '../../support/render-app';

import NewItemRoute from '../../../src/app/items/new';
import zhCN from '../../../src/locals/zh-CN.json';
import { ItemFormScreen } from '../../../src/pages/items/ItemFormScreen';

test('renders the guided creation flow instead of a long raw form', () => {
  render(<ItemFormScreen />);

  expect(screen.getByText(zhCN['itemForm.title'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.typeLabel'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.offlineTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.onlineTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.stepLabel'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.stepValue'])).toBeTruthy();
});

test('new item route renders the guided creation screen shell', () => {
  render(<NewItemRoute />);

  expect(screen.getByText(zhCN['itemForm.title'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.typeLabel'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.stepValue'])).toBeTruthy();
});
