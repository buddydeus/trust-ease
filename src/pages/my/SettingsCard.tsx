import { memo } from 'react';
import { Pressable } from 'react-native';

import { AppCard } from '../../components';
import { CardTitleText, MetaMutedText } from '../../theme';

/**
 * 我的页普通设置卡 props。
 */
export interface ISettingsCardProps {
  /** 卡片标题。 */
  title: string;
  /** 卡片摘要。 */
  summary: string;
  /** 若提供则将卡片包装为可点击入口。 */
  onPress?: () => void;
  /** 可点击卡片的无障碍标签。 */
  accessibilityLabel?: string;
}

/**
 * 我的页设置入口卡。
 *
 * @param props - `ISettingsCardProps`
 * @returns 已 memo 的设置卡元素。
 */
export const SettingsCard = memo<ISettingsCardProps>(
  ({ title, summary, onPress, accessibilityLabel }) => {
    const card = (
      <AppCard>
        <CardTitleText>{title}</CardTitleText>
        <MetaMutedText marginTop={8}>{summary}</MetaMutedText>
      </AppCard>
    );

    if (!onPress) {
      return card;
    }

    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={onPress}
      >
        {card}
      </Pressable>
    );
  }
);

SettingsCard.displayName = 'SettingsCard';
