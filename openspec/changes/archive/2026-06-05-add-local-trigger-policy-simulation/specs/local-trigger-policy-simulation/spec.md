# Local Trigger Policy Simulation Specification

## ADDED Requirements

### Requirement: Trigger policy is shown from local trust data

The app SHALL render the local trigger policy from the versioned local trust
snapshot without requiring backend, sync, push notification, contacts
permission, or network requests.

#### Scenario: Local trigger policy is displayed

- **WHEN** the local trust snapshot contains a trigger policy
- **THEN** the trigger-state surface SHALL display the check-in interval
- **AND** it SHALL display the missed check-in threshold
- **AND** it SHALL display whether missing-state semantics are enabled or paused
- **AND** it SHALL NOT require a backend or network request

#### Scenario: Missing local trust storage uses the default policy

- **WHEN** local trust storage is empty or safely falls back to the default
  snapshot
- **THEN** the trigger-state surface SHALL render the default trigger policy
- **AND** it SHALL remain usable without crashing

### Requirement: Trigger policy can be updated locally

The app SHALL let the user update local trigger policy settings and persist
valid changes into `ITrustDataSnapshot.triggerPolicy`.

#### Scenario: Valid trigger policy update is persisted

- **WHEN** the user updates a valid check-in interval or missed check-in
  threshold
- **AND** the app saves the update
- **THEN** the local trust snapshot SHALL persist the updated trigger policy
- **AND** `triggerPolicy.updatedAt` SHALL be refreshed
- **AND** the snapshot `updatedAt` SHALL be refreshed
- **AND** unrelated items and helpers SHALL be preserved

#### Scenario: Invalid trigger policy numbers fail safely

- **WHEN** a trigger policy update contains a non-positive, infinite, NaN, or
  otherwise invalid interval or threshold
- **THEN** the app SHALL return or show a validation failure
- **AND** the existing local trust snapshot SHALL remain usable

### Requirement: Missing-state semantics can be paused and resumed

The app SHALL let the user pause and resume local missing-state semantics
without deleting local trust data.

#### Scenario: User pauses missing-state semantics

- **WHEN** the user pauses missing-state semantics
- **THEN** `triggerPolicy.missingStateEnabled` SHALL become false
- **AND** local items, helpers, and reporting records SHALL remain unchanged
- **AND** the UI SHALL explain that the app is paused locally

#### Scenario: User resumes missing-state semantics

- **WHEN** the user resumes missing-state semantics
- **THEN** `triggerPolicy.missingStateEnabled` SHALL become true
- **AND** the UI SHALL explain the current check-in interval and threshold
- **AND** the UI SHALL NOT imply automatic execution

### Requirement: Local rehearsal can be run without real delivery

The app SHALL provide local trigger rehearsal or simulation behavior that does
not send real messages or perform external actions.

#### Scenario: User starts local rehearsal

- **WHEN** the user starts a trigger rehearsal
- **THEN** `triggerPolicy.simulationEnabled` SHALL become true or the route
  SHALL otherwise enter a local simulation view
- **AND** the UI SHALL clearly label the result as a rehearsal or local preview
- **AND** no helper SHALL be contacted
- **AND** no SMS, email, push notification, network request, or legal action
  SHALL occur

#### Scenario: User resets local rehearsal

- **WHEN** the user resets a rehearsal
- **THEN** the rehearsal state SHALL return to a calm non-simulated view
- **AND** local items, helpers, and reporting records SHALL remain unchanged

### Requirement: Simulation status is derived deterministically

The app SHALL derive local trigger simulation status from policy fields and an
injected clock or equivalent testable input.

#### Scenario: Paused status is derived

- **WHEN** missing-state semantics are disabled
- **THEN** the derived status SHALL be paused or calm
- **AND** the next action SHALL be to resume or review settings

#### Scenario: Normal status is derived

- **WHEN** missing-state semantics are enabled
- **AND** the simulated missed check-in count is below the warning range
- **THEN** the derived status SHALL be normal
- **AND** the next action SHALL be calm and reversible

#### Scenario: Warning status is derived

- **WHEN** missing-state semantics are enabled
- **AND** the simulated missed check-in count is approaching the configured
  threshold
- **THEN** the derived status SHALL be warning
- **AND** the UI SHALL explain that this is not execution

#### Scenario: Waiting-confirmation status is derived

- **WHEN** a rehearsal reaches a state that would require user confirmation
  before any future escalation
- **THEN** the derived status SHALL be waiting-confirmation
- **AND** the next action SHALL ask the user to confirm, pause, or reset

#### Scenario: Simulated-review status is derived

- **WHEN** a rehearsal reaches the configured missed check-in threshold
- **THEN** the derived status SHALL be simulated-review
- **AND** the UI SHALL label the state as local review or rehearsal
- **AND** it SHALL NOT present the threshold as death, legal execution, or
  automatic delivery

### Requirement: Trigger-state copy remains safe and localized

The trigger-state workflow SHALL use calm, reversible, localized copy for all
new labels, actions, states, and warnings.

#### Scenario: Existing direct death wording is removed

- **WHEN** trigger-state copy is rendered
- **THEN** it SHALL NOT display copy equivalent to "death = 3 missed check-ins"
- **AND** it SHALL use softer trigger policy language such as local rehearsal,
  missing-state warning, or next step

#### Scenario: New trigger-state copy is localized

- **WHEN** trigger policy simulation adds user-visible labels, actions, states,
  warnings, validation messages, or explanatory text
- **THEN** each copy key SHALL exist in `zh-CN`, `zh-TW`, and `en-US`

### Requirement: Trigger policy simulation remains local-only

The trigger policy simulation SHALL support the standalone MVP without adding
networked product behavior or legal execution behavior.

#### Scenario: No backend dependency is introduced

- **WHEN** trigger policy simulation is implemented
- **THEN** it SHALL NOT add backend account, sync, push notification, or API
  dependencies

#### Scenario: No real helper notification is introduced

- **WHEN** trigger policy simulation is implemented
- **THEN** it SHALL NOT send SMS, email, push notification, phone call, or any
  other real message to helpers

#### Scenario: No address-book permission is introduced

- **WHEN** trigger policy simulation is implemented
- **THEN** it SHALL NOT request device contacts permission
- **AND** it SHALL NOT read the device address book

#### Scenario: No legal execution is implied

- **WHEN** trigger policy UI explains simulated trigger states
- **THEN** the copy SHALL make clear that the app is showing a local rehearsal
  or status preview
- **AND** it SHALL NOT imply legal authority, notarization, court action,
  automatic inheritance workflow, or third-party account control
