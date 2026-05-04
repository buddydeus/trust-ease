/**
 * 新建事项向导外壳：由文案驱动且不依赖路由，可在弹层、堆栈或 Storybook 中独立渲染。
 */
import React from 'react';

import { AppScreen } from '../../components';
import { useI18n } from '../../i18n';
import { CardTitleText, MetaMutedText, ScreenTitleText } from '../../theme';

import {
  OfflineKindCard,
  OnlineKindCard,
  StepCurrentValue,
  TypeChoiceRow,
  TypeSectionCard,
  WizardStepCard
} from './item-form.styled';

/**
 * `ItemFormScreen` 使用的本地化文案。
 */
export interface IItemFormScreenCopy {
  /** 屏幕标题。 */
  title: string;
  /** 类型卡片上方的分区标签。 */
  typeLabel: string;
  /** 线下类型卡片标题。 */
  offlineTitle: string;
  /** 线下类型卡片说明。 */
  offlineSummary: string;
  /** 线上类型卡片标题。 */
  onlineTitle: string;
  /** 线上类型卡片说明。 */
  onlineSummary: string;
  /** 向导步骤标签。 */
  stepLabel: string;
  /** 向导步骤值文案。 */
  stepValue: string;
}

/**
 * `ItemFormScreen` 的 props。
 */
export interface IItemFormScreenProps {
  /** 可选本地化文案；省略时使用内置默认。 */
  copy?: IItemFormScreenCopy;
}

/**
 * 新建事项向导（首步界面）。
 *
 * @param props - `IItemFormScreenProps`
 * @returns 已 memo 的表单页元素。
 */
export const ItemFormScreen = React.memo<IItemFormScreenProps>(
  ({ copy } = {}) => {
    const { getMessage } = useI18n();

    return (
      <AppScreen>
        <ScreenTitleText>
          {copy?.title || getMessage('itemForm.title')}
        </ScreenTitleText>
        <TypeSectionCard>
          <MetaMutedText>
            {copy?.typeLabel || getMessage('itemForm.typeLabel')}
          </MetaMutedText>
          <TypeChoiceRow>
            <OfflineKindCard>
              <CardTitleText>
                {copy?.offlineTitle || getMessage('itemForm.offlineTitle')}
              </CardTitleText>
              <MetaMutedText marginTop={6}>
                {copy?.offlineSummary || getMessage('itemForm.offlineSummary')}
              </MetaMutedText>
            </OfflineKindCard>
            <OnlineKindCard>
              <CardTitleText>
                {copy?.onlineTitle || getMessage('itemForm.onlineTitle')}
              </CardTitleText>
              <MetaMutedText marginTop={6}>
                {copy?.onlineSummary || getMessage('itemForm.onlineSummary')}
              </MetaMutedText>
            </OnlineKindCard>
          </TypeChoiceRow>
        </TypeSectionCard>
        <WizardStepCard>
          <MetaMutedText>
            {copy?.stepLabel || getMessage('itemForm.stepLabel')}
          </MetaMutedText>
          <StepCurrentValue>
            {copy?.stepValue || getMessage('itemForm.stepValue')}
          </StepCurrentValue>
        </WizardStepCard>
      </AppScreen>
    );
  }
);

ItemFormScreen.displayName = 'ItemFormScreen';
