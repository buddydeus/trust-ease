describe('reporting actions', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('applies a formal report timestamp and keeps the day reported', () => {
    const { applyFormalReport } = require('../../src/store/reporting/actions');
    const { useAppStore } = require('../../src/store/useAppStore');
    const reportedAt = '2026-05-05T09:30:00.000Z';

    applyFormalReport(reportedAt);

    const state = useAppStore.getState();
    expect(state.homeSummary.lastReportedAt).toBe(reportedAt);
    expect(state.homeSummary.isReportedToday).toBe(true);
  });
});
