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
  expect(screen.getByText('Sea Salt Teal')).toBeTruthy();

  fireEvent.press(screen.getByRole('button', { name: zhCN['my.skinTitle'] }));
  fireEvent.press(screen.getAllByText('Sea Salt Teal')[1]);

  expect(setActiveSkin).toHaveBeenCalledWith('skin-001');
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

test('my route opens the trigger-state settings page', () => {
  const pushMock = router.push as jest.Mock;
  pushMock.mockClear();

  render(<MyRoute />);

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['my.openTriggerState'] })
  );

  expect(pushMock).toHaveBeenCalledWith('/my/trigger-state');
});
