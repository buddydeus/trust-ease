import {
  getFeatureVersionFromAppVersion,
  parseFeatureVersion
} from '../../src/skin/featureVersion';

test('derives major.minor feature version from semver', () => {
  expect(getFeatureVersionFromAppVersion('0.0.1')).toBe('0.0');
  expect(getFeatureVersionFromAppVersion('1.7.9')).toBe('1.7');
  expect(getFeatureVersionFromAppVersion('1.7.9-beta.1')).toBe('1.7');
  expect(getFeatureVersionFromAppVersion('1.7.9+45')).toBe('1.7');
});

test('falls back to 0.0 for malformed versions', () => {
  expect(getFeatureVersionFromAppVersion('invalid')).toBe('0.0');
});

test('parses strict major.minor feature versions only', () => {
  expect(parseFeatureVersion('1.7')).toBe('1.7');
  expect(parseFeatureVersion('-1.7')).toBeNull();
  expect(parseFeatureVersion('1.7.0')).toBeNull();
});
