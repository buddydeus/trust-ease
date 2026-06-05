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
        triggerStateSummary: 'Local warning and rehearsal settings',
        helpersTitle: 'Trusted helpers',
        helpersSummary: 'Manage local helpers and link them to important items',
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
        skinRuntimeTitle: 'Style status',
        skinRuntimeActive: 'Current style',
        skinRuntimeInitStatus: 'Status',
        skinRuntimeFallback: 'Using fallback style',
        skinRuntimePackageStates: 'Package status',
        skinRuntimeStatusIdle: 'Waiting',
        skinRuntimeStatusInitializing: 'Checking style',
        skinRuntimeStatusReady: 'Style ready',
        skinRuntimeStatusFallback: 'Fallback active',
        skinRuntimeStatusFailed: 'Style unavailable',
        skinPackageStateIdle: 'Waiting',
        skinPackageStateChecking: 'Checking',
        skinPackageStateDownloading: 'Downloading',
        skinPackageStateReady: 'Ready',
        skinPackageStateFailed: 'Temporarily unavailable',
        skinPackageStateIncompatible: 'Needs update or another style',
        openTriggerState: 'Open trigger status',
        openHelpers: 'Manage trusted helpers',
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
  expect(screen.getByText('Style status')).toBeTruthy();
  expect(screen.getByText('Follow System')).toBeTruthy();

  fireEvent.press(screen.getByRole('button', { name: 'Language' }));

  expect(screen.getByText('English')).toBeTruthy();
});
