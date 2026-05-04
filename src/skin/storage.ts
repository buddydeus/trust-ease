import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SkinPackageState } from './types';

/** 持久化皮肤选择状态的 AsyncStorage 键。 */
const STORAGE_KEY = 'trust-ease:skin-state';
const BUILTIN_SKIN_ID = 'skin-001';
const BUILTIN_SKIN_VERSION = '1.0.0';
const BUILTIN_PACKAGE_KEY = `${BUILTIN_SKIN_ID}@${BUILTIN_SKIN_VERSION}`;

/**
 * 冷启动时可序列化恢复的皮肤相关字段。
 */
export interface SkinStorageState {
  /** 界面中选中的皮肤 id。 */
  selectedSkinId: string;
  /** 资源已就绪、可用于渲染的皮肤 id。 */
  activeSkinId: string;
  /** 最近一次确认 `ready` 包的皮肤 id，用于回退。 */
  lastReadySkinId: string;
  /** 以 `skinId@version` 为键的包就绪映射。 */
  skinPackageStates: Record<string, SkinPackageState>;
}

/**
 * 持久化载荷可能不完整（旧版本字段缺失）。
 */
interface IPersistedSkinStorageState extends Partial<SkinStorageState> {}

/**
 * 内置默认 `SkinStorageState` 的工厂方法。
 *
 * @returns 新的默认状态对象。
 */
const getDefaultSkinStorageState = (): SkinStorageState => {
  return {
    selectedSkinId: BUILTIN_SKIN_ID,
    activeSkinId: BUILTIN_SKIN_ID,
    lastReadySkinId: BUILTIN_SKIN_ID,
    skinPackageStates: {
      [BUILTIN_PACKAGE_KEY]: 'ready'
    }
  };
};

/**
 * 判断某皮肤 id 下是否存在标记为 `ready` 的包键。
 *
 * @param skinId - `@` 之前的皮肤 id 前缀。
 * @param packageStates - 就绪状态表。
 * @returns 若存在任一 `ready` 包则返回 `true`。
 */
const hasReadyPackageForSkin = (
  skinId: string,
  packageStates: Record<string, SkinPackageState>
): boolean => {
  return Object.entries(packageStates).some(
    ([packageKey, state]) =>
      state === 'ready' && packageKey.startsWith(`${skinId}@`)
  );
};

/**
 * 将持久化片段与默认值合并，并校验就绪性不变量。
 *
 * @param persisted - 已解析的部分快照，可为空。
 * @returns 规范化后的 `SkinStorageState`。
 */
const normalizeSkinStorageState = (
  persisted: IPersistedSkinStorageState | null | undefined
): SkinStorageState => {
  const defaults = getDefaultSkinStorageState();
  const skinPackageStates = {
    ...defaults.skinPackageStates,
    ...(persisted?.skinPackageStates ?? {})
  };
  const selectedSkinId = persisted?.selectedSkinId ?? defaults.selectedSkinId;
  const fallbackReadySkinId =
    persisted?.lastReadySkinId &&
    hasReadyPackageForSkin(persisted.lastReadySkinId, skinPackageStates)
      ? persisted.lastReadySkinId
      : defaults.lastReadySkinId;
  const activeSkinId =
    persisted?.activeSkinId &&
    hasReadyPackageForSkin(persisted.activeSkinId, skinPackageStates)
      ? persisted.activeSkinId
      : fallbackReadySkinId;

  return {
    selectedSkinId,
    activeSkinId,
    lastReadySkinId: fallbackReadySkinId,
    skinPackageStates
  };
};

/**
 * 从 AsyncStorage 读取持久化皮肤状态。
 *
 * @returns 解析后的 `SkinStorageState`；缺失或非法时返回默认值。
 */
export const loadSkinStorageState = async (): Promise<SkinStorageState> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return getDefaultSkinStorageState();
  }

  try {
    return normalizeSkinStorageState(
      JSON.parse(raw) as IPersistedSkinStorageState
    );
  } catch {
    return getDefaultSkinStorageState();
  }
};

/**
 * 持久化已规范化的皮肤状态。
 *
 * @param state - 要保存的状态快照。
 * @returns 写入完成后的 Promise。
 */
export const saveSkinStorageState = async (
  state: SkinStorageState
): Promise<void> => {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalizeSkinStorageState(state))
  );
};

/**
 * 清除持久化皮肤状态。
 *
 * @returns 删除键完成后的 Promise。
 */
export const clearSkinStorageState = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};

/**
 * 带命名空间的皮肤持久化 API。
 */
export const skinStorage = {
  /** 见 `loadSkinStorageState`。 */
  load: loadSkinStorageState,
  /** 见 `saveSkinStorageState`。 */
  save: saveSkinStorageState,
  /** 见 `clearSkinStorageState`。 */
  clear: clearSkinStorageState
};
