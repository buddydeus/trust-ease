import { View } from 'react-native';

import { AppCard } from '@/src/ui/AppCard';
import { AppScreen } from '@/src/ui/AppScreen';
import { AppText } from '@/src/ui/AppText';

export function ItemFormScreen() {
  return (
    <AppScreen>
      <AppText style={{ fontSize: 23, fontWeight: '700' }}>
        先写第一件事
      </AppText>
      <AppCard style={{ marginTop: 18 }}>
        <AppText style={{ fontSize: 12, color: '#6F837D' }}>事项类型</AppText>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
          <AppCard style={{ flex: 1, backgroundColor: '#EEF6F2' }}>
            <AppText style={{ fontSize: 15, fontWeight: '600' }}>线下事项</AppText>
            <AppText style={{ fontSize: 12, color: '#73867F', marginTop: 6 }}>
              交代给某个人处理
            </AppText>
          </AppCard>
          <AppCard style={{ flex: 1 }}>
            <AppText style={{ fontSize: 15, fontWeight: '600' }}>线上事项</AppText>
            <AppText style={{ fontSize: 12, color: '#73867F', marginTop: 6 }}>
              触发后执行脚本
            </AppText>
          </AppCard>
        </View>
      </AppCard>
      <AppCard style={{ marginTop: 14 }}>
        <AppText style={{ fontSize: 12, color: '#6F837D' }}>当前步骤</AppText>
        <AppText style={{ fontSize: 15, fontWeight: '600', marginTop: 8 }}>
          选择协助人
        </AppText>
      </AppCard>
    </AppScreen>
  );
}
