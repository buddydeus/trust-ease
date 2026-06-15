# Implementation Handoff - Anxin Simple Daily Redesign

**Spec SSOT:** `designs/specs/anxin-simple-daily-redesign.md`
**Scope:** Design handoff only until the user chooses Option 1.

## Proposed Screens

1. `daily-report-status`
   - Shown on the first app entry of each local calendar day when today's declaration record is missing.
   - No bottom navigation in the blocking state.
   - Primary action writes the same kind of formal declaration record as the current report page.
   - Secondary action may enter the normal app, but home should retain a visible `今日未申报` banner until completed.

2. `home`
   - Keep a compact daily status banner at the top.
   - Show only readiness summary and the next useful action.
   - Avoid multiple simultaneous risk prompts.

3. `items`
   - Keep list-first structure.
   - Use a circular `+` action in the header.
   - No multiselect controls.

## State Rules

- Determine `today` by local calendar day.
- If a report-equivalent record exists for `today`, daily status is `已申报`.
- If no report-equivalent record exists for `today`, daily status is `待申报`.
- `我今天平安` creates a real report-equivalent declaration with the click timestamp.
- The daily status page must not imply that missing one check-in causes execution.
- The welcome flow's first report-equivalent record counts for the same day.

## Component Candidates

- `DailyReportStatusScreen`
- `DailyStatusStrip`
- `DailyStatusBanner`
- `ReportTimestampMeta`
- `PrimaryActionButton`
- `SecondaryTextButton`
- `ReadinessSummary`
- `ItemListRow`

## Copy Keys To Add Or Reuse

- `dailyReport.status.pending`
- `dailyReport.status.completed`
- `dailyReport.title`
- `dailyReport.description`
- `dailyReport.lastReport`
- `dailyReport.waiting`
- `dailyReport.primaryAction`
- `dailyReport.secondaryAction`
- `home.dailyStatus.pending`
- `home.dailyStatus.completed`

Update all supported locales: `zh-CN`, `zh-TW`, `en-US`.

## Accessibility And Touch

- Minimum touch target: 44 x 44 px.
- Primary and secondary actions need visible pressed states.
- Status colors must always be paired with text labels.
- Do not rely on the small status dot alone.
- Keep one focus job per screen: daily confirmation, home next action, or item list.

## Verification After Implementation

- `pnpm check:type`
- `pnpm check:local` if copy changes
- Targeted Jest tests for daily local-day gating and report-equivalent writes
- `pnpm check:qa:runtime` before visual delivery
