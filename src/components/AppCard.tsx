import { memo, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

/**
 * `AppCard` 的 props；继承 RN `View` 属性。
 */
export interface IAppCardProps extends ViewProps {
  /** 卡片内容子节点。 */
  children?: ReactNode;
}

/**
 * 圆角描边卡片容器，在各页面复用。
 *
 * @param props - `IAppCardProps`
 * @returns 已 memo 的卡片容器。
 */
export const AppCard = memo<IAppCardProps>(
  ({ children, className, style, ...props }) => (
    <View
      className={[
        'rounded-card border border-border bg-card p-[18px]',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...props}
    >
      {children}
    </View>
  )
);

AppCard.displayName = 'AppCard';
