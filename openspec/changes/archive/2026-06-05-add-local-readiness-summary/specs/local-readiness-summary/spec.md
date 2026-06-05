# Local Readiness Summary Specification

## ADDED Requirements

### Requirement: Readiness summary is derived from local trust data

The app SHALL derive a local readiness summary from the existing versioned local
trust snapshot without mutating persisted trust data.

#### Scenario: Empty snapshot derives missing preparation gaps

- **WHEN** the local trust snapshot contains no active trust items
- **AND** it contains no active trusted helpers
- **THEN** the readiness summary SHALL indicate that important items are not
  yet recorded
- **AND** it SHALL indicate that trusted helpers or contacts are not yet
  recorded
- **AND** it SHALL provide local next actions to create an item and create a
  helper

#### Scenario: Active records are counted

- **WHEN** the local trust snapshot contains active trust items and active
  trusted helpers
- **THEN** the readiness summary SHALL expose counts for active items
- **AND** it SHALL expose counts for active trusted helpers
- **AND** it SHALL NOT require a backend or network request

#### Scenario: Archived records are excluded from active readiness

- **WHEN** the local trust snapshot contains archived items or archived helpers
- **THEN** the readiness summary SHALL exclude archived items from active item
  readiness
- **AND** it SHALL exclude archived helpers from active helper readiness
- **AND** archived records SHALL remain preserved in the input snapshot

#### Scenario: Readiness derivation does not mutate the snapshot

- **WHEN** readiness is derived from a local trust snapshot
- **THEN** the input snapshot, item records, helper records, and trigger policy
  SHALL remain unchanged
- **AND** no snapshot `updatedAt` value SHALL be refreshed by readiness
  derivation

### Requirement: Item-helper coverage is summarized locally

The readiness summary SHALL explain whether active trust items have at least one
active trusted helper assigned.

#### Scenario: Items with active helper assignments are covered

- **WHEN** an active trust item references at least one active trusted helper id
- **THEN** the readiness summary SHALL count that item as covered
- **AND** it SHALL NOT require contacting the helper

#### Scenario: Items without helper assignments are uncovered

- **WHEN** an active trust item has no helper ids
- **THEN** the readiness summary SHALL count that item as uncovered
- **AND** it SHALL provide a local next action to review helper assignments

#### Scenario: Items with only archived helper assignments are uncovered

- **WHEN** an active trust item references only archived helper ids
- **THEN** the readiness summary SHALL count that item as uncovered
- **AND** it SHALL explain the gap without hard-deleting or rewriting the item

#### Scenario: Mixed assignment coverage is summarized

- **WHEN** the local trust snapshot contains both covered and uncovered active
  trust items
- **THEN** the readiness summary SHALL expose covered and uncovered item counts
- **AND** it SHALL prioritize a next action to review item-helper assignments

### Requirement: Trigger readiness is summarized as local rehearsal context

The readiness summary SHALL include trigger policy or rehearsal context using
local advisory language.

#### Scenario: Paused trigger policy appears as a reversible gap

- **WHEN** `triggerPolicy.missingStateEnabled` is false
- **THEN** the readiness summary SHALL indicate that missing-state semantics are
  paused locally
- **AND** it SHALL provide a next action to review or resume the trigger policy
- **AND** it SHALL NOT imply that external notifications are disabled because no
  external notifications exist in this MVP

#### Scenario: Missing rehearsal context appears as a review action

- **WHEN** trigger simulation or rehearsal context is not active or has not been
  reviewed
- **THEN** the readiness summary SHALL provide a calm next action to run or
  review a local rehearsal
- **AND** it SHALL explain that rehearsal is local and reversible

#### Scenario: Trigger summary does not create execution semantics

- **WHEN** trigger readiness is rendered
- **THEN** the UI SHALL NOT present missed check-ins as death, legal execution,
  or automatic helper delivery
- **AND** it SHALL describe the state as local policy, local rehearsal, warning,
  or next step

### Requirement: Readiness summary recommends existing local next actions

The app SHALL map readiness gaps to existing local workflows without creating
dead-end actions.

#### Scenario: Missing items recommend item creation

- **WHEN** readiness detects no active trust items
- **THEN** the primary next action SHALL navigate or point to the existing local
  create-item flow

#### Scenario: Missing helpers recommend helper creation

- **WHEN** readiness detects no active trusted helpers
- **THEN** the next action SHALL navigate or point to the existing local
  create-helper flow

#### Scenario: Uncovered items recommend assignment review

- **WHEN** readiness detects active trust items without active helper coverage
- **THEN** the next action SHALL navigate or point to an existing item edit or
  assignment review flow

#### Scenario: Trigger gaps recommend trigger rehearsal review

- **WHEN** readiness detects paused or not-reviewed trigger context
- **THEN** the next action SHALL navigate or point to the existing
  trigger-state flow

### Requirement: Readiness summary remains advisory and localized

The readiness summary SHALL use calm, reversible, localized copy for all labels,
states, explanations, and actions.

#### Scenario: Readiness is not shown as a legal or safety score

- **WHEN** the readiness summary is rendered
- **THEN** it SHALL NOT present readiness as a numeric score, grade, legal
  validity check, estate-planning completion claim, or safety guarantee
- **AND** it SHALL explain that the summary is local and advisory

#### Scenario: New readiness copy is localized

- **WHEN** readiness summary adds user-visible labels, states, explanations,
  actions, empty states, or warnings
- **THEN** each copy key SHALL exist in `zh-CN`, `zh-TW`, and `en-US`

#### Scenario: Readiness copy avoids external execution claims

- **WHEN** readiness summary explains gaps or next actions
- **THEN** it SHALL NOT imply backend sync, helper notification, legal
  authority, notarization, inheritance handling, or third-party account control

### Requirement: Readiness summary remains local-only

The readiness summary SHALL support the standalone MVP without adding networked
product behavior.

#### Scenario: No backend dependency is introduced

- **WHEN** readiness summary is implemented
- **THEN** it SHALL NOT add backend account, sync, push notification, or API
  dependencies

#### Scenario: No real helper notification is introduced

- **WHEN** readiness summary is implemented
- **THEN** it SHALL NOT send SMS, email, push notification, phone call, or any
  other real message to helpers

#### Scenario: No backup or export behavior is introduced

- **WHEN** readiness summary is implemented
- **THEN** it SHALL NOT add backup export/import, file sharing, or device
  transfer behavior

#### Scenario: No legal execution is implied

- **WHEN** readiness summary UI explains preparation state
- **THEN** the copy SHALL make clear that the app records and reviews a local
  plan
- **AND** it SHALL NOT imply legal authority, notarization, court action,
  automatic inheritance workflow, or third-party account control
