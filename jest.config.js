module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@testing-library/react-native/extend-expect$':
      '<rootDir>/tests/support/rntl-extend-expect.ts'
  },
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
  transformIgnorePatterns: [
    '/node_modules/(?!.*(?:react-native|@react-native|expo|@expo|react-navigation|@react-navigation|react-native-svg|native-base|@sentry/react-native|nativewind|react-native-css-interop))'
  ]
};
