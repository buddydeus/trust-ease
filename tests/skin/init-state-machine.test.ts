import {
  createSkinPackageKey,
  resolveSkinInitState
} from '../../src/skin/initStateMachine';
import type { SkinStorageState } from '../../src/skin/storage';

const builtinKey = createSkinPackageKey({
  skinId: 'skin-001',
  skinVersion: '1.0.0'
});

const createPersistedState = (
  overrides: Partial<SkinStorageState> = {}
): SkinStorageState => ({
  selectedSkinId: 'skin-001',
  activeSkinId: 'skin-001',
  lastReadySkinId: 'skin-001',
  skinPackageStates: {
    [builtinKey]: 'ready'
  },
  ...overrides
});

describe('skin init state machine', () => {
  test('resolves cold start to the bundled default skin', () => {
    const result = resolveSkinInitState({
      persistedState: null,
      defaultSkinId: 'skin-001',
      defaultSkinVersion: '1.0.0'
    });

    expect(result.state).toEqual({
      selectedSkinId: 'skin-001',
      activeSkinId: 'skin-001',
      lastReadySkinId: 'skin-001',
      skinPackageStates: {
        [builtinKey]: 'ready'
      }
    });
    expect(result.status).toBe('ready');
    expect(result.usedFallback).toBe(false);
  });

  test('keeps persisted active skin when its package is ready', () => {
    const readyKey = createSkinPackageKey({
      skinId: 'skin-002',
      skinVersion: '1.1.0'
    });
    const result = resolveSkinInitState({
      persistedState: createPersistedState({
        selectedSkinId: 'skin-002',
        activeSkinId: 'skin-002',
        lastReadySkinId: 'skin-002',
        skinPackageStates: {
          [builtinKey]: 'ready',
          [readyKey]: 'ready'
        }
      }),
      defaultSkinId: 'skin-001',
      defaultSkinVersion: '1.0.0'
    });

    expect(result.state.activeSkinId).toBe('skin-002');
    expect(result.state.lastReadySkinId).toBe('skin-002');
    expect(result.status).toBe('ready');
  });

  test('falls back to last ready skin when persisted active skin is missing', () => {
    const lastReadyKey = createSkinPackageKey({
      skinId: 'skin-002',
      skinVersion: '1.1.0'
    });
    const result = resolveSkinInitState({
      persistedState: createPersistedState({
        selectedSkinId: 'skin-003',
        activeSkinId: 'skin-003',
        lastReadySkinId: 'skin-002',
        skinPackageStates: {
          [builtinKey]: 'ready',
          [lastReadyKey]: 'ready'
        }
      }),
      defaultSkinId: 'skin-001',
      defaultSkinVersion: '1.0.0'
    });

    expect(result.state.activeSkinId).toBe('skin-002');
    expect(result.state.lastReadySkinId).toBe('skin-002');
    expect(result.status).toBe('fallback');
    expect(result.usedFallback).toBe(true);
  });

  test('does not overwrite last ready skin when selected skin failed', () => {
    const failedKey = createSkinPackageKey({
      skinId: 'skin-002',
      skinVersion: '1.1.0'
    });
    const result = resolveSkinInitState({
      persistedState: createPersistedState({
        selectedSkinId: 'skin-002',
        activeSkinId: 'skin-002',
        lastReadySkinId: 'skin-001',
        skinPackageStates: {
          [builtinKey]: 'ready',
          [failedKey]: 'failed'
        }
      }),
      defaultSkinId: 'skin-001',
      defaultSkinVersion: '1.0.0'
    });

    expect(result.state.activeSkinId).toBe('skin-001');
    expect(result.state.lastReadySkinId).toBe('skin-001');
    expect(result.state.skinPackageStates[failedKey]).toBe('failed');
    expect(result.status).toBe('fallback');
  });

  test('falls back from incompatible selected skin to bundled default', () => {
    const incompatibleKey = createSkinPackageKey({
      skinId: 'skin-002',
      skinVersion: '1.1.0'
    });
    const result = resolveSkinInitState({
      persistedState: createPersistedState({
        selectedSkinId: 'skin-002',
        activeSkinId: 'skin-002',
        lastReadySkinId: 'skin-002',
        skinPackageStates: {
          [builtinKey]: 'ready',
          [incompatibleKey]: 'incompatible'
        }
      }),
      defaultSkinId: 'skin-001',
      defaultSkinVersion: '1.0.0'
    });

    expect(result.state.activeSkinId).toBe('skin-001');
    expect(result.state.lastReadySkinId).toBe('skin-001');
    expect(result.state.skinPackageStates[incompatibleKey]).toBe(
      'incompatible'
    );
    expect(result.status).toBe('fallback');
  });

  test('activates selected skin when it has become ready', () => {
    const readyKey = createSkinPackageKey({
      skinId: 'skin-002',
      skinVersion: '1.1.0'
    });
    const result = resolveSkinInitState({
      persistedState: createPersistedState({
        selectedSkinId: 'skin-002',
        activeSkinId: 'skin-001',
        lastReadySkinId: 'skin-001',
        skinPackageStates: {
          [builtinKey]: 'ready',
          [readyKey]: 'ready'
        }
      }),
      defaultSkinId: 'skin-001',
      defaultSkinVersion: '1.0.0'
    });

    expect(result.state.activeSkinId).toBe('skin-002');
    expect(result.state.lastReadySkinId).toBe('skin-002');
    expect(result.status).toBe('ready');
  });
});
