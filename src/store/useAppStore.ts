import { create } from 'zustand';

import { defaultHomeSummary } from '@/src/domain/defaults';
import type { HomeSummary } from '@/src/domain/models';

type AppState = {
  homeSummary: HomeSummary;
};

export const useAppStore = create<AppState>(() => ({
  homeSummary: { ...defaultHomeSummary },
}));
