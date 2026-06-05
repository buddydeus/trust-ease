/**
 * 本地协助人列表：由 route 注入本地数据和动作回调，页面不直接读取存储。
 */
import React from 'react';

import {
  AppCard,
  AppScreen,
  AppText,
  FloatingAddButton
} from '../../components';
import { useI18n } from '../../i18n';
import { CardTitleText, ScreenTitleText } from '../../theme';

import {
  HelperActionButton,
  HelperActionRow,
  HelperCardTextCol,
  HelperNoticeText,
  HelpersListStack,
  HelpersTitleRow
} from './helpers.styled';

export interface IHelpersScreenHelper {
  id: string;
  displayName: string;
  relationship: string;
  contactMethod: string;
  notes: string;
}

export interface IHelpersScreenCopy {
  title: string;
  createLabel: string;
  emptyTitle: string;
  emptyBody: string;
  localOnlyNotice: string;
  editAction: string;
  archiveAction: string;
}

export interface IHelpersScreenProps {
  helpers?: IHelpersScreenHelper[];
  onCreateHelper?: () => void;
  onEditHelper?: (helperId: string) => void;
  onArchiveHelper?: (helperId: string) => void;
  copy?: IHelpersScreenCopy;
}

export const HelpersScreen = React.memo<IHelpersScreenProps>(
  ({
    helpers = [],
    onCreateHelper,
    onEditHelper,
    onArchiveHelper,
    copy
  } = {}) => {
    const { getMessage } = useI18n();

    return (
      <AppScreen>
        <HelpersTitleRow>
          <ScreenTitleText>
            {copy?.title || getMessage('helpers.title')}
          </ScreenTitleText>
          <FloatingAddButton
            label={copy?.createLabel || getMessage('helpers.createLabel')}
            onPress={onCreateHelper}
          />
        </HelpersTitleRow>
        <HelpersListStack>
          {helpers.length === 0 ? (
            <AppCard>
              <CardTitleText>
                {copy?.emptyTitle || getMessage('helpers.emptyTitle')}
              </CardTitleText>
              <AppText className="mt-[9px] text-caption text-muted">
                {copy?.emptyBody || getMessage('helpers.emptyBody')}
              </AppText>
              <HelperNoticeText>
                {copy?.localOnlyNotice ||
                  getMessage('helpers.localOnlyNotice')}
              </HelperNoticeText>
            </AppCard>
          ) : (
            helpers.map(helper => (
              <AppCard key={helper.id}>
                <HelperCardTextCol>
                  <CardTitleText>{helper.displayName}</CardTitleText>
                  <AppText className="mt-[9px] text-caption text-muted">
                    {helper.relationship}
                  </AppText>
                  <AppText className="mt-[7px] text-caption text-muted">
                    {helper.contactMethod}
                  </AppText>
                  {helper.notes ? (
                    <AppText className="mt-[7px] text-caption text-muted">
                      {helper.notes}
                    </AppText>
                  ) : null}
                  <HelperNoticeText>
                    {copy?.localOnlyNotice ||
                      getMessage('helpers.localOnlyNotice')}
                  </HelperNoticeText>
                  <HelperActionRow>
                    <HelperActionButton
                      accessibilityRole="button"
                      onPress={() => onEditHelper?.(helper.id)}
                    >
                      <AppText className="text-caption text-accent">
                        {copy?.editAction || getMessage('helpers.editAction')}
                      </AppText>
                    </HelperActionButton>
                    <HelperActionButton
                      accessibilityRole="button"
                      onPress={() => onArchiveHelper?.(helper.id)}
                    >
                      <AppText className="text-caption text-muted">
                        {copy?.archiveAction ||
                          getMessage('helpers.archiveAction')}
                      </AppText>
                    </HelperActionButton>
                  </HelperActionRow>
                </HelperCardTextCol>
              </AppCard>
            ))
          )}
        </HelpersListStack>
      </AppScreen>
    );
  }
);

HelpersScreen.displayName = 'HelpersScreen';
