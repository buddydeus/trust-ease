import { Pressable, Text, View } from 'react-native';

type ReportScreenProps = {
  mode: 'full' | 'quick';
  onSubmit: () => void;
  onOpenPassword: () => void;
};

export function ReportScreen({
  mode,
  onSubmit,
  onOpenPassword,
}: ReportScreenProps) {
  const secondaryLabel = mode === 'full' ? '进行完整确认' : '快速确认';

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        gap: 16,
        padding: 24,
        backgroundColor: '#f4efe7',
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: '700', color: '#1e2b28' }}>
        今日确认
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 24, color: '#4a5a56' }}>
        轻触按钮告诉关心你的人，你现在一切都好。
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onSubmit}
        style={{
          borderRadius: 16,
          backgroundColor: '#2d6a4f',
          paddingHorizontal: 20,
          paddingVertical: 18,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#ffffff' }}>
          我今天还在
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onOpenPassword}
        style={{
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#9cb3ab',
          paddingHorizontal: 20,
          paddingVertical: 18,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '500', color: '#1e2b28' }}>
          {secondaryLabel}
        </Text>
      </Pressable>
    </View>
  );
}
