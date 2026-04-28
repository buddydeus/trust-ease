import { router } from 'expo-router';
import { Alert } from 'react-native';

import { ReportScreen } from '@/src/features/report/ReportScreen';

export default function ReportRoute() {
  return (
    <ReportScreen
      mode="full"
      onSubmit={() => router.replace('/(tabs)/home')}
      onOpenPassword={() => Alert.alert('完整确认暂未接入')}
    />
  );
}
