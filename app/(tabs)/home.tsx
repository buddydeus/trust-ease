import { router } from 'expo-router';

import { HomeScreen } from '@/src/features/home/HomeScreen';
import { useAppStore } from '@/src/store/useAppStore';

export default function HomeRoute() {
  const homeSummary = useAppStore((state) => state.homeSummary);

  return (
    <HomeScreen
      summary={homeSummary}
      onOpenReport={() => router.push('/report')}
    />
  );
}
