import AsyncStorage from '@react-native-async-storage/async-storage';

describe('reporting actions', () => {
  beforeEach(async () => {
    jest.resetModules();
    await AsyncStorage.clear();
  });

  test('applies a formal report timestamp and keeps the day reported', async () => {
    const { applyFormalReport } = require('../../src/store/reporting/actions');
    const { useAppStore } = require('../../src/store/useAppStore');
    const reportedAt = '2026-05-05T09:30:00.000Z';

    await applyFormalReport(reportedAt);

    const state = useAppStore.getState();
    expect(state.homeSummary.lastReportedAt).toBe(reportedAt);
    expect(state.homeSummary.isReportedToday).toBe(true);
  });

  test('loads formal report state from persisted storage', async () => {
    const {
      applyFormalReport,
      loadFormalReportState
    } = require('../../src/store/reporting/actions');
    const { useAppStore } = require('../../src/store/useAppStore');
    const reportedAt = new Date(2026, 5, 15, 9, 30).toISOString();

    await applyFormalReport(reportedAt);

    useAppStore.setState(state => ({
      homeSummary: {
        ...state.homeSummary,
        isReportedToday: false,
        lastReportedAt: null
      }
    }));

    await expect(
      loadFormalReportState(new Date(2026, 5, 15, 18, 0))
    ).resolves.toEqual({
      isReportedToday: true,
      lastReportedAt: reportedAt
    });

    const state = useAppStore.getState();
    expect(state.homeSummary.lastReportedAt).toBe(reportedAt);
    expect(state.homeSummary.isReportedToday).toBe(true);
  });
});
