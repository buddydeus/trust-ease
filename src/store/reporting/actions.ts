import { useAppStore } from '../useAppStore';

import {
  isFormalReportForLocalDay,
  loadLastFormalReportAt,
  saveLastFormalReportAt
} from './storage';

/** 恢复到全局 store 的正式申报状态。 */
export interface IFormalReportState {
  /** 最近一次正式申报时间。 */
  lastReportedAt: string | null;
  /** 给定本地自然日是否已经完成正式申报。 */
  isReportedToday: boolean;
}

const commitFormalReportState = ({
  isReportedToday,
  lastReportedAt
}: IFormalReportState): void => {
  useAppStore.setState(state => ({
    homeSummary: {
      ...state.homeSummary,
      isReportedToday,
      lastReportedAt
    }
  }));
};

/**
 * 以命令式方式写入一次正式申报时间戳（路由等无 Hook 场景使用）。
 *
 * @param reportedAt - ISO-8601 时间串，写入 `lastReportedAt`。
 * @returns 写入完成后的 Promise。
 */
export const applyFormalReport = async (reportedAt: string): Promise<void> => {
  useAppStore.getState().applyFormalReport(reportedAt);
  await saveLastFormalReportAt(reportedAt);
};

/**
 * 从持久化快照恢复最近一次正式申报，并按本地自然日判断今日状态。
 *
 * @param now - 用于判断“今天”的时间，默认取当前设备时间。
 * @returns 已恢复的正式申报状态。
 */
export const loadFormalReportState = async (
  now: Date = new Date()
): Promise<IFormalReportState> => {
  const lastReportedAt = await loadLastFormalReportAt();
  const state = {
    lastReportedAt,
    isReportedToday: isFormalReportForLocalDay(lastReportedAt, now)
  };

  commitFormalReportState(state);

  return state;
};
