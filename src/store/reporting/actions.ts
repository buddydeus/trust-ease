import { useAppStore } from '../useAppStore';

/**
 * 以命令式方式写入一次正式申报时间戳（路由等无 Hook 场景使用）。
 *
 * @param reportedAt - ISO-8601 时间串，写入 `lastReportedAt`。
 * @returns void
 */
export const applyFormalReport = (reportedAt: string): void => {
  useAppStore.getState().applyFormalReport(reportedAt);
};
