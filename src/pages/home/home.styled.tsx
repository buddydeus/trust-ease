import { View } from 'react-native';

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
