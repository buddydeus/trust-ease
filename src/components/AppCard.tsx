import { memo, type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { appTheme } from '../theme';

/**
 * `AppCard` 的 props；继承 RN `View` 属性。
 */
export interface IAppCardProps extends ViewProps {
  /** 卡片内容子节点。 */
  children?: ReactNode;
}

const styles = StyleSheet.create({
  card: {
    borderColor: appTheme.color.border,
    borderRadius: appTheme.radius.card,
    borderWidth: 1,
    backgroundColor: appTheme.color.card,
    padding: 16
  }
});

/**
 * 圆角描边卡片容器，在各页面复用。
 *
 * @param props - `IAppCardProps`
 * @returns 已 memo 的卡片容器。
 */
export const AppCard = memo<IAppCardProps>(
  ({ children, className, style, ...props }) => (
    <View
      className={['rounded-card border border-border bg-card', className]
        .filter(Boolean)
        .join(' ')}
      style={[styles.card, style]}
      {...props}
    >
      {children}
    </View>
  )
);

AppCard.displayName = 'AppCard';
