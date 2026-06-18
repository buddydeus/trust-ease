import { render, screen } from '../../support/render-app';

jest.mock('expo-router', () => ({
  Tabs: (() => {
    const React = require('react');
    const { Text, View } = require('react-native');
    return Object.assign(
      ({
        children,
        screenOptions
      }: {
        children: React.ReactNode;
        screenOptions: { tabBarLabelStyle?: { fontSize?: number } };
      }) =>
        React.createElement(
          View,
          null,
          React.createElement(
            Text,
            null,
            `label-size:${screenOptions.tabBarLabelStyle?.fontSize}`
          ),
          children
        ),
      {
        Screen: ({
          options
        }: {
          options: { title: string; tabBarIcon?: Function };
        }) =>
          React.createElement(
            View,
            null,
            React.createElement(Text, null, options.title),
            options.tabBarIcon
              ? React.createElement(
                  View,
                  { testID: `tab-icon-${options.title}` },
                  options.tabBarIcon({ focused: true })
                )
              : null
          )
      }
    );
  })(),
  router: {
    push: jest.fn()
  }
}));

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn()
}));

jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'file://documents/',
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn()
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(async () => false),
  shareAsync: jest.fn()
}));

import HomeRoute from '../../../src/app/(tabs)/home';
import ItemsRoute from '../../../src/app/(tabs)/items';
import MyRoute from '../../../src/app/(tabs)/my';
import TabsLayout from '../../../src/app/(tabs)/_layout';
import zhCN from '../../../src/locals/zh-CN.json';

test('tab routes render their redesigned feature screens', async () => {
  render(<HomeRoute />);
  expect(screen.getByText(zhCN['home.statusLabel'])).toBeTruthy();
  expect(
    screen.getAllByText(zhCN['home.dailyStatus.pending']).length
  ).toBeGreaterThan(0);
  expect(await screen.findByText(zhCN['home.readiness.heading'])).toBeTruthy();

  render(<ItemsRoute />);
  expect(screen.getByText(zhCN['items.title'])).toBeTruthy();
  expect(await screen.findByText(zhCN['items.emptyTitle'])).toBeTruthy();

  render(<MyRoute />);
  expect(screen.getByText(zhCN['my.title'])).toBeTruthy();
});

test('tabs layout exposes the three tab routes', () => {
  render(<TabsLayout />);

  expect(screen.getByText(zhCN['tabs.home'])).toBeTruthy();
  expect(screen.getByText(zhCN['tabs.items'])).toBeTruthy();
  expect(screen.getByText(zhCN['tabs.my'])).toBeTruthy();
  expect(screen.getByText('label-size:10')).toBeTruthy();
  expect(screen.getByTestId(`tab-icon-${zhCN['tabs.home']}`)).toBeTruthy();
  expect(screen.getByTestId(`tab-icon-${zhCN['tabs.items']}`)).toBeTruthy();
  expect(screen.getByTestId(`tab-icon-${zhCN['tabs.my']}`)).toBeTruthy();
});
