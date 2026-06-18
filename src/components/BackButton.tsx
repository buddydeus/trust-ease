import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useI18n } from '../i18n';
import { appTheme } from '../theme';

import { AppText } from './AppText';

/**
 * `BackButton` 的 props。
 */
export interface IBackButtonProps {
  /** 回退动作。 */
  onPress?: () => void;
  /** 无障碍标签；省略时使用通用返回文案。 */
  label?: string;
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    minHeight: 36,
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: appTheme.radius.pill,
    borderWidth: 1,
    borderColor: appTheme.color.border,
    backgroundColor: appTheme.color.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  icon: {
    color: appTheme.color.foreground,
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '700'
  },
  label: {
    color: appTheme.color.foreground,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700'
  }
});

/**
 * 二级页面使用的轻量返回按钮。
 *
 * @param props - `IBackButtonProps`
 * @returns 已 memo 的返回按钮。
 */
export const BackButton = memo<IBackButtonProps>(({ onPress, label }) => {
  const { getMessage } = useI18n();
  const resolvedLabel = label || getMessage('navigation.back');

  return (
    <Pressable
      accessibilityLabel={resolvedLabel}
      accessibilityRole="button"
      style={styles.button}
      onPress={onPress}
    >
      <AppText style={styles.icon}>‹</AppText>
      <AppText style={styles.label}>{resolvedLabel}</AppText>
    </Pressable>
  );
});

BackButton.displayName = 'BackButton';
