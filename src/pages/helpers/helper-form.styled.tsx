import { Pressable, TextInput, View } from 'react-native';

import styled from 'styled-components/native';

import { AppText, AppCard } from '../../components';

export const HelperFormFieldCard = styled(AppCard)`
  margin-top: 14px;
`;

export const HelperChoiceToggle = styled(Pressable)`
  margin-top: 10px;
  min-height: 42px;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.border};
  border-radius: 14px;
  background-color: ${({ theme }) => theme.color.card};
  padding-horizontal: 12px;
`;

export const HelperChoiceList = styled(View)`
  margin-top: 8px;
  gap: 8px;
`;

export const HelperChoiceButton = styled(Pressable)<{ selected: boolean }>`
  min-height: 38px;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.color.accent : theme.color.border};
  border-radius: 14px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.color.accentSoft : theme.color.card};
  padding-horizontal: 12px;
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

export const HelperContactMethodBlock = styled(View)`
  margin-top: 10px;
  gap: 10px;
`;

export const HelperContactMethodItem = styled(View)`
  gap: 6px;
`;

export const HelperContactMethodRow = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const HelperContactTypeButton = styled(Pressable)<{ selected: boolean }>`
  min-height: 44px;
  min-width: 58px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.color.accent : theme.color.border};
  border-radius: 13px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.color.accentSoft : theme.color.card};
  padding-horizontal: 10px;
`;

export const HelperContactTypeIconText = styled(AppText)`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.accent};
`;

export const HelperContactTypeCaretText = styled(AppText)`
  margin-left: 4px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.muted};
`;

export const HelperContactTypeMenu = styled(View)`
  flex-direction: row;
  gap: 8px;
  padding-left: 2px;
`;

export const HelperContactInput = styled(HelperFormInput)`
  margin-top: 0;
  min-width: 0;
  flex: 1;
`;

export const HelperContactActionRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
`;

export const HelperContactActionButton = styled(Pressable)`
  min-height: 34px;
  justify-content: center;
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
