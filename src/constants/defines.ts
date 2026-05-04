import { type HomeSummary } from './types';

/**
 * 默认首页摘要：在后端未接入前作为占位数据，亦被预览工具克隆使用。
 */
export const defaultHomeSummary: HomeSummary = {
  streakDays: 128,
  offlineItemCount: 3,
  onlineItemCount: 3,
  isReportedToday: false,
  lastReportedAt: null
};
