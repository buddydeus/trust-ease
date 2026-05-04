/**
 * 设置向中枢：语言、皮肤兼容提示与进阶流程入口；props 全部由外部注入，便于视觉回归测试。
 */
import React, { useState } from 'react';
import { Pressable } from 'react-native';

import { AppCard, AppScreen } from '../../components';
import { LocaleType, useI18n } from '../../i18n';
import { type SkinCompatibility } from '../../skin';
import {
  CaptionMutedText,
  CardTitleText,
  MetaMutedText,
  MicroMutedText,
  PickerExpandHeader,
  PickerRow,
  ScreenTitleText,
  SkinOptionPressable
} from '../../theme';

import {
  MyScreenCardStack,
  PickerBlock,
  PickerExpandList,
  PickerHeaderLabel,
  PickerRowLabel,
  StatusHighlightCard,
  StatusValueLine
} from './my.styled';

/**
 * 选择器中一行可选的内置皮肤数据。
 */
interface SkinOption {
  /** 皮肤清单 id。 */
  skinId: string;
  /** 清单中的展示名。 */
  displayName: string;
  /** 相对当前运行应用的兼容结论。 */
  compatibility: SkinCompatibility;
}

/**
 * `MyScreen` 使用的本地化文案。
 */
interface MyScreenCopy {
  /** 屏幕标题。 */
  title: string;
  /** 状态分区标签。 */
  statusLabel: string;
  /** 状态分区取值行。 */
  statusValue: string;
  /** 触发状态卡片标题。 */
  triggerStateTitle: string;
  /** 触发状态卡片摘要。 */
  triggerStateSummary: string;
  /** 身份与安全卡片标题。 */
  identityTitle: string;
  /** 身份与安全卡片摘要。 */
  identitySummary: string;
  /** 语言卡片标题。 */
  languageTitle: string;
  /** 语言卡片摘要。 */
  languageSummary: string;
  /** 风格（皮肤）卡片标题。 */
  skinTitle: string;
  /** 风格（皮肤）卡片摘要。 */
  skinSummary: string;
  /** 展开皮肤选择器的控件文案。 */
  skinPickerOpen: string;
  /** 收起皮肤选择器的控件文案。 */
  skinPickerClose: string;
  /** 「当前」皮肤前缀标签。 */
  skinCurrent: string;
  /** 某皮肤需要升级应用时的提示。 */
  skinUpgradeRequired: string;
  /** 某皮肤不可选时的提示。 */
  skinUnavailable: string;
  /** 打开触发状态页的 CTA 文案。 */
  openTriggerState: string;
  /** 「跟随系统」语言选项。 */
  followSystem: string;
  /** 简体中文选项。 */
  simplifiedChinese: string;
  /** 繁体中文选项。 */
  traditionalChinese: string;
  /** 英语选项。 */
  english: string;
}

/**
 * `MyScreen` 的 props。
 */
export interface IMyScreenProps {
  /** 若提供则打开触发状态路由。 */
  onOpenTriggerState?: () => void;
  /** 可选本地化文案；省略时使用内置默认。 */
  copy?: MyScreenCopy;
  /** 将语言模式切为跟随系统。 */
  onUseSystemLocale?: () => void;
  /**
   * 设置手动语言。
   *
   * @param locale - 目标语言枚举值。
   */
  onSetManualLocale?: (locale: LocaleType) => void;
  /** 选择器中可用的内置皮肤列表。 */
  skinOptions?: SkinOption[];
  /** 当前激活的皮肤 id。 */
  activeSkinId?: string;
  /**
   * 按 id 激活皮肤。
   *
   * @param skinId - 目标皮肤 id。
   */
  onSetActiveSkin?: (skinId: string) => void;
}

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

    const activeSkin = skinOptions.find(skin => skin.skinId === activeSkinId);

    const triggerStateCard = (
      <AppCard>
        <CardTitleText>
          {copy?.triggerStateTitle || getMessage('my.triggerStateTitle')}
        </CardTitleText>
        <MetaMutedText marginTop={8}>
          {copy?.triggerStateSummary || getMessage('my.triggerStateSummary')}
        </MetaMutedText>
      </AppCard>
    );

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
          {onOpenTriggerState ? (
            <Pressable
              accessibilityLabel={
                copy?.openTriggerState || getMessage('my.openTriggerState')
              }
              accessibilityRole="button"
              onPress={onOpenTriggerState}
            >
              {triggerStateCard}
            </Pressable>
          ) : (
            triggerStateCard
          )}
          <AppCard>
            <CardTitleText>
              {copy?.identityTitle || getMessage('my.identityTitle')}
            </CardTitleText>
            <MetaMutedText marginTop={8}>
              {copy?.identitySummary || getMessage('my.identitySummary')}
            </MetaMutedText>
          </AppCard>
          <AppCard>
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
                  onPress={() => setIsLanguagePickerOpen(value => !value)}
                >
                  <PickerHeaderLabel>
                    {copy?.followSystem || getMessage('my.followSystem')}
                  </PickerHeaderLabel>
                  <MetaMutedText>
                    {isLanguagePickerOpen
                      ? copy?.skinPickerClose ||
                        getMessage('my.skinPickerClose')
                      : copy?.skinPickerOpen || getMessage('my.skinPickerOpen')}
                  </MetaMutedText>
                </PickerExpandHeader>
                {isLanguagePickerOpen ? (
                  <PickerExpandList>
                    {onUseSystemLocale ? (
                      <PickerRow
                        accessibilityRole="button"
                        onPress={() => {
                          onUseSystemLocale();
                          setIsLanguagePickerOpen(false);
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
                            setIsLanguagePickerOpen(false);
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
                            setIsLanguagePickerOpen(false);
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
                            setIsLanguagePickerOpen(false);
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
          </AppCard>
          <AppCard>
            <CardTitleText>
              {copy?.skinTitle || getMessage('my.skinTitle')}
            </CardTitleText>
            <MetaMutedText marginTop={8}>
              {copy?.skinSummary || getMessage('my.skinSummary')}
            </MetaMutedText>
            {skinOptions.length > 0 ? (
              <PickerBlock>
                <PickerExpandHeader
                  accessibilityRole="button"
                  accessibilityLabel={
                    copy?.skinTitle || getMessage('my.skinTitle')
                  }
                  onPress={() => setIsSkinPickerOpen(value => !value)}
                >
                  <PickerHeaderLabel>
                    {activeSkin?.displayName ?? skinOptions[0]?.displayName}
                  </PickerHeaderLabel>
                  <MetaMutedText>
                    {isSkinPickerOpen
                      ? copy?.skinPickerClose ||
                        getMessage('my.skinPickerClose')
                      : copy?.skinPickerOpen || getMessage('my.skinPickerOpen')}
                  </MetaMutedText>
                </PickerExpandHeader>
                {isSkinPickerOpen ? (
                  <PickerExpandList>
                    {skinOptions.map(skin => {
                      const isActive = skin.skinId === activeSkinId;
                      const isCompatible =
                        skin.compatibility.kind === 'compatible';
                      const disabledReason =
                        skin.compatibility.kind === 'compatible'
                          ? null
                          : skin.compatibility.reason === 'upgrade-app'
                            ? copy?.skinUpgradeRequired ||
                              getMessage('my.skinUpgradeRequired')
                            : copy?.skinUnavailable ||
                              getMessage('my.skinUnavailable');

                      return (
                        <SkinOptionPressable
                          key={skin.skinId}
                          accessibilityRole="button"
                          accessibilityState={{
                            selected: isActive,
                            disabled: !isCompatible
                          }}
                          disabled={!isCompatible}
                          active={isActive}
                          compatible={isCompatible}
                          onPress={() => {
                            onSetActiveSkin?.(skin.skinId);
                            setIsSkinPickerOpen(false);
                          }}
                        >
                          <PickerRowLabel>{skin.displayName}</PickerRowLabel>
                          <MicroMutedText>
                            {disabledReason ??
                              (isActive
                                ? copy?.skinCurrent ||
                                  getMessage('my.skinCurrent')
                                : '')}
                          </MicroMutedText>
                        </SkinOptionPressable>
                      );
                    })}
                  </PickerExpandList>
                ) : null}
              </PickerBlock>
            ) : null}
          </AppCard>
        </MyScreenCardStack>
      </AppScreen>
    );
  }
);

MyScreen.displayName = 'MyScreen';
