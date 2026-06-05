import {
  getActiveTrustedHelpers,
  getActiveTrustItems,
  getArchivedTrustItems
} from './selectors';
import { parseTrustDataSnapshot } from './storage';
import { type ITrustDataSnapshot, TRUST_DATA_SCHEMA_VERSION } from './types';

export const LOCAL_TRUST_BACKUP_PRODUCT = 'trust-ease';
export const LOCAL_TRUST_BACKUP_SCHEMA_VERSION = 1;

export type LocalTrustBackupImportError =
  | 'malformed-json'
  | 'invalid-envelope'
  | 'unsupported-backup-version'
  | 'unsupported-trust-version'
  | 'invalid-snapshot';

export type LocalTrustBackupFileError =
  | 'cancelled'
  | 'read-failed'
  | 'write-failed';

export interface ILocalTrustBackupEnvelope {
  product: typeof LOCAL_TRUST_BACKUP_PRODUCT;
  backupSchemaVersion: typeof LOCAL_TRUST_BACKUP_SCHEMA_VERSION;
  exportedAt: string;
  trustDataSchemaVersion: typeof TRUST_DATA_SCHEMA_VERSION;
  snapshot: ITrustDataSnapshot;
}

export interface ILocalTrustBackupPreview {
  exportedAt: string;
  activeItemCount: number;
  archivedItemCount: number;
  activeHelperCount: number;
  archivedHelperCount: number;
  missingStateEnabled: boolean;
  simulationEnabled: boolean;
  willReplaceCurrentData: true;
}

export type LocalTrustBackupParseResult =
  | {
      ok: true;
      envelope: ILocalTrustBackupEnvelope;
      snapshot: ITrustDataSnapshot;
      preview: ILocalTrustBackupPreview;
    }
  | {
      ok: false;
      reason: LocalTrustBackupImportError;
    };

export interface ISerializeLocalTrustBackupOptions {
  exportedAt?: string;
}

export type LocalTrustBackupWriteResult =
  | {
      ok: true;
      uri: string;
    }
  | {
      ok: false;
      reason: 'write-failed';
    };

export type LocalTrustBackupReadResult =
  | {
      ok: true;
      content: string;
    }
  | {
      ok: false;
      reason: 'cancelled' | 'read-failed';
    };

export interface ILocalTrustBackupWriteInput {
  fileName: string;
  content: string;
}

export interface ILocalTrustBackupFileAdapter {
  writeBackup: (
    input: ILocalTrustBackupWriteInput
  ) => Promise<LocalTrustBackupWriteResult>;
  readBackup: () => Promise<LocalTrustBackupReadResult>;
}

export interface IExportLocalTrustBackupOptions {
  loadSnapshot: () => Promise<ITrustDataSnapshot>;
  writeBackup: (
    input: ILocalTrustBackupWriteInput
  ) => Promise<LocalTrustBackupWriteResult>;
  exportedAt?: string;
}

export interface IPreviewLocalTrustBackupImportOptions {
  readBackup: () => Promise<LocalTrustBackupReadResult>;
}

export interface IConfirmLocalTrustBackupImportOptions {
  snapshot: ITrustDataSnapshot;
  saveSnapshot: (snapshot: ITrustDataSnapshot) => Promise<void>;
}

export type ExportLocalTrustBackupResult = LocalTrustBackupWriteResult;

export type PreviewLocalTrustBackupImportResult =
  | LocalTrustBackupParseResult
  | {
      ok: false;
      reason: 'cancelled' | 'read-failed';
    };

export type ConfirmLocalTrustBackupImportResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: 'save-failed';
    };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const toCanonical = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(toCanonical);
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.keys(value)
    .sort()
    .reduce<Record<string, unknown>>((result, key) => {
      result[key] = toCanonical(value[key]);

      return result;
    }, {});
};

const canonicalStringify = (value: unknown): string =>
  JSON.stringify(toCanonical(value));

const parseSupportedSnapshot = (value: unknown): ITrustDataSnapshot | null => {
  const parsed = parseTrustDataSnapshot(value);

  return canonicalStringify(parsed) === canonicalStringify(value)
    ? parsed
    : null;
};

export const deriveLocalTrustBackupPreview = (
  envelope: ILocalTrustBackupEnvelope
): ILocalTrustBackupPreview => {
  const activeItems = getActiveTrustItems(envelope.snapshot);
  const archivedItems = getArchivedTrustItems(envelope.snapshot);
  const activeHelpers = getActiveTrustedHelpers(envelope.snapshot);
  const archivedHelpers = envelope.snapshot.helpers.filter(
    helper => helper.status === 'archived'
  );

  return {
    exportedAt: envelope.exportedAt,
    activeItemCount: activeItems.length,
    archivedItemCount: archivedItems.length,
    activeHelperCount: activeHelpers.length,
    archivedHelperCount: archivedHelpers.length,
    missingStateEnabled: envelope.snapshot.triggerPolicy.missingStateEnabled,
    simulationEnabled: envelope.snapshot.triggerPolicy.simulationEnabled,
    willReplaceCurrentData: true
  };
};

export const serializeLocalTrustBackup = (
  snapshot: ITrustDataSnapshot,
  options: ISerializeLocalTrustBackupOptions = {}
): string => {
  const parsedSnapshot = parseSupportedSnapshot(snapshot);

  if (!parsedSnapshot) {
    throw new Error('Invalid local trust snapshot');
  }

  const envelope: ILocalTrustBackupEnvelope = {
    product: LOCAL_TRUST_BACKUP_PRODUCT,
    backupSchemaVersion: LOCAL_TRUST_BACKUP_SCHEMA_VERSION,
    exportedAt: options.exportedAt || new Date().toISOString(),
    trustDataSchemaVersion: TRUST_DATA_SCHEMA_VERSION,
    snapshot: parsedSnapshot
  };

  return JSON.stringify(envelope, null, 2);
};

export const parseLocalTrustBackup = (
  raw: string
): LocalTrustBackupParseResult => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      reason: 'malformed-json'
    };
  }

  if (!isRecord(parsed)) {
    return {
      ok: false,
      reason: 'invalid-envelope'
    };
  }

  if (parsed.product !== LOCAL_TRUST_BACKUP_PRODUCT) {
    return {
      ok: false,
      reason: 'invalid-envelope'
    };
  }

  if (parsed.backupSchemaVersion !== LOCAL_TRUST_BACKUP_SCHEMA_VERSION) {
    return {
      ok: false,
      reason: 'unsupported-backup-version'
    };
  }

  if (
    parsed.trustDataSchemaVersion !== TRUST_DATA_SCHEMA_VERSION ||
    !isRecord(parsed.snapshot) ||
    parsed.snapshot.schemaVersion !== TRUST_DATA_SCHEMA_VERSION
  ) {
    return {
      ok: false,
      reason: 'unsupported-trust-version'
    };
  }

  if (typeof parsed.exportedAt !== 'string') {
    return {
      ok: false,
      reason: 'invalid-envelope'
    };
  }

  const snapshot = parseSupportedSnapshot(parsed.snapshot);

  if (!snapshot) {
    return {
      ok: false,
      reason: 'invalid-snapshot'
    };
  }

  const envelope: ILocalTrustBackupEnvelope = {
    product: LOCAL_TRUST_BACKUP_PRODUCT,
    backupSchemaVersion: LOCAL_TRUST_BACKUP_SCHEMA_VERSION,
    exportedAt: parsed.exportedAt,
    trustDataSchemaVersion: TRUST_DATA_SCHEMA_VERSION,
    snapshot
  };

  return {
    ok: true,
    envelope,
    snapshot,
    preview: deriveLocalTrustBackupPreview(envelope)
  };
};

const createBackupFileName = (exportedAt: string): string =>
  `trust-ease-backup-${exportedAt.replace(/[:.]/g, '-')}.json`;

export const exportLocalTrustBackup = async ({
  loadSnapshot,
  writeBackup,
  exportedAt
}: IExportLocalTrustBackupOptions): Promise<ExportLocalTrustBackupResult> => {
  const resolvedExportedAt = exportedAt || new Date().toISOString();
  const snapshot = await loadSnapshot();
  const content = serializeLocalTrustBackup(snapshot, {
    exportedAt: resolvedExportedAt
  });

  try {
    return await writeBackup({
      fileName: createBackupFileName(resolvedExportedAt),
      content
    });
  } catch {
    return {
      ok: false,
      reason: 'write-failed'
    };
  }
};

export const previewLocalTrustBackupImport = async ({
  readBackup
}: IPreviewLocalTrustBackupImportOptions): Promise<PreviewLocalTrustBackupImportResult> => {
  let readResult: LocalTrustBackupReadResult;

  try {
    readResult = await readBackup();
  } catch {
    return {
      ok: false,
      reason: 'read-failed'
    };
  }

  if (!readResult.ok) {
    return readResult;
  }

  return parseLocalTrustBackup(readResult.content);
};

export const confirmLocalTrustBackupImport = async ({
  snapshot,
  saveSnapshot
}: IConfirmLocalTrustBackupImportOptions): Promise<ConfirmLocalTrustBackupImportResult> => {
  try {
    await saveSnapshot(snapshot);

    return {
      ok: true
    };
  } catch {
    return {
      ok: false,
      reason: 'save-failed'
    };
  }
};
