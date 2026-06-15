/**
 * 首页纯视图：由路由注入 `summary` 与文案，避免直接依赖 zustand/i18n，
 * 便于测试与截图时保持确定性。
 */
import { memo } from 'react';

import { AppScreen } from '../../components';
import { type HomeSummary } from '../../constants';
import { useI18n } from '../../i18n';
import type {
  ILocalReadinessSummary,
  LocalReadinessNextAction,
  LocalReadinessSectionStatus,
  LocalReadinessStatus
} from '../../store/trust';
import { CaptionMutedText, SectionHeading, StatValueAccent } from '../../theme';

import {
  HomeDailyBanner,
  HomeDailyDot,
  HomeDailyMetaText,
  HomeDailyStatusText,
  HomeIntroCard,
  HomeIntroBody,
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
  ReadinessStatusText
} from './home.styled';

/**
 * `HomeScreen` 使用的本地化文案。
 */
interface HomeScreenCopy {
  /** 主标题上方的小状态行。 */
  statusLabel: string;
  /** 主视觉大标题。 */
  heroTitle: string;
  /** 首页主标题下方说明。 */
  heroBody: string;
  /** 连续天数上方的标签。 */
  streakLabel: string;
  /** 线下列标题。 */
  offlineLabel: string;
  /** 线上列标题。 */
  onlineLabel: string;
  /** 今日未申报状态文案。 */
  dailyStatusPending: string;
  /** 今日已申报状态文案。 */
  dailyStatusCompleted: string;
  /** 最近申报标签。 */
  dailyStatusLastReport: string;
  /** 无最近申报记录时的文案。 */
  dailyStatusNoRecord: string;
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

const formatReportTime = (
  value: string | null | undefined,
  fallback: string
): string => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return fallback;
  }

  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${hour}:${minute}`;
};

/**
 * 首页 Tab 仪表盘界面。
 *
 * @param props - `IHomeScreenProps`
 * @returns 已 memo 的首页元素。
 */
export const HomeScreen = memo<IHomeScreenProps>(
  ({ summary, copy, readiness, readinessCopy, onReadinessAction }) => {
    const { getMessage } = useI18n();
    const sectionKeys = ['items', 'helpers', 'assignments', 'trigger'] as const;
    const resolvedCopy = {
      statusLabel: copy?.statusLabel || getMessage('home.statusLabel'),
      heroTitle: copy?.heroTitle || getMessage('home.heroTitle'),
      heroBody: copy?.heroBody || getMessage('home.heroBody'),
      streakLabel: copy?.streakLabel || getMessage('home.streakLabel'),
      offlineLabel: copy?.offlineLabel || getMessage('home.offlineLabel'),
      onlineLabel: copy?.onlineLabel || getMessage('home.onlineLabel'),
      dailyStatusPending:
        copy?.dailyStatusPending || getMessage('home.dailyStatus.pending'),
      dailyStatusCompleted:
        copy?.dailyStatusCompleted || getMessage('home.dailyStatus.completed'),
      dailyStatusLastReport:
        copy?.dailyStatusLastReport ||
        getMessage('home.dailyStatus.lastReport'),
      dailyStatusNoRecord:
        copy?.dailyStatusNoRecord || getMessage('home.dailyStatus.noRecord')
    };
    const dailyStatusText = summary.isReportedToday
      ? resolvedCopy.dailyStatusCompleted
      : resolvedCopy.dailyStatusPending;

    return (
      <AppScreen>
        <HomeDailyBanner>
          <HomeDailyDot reported={summary.isReportedToday} />
          <HomeDailyStatusText>{dailyStatusText}</HomeDailyStatusText>
          <HomeDailyMetaText>
            {resolvedCopy.dailyStatusLastReport}
            {' · '}
            {formatReportTime(
              summary.lastReportedAt,
              resolvedCopy.dailyStatusNoRecord
            )}
          </HomeDailyMetaText>
        </HomeDailyBanner>
        <HomeIntroCard>
          <CaptionMutedText>{resolvedCopy.statusLabel}</CaptionMutedText>
          <HeroHeadline>{resolvedCopy.heroTitle}</HeroHeadline>
          <HomeIntroBody>{resolvedCopy.heroBody}</HomeIntroBody>
        </HomeIntroCard>
        <HomeStatRow>
          <HomeStatCard>
            <SectionHeading>{resolvedCopy.offlineLabel}</SectionHeading>
            <StatValueAccent>{summary.offlineItemCount}</StatValueAccent>
          </HomeStatCard>
          <HomeStatCard>
            <SectionHeading>{resolvedCopy.onlineLabel}</SectionHeading>
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
