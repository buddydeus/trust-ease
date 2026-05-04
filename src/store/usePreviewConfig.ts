import { useMemo } from 'react';

import { getPreviewConfig, type PreviewConfig } from './preview/config';

/**
 * 对当前 JS 会话的预览配置做一次性 memo，避免无意义重算。
 *
 * @returns 与初次挂载时 URL 一致的 `PreviewConfig`。
 */
export const usePreviewConfig = (): PreviewConfig => {
  return useMemo(() => getPreviewConfig(), []);
};
