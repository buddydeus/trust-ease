import AsyncStorage from '@react-native-async-storage/async-storage';

describe('welcome onboarding storage', () => {
  beforeEach(async () => {
    jest.resetModules();
    await AsyncStorage.clear();
  });

  test('defaults to not seen on first install', async () => {
    const {
      loadHasSeenWelcome
    } = require('../../src/store/onboarding/storage');

    await expect(loadHasSeenWelcome()).resolves.toBe(false);
  });

  test('persists the seen flag after completion', async () => {
    const {
      loadHasSeenWelcome,
      saveHasSeenWelcome
    } = require('../../src/store/onboarding/storage');

    await saveHasSeenWelcome(true);

    await expect(loadHasSeenWelcome()).resolves.toBe(true);
  });
});
