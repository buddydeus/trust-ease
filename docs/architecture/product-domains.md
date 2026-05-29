# Product Domains

The PRD maps into bounded technical domains. Each domain owns its write model.
Other domains read through APIs, events, or shared contracts.

## Domain Map

| Domain | Owns | Does Not Own |
| --- | --- | --- |
| Identity & Account | registration, login, identity verification state, recovery, MFA, account freeze | trust item content |
| Contact & Authorization | trusted contacts, executors, roles, notification order, authorization grants, consent records | vault file storage |
| Trust Item Catalog | item templates, user trust items, risk levels, execution mode, required materials, assigned executor | trigger decisions |
| Secure Vault | vault documents, encrypted metadata, release rules, download audit, retention/deletion | account login |
| Trigger Engine | active checks, missed confirmations, pre-alerts, thresholds, simulation, trigger incidents | notification delivery channels |
| Notification Orchestration | templates, channels, fanout, receipts, retries, quiet hours | trigger policy ownership |
| Execution Routing | API automation tasks, official-process guidance, manual work orders, partner routing | evidence approval |
| Review & Risk Control | reviewer queues, evidence review, irreversible gates, overrides, incidents | owner-facing item editing |
| Audit & Compliance | immutable audit events, access logs, export logs, retention, legal hold markers | product UI rendering |
| Skin & Client Experience | mobile UI contracts, skin manifests, locales, preview/screenshot workflows | backend state machines |

## Aggregate Roots

### `UserAccount`

Represents the owner account, security state, lifecycle, freeze status, and
account-level settings.

### `IdentityVerification`

Tracks identity proofing status, verification provider references, reviewer
decisions, and expiry or recheck requirements.

### `TrustedContact`

Represents a contact invited by the owner. Stores contact identity, invitation
state, relationship metadata, and communication channels.

### `AuthorizationGrant`

Defines what a contact, executor, partner, or reviewer can access, when access
is valid, and which trust items or vault documents are included.

### `TrustItem`

Represents an instruction or matter to handle. Includes category, platform or
institution, desired outcome, execution mode, risk level, required materials,
and assigned executor.

### `VaultDocument`

Represents encrypted file metadata, owner, classification, release policy,
retention policy, and audit references.

### `TriggerPolicy`

Defines confirmation cadence, missed-check thresholds, contact escalation rules,
review requirements, pause/freeze controls, and simulation settings.

### `TriggerIncident`

Represents one suspected high-risk event, including signals, timeline, current
state, reviewer decisions, contacts consulted, and appeal/freeze status.

### `NotificationAttempt`

Represents one channel delivery attempt, receipt, retry, failure reason, and
template version.

### `ExecutionTask`

Represents one work item routed to automation, official guidance, executor, or
partner assistance.

### `ReviewCase`

Represents evidence review, risk review, irreversible-action approval, freeze,
appeal, or operational exception handling.

### `AuditEvent`

Immutable record of sensitive reads, writes, approvals, releases, downloads,
freezes, appeals, and operational changes.

## State Machines

### User Plan Lifecycle

```text
draft -> configured -> active -> paused -> frozen -> closed
```

- `draft`: owner has not completed minimum setup.
- `configured`: minimum setup exists, but plan may not yet be active.
- `active`: trigger policy and confirmation cycle are running.
- `paused`: owner paused trigger behavior.
- `frozen`: platform or risk workflow stopped high-risk actions.
- `closed`: account or plan is retired.

### Trigger Lifecycle

```text
normal -> missed-check -> pre-alert -> contact-verification
  -> pending-review -> approved-execution -> executing -> completed

high-risk state -> paused | frozen | appealed
```

A single missed check must not directly reach irreversible execution.

### Vault Release Lifecycle

```text
sealed -> eligible-for-review -> approved-for-release -> released -> revoked
```

Vault release requires authorization scope, release state, audit records, and
review gates for high-risk materials.

### Execution Task Lifecycle

```text
pending -> routed -> in-progress -> blocked -> completed -> cancelled
```

Execution tasks can be routed to API automation, official process guidance,
manual executor action, or partner work order.
