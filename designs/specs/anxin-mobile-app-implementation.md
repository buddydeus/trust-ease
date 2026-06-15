# Implementation Handoff — 安心移动端 App

**Spec SSOT:** `designs/specs/anxin-mobile-app.md`

## Route And Module Mapping

| Route | Module | Notes |
| --- | --- | --- |
| `/welcome` | onboarding | Brand welcome with flat sealed-plan visual and `开始设置`. |
| `/onboarding` | onboarding | 3-4 cards explaining plan, notification, vault release, anti-misfire boundary. |
| `/home` | home | Active flat status layer, next confirmation, progress, quick vault/rehearsal entries. |
| `/plans` | plans | Plan list. The plan is the top-level object, not a flat matter list. |
| `/plans/new` | plans | Question-led first plan wizard with template recommendation. |
| `/plans/:id` | plans | Flat plan detail: matters, files, helpers, trigger rules, actions. |
| `/plans/:id/matters/new` | matters | Template selection and execution mode explanation. |
| `/vault` | vault | File list, permission chips, release conditions. |
| `/trigger-rules` | trigger | Confirmation cycle, missed confirmation threshold, pause protection, rehearsal. |
| `/execution` | execution | Empty safe state, rehearsal timeline, triggered execution records. |
| `/assist/:code` | assist | Limited helper view entered by assist code; no full account model. |
| `/me` | account | Identity, 2FA, country/region, notification preferences, legal/privacy. |

## Component Priorities

1. `AppShell`: safe-area container, bottom tab bar, screen title region.
2. `StatusPacketCard`: signature flat sealed-plan layer with status label, next confirmation, readiness score.
3. `SealTimeline`: trigger/rehearsal states with text labels and non-color-only indicators.
4. `PlanCard`: plan title, scope summary, active trigger rule, helper count, readiness.
5. `ReadinessChecklist`: matters, files, helpers, trigger rule, rehearsal.
6. `VaultFileRow`: file type, permission, release condition, update time.
7. `RiskNotice`: cause, boundary, recovery path, and optional pause action.
8. `AssistCodePanel`: code entry, limited permission explanation, help affordance.

## Visual Execution Notes

- Keep the flat dossier treatment only on plan/status surfaces; forms and settings should remain flat and highly readable.
- Use checked-in flat PNG decor assets for the folder/envelope surfaces when closer mockup restoration is needed; keep all user-facing text, state, and actions as native UI layers.
- Use one soft UI shadow maximum. Do not use realistic book/envelope photos, wax seals, rope bindings, heavy paper texture, or dual-shadow neumorphism.
- Use `sealAmber` for review/cold-period states, not as a generic decorative accent.
- Use `riskBrick` only for irreversible or formal execution warnings.
- For Chinese text, prefer system CJK fonts in implementation if custom font loading would slow prototype work.

## Required States

Every core screen should include at least:

- Default state
- Empty state
- Loading state
- Error/recovery state
- Paused/protected state where relevant

## Accessibility Must-Haves

- Touch targets >= 44pt.
- Visible focus states for web/debug builds and correct accessibility labels in native.
- Form fields use visible labels and helper text.
- Status and risk labels include text and icon, never color alone.
- Reduced motion path for flat layer lift and timeline expansion.
