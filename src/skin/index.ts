/**
 * 皮肤子系统对外出口：配置、内置注册表与共享类型。
 *
 * `runtime`、`storage`、`paths` 等仍从各自模块按需导入，避免仅需清单的打包体拉入文件系统实现。
 */
export * from './appConfig';
export * from './registry';
export * from './types';
