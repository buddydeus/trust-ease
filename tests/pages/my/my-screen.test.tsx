import { fireEvent, render, screen } from '../../support/render-app';
import { waitFor } from '../../support/render-app';

jest.mock('expo-router', () => ({
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

import { router } from 'expo-router';

import MyRoute from '../../../src/app/(tabs)/my';
import zhCN from '../../../src/locals/zh-CN.json';
import { MyScreen } from '../../../src/pages/my/MyScreen';
import {
  clearTrustDataSnapshot,
  loadTrustDataSnapshot,
  serializeLocalTrustBackup
} from '../../../src/store/trust';

import type { ITrustDataSnapshot } from '../../../src/store/trust';

const createBackupSnapshot = (): ITrustDataSnapshot => ({
  schemaVersion: 1,
  items: [
    {
      id: 'backup-item',
      title: 'Local backup item',
      kind: 'offline',
      summary: 'Imported from backup',
      helperIds: ['backup-helper'],
      status: 'active',
      createdAt: '2026-06-05T12:00:00.000Z',
      updatedAt: '2026-06-05T12:00:00.000Z'
    }
  ],
  helpers: [
    {
      id: 'backup-helper',
      displayName: 'Backup helper',
      relationship: 'Family',
      contactMethod: 'Phone',
      notes: '',
      status: 'active',
      createdAt: '2026-06-05T12:00:00.000Z',
      updatedAt: '2026-06-05T12:00:00.000Z'
    }
  ],
  triggerPolicy: {
    missedCheckInThreshold: 3,
    checkInIntervalDays: 1,
    missingStateEnabled: true,
    simulationEnabled: true,
    updatedAt: '2026-06-05T12:00:00.000Z'
  },
  updatedAt: '2026-06-05T12:00:00.000Z'
});

beforeEach(async () => {
  await clearTrustDataSnapshot();
  (router.push as jest.Mock).mockClear();
});

test('renders the calm my page with trigger-state and identity sections', () => {
  render(<MyScreen />);

  expect(screen.getByText(zhCN['my.title'])).toBeTruthy();
  expect(screen.getByText(zhCN['my.triggerStateTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['my.helpersTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['my.identityTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['my.backupTitle'])).toBeTruthy();
});

test('renders backup preview and explicit import actions from props', () => {
  const onExportBackup = jest.fn();
  const onImportBackup = jest.fn();
  const onConfirmBackupImport = jest.fn();
  const onCancelBackupImport = jest.fn();

  render(
    <MyScreen
      backupPreview={{
        exportedAt: '2026-06-05T12:00:00.000Z',
        activeItemCount: 1,
        archivedItemCount: 1,
        activeHelperCount: 2,
        archivedHelperCount: 0,
        missingStateEnabled: true,
        simulationEnabled: false,
        willReplaceCurrentData: true
      }}
      backupStatusMessage="Backup is ready to review"
      onExportBackup={onExportBackup}
      onImportBackup={onImportBackup}
      onConfirmBackupImport={onConfirmBackupImport}
      onCancelBackupImport={onCancelBackupImport}
    />
  );

  expect(screen.getByText(zhCN['my.backupTitle'])).toBeTruthy();
  expect(screen.getByText(zhCN['my.backupLocalOnlyNotice'])).toBeTruthy();
  expect(screen.getByText('Backup is ready to review')).toBeTruthy();
  expect(screen.getByText(zhCN['my.backupPreviewTitle'])).toBeTruthy();
  expect(screen.getByText('1 / 1')).toBeTruthy();
  expect(screen.getByText('2 / 0')).toBeTruthy();
  expect(screen.getByText(zhCN['my.backupReplaceWarning'])).toBeTruthy();
  expect(screen.queryByText(/cloud restore/i)).toBeNull();
  expect(screen.queryByText(/account recovery/i)).toBeNull();
  expect(screen.queryByText(/legal authority/i)).toBeNull();
  expect(screen.queryByText(/automatic delivery/i)).toBeNull();
  expect(screen.queryByText(/encryption/i)).toBeNull();

  fireEvent.press(screen.getByRole('button', { name: zhCN['my.backupExportAction'] }));
  fireEvent.press(screen.getByRole('button', { name: zhCN['my.backupImportAction'] }));
  fireEvent.press(screen.getByRole('button', { name: zhCN['my.backupConfirmImport'] }));
  fireEvent.press(screen.getByRole('button', { name: zhCN['my.backupCancelImport'] }));

  expect(onExportBackup).toHaveBeenCalledTimes(1);
  expect(onImportBackup).toHaveBeenCalledTimes(1);
  expect(onConfirmBackupImport).toHaveBeenCalledTimes(1);
  expect(onCancelBackupImport).toHaveBeenCalledTimes(1);
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

test('my route exports current trust data through backup adapter', async () => {
  const written = jest.fn(async () => ({
    ok: true as const,
    uri: 'file://backup.json'
  }));

  render(
    <MyRoute
      backupFileAdapter={{
        writeBackup: written,
        readBackup: async () => ({
          ok: false,
          reason: 'cancelled'
        })
      }}
    />
  );

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['my.backupExportAction'] })
  );

  await waitFor(() => {
    expect(written).toHaveBeenCalledTimes(1);
  });
  expect(written.mock.calls[0][0].content).toContain('"product": "trust-ease"');
  expect(screen.getByText(zhCN['my.backupStatusExported'])).toBeTruthy();
});

test('my route previews import without writing until confirmation', async () => {
  const importedSnapshot = createBackupSnapshot();
  const backupContent = serializeLocalTrustBackup(importedSnapshot, {
    exportedAt: '2026-06-05T12:00:00.000Z'
  });

  render(
    <MyRoute
      backupFileAdapter={{
        writeBackup: async () => ({
          ok: false,
          reason: 'write-failed'
        }),
        readBackup: async () => ({
          ok: true,
          content: backupContent
        })
      }}
    />
  );

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['my.backupImportAction'] })
  );

  await waitFor(() => {
    expect(screen.getByText(zhCN['my.backupPreviewTitle'])).toBeTruthy();
  });
  expect((await loadTrustDataSnapshot()).items).toEqual([]);

  fireEvent.press(
    screen.getByRole('button', { name: zhCN['my.backupConfirmImport'] })
  );

  await waitFor(async () => {
    expect((await loadTrustDataSnapshot()).items).toHaveLength(1);
  });
  expect(screen.getByText(zhCN['my.backupStatusImported'])).toBeTruthy();
});
