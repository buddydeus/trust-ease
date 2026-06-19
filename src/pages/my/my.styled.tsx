import { Pressable, ScrollView, View } from 'react-native';

import styled from 'styled-components/native';

import { AppCard, AppText } from '../../components';
import { CardTitleText } from '../../theme';

export const StatusHighlightCard = styled(AppCard)`
  margin-top: 18px;
  background-color: ${p => p.theme.color.accentSoft};
`;

export const StatusValueLine = styled(CardTitleText)`
  margin-top: 8px;
`;

export const MyScreenCardStack = styled(View)`
  margin-top: 14px;
  gap: 10px;
`;

export const MyScreenScroll = styled(ScrollView).attrs({
  contentContainerStyle: {
    paddingBottom: 24
  },
  showsVerticalScrollIndicator: false
})`
  flex: 1;
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

export const BackupNoticeText = styled(AppText)`
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.color.muted};
`;

export const BackupStatusText = styled(AppText)<{ $tone?: 'error' }>`
  margin-top: 10px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $tone, theme }) =>
    $tone === 'error' ? '#9b3a3a' : theme.color.accent};
`;

export const BackupActionRow = styled(View)`
  margin-top: 14px;
  flex-direction: row;
  gap: 10px;
`;

export const BackupActionButton = styled(Pressable)<{ $variant?: 'secondary' }>`
  min-height: 44px;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.accent};
  border-radius: 16px;
  padding-horizontal: 12px;
  background-color: ${({ $variant, theme }) =>
    $variant === 'secondary' ? theme.color.card : theme.color.accent};
`;

export const BackupActionLabel = styled(AppText)<{ $variant?: 'secondary' }>`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $variant, theme }) =>
    $variant === 'secondary' ? theme.color.accent : '#ffffff'};
`;

export const BackupPreviewBlock = styled(View)`
  margin-top: 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.border};
  border-radius: 14px;
  padding: 12px;
  gap: 8px;
`;

export const BackupPreviewRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
`;

export const BackupPreviewLabel = styled(AppText)`
  flex: 1;
  font-size: 12px;
  color: ${({ theme }) => theme.color.muted};
`;

export const BackupPreviewValue = styled(AppText)`
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  text-align: right;
`;
