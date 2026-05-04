const mockFileSystem = {
  documentDirectory: 'file:///app/document/' as string | null,
  makeDirectoryAsync: jest.fn()
};

jest.mock('expo-file-system/legacy', () => ({
  get documentDirectory() {
    return mockFileSystem.documentDirectory;
  },
  makeDirectoryAsync: (...args: unknown[]) =>
    mockFileSystem.makeDirectoryAsync(...args)
}));

import {
  ensureRuntimeSkinsDirectory,
  getRuntimeSkinPackageDirectoryUri,
  getRuntimeSkinsDirectoryUri
} from '../../src/skin/paths';

beforeEach(() => {
  mockFileSystem.documentDirectory = 'file:///app/document/';
  mockFileSystem.makeDirectoryAsync.mockReset();
  mockFileSystem.makeDirectoryAsync.mockResolvedValue(undefined);
});

test('将应用 documentDirectory 作为可写皮肤根目录', () => {
  expect(getRuntimeSkinsDirectoryUri()).toBe('file:///app/document/skins');
  expect(getRuntimeSkinPackageDirectoryUri('skin-001')).toBe(
    'file:///app/document/skins/skin-001'
  );
});

test('在下载皮肤包前确保运行时皮肤目录存在', async () => {
  await expect(ensureRuntimeSkinsDirectory()).resolves.toBe(
    'file:///app/document/skins'
  );
  expect(mockFileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
    'file:///app/document/skins',
    { intermediates: true }
  );
});

test('当无可写 documentDirectory 时抛出明确错误', () => {
  mockFileSystem.documentDirectory = null;

  expect(() => getRuntimeSkinsDirectoryUri()).toThrow(
    'Bundled skins require a writable FileSystem.documentDirectory'
  );
});
