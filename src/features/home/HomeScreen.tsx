import { Pressable, View } from 'react-native';

import { colors, type } from '@/src/design/tokens';
import type { HomeSummary } from '@/src/domain/models';
import { AppCard } from '@/src/ui/AppCard';
import { AppScreen } from '@/src/ui/AppScreen';
import { AppText } from '@/src/ui/AppText';

export function HomeScreen({
  summary,
  onOpenReport,
}: {
  summary: HomeSummary;
  onOpenReport?: () => void;
}) {
  return (
    <AppScreen>
      <AppCard>
        <AppText style={{ fontSize: type.caption, color: colors.muted }}>
          今日状态
        </AppText>
        <AppText
          style={{
            marginTop: 8,
            fontSize: 34,
            fontWeight: '700',
            lineHeight: 46,
          }}
        >
          今天也好好生活着
        </AppText>
        <View
          style={{
            marginTop: 18,
            borderRadius: 20,
            backgroundColor: colors.accentSoft,
            padding: 16,
          }}
        >
          <AppText style={{ fontSize: type.caption, color: colors.muted }}>
            已连续平安记录
          </AppText>
          <AppText
            style={{
              marginTop: 8,
              fontSize: 40,
              fontWeight: '700',
            }}
          >
            {summary.streakDays}
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenReport}
          style={{
            marginTop: 16,
            alignItems: 'center',
            borderRadius: 18,
            backgroundColor: colors.accent,
            paddingVertical: 14,
          }}
        >
          <AppText style={{ color: '#FFFFFF' }}>查看本次确认</AppText>
        </Pressable>
      </AppCard>
      <View style={{ marginTop: 14, flexDirection: 'row', gap: 12 }}>
        <AppCard style={{ flex: 1 }}>
          <AppText style={{ fontSize: type.caption, color: colors.muted }}>
            事项
          </AppText>
          <AppText style={{ marginTop: 8, fontSize: 24, fontWeight: '700' }}>
            {summary.itemCount}
          </AppText>
        </AppCard>
        <AppCard style={{ flex: 1 }}>
          <AppText style={{ fontSize: type.caption, color: colors.muted }}>
            协助人
          </AppText>
          <AppText style={{ marginTop: 8, fontSize: 24, fontWeight: '700' }}>
            {summary.helperCount}
          </AppText>
        </AppCard>
      </View>
    </AppScreen>
  );
}
