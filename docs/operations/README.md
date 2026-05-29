# Operations

This directory captures how the product should be delivered and operated after
the planning phase.

The operating model should be incremental. The current mobile prototype should
not become a full backend, admin console, secure vault, trigger engine, and
partner workflow all in one leap. Each major area should become its own
OpenFlow change with a focused spec and build.

## Delivery Shape

1. Planning and contracts.
2. Monorepo foundation.
3. Backend skeleton.
4. Core product MVP.
5. Trigger and review workflows.
6. Production hardening.

## Operational Baseline

- Layered tests across packages, services, clients, workers, security, and E2E.
- Structured logs, metrics, traces, and alerts.
- Backup, restore, retention, and disaster-recovery procedures.
- Migration and rollback strategy.
- Feature flags and environment separation.
- Runbooks for high-risk incidents, freezes, review escalations, and release
  failures.

## Documents

- [Delivery Roadmap](./delivery-roadmap.md)
- [Testing Strategy](./testing-strategy.md)
