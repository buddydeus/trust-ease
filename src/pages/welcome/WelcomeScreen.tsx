/**
 * 首次启动营销面：与路由分离，便于单独调整动效与版式而不卷入 AsyncStorage 副作用。
 */
import { memo } from 'react';
import { View } from 'react-native';

import {
  BrandHero,
  EyebrowMuted,
  LogoMark,
  AssuranceGroup,
  AssuranceRow,
  AssuranceText,
  AssuranceMetaText,
  WelcomeAppScreen,
  WelcomeBody,
  WelcomeCtaLabel,
  WelcomeFooterBlock,
  WelcomePrimaryCta,
  WelcomeTitle
} from './welcome.styled';

/**
 * `WelcomeScreen` 使用的本地化文案。
 */
export interface IWelcomeScreenCopy {
  /** 品牌/产品词标。 */
  brand: string;
  /** 主标题上方眉题。 */
  eyebrow: string;
  /** 主标题。 */
  title: string;
  /** 辅助段落。 */
  body: string;
  /** 主按钮文案。 */
  primaryButton: string;
  /** 手册示意图丝带标签。 */
  bookletRibbon: string;
  /** 手册示意图列表三行标题（自上而下）。 */
  bookletLine1: string;
  bookletLine2: string;
  bookletLine3: string;
  assuranceMeta1?: string;
  assuranceMeta2?: string;
  assuranceMeta3?: string;
}

/**
 * `WelcomeScreen` 的 props。
 */
export interface IWelcomeScreenProps {
  /** 本地化营销文案。 */
  copy: IWelcomeScreenCopy;
  /** 用户确认开始（具体导航由外层处理）。 */
  onStart: () => void;
}

/**
 * 首次启动欢迎营销页。
 *
 * @param props - `IWelcomeScreenProps`
 * @returns 已 memo 的欢迎页元素。
 */
export const WelcomeScreen = memo<IWelcomeScreenProps>(({ copy, onStart }) => (
  <WelcomeAppScreen>
    <View>
      <BrandHero>{copy.brand}</BrandHero>
      <EyebrowMuted>{copy.eyebrow}</EyebrowMuted>
    </View>

    <WelcomeFooterBlock>
      <LogoMark>{copy.bookletRibbon}</LogoMark>
      <WelcomeTitle>{copy.title}</WelcomeTitle>
      <WelcomeBody>{copy.body}</WelcomeBody>
    </WelcomeFooterBlock>

    <AssuranceGroup>
      {[copy.bookletLine1, copy.bookletLine2, copy.bookletLine3].map(
        (label, index) => (
          <AssuranceRow key={label}>
            <AssuranceText>{label}</AssuranceText>
            <AssuranceMetaText>
              {
                [copy.assuranceMeta1, copy.assuranceMeta2, copy.assuranceMeta3][
                  index
                ]
              }
            </AssuranceMetaText>
          </AssuranceRow>
        )
      )}
    </AssuranceGroup>

    <WelcomePrimaryCta accessibilityRole="button" onPress={onStart}>
      <WelcomeCtaLabel>{copy.primaryButton}</WelcomeCtaLabel>
    </WelcomePrimaryCta>
  </WelcomeAppScreen>
));

WelcomeScreen.displayName = 'WelcomeScreen';
