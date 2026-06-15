import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  clearFormalReportSnapshot,
  isFormalReportForLocalDay,
  loadLastFormalReportAt,
  saveLastFormalReportAt
} from '../../src/store/reporting/storage';

const STORAGE_KEY = 'trust-ease:reporting:v1';

describe('reporting storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test('defaults to no report when storage is empty', async () => {
    await expect(loadLastFormalReportAt()).resolves.toBeNull();
  });

  test('round-trips the last formal report timestamp', async () => {
    const reportedAt = '2026-06-15T09:30:00.000Z';

    await saveLastFormalReportAt(reportedAt);

    await expect(loadLastFormalReportAt()).resolves.toBe(reportedAt);
  });

  test('ignores malformed or invalid persisted data', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, '{not-json');

    await expect(loadLastFormalReportAt()).resolves.toBeNull();

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lastReportedAt: 'not-a-date' })
    );

    await expect(loadLastFormalReportAt()).resolves.toBeNull();
  });

  test('checks formal reports by local calendar day', () => {
    const sameDayReportedAt = new Date(2026, 5, 15, 9, 30).toISOString();
    const previousDayReportedAt = new Date(2026, 5, 14, 21, 8).toISOString();

    expect(
      isFormalReportForLocalDay(sameDayReportedAt, new Date(2026, 5, 15, 20, 0))
    ).toBe(true);
    expect(
      isFormalReportForLocalDay(
        previousDayReportedAt,
        new Date(2026, 5, 15, 9, 0)
      )
    ).toBe(false);
  });

  test('clears the persisted formal report snapshot', async () => {
    await saveLastFormalReportAt('2026-06-15T09:30:00.000Z');

    await clearFormalReportSnapshot();

    await expect(loadLastFormalReportAt()).resolves.toBeNull();
  });
});
