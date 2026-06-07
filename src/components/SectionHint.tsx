import { memo } from 'react';

import { AppText } from './AppText';

/**
 * `SectionHint` 的 props。
 */
export interface ISectionHintProps {
  /** 以弱化说明样式展示的提示文案。 */
  text: string;
}

/**
 * 分组内容下方的居中弱化辅助行。
 *
 * @param props - `ISectionHintProps`
 * @returns 已 memo 的提示文本。
 */
export const SectionHint = memo<ISectionHintProps>(({ text }) => (
  <AppText className="mt-[18px] text-center text-caption text-hint">
    {text}
  </AppText>
));

SectionHint.displayName = 'SectionHint';
