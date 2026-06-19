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
  min-height: 42px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.border};
  border-radius: 14px;
  background-color: ${({ theme }) => theme.color.card};
  padding-horizontal: 14px;
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

export const HelperCardTextCol = styled(View)`
  flex: 1;
`;

export const HelperActionRow = styled(View)`
  margin-top: 12px;
  flex-direction: row;
  gap: 14px;
`;

export const HelperActionButton = styled(Pressable)`
  min-height: 28px;
  justify-content: center;
`;

export const HelperNoticeText = styled(AppText)`
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.color.muted};
`;
