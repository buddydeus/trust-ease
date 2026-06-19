import { Pressable, View } from 'react-native';

import styled from 'styled-components/native';

import { AppText } from '../../components';

export const HelpersTitleRow = styled(View)`
  min-height: 44px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-horizontal: 4px;
`;

export const HelpersListStack = styled(View)`
  margin-top: 18px;
  gap: 10px;
`;

export const HelperGroupStack = styled(View)`
  gap: 8px;
`;

export const HelperGroupHeader = styled(Pressable)`
  min-height: 28px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 4px;
`;

export const HelperGroupHeaderText = styled(AppText)`
  color: ${({ theme }) => theme.color.foreground};
  font-size: 14px;
  font-weight: 800;
`;

export const HelperGroupCountText = styled(AppText)`
  color: ${({ theme }) => theme.color.muted};
  font-size: 12px;
  font-weight: 600;
`;

export const HelperGroupItems = styled(View)`
  gap: 10px;
`;

export const HelperSwipeContent = styled(View)`
  flex-direction: row;
  align-items: stretch;
`;

export const HelperSwipeCardSlot = styled(View)`
  flex-shrink: 0;
`;

export const HelperSwipeActionRail = styled(View)`
  width: 124px;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-end;
  gap: 8px;
  padding-left: 8px;
`;

export const HelperSwipeActionButton = styled(Pressable)<{
  $tone?: 'danger';
}>`
  min-width: 58px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background-color: ${({ $tone, theme }) =>
    $tone === 'danger' ? '#9b3a3a' : theme.color.accentSoft};
  padding-horizontal: 10px;
`;

export const HelperSwipeActionText = styled(AppText)<{
  $tone?: 'danger';
}>`
  font-size: 12px;
  font-weight: 700;
  color: ${({ $tone, theme }) =>
    $tone === 'danger' ? '#ffffff' : theme.color.accent};
`;

export const HelperCardTextCol = styled(View)`
  flex: 1;
`;

export const HelperNoticeText = styled(AppText)`
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.color.muted};
`;
