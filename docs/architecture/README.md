# Architecture

This directory describes how the current Expo prototype grows into a monorepo
product system.

The current repository is still a single mobile app prototype. The target
architecture is a TypeScript-first monorepo with separate apps, services,
shared packages, infrastructure definitions, and documentation.

## Current Implementation Truth

The active implementation currently uses:

- `src/app/` for Expo Router route wrappers.
- `src/pages/` for screen-level UI.
- `src/store/` for global state and runtime helpers.
- `src/skin/` for controlled skin manifests and runtime logic.
- `src/locals/` and `src/i18n/` for `zh-CN`, `zh-TW`, and `en-US` support.
- `scripts/render_current_app_screens.py` for design previews.
- `scripts/capture_runtime_thumbs.js` for runtime screenshots.

Future monorepo migration must preserve this behavior before moving files.

## Target Boundaries

- `apps/`: user-facing applications.
- `services/`: server runtimes and async workers.
- `packages/`: shared domain, API, config, UI, i18n, and testing contracts.
- `infra/`: local and deployment infrastructure.
- `docs/`: product, architecture, security, and operations documentation.

## Technical Domains

The product is split into ten technical domains:

- Identity & Account
- Contact & Authorization
- Trust Item Catalog
- Secure Vault
- Trigger Engine
- Notification Orchestration
- Execution Routing
- Review & Risk Control
- Audit & Compliance
- Skin & Client Experience

Each domain owns its write model. Shared packages define contracts, not
service-specific business logic.

## Related Documents

- [Monorepo Plan](./monorepo.md)
- [Product Domains](./product-domains.md)
- [API Boundaries](./api-boundaries.md)
