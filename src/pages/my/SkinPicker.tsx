import React from 'react';

import { useI18n } from '../../i18n';
import {
  CardTitleText,
  MetaMutedText,
  MicroMutedText,
  PickerExpandHeader,
  SkinOptionPressable
} from '../../theme';

import {
  PickerBlock,
  PickerExpandList,
  PickerHeaderLabel,
  PickerRowLabel
} from './my.styled';
import { type IMyScreenCopy, type ISkinOption } from './types';

/**
 * 皮肤选择器 props。
 */
export interface ISkinPickerProps {
  /** 可选本地化文案覆盖。 */
  copy?: IMyScreenCopy;
  /** 选择器中可用的内置皮肤列表。 */
  skinOptions: ISkinOption[];
  /** 当前激活的皮肤 id。 */
  activeSkinId?: string;
  /** 选择器是否展开。 */
  isOpen: boolean;
  /** 切换展开状态。 */
  onToggle: () => void;
  /** 关闭选择器。 */
  onClose: () => void;
  /** 按 id 激活皮肤。 */
  onSetActiveSkin?: (skinId: string) => void;
}

/**
 * 我的页皮肤选择器。
 *
 * @param props - `ISkinPickerProps`
 * @returns 已 memo 的皮肤选择器元素。
 */
export const SkinPicker = React.memo<ISkinPickerProps>(
  ({
    copy,
    skinOptions,
    activeSkinId,
    isOpen,
    onToggle,
    onClose,
    onSetActiveSkin
  }) => {
    const { getMessage } = useI18n();
    const activeSkin = skinOptions.find(skin => skin.skinId === activeSkinId);

    return (
      <>
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
              accessibilityLabel={copy?.skinTitle || getMessage('my.skinTitle')}
              onPress={onToggle}
            >
              <PickerHeaderLabel>
                {activeSkin?.displayName ?? skinOptions[0]?.displayName}
              </PickerHeaderLabel>
              <MetaMutedText>
                {isOpen
                  ? copy?.skinPickerClose || getMessage('my.skinPickerClose')
                  : copy?.skinPickerOpen || getMessage('my.skinPickerOpen')}
              </MetaMutedText>
            </PickerExpandHeader>
            {isOpen ? (
              <PickerExpandList>
                {skinOptions.map(skin => {
                  const isActive = skin.skinId === activeSkinId;
                  const isCompatible = skin.compatibility.kind === 'compatible';
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
                        onClose();
                      }}
                    >
                      <PickerRowLabel>{skin.displayName}</PickerRowLabel>
                      <MicroMutedText>
                        {disabledReason ??
                          (isActive
                            ? copy?.skinCurrent || getMessage('my.skinCurrent')
                            : '')}
                      </MicroMutedText>
                    </SkinOptionPressable>
                  );
                })}
              </PickerExpandList>
            ) : null}
          </PickerBlock>
        ) : null}
      </>
    );
  }
);

SkinPicker.displayName = 'SkinPicker';
