import { View } from 'react-native';

import styled from 'styled-components/native';

import { AppScreen, AppText } from '../../components';

export const ReportAppScreen = styled(AppScreen)`
  justify-content: center;
  background-color: #f7f4eb;
`;

export const ReportCard = styled(View)`
  overflow: hidden;
  border-radius: 30px;
  border-width: 1px;
  border-color: #e5e8dd;
  background-color: #f8f5ee;
  padding-horizontal: 28px;
  padding-vertical: 56px;
`;

export const ReportBlobA = styled(View)`
  position: absolute;
  left: -18px;
  top: 24px;
  height: 180px;
  width: 180px;
  border-radius: 999px;
  background-color: #eaf2ed;
`;

export const ReportBlobB = styled(View)`
  position: absolute;
  right: -30px;
  top: 44px;
  height: 160px;
  width: 160px;
  border-radius: 999px;
  background-color: #edf4ef;
`;

export const ReportBlobC = styled(View)`
  position: absolute;
  left: -10px;
  bottom: 38px;
  height: 140px;
  width: 140px;
  border-radius: 999px;
  background-color: #e5efeb;
`;

export const ReportBlobD = styled(View)`
  position: absolute;
  right: -24px;
  bottom: 20px;
  height: 170px;
  width: 170px;
  border-radius: 999px;
  background-color: #eaf3ef;
`;

export const ReportBodyText = styled(AppText)`
  margin-top: 46px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  line-height: 32px;
`;
