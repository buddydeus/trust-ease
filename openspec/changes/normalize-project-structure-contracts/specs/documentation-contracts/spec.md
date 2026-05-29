# Documentation Contracts Specification

## ADDED Requirements

### Requirement: Root documentation reflects current command behavior

Root documentation SHALL describe screenshot and preview commands according to
`package.json`.

#### Scenario: Design preview command is documented

- **WHEN** root documentation describes `pnpm design`
- **THEN** it SHALL state that the command runs
  `scripts/render_current_app_screens.py`
- **AND** it SHALL state that the output is a generated design preview, not a
  runtime screenshot

#### Scenario: Runtime thumbnail command is documented

- **WHEN** root documentation describes `pnpm thumbs`
- **THEN** it SHALL state that the command runs
  `scripts/capture_runtime_thumbs.js`
- **AND** it SHALL state that the command captures real Expo Web runtime output
  through Playwright
- **AND** it SHALL NOT describe `pnpm thumbs` as using
  `scripts/render_current_app_screens.py`

### Requirement: AI workspace files remain read-only for this change

This refactor SHALL NOT modify `.ai/` files.

#### Scenario: Implementation updates documentation

- **WHEN** documentation is updated during this change
- **THEN** root-level or other human-facing docs MAY be updated
- **AND** `.ai/` files SHALL remain unchanged

#### Scenario: Historical planning material conflicts with code

- **WHEN** `.ai/archive/` or stale `.ai/` content conflicts with current code or
  `package.json`
- **THEN** implementation SHALL treat current code and `package.json` as the
  source of truth
- **AND** it SHALL NOT edit `.ai/` to resolve the conflict

### Requirement: Locale and skin documentation remains aligned

Root documentation SHALL preserve the current locale and skin runtime contracts.

#### Scenario: Locale set is documented

- **WHEN** documentation mentions supported locales
- **THEN** it SHALL list `zh-CN`, `zh-TW`, and `en-US`
- **AND** it SHALL NOT reintroduce a bare `en` locale

#### Scenario: Skin storage role is documented

- **WHEN** documentation mentions `skins/`
- **THEN** it SHALL describe project-root `skins/` as build-time bundled skin
  input
- **AND** it SHALL NOT describe project-root `skins/` as mobile runtime writable
  storage
