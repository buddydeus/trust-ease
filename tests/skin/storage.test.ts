import type { SkinPackageState } from '../../src/skin/types';

type AsyncStorageShape = {
  getItem: jest.Mock<Promise<string | null>, [string]>;
  setItem: jest.Mock<Promise<void>, [string, string]>;
  removeItem: jest.Mock<Promise<void>, [string]>;
};

const mockStorage: AsyncStorageShape = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

jest.mock('@react-native-async-storage/async-storage', () => mockStorage);

const builtinKey = 'skin-001@1.0.0';

describe('skin storage', () => {
  beforeEach(() => {
    mockStorage.getItem.mockReset();
    mockStorage.setItem.mockReset();
    mockStorage.removeItem.mockReset();
  });

  test('bootstraps builtin skin as ready when nothing is persisted', async () => {
    mockStorage.getItem.mockResolvedValue(null);

    const { loadSkinStorageState } = require('../../src/skin/storage');
    const state = await loadSkinStorageState();

    expect(state.selectedSkinId).toBe('skin-001');
    expect(state.activeSkinId).toBe('skin-001');
    expect(state.lastReadySkinId).toBe('skin-001');
    expect(state.skinPackageStates).toEqual<Record<string, SkinPackageState>>({
      [builtinKey]: 'ready'
    });
  });

  test('does not treat incomplete packages as ready', async () => {
    mockStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({
        selectedSkinId: 'skin-002',
        activeSkinId: 'skin-002',
        lastReadySkinId: 'skin-001',
        skinPackageStates: {
          [builtinKey]: 'ready',
          'skin-002@1.1.0': 'downloading'
        }
      })
    );

    const { loadSkinStorageState } = require('../../src/skin/storage');
    const state = await loadSkinStorageState();

    expect(state.activeSkinId).toBe('skin-001');
    expect(state.lastReadySkinId).toBe('skin-001');
    expect(state.skinPackageStates['skin-002@1.1.0']).toBe('downloading');
  });

  test('persists selected, active, last-ready, and package state values', async () => {
    const { saveSkinStorageState } = require('../../src/skin/storage');

    await saveSkinStorageState({
      selectedSkinId: 'skin-002',
      activeSkinId: 'skin-001',
      lastReadySkinId: 'skin-001',
      skinPackageStates: {
        [builtinKey]: 'ready',
        'skin-002@1.1.0': 'failed'
      }
    });

    expect(mockStorage.setItem).toHaveBeenCalledWith(
      'trust-ease:skin-state',
      JSON.stringify({
        selectedSkinId: 'skin-002',
        activeSkinId: 'skin-001',
        lastReadySkinId: 'skin-001',
        skinPackageStates: {
          [builtinKey]: 'ready',
          'skin-002@1.1.0': 'failed'
        }
      })
    );
  });
});
