/** @type {import('tailwindcss').Config} */
const { color, radius, fontSize } = require('./src/theme/tokens.js');

const px = n => `${n}px`;

module.exports = {
  content: ['./src/global.css', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        page: color.page,
        card: color.card,
        border: color.border,
        muted: color.muted,
        foreground: color.foreground,
        accent: color.accent,
        'accent-soft': color.accentSoft,
        'offline-ribbon': color.offlineRibbon,
        'online-ribbon': color.onlineRibbon,
        'pill-label': color.pillLabel,
        hint: color.hint
      },
      borderRadius: {
        screen: px(radius.screen),
        card: px(radius.card),
        pill: px(radius.pill)
      },
      fontSize: {
        title: [px(fontSize.title), { lineHeight: '28px' }],
        section: [px(fontSize.section), { lineHeight: '22px' }],
        body: [px(fontSize.body), { lineHeight: '22px' }],
        caption: [px(fontSize.caption), { lineHeight: '16px' }]
      }
    }
  },
  plugins: []
};
