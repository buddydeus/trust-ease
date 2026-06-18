import { Pressable, View } from 'react-native';

import styled from 'styled-components/native';

import { AppScreen, AppText } from '../../components';

export const HomeAppScreen = styled(AppScreen)`
  background-color: ${p => p.theme.color.page};
`;

export const HomeHeaderKicker = styled(AppText)`
  color: ${p => p.theme.color.muted};
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
`;

export const HomeHeaderTitle = styled(AppText)`
  margin-top: 10px;
  color: ${p => p.theme.color.foreground};
  font-size: 26px;
  font-weight: 800;
  line-height: 32px;
`;

export const HomeHeaderBody = styled(AppText)`
  margin-top: 8px;
  color: ${p => p.theme.color.muted};
  font-size: 14px;
  line-height: 22px;
`;

export const HomeStatusCard = styled(View)`
  margin-top: 18px;
  min-height: 88px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  border-radius: ${p => p.theme.radius.card}px;
  background-color: ${p => p.theme.color.card};
  padding: 16px;
`;

export const HomeStatusLabel = styled(AppText)`
  color: ${p => p.theme.color.muted};
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
`;

export const HomeDailyStatusText = styled(AppText)`
  margin-top: 5px;
  color: ${p => p.theme.color.foreground};
  font-size: 20px;
  font-weight: 800;
  line-height: 25px;
`;

export const HomeDailyMetaText = styled(AppText)`
  margin-top: 4px;
  color: ${p => p.theme.color.muted};
  font-size: 12px;
  line-height: 18px;
`;

export const HomeStatusCta = styled(Pressable)`
  position: absolute;
  top: 24px;
  right: 14px;
  min-height: 36px;
  justify-content: center;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  border-radius: 14px;
  background-color: ${p => p.theme.color.card};
  padding-horizontal: 14px;
`;

export const HomeStatusCtaText = styled(AppText)`
  color: ${p => p.theme.color.accent};
  font-size: 13px;
  font-weight: 800;
`;

export const HomeNextCard = styled(View)`
  margin-top: 14px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  border-radius: ${p => p.theme.radius.card}px;
  background-color: ${p => p.theme.color.card};
  padding: 18px;
`;

export const HomeNextLabel = styled(AppText)`
  color: ${p => p.theme.color.muted};
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
`;

export const HomeNextTitle = styled(AppText)`
  margin-top: 8px;
  color: ${p => p.theme.color.foreground};
  font-size: 22px;
  font-weight: 800;
  line-height: 28px;
`;

export const HomeNextBody = styled(AppText)`
  margin-top: 8px;
  color: ${p => p.theme.color.muted};
  font-size: 14px;
  line-height: 22px;
`;

export const HomePrimaryButton = styled(Pressable)`
  min-height: 50px;
  margin-top: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background-color: ${p => p.theme.color.accent};
`;

export const HomePrimaryButtonText = styled(AppText)`
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
`;

export const HomeQuickGroup = styled(View)`
  overflow: hidden;
  margin-top: 14px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  border-radius: ${p => p.theme.radius.card}px;
  background-color: ${p => p.theme.color.card};
`;

export const HomeSectionCaption = styled(AppText)`
  padding-horizontal: 16px;
  padding-bottom: 4px;
  padding-top: 14px;
  color: ${p => p.theme.color.muted};
  font-size: 12px;
  line-height: 18px;
`;

export const HomeQuickRow = styled(Pressable)`
  min-height: 58px;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  border-top-width: 1px;
  border-top-color: #e7efea;
  padding-horizontal: 16px;
`;

export const HomeQuickIcon = styled(AppText)`
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: 13px;
  background-color: ${p => p.theme.color.accentSoft};
  color: ${p => p.theme.color.accent};
  font-size: 14px;
  font-weight: 800;
  line-height: 32px;
  text-align: center;
`;

export const HomeQuickText = styled(View)`
  flex: 1;
`;

export const HomeQuickTitle = styled(AppText)`
  color: ${p => p.theme.color.foreground};
  font-size: 15px;
  font-weight: 800;
  line-height: 20px;
`;

export const HomeQuickMeta = styled(AppText)`
  margin-top: 4px;
  color: ${p => p.theme.color.muted};
  font-size: 12px;
  line-height: 17px;
`;

export const HomeChevron = styled(AppText)`
  color: #9aaca6;
  font-size: 22px;
  line-height: 24px;
`;
