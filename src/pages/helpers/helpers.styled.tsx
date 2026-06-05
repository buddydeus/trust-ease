import { Pressable, View } from 'react-native';

import styled from 'styled-components/native';

import { AppText } from '../../components';

export const HelpersTitleRow = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const HelpersListStack = styled(View)`
  margin-top: 18px;
  gap: 14px;
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
