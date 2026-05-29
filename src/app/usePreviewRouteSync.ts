import { router } from 'expo-router';

import { useEffect } from 'react';

/**
 * 预览导出时使用的路由同步输入。
 */
export interface IPreviewRouteSyncOptions {
  /** 当前路由路径。 */
  pathname: string;
  /** 预览模式是否启用。 */
  enabled: boolean;
  /** 预览脚本要求进入的目标路由。 */
  route?: string | null;
}

/**
 * 在截图预览模式下把当前路由同步到脚本指定路由。
 *
 * @param options - 预览路由同步参数。
 * @returns void
 */
export const usePreviewRouteSync = ({
  pathname,
  enabled,
  route
}: IPreviewRouteSyncOptions): void => {
  useEffect(() => {
    if (!enabled || !route) {
      return;
    }

    if (pathname === route) {
      return;
    }

    router.replace(route);
  }, [pathname, enabled, route]);
};
