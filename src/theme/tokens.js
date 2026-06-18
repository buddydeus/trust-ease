'use strict';

/**
 * 应用级设计令牌（颜色、圆角、字号）。
 * Tailwind 与 styled-components 共用此文件，避免与旧 `designs` 重复定义。
 */
module.exports = {
  color: {
    page: '#F6FAF8',
    card: '#FFFFFF',
    border: '#D7E5DF',
    muted: '#6F7E7B',
    foreground: '#213934',
    accent: '#4F907C',
    accentSoft: '#EEF6F2',
    offlineRibbon: '#4F907C',
    onlineRibbon: '#A56A21',
    pillLabel: '#3E7666',
    hint: '#6F7E7B'
  },
  radius: {
    screen: 36,
    card: 20,
    pill: 999
  },
  fontSize: {
    title: 26,
    section: 15,
    body: 15,
    caption: 12
  }
};
