import { memo } from 'react';

import { AppText } from '../../components';
import { useI18n } from '../../i18n';
import type { SkinInitStatus, SkinPackageState } from '../../skin';
import { CardTitleText } from '../../theme';

import {
  SkinRuntimeFallbackNote,
  SkinRuntimeHeader,
  SkinRuntimeRow,
  SkinRuntimeRowLabel,
  SkinRuntimeRowValue
} from './my.styled';
import type { IMyScreenCopy, ISkinOption, ISkinRuntimeStatus } from './types';

export interface ISkinRuntimeStatusProps {
  copy?: IMyScreenCopy;
  skinOptions: ISkinOption[];
  status: ISkinRuntimeStatus;
}

interface IResolvedSkinRuntimeCopy {
  skinRuntimeTitle: string;
  skinRuntimeActive: string;
  skinRuntimeInitStatus: string;
  skinRuntimeFallback: string;
  skinRuntimePackageStates: string;
  skinRuntimeStatusIdle: string;
  skinRuntimeStatusInitializing: string;
  skinRuntimeStatusReady: string;
  skinRuntimeStatusFallback: string;
  skinRuntimeStatusFailed: string;
  skinPackageStateIdle: string;
  skinPackageStateChecking: string;
  skinPackageStateDownloading: string;
  skinPackageStateReady: string;
  skinPackageStateFailed: string;
  skinPackageStateIncompatible: string;
}

const packageKeyToSkinId = (packageKey: string): string => {
  return packageKey.split('@')[0] || packageKey;
};

const resolveSkinDisplayName = (
  skinId: string,
  skinOptions: ISkinOption[]
): string => {
  return (
    skinOptions.find(option => option.skinId === skinId)?.displayName || skinId
  );
};

const getInitStatusText = (
  status: SkinInitStatus,
  copy: IResolvedSkinRuntimeCopy
): string => {
  const statusCopy: Record<SkinInitStatus, string> = {
    idle: copy.skinRuntimeStatusIdle,
    initializing: copy.skinRuntimeStatusInitializing,
    ready: copy.skinRuntimeStatusReady,
    fallback: copy.skinRuntimeStatusFallback,
    failed: copy.skinRuntimeStatusFailed
  };

  return statusCopy[status];
};

const getPackageStateText = (
  state: SkinPackageState,
  copy: IResolvedSkinRuntimeCopy
): string => {
  const stateCopy: Record<SkinPackageState, string> = {
    idle: copy.skinPackageStateIdle,
    checking: copy.skinPackageStateChecking,
    downloading: copy.skinPackageStateDownloading,
    ready: copy.skinPackageStateReady,
    failed: copy.skinPackageStateFailed,
    incompatible: copy.skinPackageStateIncompatible
  };

  return stateCopy[state];
};

/**
 * My 页中的皮肤运行时状态摘要。
 *
 * @param props - `ISkinRuntimeStatusProps`
 * @returns 已 memo 的皮肤运行时状态组件。
 */
export const SkinRuntimeStatus = memo<ISkinRuntimeStatusProps>(
  ({ copy, skinOptions, status }) => {
    const { getMessage } = useI18n();
    const resolvedCopy: IResolvedSkinRuntimeCopy = {
      skinRuntimeTitle:
        copy?.skinRuntimeTitle || getMessage('my.skinRuntimeTitle'),
      skinRuntimeActive:
        copy?.skinRuntimeActive || getMessage('my.skinRuntimeActive'),
      skinRuntimeInitStatus:
        copy?.skinRuntimeInitStatus || getMessage('my.skinRuntimeInitStatus'),
      skinRuntimeFallback:
        copy?.skinRuntimeFallback || getMessage('my.skinRuntimeFallback'),
      skinRuntimePackageStates:
        copy?.skinRuntimePackageStates ||
        getMessage('my.skinRuntimePackageStates'),
      skinRuntimeStatusIdle:
        copy?.skinRuntimeStatusIdle || getMessage('my.skinRuntimeStatusIdle'),
      skinRuntimeStatusInitializing:
        copy?.skinRuntimeStatusInitializing ||
        getMessage('my.skinRuntimeStatusInitializing'),
      skinRuntimeStatusReady:
        copy?.skinRuntimeStatusReady || getMessage('my.skinRuntimeStatusReady'),
      skinRuntimeStatusFallback:
        copy?.skinRuntimeStatusFallback ||
        getMessage('my.skinRuntimeStatusFallback'),
      skinRuntimeStatusFailed:
        copy?.skinRuntimeStatusFailed ||
        getMessage('my.skinRuntimeStatusFailed'),
      skinPackageStateIdle:
        copy?.skinPackageStateIdle || getMessage('my.skinPackageStateIdle'),
      skinPackageStateChecking:
        copy?.skinPackageStateChecking ||
        getMessage('my.skinPackageStateChecking'),
      skinPackageStateDownloading:
        copy?.skinPackageStateDownloading ||
        getMessage('my.skinPackageStateDownloading'),
      skinPackageStateReady:
        copy?.skinPackageStateReady || getMessage('my.skinPackageStateReady'),
      skinPackageStateFailed:
        copy?.skinPackageStateFailed || getMessage('my.skinPackageStateFailed'),
      skinPackageStateIncompatible:
        copy?.skinPackageStateIncompatible ||
        getMessage('my.skinPackageStateIncompatible')
    };
    const packageEntries = Object.entries(status.skinPackageStates);

    return (
      <>
        <SkinRuntimeHeader>
          <CardTitleText>{resolvedCopy.skinRuntimeTitle}</CardTitleText>
        </SkinRuntimeHeader>
        <SkinRuntimeRow>
          <SkinRuntimeRowLabel>
            {resolvedCopy.skinRuntimeActive}
          </SkinRuntimeRowLabel>
          <SkinRuntimeRowValue>
            {resolveSkinDisplayName(status.activeSkinId, skinOptions)}
          </SkinRuntimeRowValue>
        </SkinRuntimeRow>
        <SkinRuntimeRow>
          <SkinRuntimeRowLabel>
            {resolvedCopy.skinRuntimeInitStatus}
          </SkinRuntimeRowLabel>
          <SkinRuntimeRowValue>
            {getInitStatusText(status.skinInitStatus, resolvedCopy)}
          </SkinRuntimeRowValue>
        </SkinRuntimeRow>
        {status.skinInitUsedFallback ? (
          <SkinRuntimeFallbackNote>
            {resolvedCopy.skinRuntimeFallback}
          </SkinRuntimeFallbackNote>
        ) : null}
        {packageEntries.length > 0 ? (
          <>
            <SkinRuntimeRow>
              <SkinRuntimeRowLabel>
                {resolvedCopy.skinRuntimePackageStates}
              </SkinRuntimeRowLabel>
              <SkinRuntimeRowValue />
            </SkinRuntimeRow>
            {packageEntries.map(([packageKey, state]) => {
              const skinId = packageKeyToSkinId(packageKey);

              return (
                <SkinRuntimeRow key={packageKey}>
                  <SkinRuntimeRowLabel>
                    {resolveSkinDisplayName(skinId, skinOptions)}
                  </SkinRuntimeRowLabel>
                  <SkinRuntimeRowValue>
                    {getPackageStateText(state, resolvedCopy)}
                  </SkinRuntimeRowValue>
                </SkinRuntimeRow>
              );
            })}
          </>
        ) : (
          <AppText>{resolvedCopy.skinRuntimePackageStates}</AppText>
        )}
      </>
    );
  }
);

SkinRuntimeStatus.displayName = 'SkinRuntimeStatus';
