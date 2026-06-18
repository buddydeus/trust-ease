import { Pressable, TextInput, View } from 'react-native';

import styled from 'styled-components/native';

import { AppCard, AppText } from '../../components';
import { CardTitleText } from '../../theme';

export const TypeSectionCard = styled(AppCard)`
  margin-top: 14px;
`;

export const TypeChoiceRow = styled(View)`
  flex-direction: row;
  gap: 12px;
  margin-top: 14px;
`;

export const OfflineKindCard = styled(Pressable)`
  flex: 1;
  border-radius: ${p => p.theme.radius.card}px;
  border: 1px solid ${p => p.theme.color.border};
  background-color: ${p => p.theme.color.accentSoft};
  padding: 18px;
`;

export const OnlineKindCard = styled(Pressable)`
  flex: 1;
  border-radius: ${p => p.theme.radius.card}px;
  border: 1px solid ${p => p.theme.color.border};
  background-color: ${p => p.theme.color.card};
  padding: 18px;
`;

export const WizardStepCard = styled(AppCard)`
  margin-top: 14px;
`;

export const StepCurrentValue = styled(CardTitleText)`
  margin-top: 8px;
`;

export const FormFieldCard = styled(AppCard)`
  margin-top: 14px;
`;

export const FormTextInput = styled(TextInput)`
  min-height: 44px;
  margin-top: 10px;
  border-radius: ${p => p.theme.radius.card}px;
  border-width: 0;
  background-color: #f4f8f6;
  color: ${p => p.theme.color.foreground};
  padding: 12px;
`;

export const SummaryTextInput = styled(FormTextInput)`
  min-height: 98px;
  padding-top: 12px;
  text-align-vertical: top;
`;

export const ValidationText = styled(AppText)`
  margin-top: 8px;
  color: ${p => p.theme.color.accent};
`;

export const SaveButton = styled(Pressable)`
  min-height: 48px;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
  border-radius: 16px;
  background-color: ${p => p.theme.color.accent};
`;

export const HelperChoiceList = styled(View)`
  margin-top: 10px;
  gap: 8px;
`;

export const HelperChoiceButton = styled(Pressable)<{ selected: boolean }>`
  min-height: 38px;
  border-width: 1px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.color.accent : theme.color.border};
  border-radius: 14px;
  padding-horizontal: 12px;
  justify-content: center;
  background-color: ${({ selected, theme }) =>
    selected ? theme.color.accentSoft : theme.color.card};
`;
