import { View } from 'react-native';

import styled from 'styled-components/native';

import { AppCard, AppText } from '../../components';
import { CardTitleText } from '../../theme';

export const StatusHighlightCard = styled(AppCard)`
  margin-top: 22px;
`;

export const StatusValueLine = styled(CardTitleText)`
  margin-top: 8px;
`;

export const MyScreenCardStack = styled(View)`
  margin-top: 18px;
  gap: 14px;
`;

export const PickerBlock = styled(View)`
  margin-top: 12px;
`;

export const PickerExpandList = styled(View)`
  margin-top: 10px;
  gap: 8px;
`;

export const PickerHeaderLabel = styled(AppText)`
  font-size: 13px;
  font-weight: 600;
`;

export const PickerRowLabel = styled(AppText)`
  font-size: 13px;
`;

export const SkinRuntimeHeader = styled(View)`
  margin-bottom: 12px;
`;

export const SkinRuntimeRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
`;

export const SkinRuntimeRowLabel = styled(AppText)`
  flex: 1;
  font-size: 13px;
  color: ${({ theme }) => theme.color.muted};
`;

export const SkinRuntimeRowValue = styled(AppText)`
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  text-align: right;
`;

export const SkinRuntimeFallbackNote = styled(AppText)`
  margin-top: 10px;
  font-size: 13px;
  color: ${({ theme }) => theme.color.muted};
`;
