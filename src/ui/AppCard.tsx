import type { ReactNode } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';

import { colors, radius } from '@/src/design/tokens';

type AppCardProps = ViewProps & {
  children?: ReactNode;
};

export function AppCard({ children, style, ...props }: AppCardProps) {
  return (
    <View
      style={[baseStyle, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const baseStyle: ViewStyle = {
  backgroundColor: colors.card,
  borderColor: colors.border,
  borderWidth: 1,
  borderRadius: radius.card,
  padding: 18,
};
