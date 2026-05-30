import * as FileSystem from 'expo-file-system/legacy';

/** 应用沙盒下存放已下载皮肤的目录名。 */
const RUNTIME_SKINS_DIR_NAME = 'skins';
const RUNTIME_SKIN_STAGING_DIR_NAME = '.staging';

/**
 * 拼接两段 URI 路径，保证仅有一个斜杠分界。
 *
 * @param baseUri - 基底 URI（可含尾部斜杠）。
 * @param path - 相对路径段（可含前导斜杠）。
 * @returns 合并后的 URI 字符串。
 */
const joinUri = (baseUri: string, path: string): string => {
  return `${baseUri.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
};

/**
 * 返回应用沙盒内用于皮肤下载的根目录 URI。
 *
 * @returns `documentDirectory` 下可写的 `skins/` 目录 URI。
 * @throws {Error} 当 `FileSystem.documentDirectory` 不可用时抛出。
 */
export const getRuntimeSkinsDirectoryUri = (): string => {
  if (!FileSystem.documentDirectory) {
    throw new Error(
      'Bundled skins require a writable FileSystem.documentDirectory'
    );
  }

  return joinUri(FileSystem.documentDirectory, RUNTIME_SKINS_DIR_NAME);
};

/**
 * 返回某个皮肤 id 在运行时皮肤根目录下的存储 URI。
 *
 * @param skinId - 作为目录名的皮肤标识。
 * @returns 该皮肤包目录的绝对 URI。
 */
export const getRuntimeSkinPackageDirectoryUri = (skinId: string): string => {
  return joinUri(getRuntimeSkinsDirectoryUri(), skinId);
};

/**
 * 返回某个皮肤 id 在运行时 staging 区的目录 URI。
 *
 * @param skinId - 作为 staging 目录名的皮肤标识。
 * @returns 该皮肤包 staging 目录的绝对 URI。
 */
export const getRuntimeSkinPackageStagingDirectoryUri = (
  skinId: string
): string => {
  return joinUri(
    joinUri(getRuntimeSkinsDirectoryUri(), RUNTIME_SKIN_STAGING_DIR_NAME),
    skinId
  );
};

/**
 * 若不存在则创建运行时皮肤根目录。
 *
 * @returns 已确保存在的目录 URI。
 */
export const ensureRuntimeSkinsDirectory = async (): Promise<string> => {
  const uri = getRuntimeSkinsDirectoryUri();
  await FileSystem.makeDirectoryAsync(uri, { intermediates: true });
  return uri;
};
