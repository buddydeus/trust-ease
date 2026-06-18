/**
 * 首页纯视图：由路由注入 `summary` 与文案，避免直接依赖 zustand/i18n，
 * 便于测试与截图时保持确定性。
 */
import { memo } from 'react';

import { type HomeSummary } from '../../constants';
import { useI18n } from '../../i18n';
import type {
  ILocalReadinessSummary,
  LocalReadinessNextAction,
  LocalReadinessSectionStatus,
  LocalReadinessStatus
} from '../../store/trust';

import {
  HomeAppScreen,
  HomeHeaderBody,
  HomeHeaderKicker,
  HomeHeaderTitle,
  HomeNextBody,
  HomeNextCard,
  HomeNextLabel,
  HomeNextTitle,
  HomePrimaryButton,
  HomePrimaryButtonText,
  HomeQuickGroup,
  HomeQuickIcon,
  HomeQuickMeta,
  HomeQuickRow,
  HomeQuickText,
  HomeQuickTitle,
  HomeSectionCaption,
  HomeStatusCard,
  HomeStatusCta,
  HomeStatusCtaText,
  HomeStatusLabel,
  HomeDailyMetaText,
  HomeDailyStatusText,
  HomeChevron
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
  /** 查看今日申报按钮。 */
  dailyStatusViewAction: string;
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
        copy?.dailyStatusNoRecord || getMessage('home.dailyStatus.noRecord'),
      dailyStatusViewAction:
        copy?.dailyStatusViewAction || getMessage('home.dailyStatus.viewAction')
    };
    const dailyStatusText = summary.isReportedToday
      ? resolvedCopy.dailyStatusCompleted
      : resolvedCopy.dailyStatusPending;
    const firstAction = readiness?.nextActions[0]?.id;
    const firstActionLabel = firstAction
      ? readinessCopy?.actionLabels[firstAction]
      : void 0;
    const readinessStatus =
      readiness && readinessCopy
        ? readinessCopy.statusLabels[readiness.status]
        : resolvedCopy.heroTitle;
    const itemCount =
      readiness?.counts.activeItemCount ?? summary.offlineItemCount;
    const helperCount = readiness?.counts.activeHelperCount ?? 0;
    const triggerStatus =
      readiness && readinessCopy
        ? readinessCopy.sectionStatusLabels[readiness.sections.trigger.status]
        : resolvedCopy.dailyStatusCompleted;
    const quickItemTitle =
      readiness && readinessCopy
        ? readinessCopy.sectionLabels.items
        : resolvedCopy.offlineLabel;
    const quickHelperTitle =
      readiness && readinessCopy
        ? readinessCopy.sectionLabels.helpers
        : resolvedCopy.onlineLabel;
    const quickTriggerTitle =
      readiness && readinessCopy
        ? readinessCopy.sectionLabels.trigger
        : getMessage('home.readiness.section.trigger');
    const quickItemMeta =
      readiness && readinessCopy
        ? readinessCopy.countLabels.items
        : getMessage('home.quick.itemsRecorded', {
            fallback: '{count} items recorded'
          }).replace('{count}', String(itemCount));
    const quickHelperMeta =
      readiness && readinessCopy
        ? readinessCopy.countLabels.helpers
        : helperCount > 0
          ? getMessage('home.quick.helpersAdded', {
              fallback: '{count} helpers added'
            }).replace('{count}', String(helperCount))
          : getMessage('home.quick.helpersMissing', {
              fallback: 'Not completed yet'
            });

    return (
      <HomeAppScreen>
        <HomeHeaderKicker>{resolvedCopy.statusLabel}</HomeHeaderKicker>
        <HomeHeaderTitle>{dailyStatusText}</HomeHeaderTitle>
        <HomeHeaderBody>{resolvedCopy.heroBody}</HomeHeaderBody>

        <HomeStatusCard>
          <HomeStatusLabel>
            {resolvedCopy.dailyStatusLastReport}
          </HomeStatusLabel>
          <HomeDailyStatusText>{dailyStatusText}</HomeDailyStatusText>
          <HomeDailyMetaText>
            {formatReportTime(
              summary.lastReportedAt,
              resolvedCopy.dailyStatusNoRecord
            )}
          </HomeDailyMetaText>
          <HomeStatusCta accessibilityRole="button">
            <HomeStatusCtaText>
              {resolvedCopy.dailyStatusViewAction}
            </HomeStatusCtaText>
          </HomeStatusCta>
        </HomeStatusCard>

        {readiness && readinessCopy ? (
          <HomeNextCard>
            <HomeNextLabel>{readinessCopy.heading}</HomeNextLabel>
            <HomeNextTitle>{readinessStatus}</HomeNextTitle>
            <HomeNextBody>{readinessCopy.localOnlyNotice}</HomeNextBody>
            {firstAction && firstActionLabel ? (
              <HomePrimaryButton
                accessibilityRole="button"
                onPress={() => onReadinessAction?.(firstAction)}
              >
                <HomePrimaryButtonText>
                  {firstActionLabel}
                </HomePrimaryButtonText>
              </HomePrimaryButton>
            ) : null}
          </HomeNextCard>
        ) : null}

        <HomeQuickGroup>
          <HomeSectionCaption>{resolvedCopy.streakLabel}</HomeSectionCaption>
          <HomeQuickRow
            accessibilityRole="button"
            onPress={() => onReadinessAction?.('review-item-assignments')}
          >
            <HomeQuickIcon>事</HomeQuickIcon>
            <HomeQuickText>
              <HomeQuickTitle>{quickItemTitle}</HomeQuickTitle>
              <HomeQuickMeta>{quickItemMeta}</HomeQuickMeta>
            </HomeQuickText>
            <HomeChevron>›</HomeChevron>
          </HomeQuickRow>
          <HomeQuickRow
            accessibilityRole="button"
            onPress={() => onReadinessAction?.('create-helper')}
          >
            <HomeQuickIcon>人</HomeQuickIcon>
            <HomeQuickText>
              <HomeQuickTitle>{quickHelperTitle}</HomeQuickTitle>
              <HomeQuickMeta>{quickHelperMeta}</HomeQuickMeta>
            </HomeQuickText>
            <HomeChevron>›</HomeChevron>
          </HomeQuickRow>
          <HomeQuickRow
            accessibilityRole="button"
            onPress={() => onReadinessAction?.('review-trigger-rehearsal')}
          >
            <HomeQuickIcon>态</HomeQuickIcon>
            <HomeQuickText>
              <HomeQuickTitle>{quickTriggerTitle}</HomeQuickTitle>
              <HomeQuickMeta>{triggerStatus}</HomeQuickMeta>
            </HomeQuickText>
            <HomeChevron>›</HomeChevron>
          </HomeQuickRow>
        </HomeQuickGroup>
      </HomeAppScreen>
    );
  }
);

HomeScreen.displayName = 'HomeScreen';
