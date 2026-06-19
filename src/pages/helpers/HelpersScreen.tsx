/**
 * 本地协助人列表：由 route 注入本地数据和动作回调，页面不直接读取存储。
 */
import { memo, useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';

import {
  AppCard,
  AppScreen,
  AppText,
  BackButton,
  FloatingAddButton
} from '../../components';
import { useI18n } from '../../i18n';
import { CardTitleText, ScreenTitleText } from '../../theme';

import {
  HelperCardTextCol,
  HelperGroupCountText,
  HelperGroupHeader,
  HelperGroupHeaderText,
  HelperGroupItems,
  HelperGroupStack,
  HelperNoticeText,
  HelperSwipeActionButton,
  HelperSwipeActionRail,
  HelperSwipeActionText,
  HelperSwipeCardSlot,
  HelperSwipeContent,
  HelpersListStack,
  HelpersTitleRow
} from './helpers.styled';

export interface IHelpersScreenContactMethod {
  type: string;
  value: string;
}

export interface IHelpersScreenHelper {
  id: string;
  displayName: string;
  relationship: string;
  contactMethod: string;
  contactMethods?: IHelpersScreenContactMethod[];
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
  ungroupedRelationship?: string;
  groupCountLabel?: string;
  contactMethodTypes?: Record<string, string>;
}

export interface IHelpersScreenProps {
  helpers?: IHelpersScreenHelper[];
  onCreateHelper?: () => void;
  onEditHelper?: (helperId: string) => void;
  onArchiveHelper?: (helperId: string) => void;
  onBack?: () => void;
  copy?: IHelpersScreenCopy;
}

export const HelpersScreen = memo<IHelpersScreenProps>(
  ({
    helpers = [],
    onCreateHelper,
    onEditHelper,
    onArchiveHelper,
    onBack,
    copy
  } = {}) => {
    const { getMessage } = useI18n();
    const { width } = useWindowDimensions();
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
      () => new Set()
    );
    const helperCardWidth = Math.max(width - 36, 280);
    const ungroupedRelationship =
      copy?.ungroupedRelationship ||
      getMessage('helpers.ungroupedRelationship');
    const contactMethodTypes = copy?.contactMethodTypes || {
      phone: getMessage('helpers.contactType.phone'),
      email: getMessage('helpers.contactType.email')
    };
    const groupedHelpers = useMemo(() => {
      const groups = new Map<string, IHelpersScreenHelper[]>();

      for (const helper of helpers) {
        const groupName = helper.relationship.trim() || ungroupedRelationship;
        groups.set(groupName, [...(groups.get(groupName) || []), helper]);
      }

      return Array.from(groups.entries()).map(
        ([relationship, groupHelpers]) => ({
          helpers: groupHelpers,
          relationship
        })
      );
    }, [helpers, ungroupedRelationship]);

    const toggleGroup = (relationship: string) => {
      setCollapsedGroups(currentGroups => {
        const nextGroups = new Set(currentGroups);

        if (nextGroups.has(relationship)) {
          nextGroups.delete(relationship);
        } else {
          nextGroups.add(relationship);
        }

        return nextGroups;
      });
    };

    const renderContactMethod = (method: IHelpersScreenContactMethod) => {
      const label = contactMethodTypes[method.type] || method.type;

      return `${label}: ${method.value}`;
    };

    const normalizeDisplayContactMethods = (
      helper: IHelpersScreenHelper
    ): IHelpersScreenContactMethod[] => {
      if (helper.contactMethods?.length) {
        return helper.contactMethods;
      }

      const separatorIndex = helper.contactMethod.indexOf(':');

      if (separatorIndex > 0) {
        return [
          {
            type: helper.contactMethod.slice(0, separatorIndex),
            value: helper.contactMethod.slice(separatorIndex + 1)
          }
        ];
      }

      return [
        {
          type: helper.contactMethod.includes('@') ? 'email' : 'phone',
          value: helper.contactMethod
        }
      ];
    };

    return (
      <AppScreen>
        {onBack ? <BackButton onPress={onBack} /> : null}
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
                {copy?.localOnlyNotice || getMessage('helpers.localOnlyNotice')}
              </HelperNoticeText>
            </AppCard>
          ) : (
            groupedHelpers.map(group => (
              <HelperGroupStack key={group.relationship}>
                <HelperGroupHeader
                  accessibilityRole="button"
                  onPress={() => toggleGroup(group.relationship)}
                >
                  <HelperGroupHeaderText>
                    {group.relationship}
                  </HelperGroupHeaderText>
                  <HelperGroupCountText>
                    {(
                      copy?.groupCountLabel ||
                      getMessage('helpers.groupCountLabel')
                    ).replace('{count}', String(group.helpers.length))}
                  </HelperGroupCountText>
                </HelperGroupHeader>
                {collapsedGroups.has(group.relationship) ? null : (
                  <HelperGroupItems>
                    {group.helpers.map(helper => {
                      const contactMethods =
                        normalizeDisplayContactMethods(helper);

                      return (
                        <ScrollView
                          horizontal
                          key={helper.id}
                          bounces={false}
                          showsHorizontalScrollIndicator={false}
                          testID={`helper-swipe-row-${helper.id}`}
                        >
                          <HelperSwipeContent>
                            <HelperSwipeCardSlot
                              style={{ width: helperCardWidth }}
                            >
                              <AppCard>
                                <HelperCardTextCol>
                                  <CardTitleText>
                                    {helper.displayName}
                                  </CardTitleText>
                                  {contactMethods.map((method, index) => (
                                    <AppText
                                      className="mt-[7px] text-caption text-muted"
                                      key={`${method.type}-${method.value}-${index}`}
                                    >
                                      {renderContactMethod(method)}
                                    </AppText>
                                  ))}
                                  {helper.notes ? (
                                    <AppText className="mt-[7px] text-caption text-muted">
                                      {helper.notes}
                                    </AppText>
                                  ) : null}
                                  <HelperNoticeText>
                                    {copy?.localOnlyNotice ||
                                      getMessage('helpers.localOnlyNotice')}
                                  </HelperNoticeText>
                                </HelperCardTextCol>
                              </AppCard>
                            </HelperSwipeCardSlot>
                            <HelperSwipeActionRail>
                              <HelperSwipeActionButton
                                accessibilityRole="button"
                                onPress={() => onEditHelper?.(helper.id)}
                              >
                                <HelperSwipeActionText numberOfLines={1}>
                                  {copy?.editAction ||
                                    getMessage('helpers.editAction')}
                                </HelperSwipeActionText>
                              </HelperSwipeActionButton>
                              <HelperSwipeActionButton
                                $tone="danger"
                                accessibilityRole="button"
                                onPress={() => onArchiveHelper?.(helper.id)}
                              >
                                <HelperSwipeActionText
                                  $tone="danger"
                                  numberOfLines={1}
                                >
                                  {copy?.archiveAction ||
                                    getMessage('helpers.archiveAction')}
                                </HelperSwipeActionText>
                              </HelperSwipeActionButton>
                            </HelperSwipeActionRail>
                          </HelperSwipeContent>
                        </ScrollView>
                      );
                    })}
                  </HelperGroupItems>
                )}
              </HelperGroupStack>
            ))
          )}
        </HelpersListStack>
      </AppScreen>
    );
  }
);

HelpersScreen.displayName = 'HelpersScreen';
