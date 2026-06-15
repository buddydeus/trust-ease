import { Pressable, View } from 'react-native';

import styled from 'styled-components/native';

export const ItemsTitleRow = styled(View)`
  min-height: 44px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ItemsListStack = styled(View)`
  margin-top: 24px;
  gap: 12px;
`;

export const ItemCardInnerRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
`;

export const ItemCardTextCol = styled(View)`
  flex: 1;
`;

export const ItemKindLabel = styled.Text<{ variant: 'offline' | 'online' }>`
  align-self: flex-start;
  margin-top: 9px;
  border-radius: ${p => p.theme.radius.pill}px;
  background-color: ${p =>
    p.variant === 'offline'
      ? 'rgba(47, 138, 103, 0.12)'
      : 'rgba(154, 106, 45, 0.12)'};
  color: ${p =>
    p.variant === 'offline'
      ? p.theme.color.offlineRibbon
      : p.theme.color.onlineRibbon};
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
`;

export const ItemActionRow = styled(View)`
  flex-direction: row;
  gap: 14px;
  margin-top: 14px;
`;

export const ItemActionButton = styled(Pressable)`
  padding: 4px 0;
`;
