import { memo } from 'react';

import { useI18n } from '../../i18n';

import {
  ReportAppScreen,
  ReportActionStack,
  ReportCircleButton,
  ReportCircleButtonText,
  ReportDateText,
  ReportEncouragementText,
  ReportEyebrowText,
  ReportHintText,
  ReportPanel
} from './report.styled';

/**
 * `ReportScreen` 使用的本地化文案。
 */
interface IReportScreenCopy {
  /** 顶部场景标签。 */
  firstEntryLabel: string;
  /** 鼓励文案。 */
  encouragement: string;
  /** 日期格式文案。 */
  dateText?: string;
  /** 主按钮文案。 */
  primaryButton: string;
  /** 主按钮第一行。 */
  primaryLine1: string;
  /** 主按钮第二行。 */
  primaryLine2: string;
  /** 页面底部轻提示。 */
  hint: string;
}

/**
 * `ReportScreen` 的 props。
 */
export interface IReportScreenProps {
  /** 用户完成报平安手势时调用。 */
  onSubmit: () => void;
  /** 可选本地化文案；省略时使用内置默认。 */
  copy?: IReportScreenCopy;
}

const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六'];

const formatTodayDate = () => {
  const date = new Date();

  return `${date.getMonth() + 1}月${date.getDate()}日 周${
    weekdayLabels[date.getDay()]
  }`;
};

/**
 * 每日报平安（申报）界面 UI。
 *
 * @param props - `IReportScreenProps`
 * @returns 已 memo 的申报页元素。
 */
export const ReportScreen = memo<IReportScreenProps>(({ onSubmit, copy }) => {
  const { getMessage } = useI18n();
  const resolvedCopy = {
    firstEntryLabel:
      copy?.firstEntryLabel || getMessage('dailyReport.firstEntryLabel'),
    encouragement:
      copy?.encouragement || getMessage('dailyReport.encouragement'),
    dateText: copy?.dateText || formatTodayDate(),
    primaryButton:
      copy?.primaryButton || getMessage('dailyReport.primaryAction'),
    primaryLine1: copy?.primaryLine1 || getMessage('dailyReport.primaryLine1'),
    primaryLine2: copy?.primaryLine2 || getMessage('dailyReport.primaryLine2'),
    hint: copy?.hint || getMessage('dailyReport.hint')
  };

  return (
    <ReportAppScreen>
      <ReportEyebrowText>{resolvedCopy.firstEntryLabel}</ReportEyebrowText>

      <ReportPanel>
        <ReportEncouragementText>
          {resolvedCopy.encouragement}
        </ReportEncouragementText>
        <ReportDateText>{resolvedCopy.dateText}</ReportDateText>
        <ReportCircleButton
          accessibilityLabel={resolvedCopy.primaryButton}
          accessibilityRole="button"
          onPress={onSubmit}
        >
          <ReportCircleButtonText>
            {resolvedCopy.primaryLine1}
            {'\n'}
            {resolvedCopy.primaryLine2}
          </ReportCircleButtonText>
        </ReportCircleButton>
        <ReportHintText>{resolvedCopy.hint}</ReportHintText>
      </ReportPanel>

      <ReportActionStack />
    </ReportAppScreen>
  );
});

ReportScreen.displayName = 'ReportScreen';
