/**
 * 安全策略界面原型：仅用本地 state 保持开关响应；在产品定义持久化契约前不落盘半成品策略。
 */
import React, { useState } from 'react';

import { useTheme } from 'styled-components/native';

import { AppScreen, AppSwitch } from '../../components';
import { useI18n } from '../../i18n';
import { CaptionMutedText, ScreenTitleText } from '../../theme';

import {
  MissingSectionCard,
  PolicyCurrentValue,
  PolicySummaryCard,
  ToggleRowLabel,
  ToggleSettingRow
} from './trigger-state.styled';

/**
 * `TriggerStateScreen` 使用的本地化文案。
 */
export interface ITriggerStateScreenCopy {
  /** 屏幕标题。 */
  title: string;
  /** 当前策略摘要上方的标签。 */
  currentLabel: string;
  /** 当前策略摘要正文。 */
  currentValue: string;
  /** 「失联」分区标签。 */
  missingLabel: string;
  /** 启用失联开关的标签。 */
  missingToggle: string;
}

/**
 * `TriggerStateScreen` 的 props。
 */
export interface ITriggerStateScreenProps {
  /** 可选本地化文案；省略时使用内置默认。 */
  copy?: ITriggerStateScreenCopy;
}

/**
 * 触发 / 安全策略设置页。
 *
 * @param props - `ITriggerStateScreenProps`
 * @returns 已 memo 的触发设置页元素。
 */
export const TriggerStateScreen = React.memo<ITriggerStateScreenProps>(
  ({ copy } = {}) => {
    const theme = useTheme();
    const { getMessage } = useI18n();

    const [missingEnabled, setMissingEnabled] = useState(false);

    return (
      <AppScreen>
        <ScreenTitleText>
          {copy?.title || getMessage('triggerState.title')}
        </ScreenTitleText>
        <PolicySummaryCard>
          <CaptionMutedText>
            {copy?.currentLabel || getMessage('triggerState.currentLabel')}
          </CaptionMutedText>
          <PolicyCurrentValue>
            {copy?.currentValue || getMessage('triggerState.currentValue')}
          </PolicyCurrentValue>
        </PolicySummaryCard>
        <MissingSectionCard>
          <CaptionMutedText>
            {copy?.missingLabel || getMessage('triggerState.missingLabel')}
          </CaptionMutedText>
          <ToggleSettingRow>
            <ToggleRowLabel>
              {copy?.missingToggle || getMessage('triggerState.missingToggle')}
            </ToggleRowLabel>
            <AppSwitch
              accessibilityRole="switch"
              accessibilityState={{ checked: missingEnabled }}
              value={missingEnabled}
              onValueChange={setMissingEnabled}
              trackColor={{
                false: theme.color.border,
                true: theme.color.accent
              }}
              thumbColor="#FFFFFF"
            />
          </ToggleSettingRow>
        </MissingSectionCard>
      </AppScreen>
    );
  }
);

TriggerStateScreen.displayName = 'TriggerStateScreen';
