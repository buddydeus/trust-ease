/**
 * 应用语义化版本号字符串，读取自 `package.json`（例如 `0.0.1`）。
 *
 * 与 `package.json` 同源，便于发布脚本、CI 与运行时共用同一版本串，
 * 避免再维护一份手写常量。
 *
 * @constant
 * @type {string}
 */
export const appVersion: string = require('../../package.json').version;
