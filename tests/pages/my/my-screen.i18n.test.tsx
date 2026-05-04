import { fireEvent, render, screen } from '../../support/render-app';

import { MyScreen } from '../../../src/pages/my/MyScreen';

test('renders language preferences section on my screen', () => {
  render(
    <MyScreen
      copy={{
        title: 'My',
        statusLabel: 'Current status',
        statusValue: 'Checked in today',
        triggerStateTitle: 'Trigger status',
        triggerStateSummary: 'Death: 3 missed check-ins',
        identityTitle: 'Identity & Security',
        identitySummary: 'Identity, password, and recovery options',
        languageTitle: 'Language',
        languageSummary: 'Follow system or choose manually',
        skinTitle: 'Style',
        skinSummary: 'Choose layout and color treatment',
        skinPickerOpen: 'Choose',
        skinPickerClose: 'Close',
        skinCurrent: 'Current',
        skinUpgradeRequired: 'App update required',
        skinUnavailable: 'Unavailable',
        openTriggerState: 'Open trigger status',
        followSystem: 'Follow System',
        simplifiedChinese: 'Simplified Chinese',
        traditionalChinese: 'Traditional Chinese',
        english: 'English'
      }}
      onUseSystemLocale={jest.fn()}
      onSetManualLocale={jest.fn()}
    />
  );

  expect(screen.getByText('Language')).toBeTruthy();
  expect(screen.getByText('Follow system or choose manually')).toBeTruthy();
  expect(screen.getByText('Style')).toBeTruthy();
  expect(screen.getByText('Follow System')).toBeTruthy();

  fireEvent.press(screen.getByRole('button', { name: 'Language' }));

  expect(screen.getByText('English')).toBeTruthy();
});
