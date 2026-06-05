import { fireEvent, render, screen } from '../../support/render-app';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn()
  }
}));

import { router } from 'expo-router';

import MyRoute from '../../../src/app/(tabs)/my';
import zhCN from '../../../src/locals/zh-CN.json';
import { MyScreen } from '../../../src/pages/my/MyScreen';

test('renders the calm my page with trigger-state and identity sections', () => {
  render(<MyScreen />);

  expect(screen.getByText(zhCN['my.title'])).toBeTruthy();
  expect(screen.getByText(zhCN['my.triggerStateTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['my.helpersTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['my.identityTitle'])).toBeTruthy();
});

test('renders and switches runtime skin options from the my page dropdown', () => {
  const setActiveSkin = jest.fn();

  render(
    <MyScreen
      skinOptions={[
        {
          skinId: 'skin-001',
          displayName: 'Sea Salt Teal',
          compatibility: { kind: 'compatible' }
        }
      ]}
      activeSkinId="skin-001"
      onSetActiveSkin={setActiveSkin}
    />
  );

  expect(screen.getByText(zhCN['my.skinTitle'])).toBeTruthy();
  expect(screen.getAllByText('Sea Salt Teal').length).toBeGreaterThan(0);

  fireEvent.press(screen.getByRole('button', { name: zhCN['my.skinTitle'] }));
  const seaSaltOptions = screen.getAllByText('Sea Salt Teal');
  fireEvent.press(seaSaltOptions[seaSaltOptions.length - 1]);

  expect(setActiveSkin).toHaveBeenCalledWith('skin-001');
});

test('renders the default skin runtime ready status', () => {
  render(
    <MyScreen
      skinOptions={[
        {
          skinId: 'skin-001',
          displayName: 'Sea Salt Teal',
          compatibility: { kind: 'compatible' }
        }
      ]}
      skinRuntimeStatus={{
        activeSkinId: 'skin-001',
        skinInitStatus: 'ready',
        skinInitUsedFallback: false,
        skinPackageStates: {
          'skin-001@1.0.0': 'ready'
        }
      }}
    />
  );

  expect(screen.getByText(zhCN['my.skinRuntimeTitle'])).toBeTruthy();
  expect(screen.getAllByText('Sea Salt Teal').length).toBeGreaterThan(0);
  expect(
    screen.getAllByText(zhCN['my.skinRuntimeStatusReady']).length
  ).toBeGreaterThan(0);
});

test('renders a fallback note when skin initialization used fallback', () => {
  render(
    <MyScreen
      skinRuntimeStatus={{
        activeSkinId: 'skin-001',
        skinInitStatus: 'fallback',
        skinInitUsedFallback: true,
        skinPackageStates: {}
      }}
    />
  );

  expect(screen.getByText(zhCN['my.skinRuntimeFallback'])).toBeTruthy();
});

test('renders failed and incompatible package states calmly', () => {
  render(
    <MyScreen
      skinOptions={[
        {
          skinId: 'skin-002',
          displayName: 'Evening Blue',
          compatibility: { kind: 'compatible' }
        },
        {
          skinId: 'skin-003',
          displayName: 'Soft Sand',
          compatibility: { kind: 'compatible' }
        }
      ]}
      skinRuntimeStatus={{
        activeSkinId: 'skin-001',
        skinInitStatus: 'ready',
        skinInitUsedFallback: false,
        skinPackageStates: {
          'skin-002@1.0.0': 'failed',
          'skin-003@1.0.0': 'incompatible'
        }
      }}
    />
  );

  expect(screen.getAllByText('Evening Blue').length).toBeGreaterThan(0);
  expect(
    screen.getAllByText(zhCN['my.skinPackageStateFailed']).length
  ).toBeGreaterThan(0);
  expect(screen.getAllByText('Soft Sand').length).toBeGreaterThan(0);
  expect(
    screen.getByText(zhCN['my.skinPackageStateIncompatible'])
  ).toBeTruthy();
});

test('renders and switches language options from the my page dropdown', () => {
  const useSystemLocale = jest.fn();
  const setManualLocale = jest.fn();

  render(
    <MyScreen
      onUseSystemLocale={useSystemLocale}
      onSetManualLocale={setManualLocale}
    />
  );

  expect(screen.getByText(zhCN['my.languageTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['my.followSystem'])).toBeTruthy();

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['my.languageTitle'] })
  );
  fireEvent.press(screen.getByText(zhCN['my.english']));

  expect(setManualLocale).toHaveBeenCalledWith('en-US');
});

test('renders remote QA ready package state through status props', () => {
  render(
    <MyScreen
      skinOptions={[
        {
          skinId: 'skin-qa-remote',
          displayName: 'Remote QA Skin',
          compatibility: { kind: 'compatible' }
        }
      ]}
      skinRuntimeStatus={{
        activeSkinId: 'skin-qa-remote',
        skinInitStatus: 'ready',
        skinInitUsedFallback: false,
        skinPackageStates: {
          'skin-qa-remote@1.0.0': 'ready'
        }
      }}
    />
  );

  expect(screen.getAllByText('Remote QA Skin').length).toBeGreaterThan(0);
  expect(
    screen.getAllByText(zhCN['my.skinPackageStateReady']).length
  ).toBeGreaterThan(0);
});

test('renders remote QA failed package state through status props', () => {
  render(
    <MyScreen
      skinOptions={[
        {
          skinId: 'skin-qa-remote',
          displayName: 'Remote QA Skin',
          compatibility: { kind: 'compatible' }
        }
      ]}
      skinRuntimeStatus={{
        activeSkinId: 'skin-001',
        skinInitStatus: 'ready',
        skinInitUsedFallback: false,
        skinPackageStates: {
          'skin-qa-remote@1.0.0': 'failed'
        }
      }}
    />
  );

  expect(screen.getAllByText('Remote QA Skin').length).toBeGreaterThan(0);
  expect(
    screen.getAllByText(zhCN['my.skinPackageStateFailed']).length
  ).toBeGreaterThan(0);
});

test('my route opens the trigger-state settings page', () => {
  const pushMock = router.push as jest.Mock;
  pushMock.mockClear();

  render(<MyRoute />);

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['my.openTriggerState'] })
  );

  expect(pushMock).toHaveBeenCalledWith('/my/trigger-state');
});

test('my route opens local helper management', () => {
  const pushMock = router.push as jest.Mock;
  pushMock.mockClear();

  render(<MyRoute />);

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['my.openHelpers'] })
  );

  expect(pushMock).toHaveBeenCalledWith('/helpers');
});
