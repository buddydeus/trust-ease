import { render, screen } from '@testing-library/react-native';

import { ItemFormScreen } from '@/src/features/items/ItemFormScreen';
import NewItemRoute from '@/app/items/new';

test('renders the guided creation flow instead of a long raw form', () => {
  render(<ItemFormScreen />);

  expect(screen.getByText('先写第一件事')).toBeTruthy();
  expect(screen.getByText('事项类型')).toBeTruthy();
  expect(screen.getByText('线下事项')).toBeTruthy();
  expect(screen.getByText('线上事项')).toBeTruthy();
  expect(screen.getByText('当前步骤')).toBeTruthy();
  expect(screen.getByText('选择协助人')).toBeTruthy();
});

test('new item route renders the guided creation screen shell', () => {
  render(<NewItemRoute />);

  expect(screen.getByText('先写第一件事')).toBeTruthy();
  expect(screen.getByText('事项类型')).toBeTruthy();
  expect(screen.getByText('选择协助人')).toBeTruthy();
});
