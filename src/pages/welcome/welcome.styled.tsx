import { Pressable, Text, View } from 'react-native';

import styled from 'styled-components/native';

import { AppScreen } from '../../components';

export const BrandHero = styled(Text)`
  font-size: 32px;
  font-weight: 700;
  color: ${p => p.theme.color.accent};
`;

export const EyebrowMuted = styled(Text)`
  margin-top: 8px;
  font-size: 14px;
  color: ${p => p.theme.color.muted};
`;

export const BookletBack = styled(View)`
  position: absolute;
  top: 20px;
  left: 54px;
  width: 176px;
  height: 228px;
  border-radius: ${p => p.theme.radius.screen}px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  background-color: ${p => p.theme.color.page};
  transform: rotate(-5deg);
`;

export const BookletMid = styled(View)`
  position: absolute;
  top: 8px;
  left: 76px;
  width: 184px;
  height: 238px;
  border-radius: ${p => p.theme.radius.screen}px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  background-color: ${p => p.theme.color.offlineRibbon};
  transform: rotate(3deg);
`;

export const BookletFront = styled(View)`
  width: 192px;
  height: 248px;
  border-radius: 30px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  background-color: ${p => p.theme.color.card};
  padding-horizontal: 24px;
  padding-top: 34px;
`;

export const RibbonChip = styled(View)`
  align-self: flex-end;
  min-width: 72px;
  border-radius: ${p => p.theme.radius.pill}px;
  background-color: ${p => p.theme.color.onlineRibbon};
  padding-horizontal: 14px;
  padding-vertical: 7px;
`;

export const RibbonChipTitle = styled(Text)`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${p => p.theme.color.foreground};
`;

export const ListUnderline = styled(View)<{ $width: number }>`
  margin-top: 8px;
  height: 2px;
  width: ${p => p.$width}px;
  border-radius: 2px;
  background-color: ${p => p.theme.color.border};
`;

export const WelcomeTitle = styled(Text)`
  font-size: 28px;
  font-weight: 700;
  line-height: 40px;
`;

export const WelcomeBody = styled(Text)`
  margin-top: 18px;
  font-size: 15px;
  line-height: 24px;
  color: ${p => p.theme.color.muted};
`;

export const WelcomePrimaryCta = styled(Pressable)`
  border-radius: 22px;
  background-color: ${p => p.theme.color.accent};
  padding-vertical: 18px;
`;

export const WelcomeCtaLabel = styled(Text)`
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
`;

export const WelcomeAppScreen = styled(AppScreen)`
  justify-content: space-between;
  padding-bottom: 28px;
`;

export const BookletStack = styled(View)`
  align-items: center;
  margin-top: 20px;
`;

export const BookletRow = styled(View)<{ $first: boolean }>`
  margin-top: ${p => (p.$first ? 28 : 22)}px;
`;

export const WelcomeFooterBlock = styled(View)`
  margin-top: 24px;
`;
