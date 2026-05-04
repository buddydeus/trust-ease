module.exports = function (api) {
  // `caller` 参与缓存键，必须在 `api.cache` 之前调用（见 Babel 文档）。
  const isBabelJest = api.caller(
    caller => caller != null && caller.name === 'babel-jest'
  );

  api.cache(true);

  // 仅由 babel-jest 转换的测试代码跳过 NativeWind，避免 `jest.mock()` 工厂经 css-interop
  // 注入后出现越域变量校验失败；Metro/Expo 打包仍走完整预设。
  if (isBabelJest) {
    return {
      presets: ['babel-preset-expo'],
      plugins: ['babel-plugin-styled-components']
    };
  }

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel'
    ],
    plugins: ['babel-plugin-styled-components']
  };
};
