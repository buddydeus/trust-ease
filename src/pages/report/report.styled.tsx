import { Pressable, View } from 'react-native';

import styled from 'styled-components/native';

import { AppScreen, AppText } from '../../components';

export const ReportAppScreen = styled(AppScreen)`
  justify-content: space-between;
  background-color: ${p => p.theme.color.page};
`;

export const ReportTopRow = styled(View)`
  min-height: 44px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

export const ReportBrandText = styled(AppText)`
  color: ${p => p.theme.color.foreground};
  font-size: 22px;
  font-weight: 700;
`;

export const ReportStatusChip = styled(View)`
  min-height: 32px;
  flex-direction: row;
  align-items: center;
  gap: 7px;
  border-radius: ${p => p.theme.radius.pill}px;
  background-color: ${p => p.theme.color.accentSoft};
  padding-horizontal: 12px;
`;

export const ReportDot = styled(View)`
  height: 7px;
  width: 7px;
  border-radius: ${p => p.theme.radius.pill}px;
  background-color: ${p => p.theme.color.accent};
`;

export const ReportStatusText = styled(AppText)`
  color: ${p => p.theme.color.accent};
  font-size: 12px;
  font-weight: 700;
`;

export const ReportPanel = styled(View)`
  margin-top: 82px;
`;

export const ReportEyebrowText = styled(AppText)`
  color: ${p => p.theme.color.muted};
  font-size: 13px;
  line-height: 20px;
`;

export const ReportTitleText = styled(AppText)`
  margin-top: 9px;
  color: ${p => p.theme.color.foreground};
  font-size: 34px;
  font-weight: 700;
  line-height: 40px;
`;

export const ReportDescriptionText = styled(AppText)`
  margin-top: 16px;
  color: #2f4541;
  font-size: 16px;
  line-height: 26px;
`;

export const ReportStrip = styled(View)`
  margin-top: 38px;
  gap: 12px;
  border-radius: ${p => p.theme.radius.card}px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  background-color: ${p => p.theme.color.accentSoft};
  padding: 16px;
`;

export const ReportMetaRow = styled(View)`
  min-height: 28px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const ReportMetaLabel = styled(AppText)`
  color: ${p => p.theme.color.muted};
  font-size: 13px;
  line-height: 20px;
`;

export const ReportMetaValue = styled(AppText)`
  color: ${p => p.theme.color.foreground};
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  text-align: right;
`;

export const ReportActionStack = styled(View)`
  gap: 12px;
  padding-bottom: 4px;
`;

export const ReportPrimaryButton = styled(Pressable)`
  min-height: 54px;
  align-items: center;
  justify-content: center;
  border-radius: ${p => p.theme.radius.card}px;
  background-color: ${p => p.theme.color.accent};
`;

export const ReportPrimaryLabel = styled(AppText)`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
`;

export const ReportSecondaryButton = styled(Pressable)`
  min-height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: ${p => p.theme.radius.card}px;
  border-width: 1px;
  border-color: ${p => p.theme.color.border};
  background-color: ${p => p.theme.color.card};
`;

export const ReportSecondaryLabel = styled(AppText)`
  color: ${p => p.theme.color.accent};
  font-size: 15px;
  font-weight: 700;
`;

export const ReportFooterNote = styled(AppText)`
  margin-top: 4px;
  color: ${p => p.theme.color.muted};
  font-size: 12px;
  line-height: 18px;
  text-align: center;
`;
