# Security Baseline

Trust Ease operates in a high-sensitivity domain. The baseline below is required
before production use and should guide backend, client, worker, and admin
implementation.

## Product Boundaries

The product must keep these boundaries visible in design and engineering:

- Trust Ease is not a substitute for wills, notarization, lawyers, or legal
  advice.
- Trust Ease does not use plaintext third-party password custody as the core
  solution.
- Trust Ease does not promise to take over every third-party account.
- Trust Ease does not promise to transfer every asset.
- Trust Ease does not bypass legal identity, court, notarization, or document
  requirements.

## Data Classification

| Class | Examples | Baseline Control |
| --- | --- | --- |
| Public | marketing copy, app store text | normal review |
| Internal | templates, skin metadata, non-sensitive config | authenticated internal access |
| Confidential | contact details, item notes, notification history | least privilege, audit on sensitive reads |
| Restricted | identity verification, vault documents, release packages, review evidence | encryption, strict authorization, audit, review gates |

## Least Privilege

### Owner

Can create, edit, pause, resume, and close their own plan. Owner actions that
affect high-risk release behavior should be auditable.

### Trusted Contact

Can only see contact-specific invitations, role explanations, verification
requests, and materials released to that contact.

### Executor

Can only see assigned execution tasks and authorized released materials.

### Partner

Can only see assigned work orders and the minimum context needed to perform the
work.

### Reviewer

Can only see cases in their queue or permission scope. Sensitive evidence reads
must be audited.

### Service Role

Can only access data required for its runtime responsibility. Worker and
integration permissions should be scoped separately.

## Encryption

- Sensitive database fields should be encrypted at rest where provider-level
  encryption is not enough for the risk class.
- Vault file blobs must be encrypted at rest.
- Envelope encryption should be used or evaluated for vault materials when the
  storage provider is not the trust boundary.
- Encryption key usage should be auditable.
- Key rotation and recovery procedures must be documented before production.

## Audit

Immutable audit events are required for:

- sensitive data reads;
- sensitive data writes;
- authorization grant changes;
- vault release eligibility changes;
- reviewer approvals and rejections;
- file releases and downloads;
- account freezes and unfreezes;
- appeals and appeal decisions;
- execution task routing and completion;
- admin overrides.

Audit events should include actor, role, target, action, timestamp, request or
job correlation id, and reason where applicable.

## Review Gates

MVP should use manual review for irreversible or high-risk actions. Review gates
are required for:

- releasing restricted vault materials;
- moving trigger incidents into formal execution;
- overriding a freeze;
- rejecting an appeal;
- routing high-risk manual partner work.

## Privacy And Retention

- Collect only the data needed for the configured plan and execution path.
- Keep contacts scoped by authorization and release state.
- Define retention windows for vault files, identity evidence, review cases, and
  audit logs.
- Support deletion or closure workflows where legally and operationally
  permitted.
- Support legal hold markers when deletion must be suspended.
