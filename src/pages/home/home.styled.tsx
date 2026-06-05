import { Pressable, View } from 'react-native';

import styled from 'styled-components/native';

import { AppCard, AppText } from '../../components';

export const HeroHeadline = styled(AppText)`
  margin-top: 8px;
  font-size: 34px;
  font-weight: 700;
  line-height: 46px;
`;

export const StreakDayNumber = styled(AppText)`
  margin-top: 8px;
  font-size: 40px;
  font-weight: 700;
  text-align: center;
`;

export const HomeStatRow = styled(View)`
  margin-top: 14px;
  flex-direction: row;
  gap: 12px;
`;

export const HomeStatCard = styled(AppCard)`
  flex: 1;
`;

export const ReadinessCard = styled(AppCard)`
  margin-top: 14px;
`;

export const ReadinessStatusText = styled(AppText)`
  margin-top: 8px;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
`;

export const ReadinessSectionGrid = styled(View)`
  margin-top: 14px;
  gap: 10px;
`;

export const ReadinessSectionRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
`;

export const ReadinessSectionLabel = styled(AppText)`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
`;

export const ReadinessSectionState = styled(AppText)`
  color: ${p => p.theme.color.muted};
  font-size: 13px;
`;

export const ReadinessCountText = styled(AppText)`
  margin-top: 10px;
  color: ${p => p.theme.color.muted};
  font-size: 13px;
  line-height: 20px;
`;

export const ReadinessNoticeText = styled(AppText)`
  margin-top: 12px;
  color: ${p => p.theme.color.muted};
  font-size: 12px;
  line-height: 18px;
`;

export const ReadinessActionStack = styled(View)`
  margin-top: 14px;
  gap: 10px;
`;

export const ReadinessActionButton = styled(Pressable)`
  min-height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: ${p => p.theme.radius.pill}px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  background-color: ${p => p.theme.color.accentSoft};
`;

export const ReadinessActionLabel = styled(AppText)`
  color: ${p => p.theme.color.accent};
  font-size: 14px;
  font-weight: 600;
`;
