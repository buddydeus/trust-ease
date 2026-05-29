import { useEffect } from 'react';

import { loadSkinStorageState, saveSkinStorageState } from '../skin/storage';
import { useAppStore } from '../store';

/**
 * 启动时恢复皮肤运行时状态，并在后续变更时持久化。
 *
 * @returns void
 */
export const useSkinStorageSync = (): void => {
  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    loadSkinStorageState().then(snapshot => {
      if (!active) {
        return;
      }

      useAppStore.setState({
        selectedSkinId: snapshot.selectedSkinId,
        activeSkinId: snapshot.activeSkinId,
        lastReadySkinId: snapshot.lastReadySkinId,
        skinPackageStates: snapshot.skinPackageStates
      });

      unsubscribe = useAppStore.subscribe((state, prev) => {
        if (
          state.selectedSkinId === prev.selectedSkinId &&
          state.activeSkinId === prev.activeSkinId &&
          state.lastReadySkinId === prev.lastReadySkinId &&
          state.skinPackageStates === prev.skinPackageStates
        ) {
          return;
        }

        void saveSkinStorageState({
          selectedSkinId: state.selectedSkinId,
          activeSkinId: state.activeSkinId,
          lastReadySkinId: state.lastReadySkinId,
          skinPackageStates: state.skinPackageStates
        });
      });
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);
};
