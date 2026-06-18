import { fireEvent, render, screen } from '../../support/render-app';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn()
  }
}));

import { router } from 'expo-router';

import zhCN from '../../../src/locals/zh-CN.json';
import { ItemsScreen } from '../../../src/pages/items/ItemsScreen';
import ItemsRoute from '../../../src/app/(tabs)/items';
import {
  createDefaultTrustDataSnapshot,
  loadTrustDataSnapshot,
  saveTrustDataSnapshot
} from '../../../src/store/trust';

const activeItems = [
  {
    id: 'item-1',
    title: '宠物照料',
    kind: 'offline' as const,
    summary: '把猫交给林杉照看'
  },
  {
    id: 'item-2',
    title: '仓库备份',
    kind: 'online' as const,
    summary: '导出私有仓库备份脚本'
  }
];

beforeEach(async () => {
  await AsyncStorage.clear();
  (router.push as jest.Mock).mockClear();
  (router.replace as jest.Mock).mockClear();
});

test('renders an empty state when there are no active local items', () => {
  render(<ItemsScreen items={[]} />);

  expect(screen.getByText(zhCN['items.title'])).toBeTruthy();
  expect(screen.getByText(zhCN['items.emptyTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['items.emptyBody'])).toBeTruthy();
  expect(screen.getByText(zhCN['items.hint'])).toBeTruthy();
  expect(
    screen.getByRole('button', { name: zhCN['items.createLabel'] })
  ).toBeTruthy();
});

test('renders the add action with a stable circular accent background', () => {
  render(<ItemsScreen items={[]} />);

  expect(
    screen.getByRole('button', { name: zhCN['items.createLabel'] }).props.style
  ).toEqual(
    expect.objectContaining({
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#4F907C'
    })
  );
});

test('renders active local item cards from props', () => {
  render(<ItemsScreen items={activeItems} />);

  expect(screen.getByText('宠物照料')).toBeTruthy();
  expect(screen.getByText('把猫交给林杉照看')).toBeTruthy();
  expect(
    screen.getAllByText(zhCN['items.kindOffline']).length
  ).toBeGreaterThanOrEqual(1);
  expect(screen.getByText('仓库备份')).toBeTruthy();
  expect(screen.getByText('导出私有仓库备份脚本')).toBeTruthy();
  expect(screen.getByText(zhCN['items.kindOnline'])).toBeTruthy();
  expect(screen.queryByText(zhCN['items.emptyTitle'])).toBeNull();
});

test('items screen calls the create callback from the circular add action', () => {
  const onCreateItem = jest.fn();

  render(<ItemsScreen items={[]} onCreateItem={onCreateItem} />);

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['items.createLabel'] })
  );

  expect(onCreateItem).toHaveBeenCalledTimes(1);
});

test('items screen calls edit and archive callbacks for item actions', () => {
  const onEditItem = jest.fn();
  const onArchiveItem = jest.fn();

  render(
    <ItemsScreen
      items={activeItems}
      onEditItem={onEditItem}
      onArchiveItem={onArchiveItem}
    />
  );

  fireEvent.press(screen.getAllByText(zhCN['items.editAction'])[0]);
  fireEvent.press(screen.getAllByText(zhCN['items.archiveAction'])[0]);

  expect(onEditItem).toHaveBeenCalledWith('item-1');
  expect(onArchiveItem).toHaveBeenCalledWith('item-1');
});

test('items route sends the circular add action to the guided creation screen', async () => {
  const pushMock = router.push as jest.Mock;

  render(<ItemsRoute />);

  expect(await screen.findByText(zhCN['items.emptyTitle'])).toBeTruthy();
  fireEvent.press(
    screen.getByRole('button', { name: zhCN['items.createLabel'] })
  );

  expect(pushMock).toHaveBeenCalledWith('/items/new');
});

test('items route loads active local trust items from storage', async () => {
  await saveTrustDataSnapshot({
    ...createDefaultTrustDataSnapshot(),
    items: [
      {
        id: 'item-local',
        title: '本地事项',
        kind: 'offline',
        summary: '来自 AsyncStorage',
        helperIds: [],
        status: 'active',
        createdAt: '2026-06-05T08:00:00.000Z',
        updatedAt: '2026-06-05T08:00:00.000Z'
      },
      {
        id: 'item-archived',
        title: '已归档事项',
        kind: 'online',
        summary: '不应显示',
        helperIds: [],
        status: 'archived',
        createdAt: '2026-06-05T08:00:00.000Z',
        updatedAt: '2026-06-05T08:00:00.000Z'
      }
    ]
  });

  render(<ItemsRoute />);

  expect(await screen.findByText('本地事项')).toBeTruthy();
  expect(screen.queryByText('已归档事项')).toBeNull();
});

test('items route archives local items and removes them from active list', async () => {
  await saveTrustDataSnapshot({
    ...createDefaultTrustDataSnapshot(),
    items: [
      {
        id: 'item-local',
        title: '可归档事项',
        kind: 'offline',
        summary: '来自 AsyncStorage',
        helperIds: [],
        status: 'active',
        createdAt: '2026-06-05T08:00:00.000Z',
        updatedAt: '2026-06-05T08:00:00.000Z'
      }
    ]
  });

  render(<ItemsRoute />);

  expect(await screen.findByText('可归档事项')).toBeTruthy();
  fireEvent.press(screen.getByText(zhCN['items.archiveAction']));

  expect(await screen.findByText(zhCN['items.emptyTitle'])).toBeTruthy();
  const stored = await loadTrustDataSnapshot();
  expect(stored.items[0].status).toBe('archived');
});
