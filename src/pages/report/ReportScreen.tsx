import { memo } from 'react';

import { useI18n } from '../../i18n';

import {
  ReportAppScreen,
  ReportActionStack,
  ReportBrandText,
  ReportDescriptionText,
  ReportDot,
  ReportEyebrowText,
  ReportFooterNote,
  ReportMetaLabel,
  ReportMetaRow,
  ReportMetaValue,
  ReportPanel,
  ReportPrimaryButton,
  ReportPrimaryLabel,
  ReportSecondaryButton,
  ReportSecondaryLabel,
  ReportStatusChip,
  ReportStatusText,
  ReportStrip,
  ReportTitleText,
  ReportTopRow
} from './report.styled';

/**
 * `ReportScreen` 使用的本地化文案。
 */
interface IReportScreenCopy {
  /** App 品牌名称。 */
  brand: string;
  /** 顶部场景标签。 */
  firstEntryLabel: string;
  /** 待申报状态标签。 */
  statusPending: string;
  /** 已申报状态标签。 */
  statusCompleted: string;
  /** 页面主标题。 */
  title: string;
  /** 页面说明文案。 */
  description: string;
  /** 最近申报字段标签。 */
  lastReportLabel: string;
  /** 当前等待确认字段值。 */
  waitingLabel: string;
  /** 从未申报时的兜底文案。 */
  noLastReport: string;
  /** 主按钮文案。 */
  primaryButton: string;
  /** 次按钮文案。 */
  secondaryButton: string;
  /** 页面底部边界提示。 */
  footerNote: string;
}

/**
 * `ReportScreen` 的 props。
 */
export interface IReportScreenProps {
  /** 用户完成报平安手势时调用。 */
  onSubmit: () => void;
  /** 用户暂时进入预案时调用。 */
  onSecondaryAction?: () => void;
  /** 最近一次正式申报时间。 */
  lastReportedAt?: string | null;
  /** 可选本地化文案；省略时使用内置默认。 */
  copy?: IReportScreenCopy;
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

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${month}/${day} ${hour}:${minute}`;
};

/**
 * 每日报平安（申报）界面 UI。
 *
 * @param props - `IReportScreenProps`
 * @returns 已 memo 的申报页元素。
 */
export const ReportScreen = memo<IReportScreenProps>(
  ({ lastReportedAt, onSecondaryAction, onSubmit, copy }) => {
    const { getMessage } = useI18n();
    const resolvedCopy = {
      brand: copy?.brand || getMessage('welcome.brand'),
      firstEntryLabel:
        copy?.firstEntryLabel || getMessage('dailyReport.firstEntryLabel'),
      statusPending:
        copy?.statusPending || getMessage('dailyReport.status.pending'),
      statusCompleted:
        copy?.statusCompleted || getMessage('dailyReport.status.completed'),
      title: copy?.title || getMessage('dailyReport.title'),
      description: copy?.description || getMessage('dailyReport.description'),
      lastReportLabel:
        copy?.lastReportLabel || getMessage('dailyReport.lastReport'),
      waitingLabel: copy?.waitingLabel || getMessage('dailyReport.waiting'),
      noLastReport:
        copy?.noLastReport || getMessage('dailyReport.noLastReport'),
      primaryButton:
        copy?.primaryButton || getMessage('dailyReport.primaryAction'),
      secondaryButton:
        copy?.secondaryButton || getMessage('dailyReport.secondaryAction'),
      footerNote: copy?.footerNote || getMessage('dailyReport.footerNote')
    };

    return (
      <ReportAppScreen>
        <ReportTopRow>
          <ReportBrandText>{resolvedCopy.brand}</ReportBrandText>
          <ReportStatusChip>
            <ReportDot />
            <ReportStatusText>{resolvedCopy.statusPending}</ReportStatusText>
          </ReportStatusChip>
        </ReportTopRow>

        <ReportPanel>
          <ReportEyebrowText>{resolvedCopy.firstEntryLabel}</ReportEyebrowText>
          <ReportTitleText>{resolvedCopy.title}</ReportTitleText>
          <ReportDescriptionText>
            {resolvedCopy.description}
          </ReportDescriptionText>
          <ReportStrip>
            <ReportMetaRow>
              <ReportMetaLabel>{resolvedCopy.lastReportLabel}</ReportMetaLabel>
              <ReportMetaValue>
                {formatReportTime(lastReportedAt, resolvedCopy.noLastReport)}
              </ReportMetaValue>
            </ReportMetaRow>
            <ReportMetaRow>
              <ReportMetaLabel>{resolvedCopy.statusPending}</ReportMetaLabel>
              <ReportMetaValue>{resolvedCopy.waitingLabel}</ReportMetaValue>
            </ReportMetaRow>
          </ReportStrip>
        </ReportPanel>

        <ReportActionStack>
          <ReportPrimaryButton accessibilityRole="button" onPress={onSubmit}>
            <ReportPrimaryLabel>
              {resolvedCopy.primaryButton}
            </ReportPrimaryLabel>
          </ReportPrimaryButton>
          <ReportSecondaryButton
            accessibilityRole="button"
            onPress={onSecondaryAction}
          >
            <ReportSecondaryLabel>
              {resolvedCopy.secondaryButton}
            </ReportSecondaryLabel>
          </ReportSecondaryButton>
          <ReportFooterNote>{resolvedCopy.footerNote}</ReportFooterNote>
        </ReportActionStack>
      </ReportAppScreen>
    );
  }
);

ReportScreen.displayName = 'ReportScreen';
