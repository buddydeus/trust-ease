import { useEffect } from 'react';

import { appSkinConfig } from '../skin';
import { resolveSkinInitState } from '../skin/initStateMachine';
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

    useAppStore.getState().setSkinInitStatus('initializing');

    loadSkinStorageState()
      .catch(() => null)
      .then(snapshot => {
        if (!active) {
          return;
        }

        const resolution = resolveSkinInitState({
          persistedState: snapshot,
          defaultSkinId: appSkinConfig.defaultSkinId,
          defaultSkinVersion: '1.0.0'
        });

        useAppStore.setState({
          selectedSkinId: resolution.state.selectedSkinId,
          activeSkinId: resolution.state.activeSkinId,
          lastReadySkinId: resolution.state.lastReadySkinId,
          skinPackageStates: resolution.state.skinPackageStates,
          skinInitStatus: resolution.status,
          skinInitUsedFallback: resolution.usedFallback
        });
        void saveSkinStorageState(resolution.state);

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
