import { View } from 'react-native';

import { AppCard } from '@/src/ui/AppCard';
import { AppPill } from '@/src/ui/AppPill';
import { AppScreen } from '@/src/ui/AppScreen';
import { AppText } from '@/src/ui/AppText';
import { FloatingAddButton } from '@/src/ui/FloatingAddButton';
import { SectionHint } from '@/src/ui/SectionHint';

export function ItemsScreen({
  onCreateItem,
}: {
  onCreateItem?: () => void;
} = {}) {
  return (
    <AppScreen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={{ fontSize: 23, fontWeight: '700' }}>重要事项</AppText>
        <FloatingAddButton onPress={onCreateItem} />
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
        <AppPill label="全部" active />
        <AppPill label="线下事项" />
      </View>
      <View style={{ marginTop: 24, gap: 18 }}>
        <AppCard>
          <AppText style={{ fontSize: 15, fontWeight: '600' }}>
            把宠物交给林杉照料
          </AppText>
          <AppText style={{ fontSize: 12, color: '#6B817B', marginTop: 9 }}>
            线下事项 · 协助人 1 位
          </AppText>
        </AppCard>
        <AppCard>
          <AppText style={{ fontSize: 15, fontWeight: '600' }}>
            导出私有仓库备份脚本
          </AppText>
          <AppText style={{ fontSize: 12, color: '#6B817B', marginTop: 9 }}>
            线上事项 · 自定义脚本
          </AppText>
        </AppCard>
      </View>
      <SectionHint text="向下滚动后继续查看其他事项" />
    </AppScreen>
  );
}
