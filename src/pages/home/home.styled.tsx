import { Pressable, View } from 'react-native';

import styled from 'styled-components/native';

import { AppCard, AppText } from '../../components';

export const HomeDailyBanner = styled(View)`
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  border-radius: ${p => p.theme.radius.card}px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  background-color: ${p => p.theme.color.accentSoft};
  padding-horizontal: 14px;
`;

export const HomeDailyDot = styled(View)<{ reported: boolean }>`
  height: 8px;
  width: 8px;
  border-radius: ${p => p.theme.radius.pill}px;
  background-color: ${p =>
    p.reported ? p.theme.color.offlineRibbon : p.theme.color.onlineRibbon};
`;

export const HomeDailyStatusText = styled(AppText)`
  flex-shrink: 0;
  color: ${p => p.theme.color.foreground};
  font-size: 14px;
  font-weight: 700;
`;

export const HomeDailyMetaText = styled(AppText)`
  flex: 1;
  color: ${p => p.theme.color.muted};
  font-size: 12px;
  line-height: 18px;
  text-align: right;
`;

export const HomeIntroCard = styled(AppCard)`
  margin-top: 16px;
`;

export const HeroHeadline = styled(AppText)`
  margin-top: 8px;
  font-size: 30px;
  font-weight: 700;
  line-height: 38px;
`;

export const HomeIntroBody = styled(AppText)`
  margin-top: 10px;
  color: ${p => p.theme.color.muted};
  font-size: 15px;
  line-height: 24px;
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
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: ${p => p.theme.radius.card}px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  background-color: ${p => p.theme.color.accentSoft};
`;

export const ReadinessActionLabel = styled(AppText)`
  color: ${p => p.theme.color.accent};
  font-size: 14px;
  font-weight: 600;
`;
