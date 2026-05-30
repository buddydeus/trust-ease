import type { SkinStorageState } from './storage';
import type {
  SkinInitStatus,
  SkinPackageIdentity,
  SkinPackageKey,
  SkinPackageState
} from './types';

/**
 * 初始化状态机输入。
 */
export interface SkinInitStateInput {
  /** 持久化恢复的皮肤状态；冷启动时可为空。 */
  persistedState?: SkinStorageState | null;
  /** 构建期内置默认皮肤 id。 */
  defaultSkinId: string;
  /** 构建期内置默认皮肤版本。 */
  defaultSkinVersion: string;
}

/**
 * 初始化状态机输出。
 */
export interface SkinInitStateResolution {
  /** 解析后可安全写回 store/storage 的状态。 */
  state: SkinStorageState;
  /** 对 UI/测试暴露的初始化状态。 */
  status: SkinInitStatus;
  /** 是否发生了从 selected/active 到 last-ready/default 的回退。 */
  usedFallback: boolean;
}

/**
 * 生成稳定的 `skinId@skinVersion` 包键。
 *
 * @param identity - 皮肤包身份。
 * @returns 包状态表可使用的键。
 */
export const createSkinPackageKey = ({
  skinId,
  skinVersion
}: SkinPackageIdentity): SkinPackageKey => {
  return `${skinId}@${skinVersion}` as SkinPackageKey;
};

const hasReadyPackageForSkin = (
  skinId: string,
  packageStates: Record<string, SkinPackageState>
): boolean => {
  return Object.entries(packageStates).some(
    ([packageKey, state]) =>
      state === 'ready' && packageKey.startsWith(`${skinId}@`)
  );
};

const resolveReadySkin = (
  candidates: string[],
  defaultSkinId: string,
  packageStates: Record<string, SkinPackageState>
): string => {
  return (
    candidates.find(candidate =>
      hasReadyPackageForSkin(candidate, packageStates)
    ) ?? defaultSkinId
  );
};

/**
 * 解析启动时可渲染的皮肤状态。
 *
 * @param input - 持久化状态和内置默认皮肤信息。
 * @returns 可写回 store/storage 的规范化结果。
 */
export const resolveSkinInitState = ({
  persistedState,
  defaultSkinId,
  defaultSkinVersion
}: SkinInitStateInput): SkinInitStateResolution => {
  const defaultPackageKey = createSkinPackageKey({
    skinId: defaultSkinId,
    skinVersion: defaultSkinVersion
  });
  const skinPackageStates: Record<string, SkinPackageState> = {
    [defaultPackageKey]: 'ready',
    ...(persistedState?.skinPackageStates ?? {})
  };
  const selectedSkinId = persistedState?.selectedSkinId ?? defaultSkinId;
  const activeSkinId = persistedState?.activeSkinId ?? defaultSkinId;
  const lastReadySkinId = persistedState?.lastReadySkinId ?? defaultSkinId;
  const resolvedActiveSkinId = resolveReadySkin(
    [selectedSkinId, activeSkinId, lastReadySkinId, defaultSkinId],
    defaultSkinId,
    skinPackageStates
  );
  const resolvedLastReadySkinId = hasReadyPackageForSkin(
    resolvedActiveSkinId,
    skinPackageStates
  )
    ? resolvedActiveSkinId
    : defaultSkinId;
  const selectedSkinIsReady = hasReadyPackageForSkin(
    selectedSkinId,
    skinPackageStates
  );
  const usedFallback =
    Boolean(persistedState) &&
    !selectedSkinIsReady &&
    (resolvedActiveSkinId !== activeSkinId ||
      resolvedLastReadySkinId !== lastReadySkinId);

  return {
    state: {
      selectedSkinId,
      activeSkinId: resolvedActiveSkinId,
      lastReadySkinId: resolvedLastReadySkinId,
      skinPackageStates
    },
    status: usedFallback ? 'fallback' : 'ready',
    usedFallback
  };
};
