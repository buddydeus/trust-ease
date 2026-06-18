import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useI18n } from '../i18n';
import { appTheme } from '../theme';

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

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.color.accent
  },
  label: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700'
  }
});

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
        style={styles.button}
        onPress={onPress}
      >
        <AppText style={styles.label}>+</AppText>
      </Pressable>
    );
  }
);

FloatingAddButton.displayName = 'FloatingAddButton';
