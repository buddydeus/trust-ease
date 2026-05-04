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
