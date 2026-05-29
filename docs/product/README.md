# Product Plan

Trust Ease is the working prototype name for the `安心` product: a living
authorization and trusted-handoff platform for important personal matters. It
helps a user prepare contacts, instructions, documents, trigger rules, and
execution routes before high-risk events such as prolonged loss of contact,
severe incapacity, or death.

The product is not a password vault that takes over third-party accounts. It is
an authorization orchestration platform, trigger-decision system, and execution
routing layer.

## Positioning

- Brand direction: `安心`
- External message: `安心托付，提前交代，事后有序`
- Preferred product language: `意外预案`, `失联托付`, `授权执行`,
  `重要事项交代`
- Experience tone: gentle, credible, restrained, clear, orderly, reversible

Avoid language and visuals that feel funerary, fear-driven, sales-heavy, or
coldly bureaucratic. The product must make users feel in control before it asks
them to configure sensitive rules.

## Product Non-Goals

- Does not replace wills, notarization, lawyers, or legal advice.
- Does not use plaintext third-party password custody as the core solution.
- Does not promise to take over every third-party account.
- Does not promise to transfer all assets.
- Does not directly perform actions that legally require court documents,
  notarized documents, statutory identity checks, or human review.

## Roles

- `Owner`: configures contacts, items, documents, trigger rules, and pauses.
- `TrustedContact`: receives alerts and helps verify the owner's status.
- `Executor`: sees authorized tasks and progresses assigned execution work.
- `Partner`: processes assigned manual work orders only.
- `Reviewer`: handles platform risk review, evidence review, freezes, and
  exceptions.

## Core Product Capabilities

- Account and identity verification.
- Trusted contacts and authorization grants.
- Trust item catalog for online and offline matters.
- Secure vault for evidence, documents, and release packages.
- Trigger engine for missed checks, pre-alerts, contact verification, review,
  and execution state.
- Notification orchestration across configured channels.
- Execution routing for API automation, official process guidance, and manual
  assistance.
- Review and risk control for high-risk transitions.
- Immutable audit and compliance records.
- Mobile client experience with i18n and controlled skin runtime.

## Primary User Flows

### First Configuration

```text
welcome -> value explanation -> first contact -> first trust item
  -> first document -> confirmation cycle -> active plan
```

The first configuration should stay short, allow non-critical steps to be
skipped, and give the user a clear early milestone.

### Daily Maintenance

```text
home status -> update contacts/items -> report safe -> next reminder
```

The home screen must explain whether the current plan is safe and what action,
if any, is next.

### High-Risk Review

```text
status card -> trigger rules -> pre-alert strategy -> simulation
```

The user should see that the system is controllable, pausable, and not triggered
by a single missed signal.

### Trigger Execution

```text
normal -> missed-check -> pre-alert -> contact-verification
  -> pending-review -> approved-execution -> executing -> completed
```

High-risk states must support pause, freeze, and appeal paths.

## MVP Boundary

MVP should focus on configuring and safely explaining the plan:

- mobile onboarding and dashboard;
- contacts and trust items;
- trigger policy and simulation;
- secure vault metadata and controlled release planning;
- manual-review gates for any irreversible action;
- audit trail shape and event recording plan.

Complex partner marketplaces, fully automated third-party account takeover, and
deep analytics should remain out of MVP.
