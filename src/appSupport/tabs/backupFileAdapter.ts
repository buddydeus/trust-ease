import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import type { ILocalTrustBackupFileAdapter } from '../../store/trust';

export const createExpoBackupFileAdapter =
  (): ILocalTrustBackupFileAdapter => ({
    writeBackup: async ({ fileName, content }) => {
      if (!FileSystem.documentDirectory) {
        return {
          ok: false,
          reason: 'write-failed'
        };
      }

      const uri = `${FileSystem.documentDirectory}${fileName}`;

      try {
        await FileSystem.writeAsStringAsync(uri, content);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/json',
            dialogTitle: fileName,
            UTI: 'public.json'
          });
        }

        return {
          ok: true,
          uri
        };
      } catch {
        return {
          ok: false,
          reason: 'write-failed'
        };
      }
    },
    readBackup: async () => {
      try {
        const picked = await DocumentPicker.getDocumentAsync({
          type: 'application/json',
          copyToCacheDirectory: true,
          multiple: false
        });

        if (picked.canceled || picked.assets.length === 0) {
          return {
            ok: false,
            reason: 'cancelled'
          };
        }

        return {
          ok: true,
          content: await FileSystem.readAsStringAsync(picked.assets[0].uri)
        };
      } catch {
        return {
          ok: false,
          reason: 'read-failed'
        };
      }
    }
  });
