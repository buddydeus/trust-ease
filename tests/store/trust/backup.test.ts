import {
  LOCAL_TRUST_BACKUP_PRODUCT,
  LOCAL_TRUST_BACKUP_SCHEMA_VERSION,
  TRUST_DATA_SCHEMA_VERSION,
  confirmLocalTrustBackupImport,
  createDefaultTrustDataSnapshot,
  exportLocalTrustBackup,
  parseLocalTrustBackup,
  previewLocalTrustBackupImport,
  serializeLocalTrustBackup
} from '../../../src/store/trust';

import type {
  ITrustedHelper,
  ITrustDataSnapshot,
  ITrustItem
} from '../../../src/store/trust';

const NOW = '2026-06-05T12:00:00.000Z';

const createItem = (
  overrides: Partial<ITrustItem> = {}
): ITrustItem => ({
  id: 'item-1',
  title: 'Vault card',
  kind: 'offline',
  summary: 'Stored in the desk',
  helperIds: ['helper-1'],
  status: 'active',
  createdAt: NOW,
  updatedAt: NOW,
  ...overrides
});

const createHelper = (
  overrides: Partial<ITrustedHelper> = {}
): ITrustedHelper => ({
  id: 'helper-1',
  displayName: 'Alex',
  relationship: 'Family',
  contactMethod: 'Phone',
  notes: 'Can help review the plan',
  status: 'active',
  createdAt: NOW,
  updatedAt: NOW,
  ...overrides
});

const createSnapshot = (
  overrides: Partial<ITrustDataSnapshot> = {}
): ITrustDataSnapshot => ({
  ...createDefaultTrustDataSnapshot(),
  items: [
    createItem(),
    createItem({
      id: 'item-archived',
      helperIds: [],
      status: 'archived'
    })
  ],
  helpers: [
    createHelper(),
    createHelper({
      id: 'helper-archived',
      status: 'archived'
    })
  ],
  triggerPolicy: {
    ...createDefaultTrustDataSnapshot().triggerPolicy,
    missingStateEnabled: true,
    simulationEnabled: false,
    updatedAt: NOW
  },
  updatedAt: NOW,
  ...overrides
});

describe('local trust backup helpers', () => {
  test('serializes a versioned local backup envelope', () => {
    const snapshot = createSnapshot();

    const serialized = serializeLocalTrustBackup(snapshot, {
      exportedAt: NOW
    });
    const parsed = JSON.parse(serialized);

    expect(parsed).toEqual({
      product: LOCAL_TRUST_BACKUP_PRODUCT,
      backupSchemaVersion: LOCAL_TRUST_BACKUP_SCHEMA_VERSION,
      exportedAt: NOW,
      trustDataSchemaVersion: TRUST_DATA_SCHEMA_VERSION,
      snapshot
    });
  });

  test('rejects invalid source snapshot during export', () => {
    expect(() =>
      serializeLocalTrustBackup({
        ...createSnapshot(),
        items: 'not-items'
      } as unknown as ITrustDataSnapshot)
    ).toThrow('Invalid local trust snapshot');
  });

  test('parses a valid backup into a preview without mutating the snapshot', () => {
    const snapshot = createSnapshot();
    const before = JSON.stringify(snapshot);
    const serialized = serializeLocalTrustBackup(snapshot, {
      exportedAt: NOW
    });

    const result = parseLocalTrustBackup(serialized);

    expect(result).toEqual({
      ok: true,
      envelope: {
        product: LOCAL_TRUST_BACKUP_PRODUCT,
        backupSchemaVersion: LOCAL_TRUST_BACKUP_SCHEMA_VERSION,
        exportedAt: NOW,
        trustDataSchemaVersion: TRUST_DATA_SCHEMA_VERSION,
        snapshot
      },
      snapshot,
      preview: {
        exportedAt: NOW,
        activeItemCount: 1,
        archivedItemCount: 1,
        activeHelperCount: 1,
        archivedHelperCount: 1,
        missingStateEnabled: true,
        simulationEnabled: false,
        willReplaceCurrentData: true
      }
    });
    expect(JSON.stringify(snapshot)).toBe(before);
  });

  test.each([
    ['malformed-json', '{not-json'],
    [
      'invalid-envelope',
      JSON.stringify({
        product: 'someone-else',
        backupSchemaVersion: LOCAL_TRUST_BACKUP_SCHEMA_VERSION,
        exportedAt: NOW,
        trustDataSchemaVersion: TRUST_DATA_SCHEMA_VERSION,
        snapshot: createSnapshot()
      })
    ],
    [
      'unsupported-backup-version',
      JSON.stringify({
        product: LOCAL_TRUST_BACKUP_PRODUCT,
        backupSchemaVersion: LOCAL_TRUST_BACKUP_SCHEMA_VERSION + 1,
        exportedAt: NOW,
        trustDataSchemaVersion: TRUST_DATA_SCHEMA_VERSION,
        snapshot: createSnapshot()
      })
    ],
    [
      'unsupported-trust-version',
      JSON.stringify({
        product: LOCAL_TRUST_BACKUP_PRODUCT,
        backupSchemaVersion: LOCAL_TRUST_BACKUP_SCHEMA_VERSION,
        exportedAt: NOW,
        trustDataSchemaVersion: TRUST_DATA_SCHEMA_VERSION + 1,
        snapshot: {
          ...createSnapshot(),
          schemaVersion: TRUST_DATA_SCHEMA_VERSION + 1
        }
      })
    ],
    [
      'invalid-snapshot',
      JSON.stringify({
        product: LOCAL_TRUST_BACKUP_PRODUCT,
        backupSchemaVersion: LOCAL_TRUST_BACKUP_SCHEMA_VERSION,
        exportedAt: NOW,
        trustDataSchemaVersion: TRUST_DATA_SCHEMA_VERSION,
        snapshot: {
          ...createSnapshot(),
          items: 'not-items'
        }
      })
    ]
  ])('rejects %s backup content safely', (reason, content) => {
    expect(parseLocalTrustBackup(content)).toEqual({
      ok: false,
      reason
    });
  });
});

describe('local trust backup controller helpers', () => {
  test('exports current snapshot through an injected file writer', async () => {
    const snapshot = createSnapshot();
    const writeBackup = jest.fn(async () => ({
      ok: true as const,
      uri: 'file://trust-ease-backup.json'
    }));

    const result = await exportLocalTrustBackup({
      loadSnapshot: async () => snapshot,
      writeBackup,
      exportedAt: NOW
    });

    expect(result).toEqual({
      ok: true,
      uri: 'file://trust-ease-backup.json'
    });
    expect(writeBackup).toHaveBeenCalledWith({
      fileName: 'trust-ease-backup-2026-06-05T12-00-00-000Z.json',
      content: serializeLocalTrustBackup(snapshot, { exportedAt: NOW })
    });
  });

  test('returns write failure without throwing during export', async () => {
    const result = await exportLocalTrustBackup({
      loadSnapshot: async () => createSnapshot(),
      writeBackup: async () => ({
        ok: false,
        reason: 'write-failed'
      }),
      exportedAt: NOW
    });

    expect(result).toEqual({
      ok: false,
      reason: 'write-failed'
    });
  });

  test('previews selected backup without saving imported data', async () => {
    const saveSnapshot = jest.fn();
    const snapshot = createSnapshot();
    const content = serializeLocalTrustBackup(snapshot, { exportedAt: NOW });

    const result = await previewLocalTrustBackupImport({
      readBackup: async () => ({
        ok: true,
        content
      })
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.preview.activeItemCount).toBe(1);
      expect(result.snapshot).toEqual(snapshot);
    }
    expect(saveSnapshot).not.toHaveBeenCalled();
  });

  test.each([
    ['cancelled', { ok: false as const, reason: 'cancelled' as const }],
    ['read-failed', { ok: false as const, reason: 'read-failed' as const }]
  ])('returns %s when backup selection does not provide content', async (
    reason,
    readResult
  ) => {
    await expect(
      previewLocalTrustBackupImport({
        readBackup: async () => readResult
      })
    ).resolves.toEqual({
      ok: false,
      reason
    });
  });

  test('returns validation failure from import preview', async () => {
    await expect(
      previewLocalTrustBackupImport({
        readBackup: async () => ({
          ok: true,
          content: '{not-json'
        })
      })
    ).resolves.toEqual({
      ok: false,
      reason: 'malformed-json'
    });
  });

  test('confirmed import writes the parsed snapshot', async () => {
    const snapshot = createSnapshot();
    const saveSnapshot = jest.fn(async () => undefined);

    await expect(
      confirmLocalTrustBackupImport({
        snapshot,
        saveSnapshot
      })
    ).resolves.toEqual({
      ok: true
    });
    expect(saveSnapshot).toHaveBeenCalledWith(snapshot);
  });

  test('confirmed import reports save failure without partial fallback', async () => {
    const snapshot = createSnapshot();

    await expect(
      confirmLocalTrustBackupImport({
        snapshot,
        saveSnapshot: async () => {
          throw new Error('storage unavailable');
        }
      })
    ).resolves.toEqual({
      ok: false,
      reason: 'save-failed'
    });
  });
});
