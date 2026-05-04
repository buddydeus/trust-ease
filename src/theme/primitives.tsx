import { Pressable, Text, View } from 'react-native';

import styled from 'styled-components/native';

/** 卡片内小号弱化标签（多处复用）。 */
export const CaptionMutedText = styled(Text)`
  font-size: ${p => p.theme.fontSize.caption}px;
  color: ${p => p.theme.color.muted};
`;

/** 页面主标题（23 / 粗体）。 */
export const ScreenTitleText = styled(Text)`
  font-size: ${p => p.theme.fontSize.title}px;
  font-weight: 700;
`;

/** 卡片内区块标题（15 / 半粗）。 */
export const CardTitleText = styled(Text)`
  font-size: 15px;
  font-weight: 600;
`;

/** 辅助说明：12px 弱化色，可选顶距。 */
export const MetaMutedText = styled(Text)<{ marginTop?: number }>`
  margin-top: ${p => (p.marginTop != null ? p.marginTop : 0)}px;
  font-size: 12px;
  color: ${p => p.theme.color.muted};
`;

export const MicroMutedText = styled(Text)`
  font-size: 11px;
  color: ${p => p.theme.color.muted};
`;

/** 首页连续天数等高亮块。 */
export const StreakHighlight = styled(View)`
  margin-top: 18px;
  border-radius: 20px;
  background-color: ${p => p.theme.color.accentSoft};
  padding: 16px;
`;

export const SectionHeading = styled(Text)`
  text-align: center;
  font-size: 15px;
  font-weight: 700;
`;

export const StatValueAccent = styled(Text)`
  margin-top: 8px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: ${p => p.theme.color.accent};
`;

/** 报平安卡片顶部的弱化标题行。 */
export const MutedCenterLead = styled(Text)`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: ${p => p.theme.color.muted};
`;

/** 主操作圆形按钮容器。 */
export const PrimaryRoundButton = styled(Pressable)`
  margin-top: 46px;
  align-self: center;
  height: 164px;
  width: 164px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background-color: ${p => p.theme.color.accent};
`;

export const PrimaryOnAccentLabel = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
`;

/** 语言 / 皮肤选择器顶栏。 */
export const PickerExpandHeader = styled(Pressable)`
  min-height: 38px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  border-radius: 18px;
  padding-horizontal: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${p => p.theme.color.accentSoft};
`;

/** 语言列表中的白底选项行。 */
export const PickerRow = styled(Pressable)`
  min-height: 36px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  border-radius: 16px;
  padding-horizontal: 12px;
  flex-direction: row;
  align-items: center;
  background-color: ${p => p.theme.color.card};
`;

export const SkinOptionPressable = styled(Pressable)<{
  active: boolean;
  compatible: boolean;
}>`
  min-height: 36px;
  border-width: 1px;
  border-color: ${p =>
    p.active ? p.theme.color.accent : p.theme.color.border};
  border-radius: 16px;
  padding-horizontal: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  opacity: ${p => (p.compatible ? 1 : 0.5)};
  background-color: ${p =>
    p.active ? p.theme.color.accentSoft : p.theme.color.card};
`;

/** 事项列表左侧色带：线下 / 线上。 */
export const ItemRibbon = styled(View)<{ variant: 'offline' | 'online' }>`
  width: 10px;
  height: 36px;
  border-radius: 999px;
  background-color: ${p =>
    p.variant === 'offline'
      ? p.theme.color.offlineRibbon
      : p.theme.color.onlineRibbon};
  flex-shrink: 0;
`;
