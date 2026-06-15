# Design Brief - Trust Ease Daily Quiet Check

**Slug:** anxin-simple-daily-redesign
**User brief (verbatim summary):** 上一版太复杂，简洁一点，并增加每天首次进入 APP 时的申报状态页面。
**Stack:** Expo Router, React Native 0.85, React 19, TypeScript, styled-components, NativeWind, Zustand, React Hook Form, Zod
**Iteration:** 2026-06-15T23:31:28+08:00

## Designer Progress

- [x] Step 0: Prerequisite check
  - [x] Confirm `ui-ux-pro-max` and `frontend-design` are installed
- [x] Step 1: Base design system
- [x] Step 2: De-templating critique
- [x] Step 3: Spec, previews and user gate
- [ ] Step 4: Implement UI prototype
- [ ] Step 5: Delivery pass

## Base System

| Dimension | Content |
| --- | --- |
| Product / industry | High-sensitivity mobile trust planning app. The immediate job is not legal execution, but a calm daily declaration and local planning preview. |
| Page structure | Daily first-entry status page, then a lighter home page, a simple items page, and compact bottom navigation for normal flow. |
| Color tokens | Use calm cyan and health green as a starting point, then pull back to the existing Anxin teal world. Avoid emergency red except true destructive states. |
| Typography | System sans for all app UI. Use monospaced digits only for dates and audit times. No serif display face in this simplified round. |
| Interaction | Primary action is a clear daily declaration. Pressable targets should feel tactile, with 44 px minimum hit area and visible pressed state. |
| Anti-patterns (avoid) | Avoid App Store landing composition, vibrant block grids, decorative dashboards, fear-driven alert pages, funeral palette, legal document theater, and cold security-console UI. |

## Revised Direction

1. **Subject grounding** - The concrete subject is daily peace-of-mind reporting for a person who has already entrusted important matters. The audience is the app owner first, with family and contacts as a secondary mental model. The single page job is: on the first app entry of the day, let the user confirm today's status without implying that execution has started.
2. **Memory point (signature)** - A quiet `今日申报条`: one horizontal status strip at the top of the daily page and a smaller version on the home page after completion. It is the one recognizable element across the flow.
3. **Aesthetic risk** - Remove most decorative layering from the previous direction. The page becomes almost plain, relying on spacing, calm copy, and the daily status strip rather than visual density. This fits the sensitive topic because the interface should lower pressure.
4. **Detemplating changes** - The ui-ux base suggested brighter healthcare cyan and block-based energy. This revision keeps the trust cue but returns to Anxin teal, reduces card count, uses system type only, and makes one page do one thing.
5. **Rejected defaults** - Rejected warm cream plus terracotta serif, dark security dashboard plus acid accent, broadsheet columns, sales landing hero, large statistics, fake legal seals, and decorative numbered steps.

### Token Table

| Token | Hex | Role |
| --- | --- | --- |
| Background | `#F6FAF8` | App background, soft enough for daily use |
| Surface | `#FFFFFF` | Main cards, list rows, primary panels |
| Soft Panel | `#EAF4F1` | Status strip, inactive tab, secondary surfaces |
| Primary | `#0A6B63` | Primary CTA, selected icon, trusted highlight |
| Confirm | `#2F8A67` | Completed declaration and safe state |
| Review | `#9A6A2D` | Reminder or needs-review state, used sparingly |
| Text | `#173B37` | Main text |
| Body | `#2F4541` | Body copy |
| Muted | `#667B76` | Metadata, secondary labels |
| Border | `#D8E7E2` | Dividers and quiet outlines |
| Risk | `#8A2D2A` | True destructive or high-risk warning only |

### Layout Concept

Daily entry uses a single calm checkpoint page. Normal home then shows the same state as a compact banner, not as another blocking flow.

```text
Daily first-entry page

安心                                 今日未申报

今天先确认一次
只记录你的今日状态，不会触发任何执行。

[ 今日状态 strip ]
上次申报  昨天 21:08
本次状态  等待确认

[ 我今天平安 ]
[ 先看预案 ]

可随时暂停或修改托付内容
```

### Copy Tone

| Area | Direction |
| --- | --- |
| Register | Calm household language, like a responsible check-in, not a compliance system. |
| Vocabulary | Prefer 安心、申报、确认、预案、托付、暂停、修改. Avoid 死亡后, 自动执行, 立即触发, 警报 unless explaining boundaries. |
| Empty states | Invite one small next action, for example `今天还没有申报，先确认一次即可。` |
| Error states | Explain cause and recovery, for example `本次记录未保存，请稍后重试。不会影响已保存的托付内容。` |

## Preview Index

| Preview | Spec doc | Description |
| --- | --- | --- |
| `designs/previews/anxin-simple-daily-redesign-desktop.png` | `designs/images/anxin-simple-daily-redesign-desktop.md` | Three-phone overview: daily status, simplified home, simplified items. |
| `designs/previews/anxin-simple-daily-redesign-mobile.png` | `designs/images/anxin-simple-daily-redesign-mobile.md` | Single-phone focus on the daily first-entry declaration status page. |

## Implementation Notes

- Primary CTA label: `我今天平安`
- Secondary action label: `先看预案`
- The daily status page must reuse the same declaration/report semantics as the existing `report` flow, not create a fake parallel state.
- First install day: if the welcome flow has already created a formal report-equivalent record, this page should enter completed state for the same local day instead of forcing a duplicate declaration.
- Components to build are detailed in `designs/specs/anxin-simple-daily-redesign-implementation.md`.
- Non-goals for this pass: no backend, no real push or SMS, no remote skin store, no irreversible execution flow.
