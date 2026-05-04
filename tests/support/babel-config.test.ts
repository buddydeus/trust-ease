const babelConfigFactory = require('../../babel.config.js');

describe('babel config', () => {
  test('uses babel-preset-expo without the deprecated expo-router babel plugin', () => {
    const api = {
      cache: jest.fn(),
      caller: (cb: (caller: { name?: string } | undefined) => unknown) =>
        cb({ name: 'expo-metro' })
    };
    const config = babelConfigFactory(api);

    expect(api.cache).toHaveBeenCalledWith(true);
    const hasExpoPreset = config.presets.some(
      (p: string | [string, ...unknown[]]) =>
        p === 'babel-preset-expo' ||
        (Array.isArray(p) && p[0] === 'babel-preset-expo')
    );
    expect(hasExpoPreset).toBe(true);
    expect(config.presets).toContain('nativewind/babel');
    expect(config.plugins ?? []).toContain('babel-plugin-styled-components');
    expect(config.plugins ?? []).not.toContain('expo-router/babel');
  });

  test('babel-jest 调用方仅使用 babel-preset-expo，不加载 NativeWind', () => {
    const api = {
      cache: jest.fn(),
      caller: (cb: (caller: { name?: string } | undefined) => unknown) =>
        cb({ name: 'babel-jest' })
    };
    const config = babelConfigFactory(api);

    expect(config.presets).toEqual(['babel-preset-expo']);
    expect(config.presets).not.toContain('nativewind/babel');
    expect(config.plugins ?? []).toContain('babel-plugin-styled-components');
  });
});
