/**
 * 事项列表中枢：由路由注入回调与文案，列表内容可在不改动导航代码的情况下替换或 mock。
 */
import { memo } from 'react';

import {
  AppCard,
  AppScreen,
  AppText,
  FloatingAddButton,
  SectionHint
} from '../../components';
import { useI18n } from '../../i18n';
import { CardTitleText, ScreenTitleText } from '../../theme';

import {
  ItemCardInnerRow,
  ItemActionButton,
  ItemActionRow,
  ItemCardTextCol,
  ItemKindLabel,
  ItemsListStack,
  ItemsTitleRow
} from './items.styled';

export interface IItemsScreenItem {
  id: string;
  title: string;
  kind: 'offline' | 'online';
  summary: string;
}

/**
 * `ItemsScreen` 使用的本地化文案。
 */
export interface IItemsScreenCopy {
  /** 屏幕标题。 */
  title: string;
  /** 悬浮添加按钮的无障碍标签。 */
  createLabel: string;
  /** 底部提示文案。 */
  hint: string;
  /** 空列表标题。 */
  emptyTitle: string;
  /** 空列表说明。 */
  emptyBody: string;
  /** 线下事项类型标签。 */
  kindOffline: string;
  /** 线上事项类型标签。 */
  kindOnline: string;
  /** 编辑操作文案。 */
  editAction: string;
  /** 归档操作文案。 */
  archiveAction: string;
}

/**
 * `ItemsScreen` 的 props。
 */
export interface IItemsScreenProps {
  /** 用户点击创建时调用；静态预览可省略。 */
  onCreateItem?: () => void;
  /** 用户点击编辑某事项时调用。 */
  onEditItem?: (itemId: string) => void;
  /** 用户点击归档某事项时调用。 */
  onArchiveItem?: (itemId: string) => void;
  /** 当前 active 本地事项。 */
  items?: IItemsScreenItem[];
  /** 可选本地化文案；省略时使用内置默认。 */
  copy?: IItemsScreenCopy;
}

/**
 * 事项 Tab 列表：含筛选与示例行。
 *
 * @param props - `IItemsScreenProps`
 * @returns 已 memo 的事项页元素。
 */
export const ItemsScreen = memo<IItemsScreenProps>(
  ({ onCreateItem, onEditItem, onArchiveItem, items = [], copy } = {}) => {
    const { getMessage } = useI18n();
    const resolveKindLabel = (kind: IItemsScreenItem['kind']) =>
      kind === 'offline'
        ? copy?.kindOffline || getMessage('items.kindOffline')
        : copy?.kindOnline || getMessage('items.kindOnline');

    return (
      <AppScreen>
        <ItemsTitleRow>
          <ScreenTitleText>
            {copy?.title || getMessage('items.title')}
          </ScreenTitleText>
          <FloatingAddButton
            label={copy?.createLabel || getMessage('items.createLabel')}
            onPress={onCreateItem}
          />
        </ItemsTitleRow>
        <ItemsListStack>
          {items.length === 0 ? (
            <AppCard>
              <CardTitleText>
                {copy?.emptyTitle || getMessage('items.emptyTitle')}
              </CardTitleText>
              <AppText className="mt-[9px] text-caption text-muted">
                {copy?.emptyBody || getMessage('items.emptyBody')}
              </AppText>
            </AppCard>
          ) : (
            items.map(item => (
              <AppCard key={item.id}>
                <ItemCardInnerRow>
                  <ItemCardTextCol>
                    <CardTitleText>{item.title}</CardTitleText>
                    <ItemKindLabel variant={item.kind}>
                      {resolveKindLabel(item.kind)}
                    </ItemKindLabel>
                    <AppText className="mt-[7px] text-caption text-muted">
                      {item.summary}
                    </AppText>
                    <ItemActionRow>
                      <ItemActionButton
                        accessibilityRole="button"
                        onPress={() => onEditItem?.(item.id)}
                      >
                        <AppText className="text-caption text-accent">
                          {copy?.editAction || getMessage('items.editAction')}
                        </AppText>
                      </ItemActionButton>
                      <ItemActionButton
                        accessibilityRole="button"
                        onPress={() => onArchiveItem?.(item.id)}
                      >
                        <AppText className="text-caption text-muted">
                          {copy?.archiveAction ||
                            getMessage('items.archiveAction')}
                        </AppText>
                      </ItemActionButton>
                    </ItemActionRow>
                  </ItemCardTextCol>
                </ItemCardInnerRow>
              </AppCard>
            ))
          )}
        </ItemsListStack>
        <SectionHint text={copy?.hint || getMessage('items.hint')} />
      </AppScreen>
    );
  }
);

ItemsScreen.displayName = 'ItemsScreen';
