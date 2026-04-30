import { useState } from 'react';
import { View } from 'react-native';
import { Switch } from '@expo/ui/jetpack-compose';

import { colors, type } from '@/src/design/tokens';
import { AppCard } from '@/src/ui/AppCard';
import { AppScreen } from '@/src/ui/AppScreen';
import { AppText } from '@/src/ui/AppText';

export function TriggerStateScreen() {
  const [missingEnabled, setMissingEnabled] = useState(false);

  return (
    <AppScreen>
      <AppText style={{ fontSize: 23, fontWeight: '700' }}>触发状态</AppText>
      <AppCard style={{ marginTop: 20 }}>
        <AppText style={{ fontSize: type.caption, color: colors.muted }}>
          当前生效
        </AppText>
        <AppText style={{ marginTop: 8, fontSize: 15, fontWeight: '600' }}>
          死亡 = 3 次未申报
        </AppText>
      </AppCard>
      <AppCard style={{ marginTop: 18 }}>
        <AppText style={{ fontSize: type.caption, color: colors.muted }}>
          失联状态
        </AppText>
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <AppText style={{ fontSize: 15 }}>启用失联</AppText>
          <Switch
            value={missingEnabled}
            onCheckedChange={setMissingEnabled}
            colors={{
              checkedTrackColor: colors.accent,
              checkedThumbColor: '#FFFFFF',
              uncheckedTrackColor: colors.border,
              uncheckedThumbColor: '#FFFFFF',
            }}
          />
        </View>
      </AppCard>
    </AppScreen>
  );
}
