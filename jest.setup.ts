/**
 * Jest 全局初始化：扩展 React Native Testing Library 的匹配器，
 * 并将 AsyncStorage 替换为本地内存 mock，便于在无原生模块环境下测试 store。
 */
import '@testing-library/react-native/extend-expect';

const mockAsyncStorageStore = new Map<string, string>();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    clear: jest.fn(() => {
      mockAsyncStorageStore.clear();
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() =>
      Promise.resolve([...mockAsyncStorageStore.keys()])
    ),
    getItem: jest.fn((key: string) =>
      Promise.resolve(mockAsyncStorageStore.get(key) ?? null)
    ),
    multiGet: jest.fn((keys: string[]) =>
      Promise.resolve(
        keys.map(key => [key, mockAsyncStorageStore.get(key) ?? null])
      )
    ),
    multiRemove: jest.fn((keys: string[]) => {
      keys.forEach(key => mockAsyncStorageStore.delete(key));
      return Promise.resolve();
    }),
    multiSet: jest.fn((entries: [string, string][]) => {
      entries.forEach(([key, value]) => mockAsyncStorageStore.set(key, value));
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      mockAsyncStorageStore.delete(key);
      return Promise.resolve();
    }),
    setItem: jest.fn((key: string, value: string) => {
      mockAsyncStorageStore.set(key, value);
      return Promise.resolve();
    })
  }
}));
