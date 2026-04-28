import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: '首页' }} />
      <Tabs.Screen name="items" options={{ title: '事项' }} />
      <Tabs.Screen name="my" options={{ title: '我的' }} />
    </Tabs>
  );
}
