import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

import { router } from 'expo-router';

import { ItemsScreen } from '@/src/features/items/ItemsScreen';
import ItemsRoute from '@/app/(tabs)/items';

test('renders the clean items header with a circular add action and no total count', () => {
  render(<ItemsScreen />);

  expect(screen.getByText('重要事项')).toBeTruthy();
  expect(screen.getByText('全部')).toBeTruthy();
  expect(screen.getByText('线下事项')).toBeTruthy();
  expect(screen.getByText('把宠物交给林杉照料')).toBeTruthy();
  expect(screen.getByText('线下事项 · 协助人 1 位')).toBeTruthy();
  expect(screen.getByText('导出私有仓库备份脚本')).toBeTruthy();
  expect(screen.getByText('线上事项 · 自定义脚本')).toBeTruthy();
  expect(screen.getByText('向下滚动后继续查看其他事项')).toBeTruthy();
  expect(screen.getByRole('button', { name: '新建事项' })).toBeTruthy();
});

test('items screen calls the create callback from the circular add action', () => {
  const onCreateItem = jest.fn();

  render(<ItemsScreen onCreateItem={onCreateItem} />);

  fireEvent.press(screen.getByRole('button', { name: '新建事项' }));

  expect(onCreateItem).toHaveBeenCalledTimes(1);
});

test('items route sends the circular add action to the guided creation screen', () => {
  const pushMock = router.push as jest.Mock;
  pushMock.mockClear();

  render(<ItemsRoute />);

  fireEvent.press(screen.getByRole('button', { name: '新建事项' }));

  expect(pushMock).toHaveBeenCalledWith('/items/new');
});
