import { View } from 'react-native';

import { colors } from '@/src/design/tokens';
import { AppText } from '@/src/ui/AppText';

export function AppPill({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: active ? colors.accent : '#FFFFFF',
        borderWidth: active ? 0 : 1,
        borderColor: colors.border,
      }}
    >
      <AppText style={{ color: active ? '#FFFFFF' : '#466059', fontSize: 12 }}>
        {label}
      </AppText>
    </View>
  );
}
