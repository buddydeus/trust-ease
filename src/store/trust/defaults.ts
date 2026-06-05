import { TRUST_DATA_SCHEMA_VERSION } from './types';

import type { ITrustDataSnapshot } from './types';

export const createDefaultTrustDataSnapshot = (): ITrustDataSnapshot => ({
  schemaVersion: TRUST_DATA_SCHEMA_VERSION,
  items: [],
  helpers: [],
  triggerPolicy: {
    missedCheckInThreshold: 3,
    checkInIntervalDays: 1,
    missingStateEnabled: false,
    simulationEnabled: false,
    updatedAt: null
  },
  updatedAt: null
});
