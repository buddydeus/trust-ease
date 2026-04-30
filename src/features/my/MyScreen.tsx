import { Pressable, View } from 'react-native';

import { colors, type } from '@/src/design/tokens';
import { AppCard } from '@/src/ui/AppCard';
import { AppScreen } from '@/src/ui/AppScreen';
import { AppText } from '@/src/ui/AppText';

export function MyScreen({
  onOpenTriggerState,
}: {
  onOpenTriggerState?: () => void;
} = {}) {
  const triggerStateCard = (
    <AppCard>
      <AppText style={{ fontSize: 15, fontWeight: '600' }}>触发状态</AppText>
      <AppText style={{ marginTop: 8, fontSize: 12, color: colors.muted }}>
        死亡：3 次未申报
      </AppText>
    </AppCard>
  );

  return (
    <AppScreen>
      <AppText style={{ fontSize: 23, fontWeight: '700' }}>我的</AppText>
      <AppCard style={{ marginTop: 22 }}>
        <AppText style={{ fontSize: type.caption, color: colors.muted }}>
          当前状态
        </AppText>
        <AppText style={{ marginTop: 8, fontSize: 15, fontWeight: '600' }}>
          今天已完成确认
        </AppText>
      </AppCard>
      <View style={{ marginTop: 18, gap: 14 }}>
        {onOpenTriggerState ? (
          <Pressable
            accessibilityLabel="打开触发状态"
            accessibilityRole="button"
            onPress={onOpenTriggerState}
          >
            {triggerStateCard}
          </Pressable>
        ) : (
          triggerStateCard
        )}
        <AppCard>
          <AppText style={{ fontSize: 15, fontWeight: '600' }}>身份与安全</AppText>
          <AppText style={{ marginTop: 8, fontSize: 12, color: colors.muted }}>
            实名、密码与恢复方式
          </AppText>
        </AppCard>
      </View>
    </AppScreen>
  );
}
