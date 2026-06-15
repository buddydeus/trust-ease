import React from 'react';
import { render, screen, waitFor } from '../support/render-app';

jest.mock('../../src/store', () => {
  const actual =
    jest.requireActual<typeof import('../../src/store')>('../../src/store');
  return {
    ...actual,
    loadFormalReportState: jest.fn(),
    loadHasSeenWelcome: jest.fn()
  };
});

jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text } = require('react-native');
    return <Text>{href}</Text>;
  }
}));

import { loadFormalReportState, loadHasSeenWelcome } from '../../src/store';
import IndexRoute from '../../src/app/index';

beforeEach(() => {
  (loadFormalReportState as jest.Mock).mockReset();
  (loadHasSeenWelcome as jest.Mock).mockReset();
});

test('redirects first launch to welcome', async () => {
  (loadHasSeenWelcome as jest.Mock).mockResolvedValue(false);

  render(<IndexRoute />);

  await waitFor(() => {
    expect(screen.getByText('/welcome')).toBeTruthy();
  });
  expect(loadFormalReportState).not.toHaveBeenCalled();
});

test('redirects returning launch to report when today is not reported', async () => {
  (loadHasSeenWelcome as jest.Mock).mockResolvedValue(true);
  (loadFormalReportState as jest.Mock).mockResolvedValue({
    isReportedToday: false,
    lastReportedAt: null
  });

  render(<IndexRoute />);

  await waitFor(() => {
    expect(screen.getByText('/report')).toBeTruthy();
  });
  expect(loadFormalReportState).toHaveBeenCalledTimes(1);
});

test('redirects returning launch to home when today is already reported', async () => {
  (loadHasSeenWelcome as jest.Mock).mockResolvedValue(true);
  (loadFormalReportState as jest.Mock).mockResolvedValue({
    isReportedToday: true,
    lastReportedAt: '2026-06-15T09:30:00.000Z'
  });

  render(<IndexRoute />);

  await waitFor(() => {
    expect(screen.getByText('/(tabs)/home')).toBeTruthy();
  });
  expect(loadFormalReportState).toHaveBeenCalledTimes(1);
});
