/**
 * 首页纯视图：由路由注入 `summary` 与文案，避免直接依赖 zustand/i18n，
 * 便于测试与截图时保持确定性。
 */
import React from 'react';

import { AppCard, AppScreen } from '../../components';
import { type HomeSummary } from '../../constants';
import { useI18n } from '../../i18n';
import {
  CaptionMutedText,
  SectionHeading,
  StatValueAccent,
  StreakHighlight
} from '../../theme';

import {
  HeroHeadline,
  HomeStatCard,
  HomeStatRow,
  StreakDayNumber
} from './home.styled';

/**
 * `HomeScreen` 使用的本地化文案。
 */
interface HomeScreenCopy {
  /** 主标题上方的小状态行。 */
  statusLabel: string;
  /** 主视觉大标题。 */
  heroTitle: string;
  /** 连续天数上方的标签。 */
  streakLabel: string;
  /** 线下列标题。 */
  offlineLabel: string;
  /** 线上列标题。 */
  onlineLabel: string;
}

/**
 * `HomeScreen` 的 props。
 */
export interface IHomeScreenProps {
  /** 驱动连续天数与计数的摘要数据。 */
  summary: HomeSummary;
  /** 可选本地化文案；省略时使用内置默认。 */
  copy?: HomeScreenCopy;
}

/**
 * 首页 Tab 仪表盘界面。
 *
 * @param props - `IHomeScreenProps`
 * @returns 已 memo 的首页元素。
 */
export const HomeScreen = React.memo<IHomeScreenProps>(({ summary, copy }) => {
  const { getMessage } = useI18n();

  return (
    <AppScreen>
      <AppCard>
        <CaptionMutedText>
          {copy?.statusLabel || getMessage('home.statusLabel')}
        </CaptionMutedText>
        <HeroHeadline>
          {copy?.heroTitle || getMessage('home.heroTitle')}
        </HeroHeadline>
        <StreakHighlight>
          <CaptionMutedText>
            {copy?.streakLabel || getMessage('home.streakLabel')}
          </CaptionMutedText>
          <StreakDayNumber>{summary.streakDays}</StreakDayNumber>
        </StreakHighlight>
      </AppCard>
      <HomeStatRow>
        <HomeStatCard>
          <SectionHeading>
            {copy?.offlineLabel || getMessage('home.offlineLabel')}
          </SectionHeading>
          <StatValueAccent>{summary.offlineItemCount}</StatValueAccent>
        </HomeStatCard>
        <HomeStatCard>
          <SectionHeading>
            {copy?.onlineLabel || getMessage('home.onlineLabel')}
          </SectionHeading>
          <StatValueAccent>{summary.onlineItemCount}</StatValueAccent>
        </HomeStatCard>
      </HomeStatRow>
    </AppScreen>
  );
});

HomeScreen.displayName = 'HomeScreen';
