/**
 * 首页纯视图：由路由注入 `summary` 与文案，避免直接依赖 zustand/i18n，
 * 便于测试与截图时保持确定性。
 */
import React from 'react';

import { AppCard, AppScreen } from '../../components';
import { type HomeSummary } from '../../constants';
import { useI18n } from '../../i18n';
import type {
  ILocalReadinessSummary,
  LocalReadinessNextAction,
  LocalReadinessSectionStatus,
  LocalReadinessStatus
} from '../../store/trust';
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
  ReadinessActionButton,
  ReadinessActionLabel,
  ReadinessActionStack,
  ReadinessCard,
  ReadinessCountText,
  ReadinessNoticeText,
  ReadinessSectionGrid,
  ReadinessSectionLabel,
  ReadinessSectionRow,
  ReadinessSectionState,
  ReadinessStatusText,
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

interface IHomeReadinessCopy {
  heading: string;
  statusLabels: Record<LocalReadinessStatus, string>;
  localOnlyNotice: string;
  sectionLabels: {
    items: string;
    helpers: string;
    assignments: string;
    trigger: string;
  };
  sectionStatusLabels: Record<LocalReadinessSectionStatus, string>;
  countLabels: {
    items: string;
    helpers: string;
    coverage: string;
  };
  actionLabels: Record<LocalReadinessNextAction, string>;
}

/**
 * `HomeScreen` 的 props。
 */
export interface IHomeScreenProps {
  /** 驱动连续天数与计数的摘要数据。 */
  summary: HomeSummary;
  /** 可选本地化文案；省略时使用内置默认。 */
  copy?: HomeScreenCopy;
  readiness?: ILocalReadinessSummary;
  readinessCopy?: IHomeReadinessCopy;
  onReadinessAction?: (action: LocalReadinessNextAction) => void;
}

/**
 * 首页 Tab 仪表盘界面。
 *
 * @param props - `IHomeScreenProps`
 * @returns 已 memo 的首页元素。
 */
export const HomeScreen = React.memo<IHomeScreenProps>(
  ({ summary, copy, readiness, readinessCopy, onReadinessAction }) => {
    const { getMessage } = useI18n();
    const sectionKeys = ['items', 'helpers', 'assignments', 'trigger'] as const;

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
        {readiness && readinessCopy ? (
          <ReadinessCard>
            <CaptionMutedText>{readinessCopy.heading}</CaptionMutedText>
            <ReadinessStatusText>
              {readinessCopy.statusLabels[readiness.status]}
            </ReadinessStatusText>
            <ReadinessSectionGrid>
              {sectionKeys.map(sectionKey => (
                <ReadinessSectionRow key={sectionKey}>
                  <ReadinessSectionLabel>
                    {readinessCopy.sectionLabels[sectionKey]}
                  </ReadinessSectionLabel>
                  <ReadinessSectionState>
                    {
                      readinessCopy.sectionStatusLabels[
                        readiness.sections[sectionKey].status
                      ]
                    }
                  </ReadinessSectionState>
                </ReadinessSectionRow>
              ))}
            </ReadinessSectionGrid>
            <ReadinessCountText>
              {readinessCopy.countLabels.items}
            </ReadinessCountText>
            <ReadinessCountText>
              {readinessCopy.countLabels.helpers}
            </ReadinessCountText>
            <ReadinessCountText>
              {readinessCopy.countLabels.coverage}
            </ReadinessCountText>
            <ReadinessNoticeText>
              {readinessCopy.localOnlyNotice}
            </ReadinessNoticeText>
            <ReadinessActionStack>
              {readiness.nextActions.map(action => (
                <ReadinessActionButton
                  accessibilityRole="button"
                  key={action.id}
                  onPress={() => onReadinessAction?.(action.id)}
                >
                  <ReadinessActionLabel>
                    {readinessCopy.actionLabels[action.id]}
                  </ReadinessActionLabel>
                </ReadinessActionButton>
              ))}
            </ReadinessActionStack>
          </ReadinessCard>
        ) : null}
      </AppScreen>
    );
  }
);

HomeScreen.displayName = 'HomeScreen';
