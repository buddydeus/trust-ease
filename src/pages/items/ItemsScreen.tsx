/**
 * 事项列表中枢：由路由注入回调与文案，列表内容可在不改动导航代码的情况下替换或 mock。
 */
import React from 'react';

import {
  AppCard,
  AppPill,
  AppScreen,
  AppText,
  FloatingAddButton,
  SectionHint
} from '../../components';
import { useI18n } from '../../i18n';
import { CardTitleText, ItemRibbon, ScreenTitleText } from '../../theme';

import {
  ItemCardInnerRow,
  ItemCardTextCol,
  ItemsFilterRow,
  ItemsListStack,
  ItemsTitleRow
} from './items.styled';

/**
 * `ItemsScreen` 使用的本地化文案。
 */
export interface IItemsScreenCopy {
  /** 屏幕标题。 */
  title: string;
  /** 悬浮添加按钮的无障碍标签。 */
  createLabel: string;
  /** 「全部」筛选项文案。 */
  filterAll: string;
  /** 「线下」筛选项文案。 */
  filterOffline: string;
  /** 第一条示例列表项标题。 */
  itemOneTitle: string;
  /** 第一条示例列表项副标题。 */
  itemOneMeta: string;
  /** 第二条示例列表项标题。 */
  itemTwoTitle: string;
  /** 第二条示例列表项副标题。 */
  itemTwoMeta: string;
  /** 底部提示文案。 */
  hint: string;
}

/**
 * `ItemsScreen` 的 props。
 */
export interface IItemsScreenProps {
  /** 用户点击创建时调用；静态预览可省略。 */
  onCreateItem?: () => void;
  /** 可选本地化文案；省略时使用内置默认。 */
  copy?: IItemsScreenCopy;
}

/**
 * 事项 Tab 列表：含筛选与示例行。
 *
 * @param props - `IItemsScreenProps`
 * @returns 已 memo 的事项页元素。
 */
export const ItemsScreen = React.memo<IItemsScreenProps>(
  ({ onCreateItem, copy } = {}) => {
    const { getMessage } = useI18n();

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
        <ItemsFilterRow>
          <AppPill
            label={copy?.filterAll || getMessage('items.filterAll')}
            active
          />
          <AppPill
            label={copy?.filterOffline || getMessage('items.filterOffline')}
          />
        </ItemsFilterRow>
        <ItemsListStack>
          <AppCard>
            <ItemCardInnerRow>
              <ItemCardTextCol>
                <CardTitleText>
                  {copy?.itemOneTitle || getMessage('items.itemOneTitle')}
                </CardTitleText>
                <AppText className="mt-[9px] text-caption text-muted">
                  {copy?.itemOneMeta || getMessage('items.itemOneMeta')}
                </AppText>
              </ItemCardTextCol>
              <ItemRibbon variant="offline" />
            </ItemCardInnerRow>
          </AppCard>
          <AppCard>
            <ItemCardInnerRow>
              <ItemCardTextCol>
                <CardTitleText>
                  {copy?.itemTwoTitle || getMessage('items.itemTwoTitle')}
                </CardTitleText>
                <AppText className="mt-[9px] text-caption text-muted">
                  {copy?.itemTwoMeta || getMessage('items.itemTwoMeta')}
                </AppText>
              </ItemCardTextCol>
              <ItemRibbon variant="online" />
            </ItemCardInnerRow>
          </AppCard>
        </ItemsListStack>
        <SectionHint text={copy?.hint || getMessage('items.hint')} />
      </AppScreen>
    );
  }
);

ItemsScreen.displayName = 'ItemsScreen';
