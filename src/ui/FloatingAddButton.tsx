import { Pressable } from 'react-native';

import { AppText } from '@/src/ui/AppText';

export function FloatingAddButton({
  onPress,
}: {
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel="新建事项"
      accessibilityRole="button"
      onPress={onPress}
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#86B1A2',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AppText style={{ color: '#FFFFFF', fontSize: 20, lineHeight: 20 }}>+</AppText>
    </Pressable>
  );
}
