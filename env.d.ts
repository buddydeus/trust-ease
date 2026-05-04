/**
 * 收窄 `process.env.NODE_ENV`，使在 Jest 与生产分支（如 `AppSwitch`）中
 * TypeScript 能拒绝不可能的字面量取值。
 */
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
