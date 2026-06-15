import React from 'react';
import { fireEvent, render, screen, waitFor } from '../support/render-app';

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() }
}));

jest.mock('../../src/store/onboarding/storage', () => ({
  saveHasSeenWelcome: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('../../src/store/reporting/actions', () => ({
  applyFormalReport: jest.fn().mockResolvedValue(undefined)
}));

import { router } from 'expo-router';
import zhCN from '../../src/locals/zh-CN.json';
import { applyFormalReport } from '../../src/store/reporting/actions';
import { saveHasSeenWelcome } from '../../src/store/onboarding/storage';
import WelcomeRoute from '../../src/app/welcome';

test('start button persists welcome state, reports formally, and routes home', async () => {
  render(<WelcomeRoute />);

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['welcome.primaryButton'] })
  );

  await waitFor(() => {
    expect(saveHasSeenWelcome).toHaveBeenCalledWith(true);
    expect(applyFormalReport).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
  });
});
