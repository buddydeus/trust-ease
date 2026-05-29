# Threat Model

This threat model focuses on product-specific risks. It should be refined into
formal security review artifacts before production.

## Critical Risks

### False Trigger

The system incorrectly escalates a user into high-risk execution.

Controls:

- one missed check cannot trigger irreversible execution;
- pre-alert state before contact escalation;
- multi-channel owner confirmation attempts;
- trusted contact verification;
- pending-review state before formal execution;
- simulation mode separate from production execution;
- freeze and appeal paths.

### Unauthorized Contact Access

A contact or executor sees more than the owner authorized.

Controls:

- authorization grants scoped by role, item, document, and release state;
- contact portal responses filtered by current authorization;
- audit events for sensitive reads;
- tests for cross-contact access boundaries.

### Reviewer Overreach

A reviewer accesses or changes cases outside their role.

Controls:

- reviewer queue scoping;
- reviewer role permissions;
- audit events for evidence reads and decisions;
- escalation rules for overrides.

### Vault Material Leakage

Restricted documents are exposed before eligibility or approval.

Controls:

- encrypted file storage;
- release lifecycle: `sealed -> eligible-for-review -> approved-for-release -> released`;
- short-lived download URLs or equivalent access controls;
- audit on release and download;
- revoke path where legally and technically possible.

### Partner Data Overexposure

A partner receives more context than needed for a manual task.

Controls:

- partner work orders contain minimum task context;
- partner access is case-scoped;
- no bulk owner profile or vault access;
- audit and reviewer assignment.

### Notification Misdelivery

Sensitive content is sent to a wrong or stale channel.

Controls:

- channel verification;
- message templates that avoid exposing sensitive details before authentication;
- delivery receipts and retry tracking;
- escalation content separated from release content.

## Trigger Safety Model

Trigger escalation should follow this shape:

```text
normal
  -> missed-check
  -> pre-alert
  -> contact-verification
  -> pending-review
  -> approved-execution
  -> executing
```

High-risk states can exit to:

```text
paused | frozen | appealed
```

Irreversible actions must not run directly from `missed-check`,
`pre-alert`, or `contact-verification`.

## Freeze Path

Freeze must stop sensitive release or execution while preserving evidence.

Freeze can be triggered by:

- owner action;
- reviewer action;
- suspected abuse;
- disputed contact verification;
- identity or evidence conflict;
- platform incident.

Freeze events must be audited and visible to authorized reviewers.

## Appeal Path

Appeal exists for disputed high-risk states.

Appeal should capture:

- appellant identity and role;
- affected trigger incident or execution task;
- reason and supporting materials;
- reviewer assignment;
- decision and timestamp;
- audit trail.

Execution should pause or remain frozen while an appeal is unresolved when the
appeal concerns irreversible release or execution.

## Testing Expectations

Security regression tests should cover:

- contact A cannot access contact B material;
- executor cannot access unrelated vault documents;
- reviewer cannot access unassigned cases without permission;
- single missed check cannot formalize execution;
- vault release requires eligible state and approval;
- sensitive reads create audit events.
