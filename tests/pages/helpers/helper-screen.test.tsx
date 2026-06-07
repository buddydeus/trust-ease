import { fireEvent, render, screen, waitFor } from '../../support/render-app';
import AsyncStorage from '@react-native-async-storage/async-storage';

let mockSearchParams: Record<string, string> = {};

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn()
  },
  useLocalSearchParams: () => mockSearchParams
}));

import { router } from 'expo-router';

import HelpersRoute from '../../../src/app/helpers';
import EditHelperRoute from '../../../src/app/helpers/[id]';
import NewHelperRoute from '../../../src/app/helpers/new';
import {
  HelperFormScreen,
  type IHelperFormValues
} from '../../../src/pages/helpers/HelperFormScreen';
import { HelpersScreen } from '../../../src/pages/helpers/HelpersScreen';
import {
  createDefaultTrustDataSnapshot,
  loadTrustDataSnapshot,
  saveTrustDataSnapshot
} from '../../../src/store/trust';

const listCopy = {
  title: '托付协助人',
  createLabel: '新增协助人',
  emptyTitle: '还没有协助人',
  emptyBody: '先记录一个你信任的人，后续可以关联到重要事项。',
  localOnlyNotice: '这里只是本地记录，不会自动发送消息或产生法律授权。',
  editAction: '编辑',
  archiveAction: '归档'
};

const formCopy = {
  title: '协助人资料',
  displayNameLabel: '姓名',
  displayNamePlaceholder: '例如：林杉',
  relationshipLabel: '关系',
  relationshipPlaceholder: '例如：朋友、家人',
  contactMethodLabel: '联系方法',
  contactMethodPlaceholder: '电话、邮箱或其他方式',
  notesLabel: '说明',
  notesPlaceholder: '希望 TA 如何协助',
  localOnlyNotice: 'App 只会保存本地记录，不会自动联系对方。',
  saveAction: '保存',
  displayNameRequired: '请填写协助人姓名',
  contactMethodRequired: '请填写联系方法'
};

const activeHelpers = [
  {
    id: 'helper-1',
    displayName: '林杉',
    relationship: '朋友',
    contactMethod: 'phone:13800000000',
    notes: '优先联系'
  },
  {
    id: 'helper-2',
    displayName: '周宁',
    relationship: '家人',
    contactMethod: 'email:zhou@example.com',
    notes: '协助处理宠物照料'
  }
];

beforeEach(async () => {
  mockSearchParams = {};
  await AsyncStorage.clear();
  (router.push as jest.Mock).mockClear();
  (router.replace as jest.Mock).mockClear();
});

test('renders helper empty state and create action', () => {
  render(<HelpersScreen copy={listCopy} helpers={[]} />);

  expect(screen.getByText('托付协助人')).toBeTruthy();
  expect(screen.getByText('还没有协助人')).toBeTruthy();
  expect(
    screen.getByText('先记录一个你信任的人，后续可以关联到重要事项。')
  ).toBeTruthy();
  expect(
    screen.getByText('这里只是本地记录，不会自动发送消息或产生法律授权。')
  ).toBeTruthy();
  expect(screen.getByRole('button', { name: '新增协助人' })).toBeTruthy();
});

test('renders active helpers and calls edit/archive callbacks', () => {
  const onEditHelper = jest.fn();
  const onArchiveHelper = jest.fn();

  render(
    <HelpersScreen
      copy={listCopy}
      helpers={activeHelpers}
      onEditHelper={onEditHelper}
      onArchiveHelper={onArchiveHelper}
    />
  );

  expect(screen.getByText('林杉')).toBeTruthy();
  expect(screen.getByText('朋友')).toBeTruthy();
  expect(screen.getByText('phone:13800000000')).toBeTruthy();
  expect(screen.getByText('周宁')).toBeTruthy();

  fireEvent.press(screen.getAllByText('编辑')[0]);
  fireEvent.press(screen.getAllByText('归档')[0]);

  expect(onEditHelper).toHaveBeenCalledWith('helper-1');
  expect(onArchiveHelper).toHaveBeenCalledWith('helper-1');
});

test('helper form blocks missing required fields before submit', () => {
  const onSubmit = jest.fn();

  render(<HelperFormScreen copy={formCopy} onSubmit={onSubmit} />);

  fireEvent.press(screen.getByRole('button', { name: '保存' }));

  expect(screen.getByText('请填写协助人姓名')).toBeTruthy();
  expect(onSubmit).not.toHaveBeenCalled();

  fireEvent.changeText(screen.getByPlaceholderText('例如：林杉'), '林杉');
  fireEvent.press(screen.getByRole('button', { name: '保存' }));

  expect(screen.getByText('请填写联系方法')).toBeTruthy();
  expect(onSubmit).not.toHaveBeenCalled();
});

test('helper form submits trimmed helper values', () => {
  const onSubmit = jest.fn<void, [IHelperFormValues]>();

  render(<HelperFormScreen copy={formCopy} onSubmit={onSubmit} />);

  fireEvent.changeText(screen.getByPlaceholderText('例如：林杉'), '  林杉  ');
  fireEvent.changeText(
    screen.getByPlaceholderText('例如：朋友、家人'),
    '  朋友  '
  );
  fireEvent.changeText(
    screen.getByPlaceholderText('电话、邮箱或其他方式'),
    '  phone:13800000000  '
  );
  fireEvent.changeText(
    screen.getByPlaceholderText('希望 TA 如何协助'),
    '  优先联系  '
  );
  fireEvent.press(screen.getByRole('button', { name: '保存' }));

  expect(onSubmit).toHaveBeenCalledWith({
    displayName: '林杉',
    relationship: '朋友',
    contactMethod: 'phone:13800000000',
    notes: '优先联系'
  });
});

test('helper form preloads edit values', () => {
  const onSubmit = jest.fn<void, [IHelperFormValues]>();

  render(
    <HelperFormScreen
      copy={formCopy}
      initialValues={{
        displayName: '旧姓名',
        relationship: '朋友',
        contactMethod: 'old@example.com',
        notes: '旧说明'
      }}
      onSubmit={onSubmit}
    />
  );

  fireEvent.changeText(screen.getByDisplayValue('旧姓名'), '新姓名');
  fireEvent.press(screen.getByRole('button', { name: '保存' }));

  expect(onSubmit).toHaveBeenCalledWith({
    displayName: '新姓名',
    relationship: '朋友',
    contactMethod: 'old@example.com',
    notes: '旧说明'
  });
});

test('helpers route loads active helpers and opens the create flow', async () => {
  await saveTrustDataSnapshot({
    ...createDefaultTrustDataSnapshot(),
    helpers: [
      {
        id: 'helper-active',
        displayName: '林杉',
        relationship: '朋友',
        contactMethod: 'phone:13800000000',
        notes: '优先联系',
        status: 'active',
        createdAt: '2026-06-05T08:00:00.000Z',
        updatedAt: '2026-06-05T08:00:00.000Z'
      },
      {
        id: 'helper-archived',
        displayName: '旧联系人',
        relationship: '同事',
        contactMethod: 'old@example.com',
        notes: '不再使用',
        status: 'archived',
        createdAt: '2026-06-04T08:00:00.000Z',
        updatedAt: '2026-06-04T08:00:00.000Z'
      }
    ]
  });

  render(<HelpersRoute />);

  expect(await screen.findByText('林杉')).toBeTruthy();
  expect(screen.queryByText('旧联系人')).toBeNull();

  fireEvent.press(screen.getByRole('button', { name: '新增协助人' }));

  expect(router.push).toHaveBeenCalledWith('/helpers/new');
});

test('new helper route persists a local helper and returns to helper list', async () => {
  render(<NewHelperRoute />);

  fireEvent.changeText(screen.getByPlaceholderText('例如：林杉'), '林杉');
  fireEvent.changeText(screen.getByPlaceholderText('例如：朋友、家人'), '朋友');
  fireEvent.changeText(
    screen.getByPlaceholderText('电话、邮箱或其他方式'),
    'phone:13800000000'
  );
  fireEvent.changeText(
    screen.getByPlaceholderText('希望 TA 如何协助'),
    '优先联系'
  );
  fireEvent.press(screen.getByRole('button', { name: '保存' }));

  await waitFor(async () => {
    const currentSnapshot = await loadTrustDataSnapshot();

    expect(currentSnapshot.helpers).toHaveLength(1);
  });

  const stored = await loadTrustDataSnapshot();
  expect(stored.helpers[0]).toMatchObject({
    displayName: '林杉',
    relationship: '朋友',
    contactMethod: 'phone:13800000000',
    notes: '优先联系',
    status: 'active'
  });
  expect(router.replace).toHaveBeenCalledWith('/helpers');
});

test('edit helper route preloads and updates an existing helper', async () => {
  mockSearchParams = { id: 'helper-active' };
  await saveTrustDataSnapshot({
    ...createDefaultTrustDataSnapshot(),
    helpers: [
      {
        id: 'helper-active',
        displayName: '旧姓名',
        relationship: '朋友',
        contactMethod: 'old@example.com',
        notes: '旧说明',
        status: 'active',
        createdAt: '2026-06-05T08:00:00.000Z',
        updatedAt: '2026-06-05T08:00:00.000Z'
      }
    ]
  });

  render(<EditHelperRoute />);

  fireEvent.changeText(await screen.findByDisplayValue('旧姓名'), '新姓名');
  fireEvent.press(screen.getByRole('button', { name: '保存' }));

  const stored = await loadTrustDataSnapshot();
  expect(stored.helpers[0]).toMatchObject({
    id: 'helper-active',
    displayName: '新姓名',
    relationship: '朋友',
    contactMethod: 'old@example.com',
    notes: '旧说明',
    createdAt: '2026-06-05T08:00:00.000Z'
  });
  expect(router.replace).toHaveBeenCalledWith('/helpers');
});

test('helpers route archives local helpers and removes them from active list', async () => {
  await saveTrustDataSnapshot({
    ...createDefaultTrustDataSnapshot(),
    helpers: [
      {
        id: 'helper-active',
        displayName: '可归档协助人',
        relationship: '朋友',
        contactMethod: 'phone:13800000000',
        notes: '优先联系',
        status: 'active',
        createdAt: '2026-06-05T08:00:00.000Z',
        updatedAt: '2026-06-05T08:00:00.000Z'
      }
    ]
  });

  render(<HelpersRoute />);

  expect(await screen.findByText('可归档协助人')).toBeTruthy();
  fireEvent.press(screen.getByText('归档'));

  expect(await screen.findByText('还没有协助人')).toBeTruthy();
  const stored = await loadTrustDataSnapshot();
  expect(stored.helpers[0].status).toBe('archived');
});
