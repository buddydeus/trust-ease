module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@testing-library/react-native/extend-expect$':
      '<rootDir>/tests/support/rntl-extend-expect.ts',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
  transformIgnorePatterns: [
    '/node_modules/(?!.*(?:react-native|@react-native|expo|@expo|react-navigation|@react-navigation|react-native-svg|native-base|@sentry/react-native))',
  ],
};
