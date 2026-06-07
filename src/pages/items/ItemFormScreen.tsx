/**
 * 新建事项向导外壳：由文案驱动且不依赖路由，可在弹层、堆栈或 Storybook 中独立渲染。
 */
import { memo, useEffect, useState } from 'react';

import { AppScreen } from '../../components';
import { useI18n } from '../../i18n';
import {
  CardTitleText,
  MetaMutedText,
  PrimaryOnAccentLabel,
  ScreenTitleText
} from '../../theme';

import {
  FormFieldCard,
  FormTextInput,
  HelperChoiceButton,
  HelperChoiceList,
  OfflineKindCard,
  OnlineKindCard,
  SaveButton,
  StepCurrentValue,
  SummaryTextInput,
  TypeChoiceRow,
  TypeSectionCard,
  ValidationText,
  WizardStepCard
} from './item-form.styled';

export interface IItemFormValues {
  title: string;
  kind: 'offline' | 'online';
  summary: string;
  helperIds: string[];
}

export interface IItemFormHelperChoice {
  id: string;
  displayName: string;
  relationship: string;
}

/**
 * `ItemFormScreen` 使用的本地化文案。
 */
export interface IItemFormScreenCopy {
  /** 屏幕标题。 */
  title: string;
  /** 类型卡片上方的分区标签。 */
  typeLabel: string;
  /** 标题输入标签。 */
  titleLabel: string;
  /** 标题输入占位。 */
  titlePlaceholder: string;
  /** 摘要输入标签。 */
  summaryLabel: string;
  /** 摘要输入占位。 */
  summaryPlaceholder: string;
  /** 线下类型卡片标题。 */
  offlineTitle: string;
  /** 线下类型卡片说明。 */
  offlineSummary: string;
  /** 线上类型卡片标题。 */
  onlineTitle: string;
  /** 线上类型卡片说明。 */
  onlineSummary: string;
  /** 向导步骤标签。 */
  stepLabel: string;
  /** 向导步骤值文案。 */
  stepValue: string;
  /** 保存按钮文案。 */
  saveAction: string;
  /** 标题必填错误。 */
  titleRequired: string;
}

/**
 * `ItemFormScreen` 的 props。
 */
export interface IItemFormScreenProps {
  /** 表单初始值；传入时可用于编辑模式。 */
  initialValues?: IItemFormValues;
  /** 可供关联到事项的 active 协助人。 */
  helperChoices?: IItemFormHelperChoice[];
  /** 提交已验证的表单值。 */
  onSubmit?: (values: IItemFormValues) => void;
  /** 可选本地化文案；省略时使用内置默认。 */
  copy?: IItemFormScreenCopy;
}

/**
 * 新建事项向导（首步界面）。
 *
 * @param props - `IItemFormScreenProps`
 * @returns 已 memo 的表单页元素。
 */
export const ItemFormScreen = memo<IItemFormScreenProps>(
  ({ initialValues, helperChoices = [], onSubmit, copy } = {}) => {
    const { getMessage } = useI18n();
    const [title, setTitle] = useState(initialValues?.title ?? '');
    const [kind, setKind] = useState<IItemFormValues['kind']>(
      initialValues?.kind ?? 'offline'
    );
    const [summary, setSummary] = useState(initialValues?.summary ?? '');
    const [helperIds, setHelperIds] = useState(initialValues?.helperIds ?? []);
    const [titleErrorVisible, setTitleErrorVisible] = useState(false);

    useEffect(() => {
      setTitle(initialValues?.title ?? '');
      setKind(initialValues?.kind ?? 'offline');
      setSummary(initialValues?.summary ?? '');
      setHelperIds(initialValues?.helperIds ?? []);
      setTitleErrorVisible(false);
    }, [
      initialValues?.helperIds,
      initialValues?.kind,
      initialValues?.summary,
      initialValues?.title
    ]);

    const toggleHelper = (helperId: string) => {
      setHelperIds(currentIds =>
        currentIds.includes(helperId)
          ? currentIds.filter(currentId => currentId !== helperId)
          : [...currentIds, helperId]
      );
    };

    const handleSubmit = () => {
      const normalizedTitle = title.trim();

      if (!normalizedTitle) {
        setTitleErrorVisible(true);
        return;
      }

      setTitleErrorVisible(false);
      onSubmit?.({
        title: normalizedTitle,
        kind,
        summary: summary.trim(),
        helperIds
      });
    };

    return (
      <AppScreen>
        <ScreenTitleText>
          {copy?.title || getMessage('itemForm.title')}
        </ScreenTitleText>
        <FormFieldCard>
          <MetaMutedText>
            {copy?.titleLabel || getMessage('itemForm.titleLabel')}
          </MetaMutedText>
          <FormTextInput
            placeholder={
              copy?.titlePlaceholder || getMessage('itemForm.titlePlaceholder')
            }
            value={title}
            onChangeText={setTitle}
          />
          {titleErrorVisible ? (
            <ValidationText>
              {copy?.titleRequired || getMessage('itemForm.titleRequired')}
            </ValidationText>
          ) : null}
        </FormFieldCard>
        <TypeSectionCard>
          <MetaMutedText>
            {copy?.typeLabel || getMessage('itemForm.typeLabel')}
          </MetaMutedText>
          <TypeChoiceRow>
            <OfflineKindCard
              accessibilityRole="button"
              onPress={() => setKind('offline')}
            >
              <CardTitleText>
                {copy?.offlineTitle || getMessage('itemForm.offlineTitle')}
              </CardTitleText>
              <MetaMutedText marginTop={6}>
                {copy?.offlineSummary || getMessage('itemForm.offlineSummary')}
              </MetaMutedText>
            </OfflineKindCard>
            <OnlineKindCard
              accessibilityRole="button"
              onPress={() => setKind('online')}
            >
              <CardTitleText>
                {copy?.onlineTitle || getMessage('itemForm.onlineTitle')}
              </CardTitleText>
              <MetaMutedText marginTop={6}>
                {copy?.onlineSummary || getMessage('itemForm.onlineSummary')}
              </MetaMutedText>
            </OnlineKindCard>
          </TypeChoiceRow>
        </TypeSectionCard>
        <FormFieldCard>
          <MetaMutedText>
            {copy?.summaryLabel || getMessage('itemForm.summaryLabel')}
          </MetaMutedText>
          <SummaryTextInput
            multiline
            placeholder={
              copy?.summaryPlaceholder ||
              getMessage('itemForm.summaryPlaceholder')
            }
            value={summary}
            onChangeText={setSummary}
          />
        </FormFieldCard>
        <WizardStepCard>
          <MetaMutedText>
            {copy?.stepLabel || getMessage('itemForm.stepLabel')}
          </MetaMutedText>
          <StepCurrentValue>
            {copy?.stepValue || getMessage('itemForm.stepValue')}
          </StepCurrentValue>
          {helperChoices.length > 0 ? (
            <HelperChoiceList>
              {helperChoices.map(helper => (
                <HelperChoiceButton
                  accessibilityRole="button"
                  key={helper.id}
                  selected={helperIds.includes(helper.id)}
                  onPress={() => toggleHelper(helper.id)}
                >
                  <CardTitleText>{helper.displayName}</CardTitleText>
                  <MetaMutedText marginTop={4}>
                    {helper.relationship}
                  </MetaMutedText>
                </HelperChoiceButton>
              ))}
            </HelperChoiceList>
          ) : null}
        </WizardStepCard>
        <SaveButton
          accessibilityRole="button"
          accessibilityLabel={
            copy?.saveAction || getMessage('itemForm.saveAction')
          }
          onPress={handleSubmit}
        >
          <PrimaryOnAccentLabel>
            {copy?.saveAction || getMessage('itemForm.saveAction')}
          </PrimaryOnAccentLabel>
        </SaveButton>
      </AppScreen>
    );
  }
);

ItemFormScreen.displayName = 'ItemFormScreen';
