import { fireEvent, render, screen, waitFor } from '../../support/render-app';
import AsyncStorage from '@react-native-async-storage/async-storage';

let mockSearchParams: Record<string, string> = {};

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn()
  },
  useLocalSearchParams: () => mockSearchParams
}));

import { router } from 'expo-router';

import NewItemRoute from '../../../src/app/items/new';
import EditItemRoute from '../../../src/app/items/[id]';
import zhCN from '../../../src/locals/zh-CN.json';
import { ItemFormScreen } from '../../../src/pages/items/ItemFormScreen';
import {
  createDefaultTrustDataSnapshot,
  loadTrustDataSnapshot,
  saveTrustDataSnapshot
} from '../../../src/store/trust';

beforeEach(async () => {
  mockSearchParams = {};
  await AsyncStorage.clear();
  (router.push as jest.Mock).mockClear();
  (router.back as jest.Mock).mockClear();
  (router.replace as jest.Mock).mockClear();
});

test('renders the guided creation flow instead of a long raw form', () => {
  render(<ItemFormScreen />);

  expect(screen.getByText(zhCN['itemForm.title'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.titleLabel'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.summaryLabel'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.offlineTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.onlineTitle'])).toBeTruthy();
  expect(
    screen.getByRole('button', { name: zhCN['itemForm.saveAction'] })
  ).toBeTruthy();
});

test('new item route renders the guided creation screen shell', async () => {
  render(<NewItemRoute />);

  await waitFor(() => {
    expect(screen.getByText(zhCN['itemForm.title'])).toBeTruthy();
  });
  expect(screen.getByText(zhCN['itemForm.titleLabel'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.summaryLabel'])).toBeTruthy();
  expect(
    screen.getByRole('button', { name: zhCN['navigation.back'] })
  ).toBeTruthy();
});

test('new item route exposes a back action', async () => {
  render(<NewItemRoute />);

  fireEvent.press(
    await screen.findByRole('button', { name: zhCN['navigation.back'] })
  );

  expect(router.back).toHaveBeenCalledTimes(1);
});

test('online item mode shows the online template without the old step copy', () => {
  const onCreateHelper = jest.fn();

  render(<ItemFormScreen onCreateHelper={onCreateHelper} />);

  expect(screen.getByText(zhCN['itemForm.stepValue'])).toBeTruthy();

  fireEvent.press(screen.getByText(zhCN['itemForm.onlineTitle']));

  expect(screen.getByText(zhCN['itemForm.onlineTemplateLabel'])).toBeTruthy();
  expect(screen.getByText(zhCN['itemForm.onlineTemplateTitle'])).toBeTruthy();
  expect(screen.queryByText(zhCN['itemForm.stepValue'])).toBeNull();

  fireEvent.press(screen.getByText(zhCN['itemForm.addHelperAction']));

  expect(onCreateHelper).toHaveBeenCalledTimes(1);
});

test('new item route can jump to create a helper from online item mode', async () => {
  render(<NewItemRoute />);

  fireEvent.press(await screen.findByText(zhCN['itemForm.onlineTitle']));
  fireEvent.press(screen.getByText(zhCN['itemForm.addHelperAction']));

  expect(router.push).toHaveBeenCalledWith({
    pathname: '/helpers/new',
    params: { returnTo: '/items/new' }
  });
});

test('new item route saves a local item and returns to items tab', async () => {
  await saveTrustDataSnapshot({
    ...createDefaultTrustDataSnapshot(),
    helpers: [
      {
        id: 'helper-1',
        displayName: '林杉',
        relationship: '朋友',
        contactMethod: 'phone:13800000000',
        notes: '优先联系',
        status: 'active',
        createdAt: '2026-06-05T08:00:00.000Z',
        updatedAt: '2026-06-05T08:00:00.000Z'
      }
    ]
  });

  render(<NewItemRoute />);

  fireEvent.changeText(
    screen.getByPlaceholderText(zhCN['itemForm.titlePlaceholder']),
    '宠物照料'
  );
  fireEvent.changeText(
    screen.getByPlaceholderText(zhCN['itemForm.summaryPlaceholder']),
    '把猫交给林杉照看'
  );
  fireEvent.press(await screen.findByText('林杉'));
  fireEvent.press(
    screen.getByRole('button', { name: zhCN['itemForm.saveAction'] })
  );

  await waitFor(async () => {
    const currentSnapshot = await loadTrustDataSnapshot();

    expect(currentSnapshot.items).toHaveLength(1);
  });

  const stored = await loadTrustDataSnapshot();
  expect(stored.items[0]).toMatchObject({
    title: '宠物照料',
    kind: 'offline',
    summary: '把猫交给林杉照看',
    helperIds: ['helper-1'],
    status: 'active'
  });
  expect(router.replace).toHaveBeenCalledWith('/items');
});

test('blocks empty titles before submit', () => {
  const onSubmit = jest.fn();

  render(<ItemFormScreen onSubmit={onSubmit} />);

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['itemForm.saveAction'] })
  );

  expect(screen.getByText(zhCN['itemForm.titleRequired'])).toBeTruthy();
  expect(onSubmit).not.toHaveBeenCalled();
});

test('submits a validated item payload', () => {
  const onSubmit = jest.fn();

  render(<ItemFormScreen onSubmit={onSubmit} />);

  fireEvent.changeText(
    screen.getByPlaceholderText(zhCN['itemForm.titlePlaceholder']),
    '  宠物照料  '
  );
  fireEvent.changeText(
    screen.getByPlaceholderText(zhCN['itemForm.summaryPlaceholder']),
    '  把猫交给林杉照看  '
  );
  fireEvent.press(screen.getByText(zhCN['itemForm.onlineTitle']));
  expect(
    screen.getByRole('button', {
      name: new RegExp(zhCN['itemForm.onlineTitle'])
    }).props.accessibilityState
  ).toEqual({ selected: true });
  fireEvent.press(
    screen.getByRole('button', { name: zhCN['itemForm.saveAction'] })
  );

  expect(onSubmit).toHaveBeenCalledWith({
    title: '宠物照料',
    kind: 'online',
    summary: '把猫交给林杉照看',
    helperIds: []
  });
});

test('submits selected helper ids from helper choices', () => {
  const onSubmit = jest.fn();

  render(
    <ItemFormScreen
      helperChoices={[
        {
          id: 'helper-1',
          displayName: '林杉',
          relationship: '朋友'
        }
      ]}
      onSubmit={onSubmit}
    />
  );

  fireEvent.changeText(
    screen.getByPlaceholderText(zhCN['itemForm.titlePlaceholder']),
    '宠物照料'
  );
  fireEvent.press(screen.getByText('林杉'));
  fireEvent.press(
    screen.getByRole('button', { name: zhCN['itemForm.saveAction'] })
  );

  expect(onSubmit).toHaveBeenCalledWith({
    title: '宠物照料',
    kind: 'offline',
    summary: '',
    helperIds: ['helper-1']
  });
});

test('prefills edit values and submits updated payload', () => {
  const onSubmit = jest.fn();

  render(
    <ItemFormScreen
      initialValues={{
        title: '旧标题',
        kind: 'offline',
        summary: '旧摘要',
        helperIds: ['helper-1']
      }}
      helperChoices={[
        {
          id: 'helper-1',
          displayName: '林杉',
          relationship: '朋友'
        }
      ]}
      onSubmit={onSubmit}
    />
  );

  fireEvent.changeText(screen.getByDisplayValue('旧标题'), '更新事项');
  fireEvent.press(
    screen.getByRole('button', { name: zhCN['itemForm.saveAction'] })
  );

  expect(onSubmit).toHaveBeenCalledWith({
    title: '更新事项',
    kind: 'offline',
    summary: '旧摘要',
    helperIds: ['helper-1']
  });
});

test('edit item route preloads and updates an existing local item', async () => {
  mockSearchParams = { id: 'item-1' };
  await saveTrustDataSnapshot({
    ...createDefaultTrustDataSnapshot(),
    items: [
      {
        id: 'item-1',
        title: '旧标题',
        kind: 'offline',
        summary: '旧摘要',
        helperIds: [],
        status: 'active',
        createdAt: '2026-06-05T08:00:00.000Z',
        updatedAt: '2026-06-05T08:00:00.000Z'
      }
    ],
    helpers: [
      {
        id: 'helper-1',
        displayName: '林杉',
        relationship: '朋友',
        contactMethod: 'phone:13800000000',
        notes: '优先联系',
        status: 'active',
        createdAt: '2026-06-05T08:00:00.000Z',
        updatedAt: '2026-06-05T08:00:00.000Z'
      }
    ]
  });

  render(<EditItemRoute />);

  fireEvent.changeText(await screen.findByDisplayValue('旧标题'), '更新事项');
  fireEvent.press(
    screen.getByRole('button', { name: zhCN['itemForm.saveAction'] })
  );

  const stored = await loadTrustDataSnapshot();
  expect(stored.items[0]).toMatchObject({
    id: 'item-1',
    title: '更新事项',
    summary: '旧摘要',
    helperIds: [],
    createdAt: '2026-06-05T08:00:00.000Z'
  });
  expect(router.replace).toHaveBeenCalledWith('/items');
});
