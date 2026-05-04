/**
 * Jest 全局初始化：扩展 React Native Testing Library 的匹配器，
 * 并将 AsyncStorage 替换为官方内存 mock，便于在无原生模块环境下测试 store。
 */
import '@testing-library/react-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest')
);
