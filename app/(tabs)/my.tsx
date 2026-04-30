import { router } from 'expo-router';

import { MyScreen } from '@/src/features/my/MyScreen';

export default function MyRoute() {
  return <MyScreen onOpenTriggerState={() => router.push('/my/trigger-state')} />;
}
