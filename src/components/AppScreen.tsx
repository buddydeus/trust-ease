import { memo, type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { appTheme } from '../theme';

/**
 * `AppScreen` 的 props；内层内容区继承 `View` 属性。
 */
export interface IAppScreenProps extends ViewProps {
  /** 屏幕主体子节点。 */
  children?: ReactNode;
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 24,
    paddingTop: 26
  },
  safeArea: {
    flex: 1,
    backgroundColor: appTheme.color.page
  }
});

/**
 * 全屏安全区内层：统一页面背景与内边距。
 *
 * @param props - `IAppScreenProps`
 * @returns 已 memo 的屏幕布局。
 */
export const AppScreen = memo<IAppScreenProps>(
  ({ children, style, ...props }) => (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.content, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  )
);

AppScreen.displayName = 'AppScreen';
