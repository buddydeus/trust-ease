import type { ReactNode } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/design/tokens';

type AppScreenProps = ViewProps & {
  children?: ReactNode;
};

export function AppScreen({ children, style, ...props }: AppScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }}>
      <View
        style={[baseStyle, style]}
        {...props}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const baseStyle: ViewStyle = {
  flex: 1,
  padding: 22,
};
