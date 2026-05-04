import {
  getPreviewConfigFromSearch,
  getPreviewHomeSummary
} from '../../src/store/preview/config';

test('parses locale, route and screen-state preview params from URL search', () => {
  const preview = getPreviewConfigFromSearch(
    '?preview=1&locale=en-US&route=%2Freport&homeState=unreported'
  );

  expect(preview).toEqual({
    enabled: true,
    locale: 'en-US',
    route: '/report',
    homeState: 'unreported'
  });
});

test('ignores unsupported preview params', () => {
  const preview = getPreviewConfigFromSearch(
    '?preview=1&locale=en-GB&homeState=unknown'
  );

  expect(preview).toEqual({
    enabled: true,
    locale: null,
    route: null,
    homeState: null
  });
});

test('rejects protocol-relative and external-looking preview routes', () => {
  expect(
    getPreviewConfigFromSearch('?preview=1&route=%2F%2Fevil.example%2Fpath')
      .route
  ).toBeNull();

  expect(
    getPreviewConfigFromSearch('?preview=1&route=https%3A%2F%2Fevil.example%2F')
      .route
  ).toBeNull();
});

test('returns the default home summary when no preview state override is set', () => {
  expect(getPreviewHomeSummary(null)).toEqual({
    streakDays: 128,
    offlineItemCount: 3,
    onlineItemCount: 3,
    isReportedToday: false,
    lastReportedAt: null
  });
});

test('returns the unreported home summary when preview state requires it', () => {
  expect(getPreviewHomeSummary('unreported')).toEqual({
    streakDays: 128,
    offlineItemCount: 0,
    onlineItemCount: 0,
    isReportedToday: false,
    lastReportedAt: null
  });
});
