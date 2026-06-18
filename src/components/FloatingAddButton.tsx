import { memo } from 'react';
import { Pressable } from 'react-native';

import { useI18n } from '../i18n';

import { AppText } from './AppText';

/**
 * `FloatingAddButton` 的 props。
 */
export interface IFloatingAddButtonProps {
  /** 点击创建新项时的回调。 */
  onPress?: () => void;
  /** 纯图标按钮的无障碍名称。 */
  label?: string;
}

/**
 * 事项页标题栏使用的圆形「添加」操作按钮。
 *
 * @param props - `IFloatingAddButtonProps`
 * @returns 已 memo 的可按下按钮。
 */
export const FloatingAddButton = memo<IFloatingAddButtonProps>(
  ({ onPress, label }) => {
    const { getMessage } = useI18n();

    return (
      <Pressable
        accessibilityLabel={label || getMessage('items.createLabel')}
        accessibilityRole="button"
        className="h-[44px] w-[44px] items-center justify-center rounded-full bg-accent"
        onPress={onPress}
      >
        <AppText className="text-[20px] leading-[20px] text-white">+</AppText>
      </Pressable>
    );
  }
);

FloatingAddButton.displayName = 'FloatingAddButton';
