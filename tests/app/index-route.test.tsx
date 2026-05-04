import React from 'react';
import { render, screen, waitFor } from '../support/render-app';

jest.mock('../../src/store', () => {
  const actual =
    jest.requireActual<typeof import('../../src/store')>('../../src/store');
  return {
    ...actual,
    loadHasSeenWelcome: jest.fn()
  };
});

jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text } = require('react-native');
    return <Text>{href}</Text>;
  }
}));

import { loadHasSeenWelcome } from '../../src/store';
import IndexRoute from '../../src/app/index';

test('redirects first launch to welcome', async () => {
  (loadHasSeenWelcome as jest.Mock).mockResolvedValue(false);

  render(<IndexRoute />);

  await waitFor(() => {
    expect(screen.getByText('/welcome')).toBeTruthy();
  });
});

test('redirects returning launch to report', async () => {
  (loadHasSeenWelcome as jest.Mock).mockResolvedValue(true);

  render(<IndexRoute />);

  await waitFor(() => {
    expect(screen.getByText('/report')).toBeTruthy();
  });
});
