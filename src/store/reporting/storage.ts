import AsyncStorage from '@react-native-async-storage/async-storage';

/** 正式申报记录在 AsyncStorage 中的键名。 */
const STORAGE_KEY = 'trust-ease:reporting:v1';

/** 持久化的正式申报快照。 */
export interface IReportingSnapshot {
  /** 最近一次正式申报时间。 */
  lastReportedAt?: string | null;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';

const isValidDate = (value: Date): boolean => Number.isFinite(value.getTime());

const toLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const parseReportingSnapshot = (value: unknown): IReportingSnapshot => {
  if (!isRecord(value)) {
    return { lastReportedAt: null };
  }

  if (!('lastReportedAt' in value) || value.lastReportedAt === null) {
    return { lastReportedAt: null };
  }

  if (!isString(value.lastReportedAt)) {
    return { lastReportedAt: null };
  }

  const reportedAt = new Date(value.lastReportedAt);

  if (!isValidDate(reportedAt)) {
    return { lastReportedAt: null };
  }

  return { lastReportedAt: value.lastReportedAt };
};

/**
 * 判断某次申报是否落在给定本地自然日。
 *
 * @param reportedAt - 最近一次正式申报时间。
 * @param now - 用于比较的当前时间，默认取当前设备时间。
 * @returns 同一本地自然日返回 `true`。
 */
export const isFormalReportForLocalDay = (
  reportedAt: string | null,
  now: Date = new Date()
): boolean => {
  if (!reportedAt || !isValidDate(now)) {
    return false;
  }

  const reportDate = new Date(reportedAt);

  if (!isValidDate(reportDate)) {
    return false;
  }

  return toLocalDateKey(reportDate) === toLocalDateKey(now);
};

/**
 * 读取最近一次正式申报时间。
 *
 * @returns 最近一次申报 ISO 时间；缺失或损坏时返回 `null`。
 */
export const loadLastFormalReportAt = async (): Promise<string | null> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return parseReportingSnapshot(JSON.parse(raw)).lastReportedAt ?? null;
  } catch {
    return null;
  }
};

/**
 * 持久化最近一次正式申报时间。
 *
 * @param reportedAt - ISO-8601 时间串。
 * @returns 写入完成后的 Promise。
 */
export const saveLastFormalReportAt = async (
  reportedAt: string
): Promise<void> => {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(parseReportingSnapshot({ lastReportedAt: reportedAt }))
  );
};

/**
 * 清理正式申报快照，供测试或后续重置流程使用。
 *
 * @returns 清理完成后的 Promise。
 */
export const clearFormalReportSnapshot = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
