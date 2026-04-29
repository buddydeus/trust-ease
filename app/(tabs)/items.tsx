import { router } from 'expo-router';

import { ItemsScreen } from '@/src/features/items/ItemsScreen';

export default function ItemsRoute() {
  return <ItemsScreen onCreateItem={() => router.push('/items/new')} />;
}
