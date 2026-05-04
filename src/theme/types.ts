export interface AppTheme {
  color: {
    page: string;
    card: string;
    border: string;
    muted: string;
    foreground: string;
    accent: string;
    accentSoft: string;
    offlineRibbon: string;
    onlineRibbon: string;
    pillLabel: string;
    hint: string;
  };
  radius: {
    screen: number;
    card: number;
    pill: number;
  };
  fontSize: {
    title: number;
    section: number;
    body: number;
    caption: number;
  };
}
