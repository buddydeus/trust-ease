import { create, type StoreApi, type UseBoundStore } from 'zustand';

import { defaultHomeSummary, type HomeSummary } from '../constants';
import { LocaleType, type LocaleMode } from '../i18n/types';
import {
  appSkinConfig,
  type SkinInitStatus,
  type SkinPackageState
} from '../skin';

/**
 * 内置默认皮肤的 `skinPackageStates` 初始项（冷启动时视为已就绪）。
 */
const defaultSkinPackageStates: Record<string, SkinPackageState> = {
  [`${appSkinConfig.defaultSkinId}@1.0.0`]: 'ready'
};

/**
 * 跨路由需保持一致的全局客户端状态。
 *
 * 使用 zustand 而非 React Context，便于上报、皮肤启动等非组件代码
 * 在同一快照上读写，避免层层透传 props。
 */
export interface AppState {
  /** 首页英雄区数字与申报相关标志。 */
  homeSummary: HomeSummary;
  /** 最近一次手动选择的语言，与 `localeMode` 配合使用。 */
  locale: LocaleType;
  /** `locale` 是否跟随系统。 */
  localeMode: LocaleMode;
  /** 界面中选中的皮肤 id（包可能仍在下载）。 */
  selectedSkinId: string;
  /** 当前可用于渲染的皮肤 id（包已就绪）。 */
  activeSkinId: string;
  /** 最近一次处于 `ready` 包的皮肤 id，用于持久化回退。 */
  lastReadySkinId: string;
  /** 以 `skinId@skinVersion` 为键的包就绪状态表。 */
  skinPackageStates: Record<string, SkinPackageState>;
  /** 皮肤初始化的最小可观察状态。 */
  skinInitStatus: SkinInitStatus;
  /** 最近一次初始化是否发生了安全回退。 */
  skinInitUsedFallback: boolean;
  /**
   * 写入用户显式语言选择并停止跟随系统。
   *
   * @param locale - 要应用的语言枚举值。
   * @returns void
   */
  setManualLocale: (locale: LocaleType) => void;
  /**
   * 清除手动模式，使 `resolveSupportedLocale` 再次跟随设备。
   *
   * @returns void
   */
  useSystemLocale: () => void;
  /**
   * 更新界面选中的皮肤 id。
   *
   * @param skinId - 目标皮肤 id。
   * @returns void
   */
  setSelectedSkinId: (skinId: string) => void;
  /**
   * 提交实际可用于渲染的皮肤，并刷新 `lastReadySkinId` 供持久化安全回退。
   *
   * @param skinId - 已达到 `ready` 的皮肤 id。
   * @returns void
   */
  setActiveSkinId: (skinId: string) => void;
  /**
   * 更新某个皮肤包键的就绪状态。
   *
   * @param packageKey - `skinId@version` 形式的键。
   * @param stateValue - 新的生命周期状态。
   * @returns void
   */
  setSkinPackageState: (
    packageKey: string,
    stateValue: SkinPackageState
  ) => void;
  /**
   * 更新皮肤初始化状态。
   *
   * @param status - 初始化状态。
   * @param usedFallback - 是否发生安全回退。
   * @returns void
   */
  setSkinInitStatus: (status: SkinInitStatus, usedFallback?: boolean) => void;
  /**
   * 标记当日正式申报已完成。
   *
   * @param reportedAt - 写入 `lastReportedAt` 的 ISO 时间戳。
   * @returns void
   */
  applyFormalReport: (reportedAt: string) => void;
}

/**
 * 绑定到 `AppState` 的全局 zustand 存储。
 *
 * @returns 由 zustand `create` 返回的 Hook API（支持选择器订阅）。
 */
export const useAppStore: UseBoundStore<StoreApi<AppState>> = create<AppState>(
  set => ({
    homeSummary: { ...defaultHomeSummary },
    locale: LocaleType.ZH_CN,
    localeMode: 'system',
    selectedSkinId: appSkinConfig.defaultSkinId,
    activeSkinId: appSkinConfig.defaultSkinId,
    lastReadySkinId: appSkinConfig.defaultSkinId,
    skinPackageStates: { ...defaultSkinPackageStates },
    skinInitStatus: 'idle',
    skinInitUsedFallback: false,
    setManualLocale: locale => set({ locale, localeMode: 'manual' }),
    useSystemLocale: () => set({ localeMode: 'system' }),
    setSelectedSkinId: skinId => set({ selectedSkinId: skinId }),
    setActiveSkinId: skinId =>
      set(state => ({
        activeSkinId: skinId,
        lastReadySkinId: skinId,
        selectedSkinId: state.selectedSkinId
      })),
    setSkinPackageState: (packageKey, stateValue) =>
      set(state => ({
        skinPackageStates: {
          ...state.skinPackageStates,
          [packageKey]: stateValue
        }
      })),
    setSkinInitStatus: (skinInitStatus, skinInitUsedFallback = false) =>
      set({
        skinInitStatus,
        skinInitUsedFallback
      }),
    applyFormalReport: reportedAt =>
      set(state => ({
        homeSummary: {
          ...state.homeSummary,
          isReportedToday: true,
          lastReportedAt: reportedAt
        }
      }))
  })
);
