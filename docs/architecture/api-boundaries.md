# API Boundaries

Applications should communicate through stable contracts instead of embedding
backend business rules in clients.

## API Groups

### `/auth`

Login, logout, session refresh, MFA challenge, and recovery entry points.

### `/account`

Account profile, security settings, freeze status, identity verification
summary, and owner lifecycle state.

### `/contacts`

Trusted contact CRUD, invitations, communication channels, contact status, and
relationship metadata.

### `/authorizations`

Role grants, item-scoped permissions, document-scoped permissions, release
windows, consent acknowledgements, and revocation.

### `/items`

Trust item templates, user-created items, categories, risk levels, execution
mode, required materials, and assignment.

### `/vault`

Vault document metadata, upload intent, release rules, access checks, download
records, retention, and deletion requests.

### `/trigger-policy`

Confirmation cadence, missed-check thresholds, escalation order, pause/resume,
and simulation settings.

### `/trigger-incidents`

High-risk incident timeline, state transitions, contact verification, evidence,
review status, freeze, and appeal.

### `/notifications`

Template previews, delivery preferences, delivery attempts, receipts, retries,
and channel status.

### `/execution-tasks`

Tasks routed to automation, official guidance, executor work, partner work
orders, blocked reasons, and completion records.

### `/review`

Reviewer queues, evidence review, irreversible-action gates, reviewer decisions,
manual overrides, and case notes.

### `/audit`

Owner-visible export logs, reviewer-visible audit trails, sensitive access logs,
and compliance event queries.

### `/skins`

Skin catalog, bundled skin metadata, compatibility checks, package download
metadata, and client feature-version negotiation.

## Surface-Specific Contracts

### Mobile

Mobile APIs should optimize for owner tasks: setup, daily status, safe
confirmation, item editing, trigger settings, and vault preparation.

### Admin

Admin APIs should optimize for reviewer workflows: queues, risk flags,
evidence, irreversible gates, freezes, appeals, and operational notes.

Admin response shapes can differ from mobile response shapes because reviewer
permissions and workflow context are different.

### Contact Portal

Contact portal APIs should optimize for clarity: identity confirmation, role
explanation, authorized tasks, released documents, and "next action" guidance.

Contact responses should expose only authorized materials for the current state.

## Contract Rules

- Request and response schemas belong in `packages/api-contracts` in the future
  monorepo.
- Domain state machines belong in `packages/domain`.
- API handlers enforce permissions before returning sensitive data.
- Sensitive reads create audit events.
- BFF layers can shape responses per surface, but they must use the same domain
  rules.
