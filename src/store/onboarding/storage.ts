import AsyncStorage from '@react-native-async-storage/async-storage';

/** 引导相关标志在 AsyncStorage 中的键名。 */
const STORAGE_KEY = 'trust-ease:onboarding';

/**
 * 持久化的引导阶段快照。
 */
export interface IOnboardingSnapshot {
  /** 是否已完成首次欢迎流程。 */
  hasSeenWelcome?: boolean;
}

/**
 * 读取用户是否已完成欢迎页。
 *
 * @returns 当且仅当持久化字段为 `true` 时返回 `true`。
 */
export const loadHasSeenWelcome = async (): Promise<boolean> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return false;
  }

  try {
    const snapshot = JSON.parse(raw) as IOnboardingSnapshot;
    return snapshot.hasSeenWelcome === true;
  } catch {
    return false;
  }
};

/**
 * 持久化欢迎完成标志。
 *
 * @param value - 下一个 `hasSeenWelcome` 取值。
 * @returns 写入完成后的 Promise。
 */
export const saveHasSeenWelcome = async (value: boolean): Promise<void> => {
  const snapshot: IOnboardingSnapshot = { hasSeenWelcome: value };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
};
