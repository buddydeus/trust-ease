/**
 * 每日报平安界面刻意保持「哑组件」：副作用由路由承担，本组件专注情绪文案与点击区域。
 */
import React from 'react';

import { useI18n } from '../../i18n';
import {
  MutedCenterLead,
  PrimaryOnAccentLabel,
  PrimaryRoundButton
} from '../../theme';

import {
  ReportAppScreen,
  ReportBlobA,
  ReportBlobB,
  ReportBlobC,
  ReportBlobD,
  ReportBodyText,
  ReportCard
} from './report.styled';

/**
 * `ReportScreen` 使用的本地化文案。
 */
interface IReportScreenCopy {
  /** 卡片内连续申报标题行。 */
  streakTitle: string;
  /** 支撑报平安动作的正文。 */
  body: string;
  /** 主按钮文案。 */
  primaryButton: string;
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

/**
 * 每日报平安（申报）界面 UI。
 *
 * @param props - `IReportScreenProps`
 * @returns 已 memo 的申报页元素。
 */
export const ReportScreen = React.memo<IReportScreenProps>(
  ({ onSubmit, copy }) => {
    const { getMessage } = useI18n();

    return (
      <ReportAppScreen>
        <ReportCard>
          <ReportBlobA pointerEvents="none" />
          <ReportBlobB pointerEvents="none" />
          <ReportBlobC pointerEvents="none" />
          <ReportBlobD pointerEvents="none" />

          <MutedCenterLead>
            {copy?.streakTitle || getMessage('report.streakTitle')}
          </MutedCenterLead>
          <ReportBodyText>
            {copy?.body || getMessage('report.body')}
          </ReportBodyText>
          <PrimaryRoundButton accessibilityRole="button" onPress={onSubmit}>
            <PrimaryOnAccentLabel>
              {copy?.primaryButton || getMessage('report.primaryButton')}
            </PrimaryOnAccentLabel>
          </PrimaryRoundButton>
        </ReportCard>
      </ReportAppScreen>
    );
  }
);

ReportScreen.displayName = 'ReportScreen';
