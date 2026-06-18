import { Pressable, Text, View } from 'react-native';

import styled from 'styled-components/native';

import { AppScreen } from '../../components';

export const BrandHero = styled(Text)`
  color: ${p => p.theme.color.foreground};
  font-size: 26px;
  font-weight: 800;
  line-height: 32px;
`;

export const EyebrowMuted = styled(Text)`
  margin-top: 8px;
  color: ${p => p.theme.color.muted};
  font-size: 14px;
  line-height: 22px;
`;

export const LogoMark = styled(Text)`
  width: 56px;
  height: 56px;
  overflow: hidden;
  border-radius: 18px;
  background-color: ${p => p.theme.color.accentSoft};
  color: ${p => p.theme.color.accent};
  font-size: 24px;
  font-weight: 800;
  line-height: 56px;
  text-align: center;
`;

export const WelcomeTitle = styled(Text)`
  margin-top: 22px;
  color: ${p => p.theme.color.foreground};
  font-size: 32px;
  font-weight: 800;
  line-height: 40px;
`;

export const WelcomeBody = styled(Text)`
  margin-top: 14px;
  color: ${p => p.theme.color.muted};
  font-size: 16px;
  line-height: 26px;
`;

export const AssuranceGroup = styled(View)`
  overflow: hidden;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  border-radius: ${p => p.theme.radius.card}px;
  background-color: ${p => p.theme.color.card};
`;

export const AssuranceRow = styled(View)`
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #e7efea;
  padding-horizontal: 16px;
`;

export const AssuranceText = styled(Text)`
  flex: 1;
  color: ${p => p.theme.color.foreground};
  font-size: 15px;
  font-weight: 700;
`;

export const AssuranceMetaText = styled(Text)`
  color: ${p => p.theme.color.muted};
  font-size: 12px;
  font-weight: 600;
`;

export const WelcomePrimaryCta = styled(Pressable)`
  min-height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background-color: ${p => p.theme.color.accent};
`;

export const WelcomeCtaLabel = styled(Text)`
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  text-align: center;
`;

export const WelcomeAppScreen = styled(AppScreen)`
  justify-content: space-between;
  padding-bottom: 24px;
`;

export const WelcomeFooterBlock = styled(View)`
  margin-top: 42px;
`;
