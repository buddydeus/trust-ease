import { type LocaleType } from '../../i18n';
import {
  type SkinCompatibility,
  type SkinInitStatus,
  type SkinPackageState
} from '../../skin';
import type { ILocalTrustBackupPreview } from '../../store/trust';

/**
 * 选择器中一行可选的内置皮肤数据。
 */
export interface ISkinOption {
  /** 皮肤清单 id。 */
  skinId: string;
  /** 清单中的展示名。 */
  displayName: string;
  /** 相对当前运行应用的兼容结论。 */
  compatibility: SkinCompatibility;
}

export interface ISkinRuntimeStatus {
  activeSkinId: string;
  skinInitStatus: SkinInitStatus;
  skinInitUsedFallback: boolean;
  skinPackageStates: Record<string, SkinPackageState>;
}

/**
 * `MyScreen` 使用的本地化文案。
 */
export interface IMyScreenCopy {
  /** 屏幕标题。 */
  title: string;
  /** 状态分区标签。 */
  statusLabel: string;
  /** 状态分区取值行。 */
  statusValue: string;
  /** 触发状态卡片标题。 */
  triggerStateTitle: string;
  /** 触发状态卡片摘要。 */
  triggerStateSummary: string;
  /** 协助人卡片标题。 */
  helpersTitle: string;
  /** 协助人卡片摘要。 */
  helpersSummary: string;
  /** 身份与安全卡片标题。 */
  identityTitle: string;
  /** 身份与安全卡片摘要。 */
  identitySummary: string;
  /** 语言卡片标题。 */
  languageTitle: string;
  /** 语言卡片摘要。 */
  languageSummary: string;
  /** 风格（皮肤）卡片标题。 */
  skinTitle: string;
  /** 风格（皮肤）卡片摘要。 */
  skinSummary: string;
  /** 展开皮肤选择器的控件文案。 */
  skinPickerOpen: string;
  /** 收起皮肤选择器的控件文案。 */
  skinPickerClose: string;
  /** 「当前」皮肤前缀标签。 */
  skinCurrent: string;
  /** 某皮肤需要升级应用时的提示。 */
  skinUpgradeRequired: string;
  /** 某皮肤不可选时的提示。 */
  skinUnavailable: string;
  skinRuntimeTitle: string;
  skinRuntimeActive: string;
  skinRuntimeInitStatus: string;
  skinRuntimeFallback: string;
  skinRuntimePackageStates: string;
  skinRuntimeStatusIdle: string;
  skinRuntimeStatusInitializing: string;
  skinRuntimeStatusReady: string;
  skinRuntimeStatusFallback: string;
  skinRuntimeStatusFailed: string;
  skinPackageStateIdle: string;
  skinPackageStateChecking: string;
  skinPackageStateDownloading: string;
  skinPackageStateReady: string;
  skinPackageStateFailed: string;
  skinPackageStateIncompatible: string;
  /** 打开触发状态页的 CTA 文案。 */
  openTriggerState: string;
  /** 打开协助人管理页的 CTA 文案。 */
  openHelpers: string;
  /** 「跟随系统」语言选项。 */
  followSystem: string;
  /** 简体中文选项。 */
  simplifiedChinese: string;
  /** 繁体中文选项。 */
  traditionalChinese: string;
  /** 英语选项。 */
  english: string;
  backupTitle?: string;
  backupSummary?: string;
  backupLocalOnlyNotice?: string;
  backupSensitiveNotice?: string;
  backupExportAction?: string;
  backupImportAction?: string;
  backupPreviewTitle?: string;
  backupPreviewExportedAt?: string;
  backupPreviewItems?: string;
  backupPreviewHelpers?: string;
  backupPreviewTriggerOn?: string;
  backupPreviewTriggerOff?: string;
  backupPreviewSimulationOn?: string;
  backupPreviewSimulationOff?: string;
  backupReplaceWarning?: string;
  backupConfirmImport?: string;
  backupCancelImport?: string;
}

/**
 * `MyScreen` 的 props。
 */
export interface IMyScreenProps {
  /** 若提供则打开触发状态路由。 */
  onOpenTriggerState?: () => void;
  /** 若提供则打开本地协助人管理路由。 */
  onOpenHelpers?: () => void;
  /** 可选本地化文案；省略时使用内置默认。 */
  copy?: IMyScreenCopy;
  /** 将语言模式切为跟随系统。 */
  onUseSystemLocale?: () => void;
  /**
   * 设置手动语言。
   *
   * @param locale - 目标语言枚举值。
   */
  onSetManualLocale?: (locale: LocaleType) => void;
  /** 选择器中可用的内置皮肤列表。 */
  skinOptions?: ISkinOption[];
  /** 当前激活的皮肤 id。 */
  activeSkinId?: string;
  skinRuntimeStatus?: ISkinRuntimeStatus;
  backupPreview?: ILocalTrustBackupPreview | null;
  backupStatusMessage?: string | null;
  backupErrorMessage?: string | null;
  onExportBackup?: () => void;
  onImportBackup?: () => void;
  onConfirmBackupImport?: () => void;
  onCancelBackupImport?: () => void;
  /**
   * 按 id 激活皮肤。
   *
   * @param skinId - 目标皮肤 id。
   */
  onSetActiveSkin?: (skinId: string) => void;
}
