import { memo, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * `AppScreen` 的 props；内层内容区继承 `View` 属性。
 */
export interface IAppScreenProps extends ViewProps {
  /** 屏幕主体子节点。 */
  children?: ReactNode;
}

/**
 * 全屏安全区内层：统一页面背景与内边距。
 *
 * @param props - `IAppScreenProps`
 * @returns 已 memo 的屏幕布局。
 */
export const AppScreen = memo<IAppScreenProps>(
  ({ children, className, style, ...props }) => (
    <SafeAreaView className="flex-1 bg-page">
      <View
        className={['flex-1 p-[22px]', className].filter(Boolean).join(' ')}
        style={style}
        {...props}
      >
        {children}
      </View>
    </SafeAreaView>
  )
);

AppScreen.displayName = 'AppScreen';
