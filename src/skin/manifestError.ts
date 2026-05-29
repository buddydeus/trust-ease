/**
 * 当皮肤清单 JSON 未通过模式校验时抛出。
 */
export class SkinManifestParseError extends Error {
  /**
   * @param message - 解析错误说明，通常包含 JSON 路径上下文。
   */
  constructor(message: string) {
    super(message);
    this.name = 'SkinManifestParseError';
  }
}
