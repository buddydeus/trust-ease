import { fireEvent, render, screen } from '../../support/render-app';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn()
  }
}));

import { router } from 'expo-router';

import zhCN from '../../../src/locals/zh-CN.json';
import { ItemsScreen } from '../../../src/pages/items/ItemsScreen';
import ItemsRoute from '../../../src/app/(tabs)/items';

test('renders the clean items header with a circular add action and no total count', () => {
  render(<ItemsScreen />);

  expect(screen.getByText(zhCN['items.title'])).toBeTruthy();
  expect(screen.getByText(zhCN['items.filterAll'])).toBeTruthy();
  expect(screen.getByText(zhCN['items.filterOffline'])).toBeTruthy();
  expect(screen.getByText(zhCN['items.itemOneTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['items.itemOneMeta'])).toBeTruthy();
  expect(screen.getByText(zhCN['items.itemTwoTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['items.itemTwoMeta'])).toBeTruthy();
  expect(screen.getByText(zhCN['items.hint'])).toBeTruthy();
  expect(
    screen.getByRole('button', { name: zhCN['items.createLabel'] })
  ).toBeTruthy();
});

test('items screen calls the create callback from the circular add action', () => {
  const onCreateItem = jest.fn();

  render(<ItemsScreen onCreateItem={onCreateItem} />);

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['items.createLabel'] })
  );

  expect(onCreateItem).toHaveBeenCalledTimes(1);
});

test('items route sends the circular add action to the guided creation screen', () => {
  const pushMock = router.push as jest.Mock;
  pushMock.mockClear();

  render(<ItemsRoute />);

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['items.createLabel'] })
  );

  expect(pushMock).toHaveBeenCalledWith('/items/new');
});
