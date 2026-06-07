import { memo } from 'react';

import { LocaleType, useI18n } from '../../i18n';
import {
  CardTitleText,
  MetaMutedText,
  PickerExpandHeader,
  PickerRow
} from '../../theme';

import {
  PickerBlock,
  PickerExpandList,
  PickerHeaderLabel,
  PickerRowLabel
} from './my.styled';
import { type IMyScreenCopy } from './types';

/**
 * 语言选择器 props。
 */
export interface ILanguagePickerProps {
  /** 可选本地化文案覆盖。 */
  copy?: IMyScreenCopy;
  /** 选择器是否展开。 */
  isOpen: boolean;
  /** 切换展开状态。 */
  onToggle: () => void;
  /** 关闭选择器。 */
  onClose: () => void;
  /** 将语言模式切为跟随系统。 */
  onUseSystemLocale?: () => void;
  /** 设置手动语言。 */
  onSetManualLocale?: (locale: LocaleType) => void;
}

/**
 * 我的页语言选择器。
 *
 * @param props - `ILanguagePickerProps`
 * @returns 已 memo 的语言选择器元素。
 */
export const LanguagePicker = memo<ILanguagePickerProps>(
  ({
    copy,
    isOpen,
    onToggle,
    onClose,
    onUseSystemLocale,
    onSetManualLocale
  }) => {
    const { getMessage } = useI18n();

    return (
      <>
        <CardTitleText>
          {copy?.languageTitle || getMessage('my.languageTitle')}
        </CardTitleText>
        <MetaMutedText marginTop={8}>
          {copy?.languageSummary || getMessage('my.languageSummary')}
        </MetaMutedText>
        {onUseSystemLocale || onSetManualLocale ? (
          <PickerBlock>
            <PickerExpandHeader
              accessibilityRole="button"
              accessibilityLabel={
                copy?.languageTitle || getMessage('my.languageTitle')
              }
              onPress={onToggle}
            >
              <PickerHeaderLabel>
                {copy?.followSystem || getMessage('my.followSystem')}
              </PickerHeaderLabel>
              <MetaMutedText>
                {isOpen
                  ? copy?.skinPickerClose || getMessage('my.skinPickerClose')
                  : copy?.skinPickerOpen || getMessage('my.skinPickerOpen')}
              </MetaMutedText>
            </PickerExpandHeader>
            {isOpen ? (
              <PickerExpandList>
                {onUseSystemLocale ? (
                  <PickerRow
                    accessibilityRole="button"
                    onPress={() => {
                      onUseSystemLocale();
                      onClose();
                    }}
                  >
                    <PickerRowLabel>
                      {copy?.followSystem || getMessage('my.followSystem')}
                    </PickerRowLabel>
                  </PickerRow>
                ) : null}
                {onSetManualLocale ? (
                  <>
                    <PickerRow
                      accessibilityRole="button"
                      onPress={() => {
                        onSetManualLocale(LocaleType.ZH_CN);
                        onClose();
                      }}
                    >
                      <PickerRowLabel>
                        {copy?.simplifiedChinese ||
                          getMessage('my.simplifiedChinese')}
                      </PickerRowLabel>
                    </PickerRow>
                    <PickerRow
                      accessibilityRole="button"
                      onPress={() => {
                        onSetManualLocale(LocaleType.ZH_TW);
                        onClose();
                      }}
                    >
                      <PickerRowLabel>
                        {copy?.traditionalChinese ||
                          getMessage('my.traditionalChinese')}
                      </PickerRowLabel>
                    </PickerRow>
                    <PickerRow
                      accessibilityRole="button"
                      onPress={() => {
                        onSetManualLocale(LocaleType.EN_US);
                        onClose();
                      }}
                    >
                      <PickerRowLabel>
                        {copy?.english || getMessage('my.english')}
                      </PickerRowLabel>
                    </PickerRow>
                  </>
                ) : null}
              </PickerExpandList>
            ) : null}
          </PickerBlock>
        ) : null}
      </>
    );
  }
);

LanguagePicker.displayName = 'LanguagePicker';
