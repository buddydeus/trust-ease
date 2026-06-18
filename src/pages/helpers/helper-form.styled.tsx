import { Pressable, TextInput, View } from 'react-native';

import styled from 'styled-components/native';

import { AppText, AppCard } from '../../components';

export const HelperFormFieldCard = styled(AppCard)`
  margin-top: 14px;
`;

export const HelperFormInput = styled(TextInput).attrs(({ theme }) => ({
  placeholderTextColor: theme.color.muted
}))`
  margin-top: 8px;
  min-height: 44px;
  border-width: 0;
  border-radius: 14px;
  background-color: #f4f8f6;
  padding-horizontal: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.foreground};
`;

export const HelperNotesInput = styled(HelperFormInput)`
  min-height: 98px;
  padding-top: 12px;
  text-align-vertical: top;
`;

export const HelperValidationText = styled(AppText)`
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.color.accent};
`;

export const HelperSaveButton = styled(Pressable)`
  margin-top: 18px;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.color.accent};
`;

export const HelperNoticeBlock = styled(View)`
  margin-top: 14px;
`;
