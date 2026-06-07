import { memo } from 'react';
import { View } from 'react-native';

import { AppText } from './AppText';

/**
 * `AppPill` 的 props。
 */
export interface IAppPillProps {
  /** 胶囊展示文案。 */
  label: string;
  /** 为 `true` 时使用填充主色样式。 */
  active?: boolean;
}

/**
 * 紧凑型筛选/状态胶囊，区分激活与未激活视觉状态。
 *
 * @param props - `IAppPillProps`
 * @returns 已 memo 的胶囊元素。
 */
export const AppPill = memo<IAppPillProps>(({ label, active = false }) => (
  <View
    className={[
      'rounded-pill px-[14px] py-[10px]',
      active ? 'border-0 bg-accent' : 'border border-border bg-card'
    ].join(' ')}
  >
    <AppText
      className={[
        'text-caption',
        active ? 'text-white' : 'text-pill-label'
      ].join(' ')}
    >
      {label}
    </AppText>
  </View>
));

AppPill.displayName = 'AppPill';
