/**
 * 首页仪表盘聚合数据，供全局 store 与预览逻辑共用。
 */
export interface HomeSummary {
  /** 连续完成正式申报的天数。 */
  streakDays: number;
  /** 摘要中的线下类事项数量。 */
  offlineItemCount: number;
  /** 摘要中的线上类事项数量。 */
  onlineItemCount: number;
  /** 当日是否已完成正式申报。 */
  isReportedToday: boolean;
  /** 最近一次正式申报的 ISO 时间戳；从未申报则为 `null`。 */
  lastReportedAt: string | null;
}
