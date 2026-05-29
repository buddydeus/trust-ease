import { useEffect } from 'react';

/**
 * 预览截图脚本读取的 DOM 标记输入。
 */
export interface IPreviewReadyMarkerOptions {
  /** 当前路由路径。 */
  pathname: string;
  /** 预览模式是否启用。 */
  enabled: boolean;
  /** 当前预览语言。 */
  locale?: string | null;
}

/**
 * 在 Web 预览环境中写入截图脚本需要的 body dataset。
 *
 * @param options - 预览 DOM 标记参数。
 * @returns void
 */
export const usePreviewReadyMarker = ({
  pathname,
  enabled,
  locale
}: IPreviewReadyMarkerOptions): void => {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    if (!enabled) {
      delete document.body.dataset.previewReady;
      delete document.body.dataset.previewRoute;
      delete document.body.dataset.previewLocale;
      return;
    }

    document.body.dataset.previewReady = '0';
    document.body.dataset.previewRoute = pathname;
    document.body.dataset.previewLocale = locale ?? '';

    // 推迟标记 previewReady，使无头截图在布局 effect 冲刷后再读取布局。
    const frameId = requestAnimationFrame(() => {
      document.body.dataset.previewReady = '1';
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [pathname, enabled, locale]);
};
