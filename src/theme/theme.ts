import type { AppTheme } from './types';

const raw = require('./tokens.js') as {
  color: Record<string, string>;
  radius: Record<string, number>;
  fontSize: Record<string, number>;
};

export const appTheme: AppTheme = {
  color: {
    page: raw.color.page,
    card: raw.color.card,
    border: raw.color.border,
    muted: raw.color.muted,
    foreground: raw.color.foreground,
    accent: raw.color.accent,
    accentSoft: raw.color.accentSoft,
    offlineRibbon: raw.color.offlineRibbon,
    onlineRibbon: raw.color.onlineRibbon,
    pillLabel: raw.color.pillLabel,
    hint: raw.color.hint
  },
  radius: {
    screen: raw.radius.screen,
    card: raw.radius.card,
    pill: raw.radius.pill
  },
  fontSize: {
    title: raw.fontSize.title,
    section: raw.fontSize.section,
    body: raw.fontSize.body,
    caption: raw.fontSize.caption
  }
};
