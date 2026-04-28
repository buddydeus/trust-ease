import { Text, type TextProps } from 'react-native';

import { colors, type } from '@/src/design/tokens';

export function AppText({ style, ...props }: TextProps) {
  return (
    <Text
      style={[{ color: colors.text, fontSize: type.body }, style]}
      {...props}
    />
  );
}
