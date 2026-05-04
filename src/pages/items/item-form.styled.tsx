import { View } from 'react-native';

import styled from 'styled-components/native';

import { AppCard } from '../../components';
import { CardTitleText } from '../../theme';

export const TypeSectionCard = styled(AppCard)`
  margin-top: 18px;
`;

export const TypeChoiceRow = styled(View)`
  flex-direction: row;
  gap: 12px;
  margin-top: 14px;
`;

export const OfflineKindCard = styled(AppCard)`
  flex: 1;
  background-color: ${p => p.theme.color.accentSoft};
`;

export const OnlineKindCard = styled(AppCard)`
  flex: 1;
`;

export const WizardStepCard = styled(AppCard)`
  margin-top: 14px;
`;

export const StepCurrentValue = styled(CardTitleText)`
  margin-top: 8px;
`;
