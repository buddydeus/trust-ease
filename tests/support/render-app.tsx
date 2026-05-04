import React from 'react';
import {
  fireEvent,
  render as rtlRender,
  screen,
  waitFor,
  within,
  type RenderOptions
} from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';

import { appTheme } from '../../src/theme';

function AppProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={appTheme}>{children}</ThemeProvider>;
}

export function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, { ...options, wrapper: AppProviders });
}

export { fireEvent, screen, waitFor, within };
