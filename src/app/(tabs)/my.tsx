import { router } from 'expo-router';

import { memo, useMemo, useState } from 'react';

import { useI18n } from '../../i18n';
import { MyScreen } from '../../pages/my/MyScreen';
import { loadConfiguredBundledSkinPackages } from '../../skin';
import { useAppStore } from '../../store';
import {
  type ILocalTrustBackupFileAdapter,
  type ILocalTrustBackupPreview,
  type ITrustDataSnapshot,
  type LocalTrustBackupImportError,
  confirmLocalTrustBackupImport,
  exportLocalTrustBackup,
  loadTrustDataSnapshot,
  previewLocalTrustBackupImport,
  saveTrustDataSnapshot
} from '../../store/trust';

import { createExpoBackupFileAdapter } from './backupFileAdapter';

export interface IMyRouteProps {
  backupFileAdapter?: ILocalTrustBackupFileAdapter;
}

type BackupStatus = 'exported' | 'import-ready' | 'imported' | 'cancelled';
type BackupError =
  | LocalTrustBackupImportError
  | 'read-failed'
  | 'write-failed'
  | 'save-failed';

const MyRoute = memo<IMyRouteProps>(({ backupFileAdapter }) => {
  const { getMessage, setManualLocale, useSystemLocale } = useI18n();
  const activeSkinId = useAppStore(state => state.activeSkinId);
  const skinInitStatus = useAppStore(state => state.skinInitStatus);
  const skinInitUsedFallback = useAppStore(state => state.skinInitUsedFallback);
  const skinPackageStates = useAppStore(state => state.skinPackageStates);
  const setActiveSkinId = useAppStore(state => state.setActiveSkinId);

  const fileAdapter = useMemo(
    () => backupFileAdapter || createExpoBackupFileAdapter(),
    [backupFileAdapter]
  );
  const [backupPreview, setBackupPreview] =
    useState<ILocalTrustBackupPreview | null>(null);
  const [pendingImportSnapshot, setPendingImportSnapshot] =
    useState<ITrustDataSnapshot | null>(null);
  const [backupStatus, setBackupStatus] = useState<BackupStatus | null>(null);
  const [backupError, setBackupError] = useState<BackupError | null>(null);

  const copy = {
    title: getMessage('my.title'),
    statusLabel: getMessage('my.statusLabel'),
    statusValue: getMessage('my.statusValue'),
    triggerStateTitle: getMessage('my.triggerStateTitle'),
    triggerStateSummary: getMessage('my.triggerStateSummary'),
    helpersTitle: getMessage('my.helpersTitle'),
    helpersSummary: getMessage('my.helpersSummary'),
    identityTitle: getMessage('my.identityTitle'),
    identitySummary: getMessage('my.identitySummary'),
    languageTitle: getMessage('my.languageTitle'),
    languageSummary: getMessage('my.languageSummary'),
    skinTitle: getMessage('my.skinTitle'),
    skinSummary: getMessage('my.skinSummary'),
    skinPickerOpen: getMessage('my.skinPickerOpen'),
    skinPickerClose: getMessage('my.skinPickerClose'),
    skinCurrent: getMessage('my.skinCurrent'),
    skinUpgradeRequired: getMessage('my.skinUpgradeRequired'),
    skinUnavailable: getMessage('my.skinUnavailable'),
    skinRuntimeTitle: getMessage('my.skinRuntimeTitle'),
    skinRuntimeActive: getMessage('my.skinRuntimeActive'),
    skinRuntimeInitStatus: getMessage('my.skinRuntimeInitStatus'),
    skinRuntimeFallback: getMessage('my.skinRuntimeFallback'),
    skinRuntimePackageStates: getMessage('my.skinRuntimePackageStates'),
    skinRuntimeStatusIdle: getMessage('my.skinRuntimeStatusIdle'),
    skinRuntimeStatusInitializing: getMessage(
      'my.skinRuntimeStatusInitializing'
    ),
    skinRuntimeStatusReady: getMessage('my.skinRuntimeStatusReady'),
    skinRuntimeStatusFallback: getMessage('my.skinRuntimeStatusFallback'),
    skinRuntimeStatusFailed: getMessage('my.skinRuntimeStatusFailed'),
    skinPackageStateIdle: getMessage('my.skinPackageStateIdle'),
    skinPackageStateChecking: getMessage('my.skinPackageStateChecking'),
    skinPackageStateDownloading: getMessage('my.skinPackageStateDownloading'),
    skinPackageStateReady: getMessage('my.skinPackageStateReady'),
    skinPackageStateFailed: getMessage('my.skinPackageStateFailed'),
    skinPackageStateIncompatible: getMessage('my.skinPackageStateIncompatible'),
    openTriggerState: getMessage('my.openTriggerState'),
    openHelpers: getMessage('my.openHelpers'),
    backupTitle: getMessage('my.backupTitle'),
    backupSummary: getMessage('my.backupSummary'),
    backupLocalOnlyNotice: getMessage('my.backupLocalOnlyNotice'),
    backupSensitiveNotice: getMessage('my.backupSensitiveNotice'),
    backupExportAction: getMessage('my.backupExportAction'),
    backupImportAction: getMessage('my.backupImportAction'),
    backupPreviewTitle: getMessage('my.backupPreviewTitle'),
    backupPreviewExportedAt: getMessage('my.backupPreviewExportedAt'),
    backupPreviewItems: getMessage('my.backupPreviewItems'),
    backupPreviewHelpers: getMessage('my.backupPreviewHelpers'),
    backupPreviewTriggerOn: getMessage('my.backupPreviewTriggerOn'),
    backupPreviewTriggerOff: getMessage('my.backupPreviewTriggerOff'),
    backupPreviewSimulationOn: getMessage('my.backupPreviewSimulationOn'),
    backupPreviewSimulationOff: getMessage('my.backupPreviewSimulationOff'),
    backupReplaceWarning: getMessage('my.backupReplaceWarning'),
    backupConfirmImport: getMessage('my.backupConfirmImport'),
    backupCancelImport: getMessage('my.backupCancelImport'),
    followSystem: getMessage('my.followSystem'),
    simplifiedChinese: getMessage('my.simplifiedChinese'),
    traditionalChinese: getMessage('my.traditionalChinese'),
    english: getMessage('my.english')
  };

  const skinOptions = loadConfiguredBundledSkinPackages().map(skinPackage => ({
    skinId: skinPackage.manifest.skinId,
    displayName: skinPackage.manifest.displayName,
    compatibility: skinPackage.compatibility
  }));

  const statusMessage = backupStatus
    ? {
        exported: getMessage('my.backupStatusExported'),
        'import-ready': getMessage('my.backupStatusImportReady'),
        imported: getMessage('my.backupStatusImported'),
        cancelled: getMessage('my.backupStatusCancelled')
      }[backupStatus]
    : null;

  const errorMessage = backupError
    ? {
        'malformed-json': getMessage('my.backupErrorMalformed'),
        'invalid-envelope': getMessage('my.backupErrorInvalid'),
        'invalid-snapshot': getMessage('my.backupErrorInvalid'),
        'unsupported-backup-version': getMessage('my.backupErrorUnsupported'),
        'unsupported-trust-version': getMessage('my.backupErrorUnsupported'),
        'read-failed': getMessage('my.backupErrorReadFailed'),
        'write-failed': getMessage('my.backupErrorWriteFailed'),
        'save-failed': getMessage('my.backupErrorSaveFailed')
      }[backupError]
    : null;

  const clearBackupFeedback = () => {
    setBackupStatus(null);
    setBackupError(null);
  };

  const handleOpenTriggerState = () => {
    router.push('/my/trigger-state');
  };

  const handleOpenHelpers = () => {
    router.push('/helpers' as never);
  };

  const handleExportBackup = async () => {
    clearBackupFeedback();
    const result = await exportLocalTrustBackup({
      loadSnapshot: loadTrustDataSnapshot,
      writeBackup: fileAdapter.writeBackup
    });

    if (result.ok) {
      setBackupStatus('exported');

      return;
    }

    setBackupError(result.reason);
  };

  const handleImportBackup = async () => {
    clearBackupFeedback();
    const result = await previewLocalTrustBackupImport({
      readBackup: fileAdapter.readBackup
    });

    if (!result.ok) {
      setBackupPreview(null);
      setPendingImportSnapshot(null);
      setBackupStatus(result.reason === 'cancelled' ? 'cancelled' : null);
      setBackupError(result.reason === 'cancelled' ? null : result.reason);

      return;
    }

    setPendingImportSnapshot(result.snapshot);
    setBackupPreview(result.preview);
    setBackupStatus('import-ready');
  };

  const handleConfirmBackupImport = async () => {
    if (!pendingImportSnapshot) {
      return;
    }

    clearBackupFeedback();
    const result = await confirmLocalTrustBackupImport({
      snapshot: pendingImportSnapshot,
      saveSnapshot: saveTrustDataSnapshot
    });

    if (result.ok) {
      setBackupPreview(null);
      setPendingImportSnapshot(null);
      setBackupStatus('imported');

      return;
    }

    setBackupError(result.reason);
  };

  const handleCancelBackupImport = () => {
    setBackupPreview(null);
    setPendingImportSnapshot(null);
    setBackupError(null);
    setBackupStatus('cancelled');
  };

  return (
    <MyScreen
      copy={copy}
      onOpenHelpers={handleOpenHelpers}
      onOpenTriggerState={handleOpenTriggerState}
      onSetManualLocale={setManualLocale}
      onUseSystemLocale={useSystemLocale}
      backupPreview={backupPreview}
      backupStatusMessage={statusMessage}
      backupErrorMessage={errorMessage}
      onExportBackup={handleExportBackup}
      onImportBackup={handleImportBackup}
      onConfirmBackupImport={handleConfirmBackupImport}
      onCancelBackupImport={handleCancelBackupImport}
      activeSkinId={activeSkinId}
      skinRuntimeStatus={{
        activeSkinId,
        skinInitStatus,
        skinInitUsedFallback,
        skinPackageStates
      }}
      skinOptions={skinOptions}
      onSetActiveSkin={setActiveSkinId}
    />
  );
});

MyRoute.displayName = 'MyRoute';

export default MyRoute;
