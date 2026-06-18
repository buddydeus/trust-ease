import { Pressable, View } from 'react-native';

import styled from 'styled-components/native';

import { AppCard, AppText } from '../../components';
import { CardTitleText } from '../../theme';

export const PolicySummaryCard = styled(AppCard)`
  margin-top: 18px;
  background-color: ${p => p.theme.color.accentSoft};
`;

export const MissingSectionCard = styled(AppCard)`
  margin-top: 18px;
`;

export const StatusCard = styled(AppCard)`
  margin-top: 14px;
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

export const MetricRow = styled(View)`
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MetricValue = styled(CardTitleText)`
  color: ${p => p.theme.color.accent};
  font-size: 20px;
`;

export const ToggleRowLabel = styled(AppText)`
  font-size: 15px;
`;

export const LocalOnlyNotice = styled(AppText)`
  margin-top: 12px;
  font-size: 12px;
  color: ${p => p.theme.color.muted};
`;

export const ActionGrid = styled(View)`
  margin-top: 16px;
  gap: 10px;
`;

export const ActionButton = styled(Pressable)`
  min-height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  background-color: ${p => p.theme.color.card};
`;

export const ActionLabel = styled(AppText)`
  font-size: 14px;
  font-weight: 600;
  color: ${p => p.theme.color.accent};
`;
