import { memo } from 'react';
import { Platform, Switch, View } from 'react-native';

/**
 * 与 RN `Switch` 对齐的 `AppSwitch` 属性集。
 */
export interface IAppSwitchProps {
  /** 受控开关值。 */
  value: boolean;
  /** 值变化时的回调。 */
  onValueChange?: (value: boolean) => void;
  /** 无障碍角色覆盖。 */
  accessibilityRole?: 'switch';
  /** 可选的无障碍状态扩展。 */
  accessibilityState?: {
    checked?: boolean;
  };
  /** 开关轨道开/关颜色。 */
  trackColor?: {
    false?: string;
    true?: string;
  };
  /** 拇指颜色覆盖。 */
  thumbColor?: string;
}

/**
 * 在 `NODE_ENV === 'test'` 下用 `View` 桩替代原生 `Switch`，便于 Jest 稳定交互。
 *
 * @param props - `IAppSwitchProps`
 * @returns 已 memo 的开关或测试替身。
 */
export const AppSwitch = memo<IAppSwitchProps>(
  ({
    value,
    onValueChange,
    accessibilityRole = 'switch',
    accessibilityState,
    trackColor,
    thumbColor
  }) => {
    if (process.env.NODE_ENV === 'test') {
      return (
        <View
          accessible
          accessibilityRole={accessibilityRole}
          accessibilityState={{ checked: value, ...accessibilityState }}
          onTouchEnd={() => onValueChange?.(!value)}
        />
      );
    }

    return (
      <Switch
        accessibilityRole={accessibilityRole}
        accessibilityState={{ checked: value, ...accessibilityState }}
        value={value}
        onValueChange={onValueChange}
        trackColor={trackColor}
        thumbColor={thumbColor}
        ios_backgroundColor={Platform.OS === 'ios' ? trackColor?.false : void 0}
      />
    );
  }
);

AppSwitch.displayName = 'AppSwitch';
