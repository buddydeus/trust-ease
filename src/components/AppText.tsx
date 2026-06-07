import { memo } from 'react';
import { Text, type TextProps } from 'react-native';

/**
 * `AppText` 的 props；继承 RN `Text` 的全部属性。
 */
export interface IAppTextProps extends TextProps {}

/**
 * 默认正文文本原语，应用共享颜色与正文字号。
 *
 * @param props - `IAppTextProps`
 * @returns 已 memo 的 `Text` 元素。
 */
export const AppText = memo<IAppTextProps>(({ className, style, ...props }) => (
  <Text
    className={['text-body text-foreground', className]
      .filter(Boolean)
      .join(' ')}
    style={style}
    {...props}
  />
));

AppText.displayName = 'AppText';
