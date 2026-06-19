export const TRUST_DATA_SCHEMA_VERSION = 1;

export type TrustRecordStatus = 'active' | 'archived';
export type TrustItemKind = 'offline' | 'online';
export type TrustedHelperContactMethodType = 'phone' | 'email' | string;

export interface ITrustItem {
  id: string;
  title: string;
  kind: TrustItemKind;
  summary: string;
  helperIds: string[];
  status: TrustRecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ITrustedHelper {
  id: string;
  displayName: string;
  relationship: string;
  contactMethod: string;
  contactMethods?: ITrustedHelperContactMethod[];
  notes: string;
  status: TrustRecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ITrustedHelperContactMethod {
  type: TrustedHelperContactMethodType;
  value: string;
}

export interface ILocalTriggerPolicy {
  missedCheckInThreshold: number;
  checkInIntervalDays: number;
  missingStateEnabled: boolean;
  simulationEnabled: boolean;
  updatedAt: string | null;
}

export interface ITrustDataSnapshot {
  schemaVersion: typeof TRUST_DATA_SCHEMA_VERSION;
  items: ITrustItem[];
  helpers: ITrustedHelper[];
  triggerPolicy: ILocalTriggerPolicy;
  updatedAt: string | null;
}
