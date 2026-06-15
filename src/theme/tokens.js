'use strict';

/**
 * 应用级设计令牌（颜色、圆角、字号）。
 * Tailwind 与 styled-components 共用此文件，避免与旧 `designs` 重复定义。
 */
module.exports = {
  color: {
    page: '#F6FAF8',
    card: '#FFFFFF',
    border: '#D8E7E2',
    muted: '#667B76',
    foreground: '#173B37',
    accent: '#0A6B63',
    accentSoft: '#EAF4F1',
    offlineRibbon: '#2F8A67',
    onlineRibbon: '#9A6A2D',
    pillLabel: '#0A6B63',
    hint: '#667B76'
  },
  radius: {
    screen: 28,
    card: 8,
    pill: 999
  },
  fontSize: {
    title: 23,
    section: 15,
    body: 15,
    caption: 12
  }
};
