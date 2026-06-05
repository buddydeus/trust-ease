/**
 * 设置向中枢：语言、皮肤兼容提示与进阶流程入口；props 全部由外部注入，便于视觉回归测试。
 */
import React, { useState } from 'react';

import { AppCard, AppScreen } from '../../components';
import { useI18n } from '../../i18n';
import {
  CaptionMutedText,
  CardTitleText,
  MetaMutedText,
  ScreenTitleText
} from '../../theme';

import { LanguagePicker } from './LanguagePicker';
import {
  BackupActionButton,
  BackupActionLabel,
  BackupActionRow,
  BackupNoticeText,
  BackupPreviewBlock,
  BackupPreviewLabel,
  BackupPreviewRow,
  BackupPreviewValue,
  BackupStatusText,
  MyScreenCardStack,
  StatusHighlightCard,
  StatusValueLine
} from './my.styled';
import { SettingsCard } from './SettingsCard';
import { SkinPicker } from './SkinPicker';
import { SkinRuntimeStatus } from './SkinRuntimeStatus';
import { type IMyScreenProps } from './types';

export type { IMyScreenCopy, IMyScreenProps, ISkinOption } from './types';

/**
 * 「我的」页：状态、身份、语言、皮肤与触发策略入口。
 *
 * @param props - `IMyScreenProps`
 * @returns 已 memo 的我的页元素。
 */
export const MyScreen = React.memo<IMyScreenProps>(
  ({
    onOpenTriggerState,
    onOpenHelpers,
    copy,
    onUseSystemLocale,
    onSetManualLocale,
    skinOptions = [],
    activeSkinId,
    skinRuntimeStatus,
    onSetActiveSkin,
    backupPreview,
    backupStatusMessage,
    backupErrorMessage,
    onExportBackup,
    onImportBackup,
    onConfirmBackupImport,
    onCancelBackupImport
  } = {}) => {
    const { getMessage } = useI18n();

    const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState(false);
    const [isSkinPickerOpen, setIsSkinPickerOpen] = useState(false);
    const resolvedSkinRuntimeStatus = skinRuntimeStatus ?? {
      activeSkinId: activeSkinId || 'skin-001',
      skinInitStatus: 'ready',
      skinInitUsedFallback: false,
      skinPackageStates: {
        [`${activeSkinId || 'skin-001'}@1.0.0`]: 'ready'
      }
    };

    return (
      <AppScreen>
        <ScreenTitleText>
          {copy?.title || getMessage('my.title')}
        </ScreenTitleText>
        <StatusHighlightCard>
          <CaptionMutedText>
            {copy?.statusLabel || getMessage('my.statusLabel')}
          </CaptionMutedText>
          <StatusValueLine>
            {copy?.statusValue || getMessage('my.statusValue')}
          </StatusValueLine>
        </StatusHighlightCard>
        <MyScreenCardStack>
          <SettingsCard
            accessibilityLabel={
              copy?.openTriggerState || getMessage('my.openTriggerState')
            }
            title={
              copy?.triggerStateTitle || getMessage('my.triggerStateTitle')
            }
            summary={
              copy?.triggerStateSummary || getMessage('my.triggerStateSummary')
            }
            onPress={onOpenTriggerState}
          />
          <SettingsCard
            accessibilityLabel={
              copy?.openHelpers || getMessage('my.openHelpers')
            }
            title={copy?.helpersTitle || getMessage('my.helpersTitle')}
            summary={copy?.helpersSummary || getMessage('my.helpersSummary')}
            onPress={onOpenHelpers}
          />
          <SettingsCard
            title={copy?.identityTitle || getMessage('my.identityTitle')}
            summary={copy?.identitySummary || getMessage('my.identitySummary')}
          />
          <AppCard>
            <CardTitleText>
              {copy?.backupTitle || getMessage('my.backupTitle')}
            </CardTitleText>
            <MetaMutedText marginTop={8}>
              {copy?.backupSummary || getMessage('my.backupSummary')}
            </MetaMutedText>
            <BackupNoticeText>
              {copy?.backupLocalOnlyNotice ||
                getMessage('my.backupLocalOnlyNotice')}
            </BackupNoticeText>
            <BackupNoticeText>
              {copy?.backupSensitiveNotice ||
                getMessage('my.backupSensitiveNotice')}
            </BackupNoticeText>
            {backupStatusMessage ? (
              <BackupStatusText>{backupStatusMessage}</BackupStatusText>
            ) : null}
            {backupErrorMessage ? (
              <BackupStatusText $tone="error">
                {backupErrorMessage}
              </BackupStatusText>
            ) : null}
            <BackupActionRow>
              <BackupActionButton
                accessibilityLabel={
                  copy?.backupExportAction ||
                  getMessage('my.backupExportAction')
                }
                accessibilityRole="button"
                onPress={onExportBackup}
              >
                <BackupActionLabel>
                  {copy?.backupExportAction ||
                    getMessage('my.backupExportAction')}
                </BackupActionLabel>
              </BackupActionButton>
              <BackupActionButton
                $variant="secondary"
                accessibilityLabel={
                  copy?.backupImportAction ||
                  getMessage('my.backupImportAction')
                }
                accessibilityRole="button"
                onPress={onImportBackup}
              >
                <BackupActionLabel $variant="secondary">
                  {copy?.backupImportAction ||
                    getMessage('my.backupImportAction')}
                </BackupActionLabel>
              </BackupActionButton>
            </BackupActionRow>
            {backupPreview ? (
              <BackupPreviewBlock>
                <CardTitleText>
                  {copy?.backupPreviewTitle ||
                    getMessage('my.backupPreviewTitle')}
                </CardTitleText>
                <BackupPreviewRow>
                  <BackupPreviewLabel>
                    {copy?.backupPreviewExportedAt ||
                      getMessage('my.backupPreviewExportedAt')}
                  </BackupPreviewLabel>
                  <BackupPreviewValue>
                    {backupPreview.exportedAt}
                  </BackupPreviewValue>
                </BackupPreviewRow>
                <BackupPreviewRow>
                  <BackupPreviewLabel>
                    {copy?.backupPreviewItems ||
                      getMessage('my.backupPreviewItems')}
                  </BackupPreviewLabel>
                  <BackupPreviewValue>
                    {backupPreview.activeItemCount} /{' '}
                    {backupPreview.archivedItemCount}
                  </BackupPreviewValue>
                </BackupPreviewRow>
                <BackupPreviewRow>
                  <BackupPreviewLabel>
                    {copy?.backupPreviewHelpers ||
                      getMessage('my.backupPreviewHelpers')}
                  </BackupPreviewLabel>
                  <BackupPreviewValue>
                    {backupPreview.activeHelperCount} /{' '}
                    {backupPreview.archivedHelperCount}
                  </BackupPreviewValue>
                </BackupPreviewRow>
                <BackupNoticeText>
                  {backupPreview.missingStateEnabled
                    ? copy?.backupPreviewTriggerOn ||
                      getMessage('my.backupPreviewTriggerOn')
                    : copy?.backupPreviewTriggerOff ||
                      getMessage('my.backupPreviewTriggerOff')}
                </BackupNoticeText>
                <BackupNoticeText>
                  {backupPreview.simulationEnabled
                    ? copy?.backupPreviewSimulationOn ||
                      getMessage('my.backupPreviewSimulationOn')
                    : copy?.backupPreviewSimulationOff ||
                      getMessage('my.backupPreviewSimulationOff')}
                </BackupNoticeText>
                <BackupStatusText $tone="error">
                  {copy?.backupReplaceWarning ||
                    getMessage('my.backupReplaceWarning')}
                </BackupStatusText>
                <BackupActionRow>
                  <BackupActionButton
                    accessibilityLabel={
                      copy?.backupConfirmImport ||
                      getMessage('my.backupConfirmImport')
                    }
                    accessibilityRole="button"
                    onPress={onConfirmBackupImport}
                  >
                    <BackupActionLabel>
                      {copy?.backupConfirmImport ||
                        getMessage('my.backupConfirmImport')}
                    </BackupActionLabel>
                  </BackupActionButton>
                  <BackupActionButton
                    $variant="secondary"
                    accessibilityLabel={
                      copy?.backupCancelImport ||
                      getMessage('my.backupCancelImport')
                    }
                    accessibilityRole="button"
                    onPress={onCancelBackupImport}
                  >
                    <BackupActionLabel $variant="secondary">
                      {copy?.backupCancelImport ||
                        getMessage('my.backupCancelImport')}
                    </BackupActionLabel>
                  </BackupActionButton>
                </BackupActionRow>
              </BackupPreviewBlock>
            ) : null}
          </AppCard>
          <AppCard>
            <LanguagePicker
              copy={copy}
              isOpen={isLanguagePickerOpen}
              onToggle={() => setIsLanguagePickerOpen(value => !value)}
              onClose={() => setIsLanguagePickerOpen(false)}
              onUseSystemLocale={onUseSystemLocale}
              onSetManualLocale={onSetManualLocale}
            />
          </AppCard>
          <AppCard>
            <SkinRuntimeStatus
              copy={copy}
              skinOptions={skinOptions}
              status={resolvedSkinRuntimeStatus}
            />
          </AppCard>
          <AppCard>
            <SkinPicker
              copy={copy}
              skinOptions={skinOptions}
              activeSkinId={activeSkinId}
              isOpen={isSkinPickerOpen}
              onToggle={() => setIsSkinPickerOpen(value => !value)}
              onClose={() => setIsSkinPickerOpen(false)}
              onSetActiveSkin={onSetActiveSkin}
            />
          </AppCard>
        </MyScreenCardStack>
      </AppScreen>
    );
  }
);

MyScreen.displayName = 'MyScreen';
