import React from 'react';
import { fireEvent, render, screen } from '../../support/render-app';

import zhCN from '../../../src/locals/zh-CN.json';
import { WelcomeScreen } from '../../../src/pages/welcome/WelcomeScreen';

const defaultCopy = {
  brand: zhCN['welcome.brand'],
  eyebrow: zhCN['welcome.eyebrow'],
  title: zhCN['welcome.title'],
  body: zhCN['welcome.body'],
  primaryButton: zhCN['welcome.primaryButton'],
  bookletRibbon: zhCN['welcome.bookletRibbon'],
  bookletLine1: zhCN['welcome.bookletLine1'],
  bookletLine2: zhCN['welcome.bookletLine2'],
  bookletLine3: zhCN['welcome.bookletLine3']
};

test('renders welcome copy and triggers start action', () => {
  const onStart = jest.fn();

  render(<WelcomeScreen onStart={onStart} copy={defaultCopy} />);

  expect(screen.getByText(zhCN['welcome.brand'])).toBeTruthy();
  expect(screen.getByText(zhCN['welcome.primaryButton'])).toBeTruthy();

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['welcome.primaryButton'] })
  );
  expect(onStart).toHaveBeenCalledTimes(1);
});

test('renders the decorative stack and single primary action only', () => {
  render(<WelcomeScreen onStart={() => {}} copy={defaultCopy} />);

  expect(screen.getByText(zhCN['welcome.primaryButton'])).toBeTruthy();
  expect(screen.queryByText('Legacy onboarding CTA label')).toBeNull();
});
