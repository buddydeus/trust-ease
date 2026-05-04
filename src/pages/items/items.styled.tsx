import { View } from 'react-native';

import styled from 'styled-components/native';

export const ItemsTitleRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

export const ItemsFilterRow = styled(View)`
  flex-direction: row;
  gap: 12px;
  margin-top: 20px;
`;

export const ItemsListStack = styled(View)`
  margin-top: 24px;
  gap: 18px;
`;

export const ItemCardInnerRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
`;

export const ItemCardTextCol = styled(View)`
  flex: 1;
`;
