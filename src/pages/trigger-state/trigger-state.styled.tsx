import { View } from 'react-native';

import styled from 'styled-components/native';

import { AppCard, AppText } from '../../components';
import { CardTitleText } from '../../theme';

export const PolicySummaryCard = styled(AppCard)`
  margin-top: 20px;
`;

export const MissingSectionCard = styled(AppCard)`
  margin-top: 18px;
`;

export const ToggleSettingRow = styled(View)`
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const PolicyCurrentValue = styled(CardTitleText)`
  margin-top: 8px;
`;

export const ToggleRowLabel = styled(AppText)`
  font-size: 15px;
`;
