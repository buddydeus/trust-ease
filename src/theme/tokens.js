'use strict';

/**
 * 应用级设计令牌（颜色、圆角、字号）。
 * Tailwind 与 styled-components 共用此文件，避免与旧 `designs` 重复定义。
 */
module.exports = {
  color: {
    page: '#F7FBFA',
    card: '#FFFFFF',
    border: '#DEEBE6',
    muted: '#6F837D',
    foreground: '#243F39',
    accent: '#86B1A2',
    accentSoft: '#EEF5F2',
    offlineRibbon: '#DBEAE6',
    onlineRibbon: '#EADFDB',
    pillLabel: '#466059',
    hint: '#728680'
  },
  radius: {
    screen: 28,
    card: 24,
    pill: 999
  },
  fontSize: {
    title: 23,
    section: 15,
    body: 15,
    caption: 12
  }
};
