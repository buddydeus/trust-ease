import { Pressable, View } from 'react-native';

import styled from 'styled-components/native';

import { AppScreen, AppText } from '../../components';

export const ReportAppScreen = styled(AppScreen)`
  background-color: ${p => p.theme.color.page};
`;

export const ReportEyebrowText = styled(AppText)`
  color: ${p => p.theme.color.muted};
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
`;

export const ReportPanel = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: 54px;
`;

export const ReportEncouragementText = styled(AppText)`
  color: ${p => p.theme.color.foreground};
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  text-align: center;
`;

export const ReportDateText = styled(AppText)`
  margin-top: 28px;
  color: ${p => p.theme.color.muted};
  font-size: 19px;
  font-weight: 700;
  line-height: 26px;
  text-align: center;
`;

export const ReportCircleButton = styled(Pressable)`
  margin-top: 34px;
  width: 218px;
  height: 218px;
  align-items: center;
  justify-content: center;
  border-radius: 109px;
  background-color: ${p => p.theme.color.accent};
  shadow-color: ${p => p.theme.color.accent};
  shadow-offset: 0 18px;
  shadow-opacity: 0.18;
  shadow-radius: 22px;
  elevation: 4;
`;

export const ReportCircleButtonText = styled(AppText)`
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
  line-height: 38px;
  text-align: center;
`;

export const ReportHintText = styled(AppText)`
  margin-top: 28px;
  color: ${p => p.theme.color.muted};
  font-size: 14px;
  line-height: 22px;
  text-align: center;
`;

export const ReportActionStack = styled(View)`
  height: 1px;
`;
