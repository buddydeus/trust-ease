/**
 * 设置向中枢：语言、皮肤兼容提示与进阶流程入口；props 全部由外部注入，便于视觉回归测试。
 */
import React, { useState } from 'react';

import { AppCard, AppScreen } from '../../components';
import { useI18n } from '../../i18n';
import { CaptionMutedText, ScreenTitleText } from '../../theme';

import {
  MyScreenCardStack,
  StatusHighlightCard,
  StatusValueLine
} from './my.styled';
import { LanguagePicker } from './LanguagePicker';
import { SettingsCard } from './SettingsCard';
import { SkinPicker } from './SkinPicker';
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
    copy,
    onUseSystemLocale,
    onSetManualLocale,
    skinOptions = [],
    activeSkinId,
    onSetActiveSkin
  } = {}) => {
    const { getMessage } = useI18n();

    const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState(false);
    const [isSkinPickerOpen, setIsSkinPickerOpen] = useState(false);

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
            title={copy?.identityTitle || getMessage('my.identityTitle')}
            summary={copy?.identitySummary || getMessage('my.identitySummary')}
          />
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
