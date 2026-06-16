import { Tabs } from 'expo-router';

import { memo, useMemo } from 'react';
import { type TextStyle } from 'react-native';

import { useTheme } from 'styled-components/native';

import {
  TabHomeBase,
  TabHomeRoof,
  TabIconSquareFrame,
  TabItemsClip,
  TabItemsLine,
  TabMyAvatar,
  TabMyShoulders
} from '../../appSupport/tabs/tabs-layout.styled';
import { useI18n } from '../../i18n';

/**
 * 底部 Tab 栏图标标识，对应矢量形状。
 */
type TabIconName = 'home' | 'items' | 'my';

/**
 * `TabIcon` 的 props。
 */
interface ITabIconProps {
  /** 要渲染的 Tab 图形种类。 */
  name: TabIconName;
  /** 父级 Tab 是否处于聚焦态。 */
  focused: boolean;
}

/**
 * 自绘矢量 Tab 图标（不依赖外部图标字体）。
 *
 * @param props - `ITabIconProps`
 * @returns 已 memo 的图标元素。
 */
const TabIcon = memo<ITabIconProps>(({ name, focused }) => {
  const theme = useTheme();
  const stroke = focused ? theme.color.foreground : theme.color.muted;
  const fill = focused ? theme.color.accentSoft : theme.color.card;

  if (name === 'home') {
    return (
      <TabIconSquareFrame>
        <TabHomeRoof $fill={fill} $stroke={stroke} />
        <TabHomeBase $fill={fill} $stroke={stroke} />
      </TabIconSquareFrame>
    );
  }

  if (name === 'items') {
    return (
      <TabItemsClip $fill={fill} $stroke={stroke}>
        {[0, 1, 2].map(line => (
          <TabItemsLine key={line} $stroke={stroke} $muted={line === 2} />
        ))}
      </TabItemsClip>
    );
  }

  return (
    <TabIconSquareFrame>
      <TabMyAvatar $fill={fill} $stroke={stroke} />
      <TabMyShoulders $fill={fill} $stroke={stroke} />
    </TabIconSquareFrame>
  );
});

TabIcon.displayName = 'TabIcon';

/** 与其它布局对称的占位 props；Tab 文案由 `useI18n` 提供。 */
export interface ITabsLayoutProps {}

/**
 * 底部 Tab 导航：首页 / 事项 / 我的。
 *
 * @returns 已 memo 的 Tabs 布局元素。
 */
const TabsLayout = memo<ITabsLayoutProps>(() => {
  const { getMessage } = useI18n();
  const theme = useTheme();

  const tabBarLabelStyle = useMemo<TextStyle>(
    () => ({
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '600',
      marginTop: 1,
      marginBottom: 9,
      paddingBottom: 0
    }),
    []
  );

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: theme.color.foreground,
      tabBarInactiveTintColor: theme.color.muted,
      tabBarLabelStyle,
      tabBarIconStyle: {
        width: 18,
        height: 18,
        marginTop: 6,
        marginBottom: 0
      },
      tabBarItemStyle: {
        paddingTop: 2,
        paddingBottom: 8
      },
      tabBarStyle: {
        height: 70,
        paddingTop: 4,
        paddingBottom: 12,
        borderTopWidth: 1,
        borderTopColor: theme.color.border,
        backgroundColor: theme.color.card
      }
    }),
    [theme, tabBarLabelStyle]
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="home"
        options={{
          title: getMessage('tabs.home'),
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: getMessage('tabs.items'),
          tabBarIcon: ({ focused }) => (
            <TabIcon name="items" focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: getMessage('tabs.my'),
          tabBarIcon: ({ focused }) => <TabIcon name="my" focused={focused} />
        }}
      />
    </Tabs>
  );
});

TabsLayout.displayName = 'TabsLayout';

export default TabsLayout;
