# Add Remote Skin Download QA Entry

## Why

The skin runtime now has the core pieces needed for a controlled remote skin
download path:

- local package publishing and validation tooling;
- canonical package hash calculation;
- remote skin source adapter;
- downloader staging, validation, and ready promotion;
- app initialization fallback behavior;
- My/settings skin runtime status UI.

These pieces are individually tested, but there is not yet a single developer
or QA entry point that exercises the whole flow from a prepared remote-style
skin package into the app state surface.

Without that entry point, future remote skin work would remain hard to verify
end to end. Developers can validate a package and test adapter internals, but
cannot easily prove that a remote-style package can be prepared, staged,
validated, promoted, and reflected in status UI through one controlled workflow.

## What Changes

- Add an internal QA/dev entry point for remote skin download verification.
- Provide a controlled remote-style skin fixture or fixture generation path that
  uses the existing skin package publishing tool.
- Exercise the path from manifest URL or local test server URL through the
  remote source adapter.
- Reuse the existing downloader lifecycle for staging, validation, promotion,
  fallback, and package state updates.
- Ensure the My/settings skin runtime status surface can reflect the resulting
  package state.
- Add tests for successful ready promotion, validation failure, and recoverable
  failure display.
- Document how developers run the QA flow locally.

## Success Criteria

- A developer can run a documented QA command or test path that prepares a
  remote-style skin package fixture and verifies it through the remote adapter
  and downloader.
- A valid QA package can become `ready` through the existing downloader gates.
- A stale package hash or stale asset hash fails recoverably and does not
  replace the previous ready skin.
- The QA flow can surface ready/failed/incompatible states through the existing
  My/settings status model without page components importing downloader
  internals.
- The QA entry does not introduce a user-facing skin store, production remote
  index, marketplace, or arbitrary remote code execution.

## Scope

In scope:

- Internal QA/dev command, fixture, test harness, or route guarded as
  non-production if needed.
- Local fixture preparation using `pnpm skin:package`.
- Remote adapter and downloader integration tests around the QA flow.
- Documentation for running the QA flow locally.
- Status UI verification through existing props/store boundaries.

Out of scope:

- Public skin marketplace or skin store.
- Production remote skin index service.
- User-facing remote download settings UI.
- Remote JavaScript, React component execution, or plugin loading.
- Cryptographic signing or trust-chain policy beyond current hash validation.

## Existing Constraints

- Runtime downloads must still write only under Expo FileSystem
  `documentDirectory/skins/`.
- Project-root `skins/` remains a build-time bundled source or local fixture
  input, not mobile runtime storage.
- Remote packages remain data-only: manifest plus declared static assets.
- Package hashes must use the canonical package hash helper.
- The QA flow must keep route/page code thin and avoid importing downloader
  implementation details into UI components.
- New user-visible copy, if any, must be added in `zh-CN`, `zh-TW`, and
  `en-US`.
