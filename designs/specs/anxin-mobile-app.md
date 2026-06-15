# Design Brief — 安心移动端 App

**Slug:** anxin-mobile-app
**User brief (verbatim summary):** 根据项目规划、项目模块进行 UI 设计
**Stack:** React Native + Expo, TypeScript, iOS first with Android support
**Iteration:** 2026-06-14T22:40:39+0800

## Source Context

- `PRD_身后事务托管App.md`: 产品是生前授权的数字遗产与事务托管平台，核心不是代管密码，而是授权编排、触发判断、执行路由。
- `UXUI_安心_阶段1_体验策略与信息架构.md`: 界面应温和、可信、克制、清晰、有秩序、可撤回，避免殡葬感、保险推销感、纯后台工具感。
- `todo.md`: 当前正式方向是只考虑 App，计划采用 React Native + Expo；顶层结构收敛为 `首页 / 预案 / 执行 / 我的`；主心智是 `预案`，不是模块工具。

## § Base System (Step 1 — ui-ux-pro-max)

| Dimension | Content |
| --- | --- |
| Product / industry | Sensitive mobile app combining digital legacy planning, personal emergency preparation, family trust, legal/healthcare-adjacent consent, and execution workflow. Closest source patterns: healthcare app, legal services, insurance platform, senior care, accessible consumer app. |
| Page structure | Mobile-first app shell with four tabs: 首页, 预案, 执行, 我的. First-use flow: 欢迎 -> 价值理解 -> 创建首个预案 -> 添加事项/文件/协助人 -> 设置确认周期 -> 生效。Daily flow: status check, plan maintenance, survival confirmation, next reminder. |
| Color tokens | Base recommendation from ui-ux-pro-max: calm cyan and health green (`#0891B2`, `#059669`, `#ECFEFF`, `#164E63`) with destructive `#DC2626`. Product docs add soft deep teal, warm gray-white, amber warning, and deep red for high-risk states. |
| Typography | Base recommendation: highly readable sans for mobile accessibility. Candidate pairings: Lexend + Source Sans 3, Figtree + Noto Sans, Plus Jakarta Sans. Chinese UI requires a CJK-first stack with strong legibility. |
| Interaction | Mobile-first, safe-area aware, clear pressed feedback, no hover-only behaviors, visible labels, loading/success/error feedback, predictable back behavior, skeletons for waits >300ms, haptics only for confirmations and important actions. |
| Anti-patterns (avoid) | No bright neon, no AI purple/pink gradients, no motion-heavy screens, no emoji structural icons, no single signal implying final execution, no pure neumorphism with low contrast, no death/funeral mood, no insurance sales visual language. |

### Base System Notes

The ui-ux-pro-max `--design-system` output suggested an App Store style landing pattern and Neumorphism. For this project those are only partial inputs:

- The product is not a download landing page; it needs an in-app prototype direction.
- Pure neumorphism risks low contrast and ambiguous depth in high-risk forms.
- Soft UI Evolution and Accessible & Ethical are better foundations: tactile, calm, but still readable and auditable.

## § Revised Direction (Step 2 — frontend-design)

1. **Subject grounding** — The concrete subject is `安心`, an iOS-first mobile app for creating executable emergency/失联/托付预案. The primary audience is a low-frequency, emotionally cautious personal user who needs to leave clear instructions without feeling pushed into a morbid or legal-heavy tool. The single page job for this design round is to define the app shell and core MVP screens so a user can understand status, create a plan, and trust the trigger boundary.

2. **Memory point (signature)** — `平面封存层片 + 封签时间线`: plans are represented as flat, component-friendly dossier/envelope layers with a visible seal band. The band becomes a progress and trigger timeline device: draft, ready, watching, review, execution. It is not decoration; it encodes whether a plan is reversible, paused, watching, or released.

3. **Aesthetic risk** — Use a flattened dossier language inside a modern app: abstract file tabs, seal strips, release stamps, and layered packet silhouettes. This is a risk because dossier metaphors can become nostalgic or skeuomorphic, so the execution must stay flat and UI-native: no realistic book, envelope photo, wax seal, rope, leather, paper grain, or hard-to-cut image edge. The metaphor fits the subject because the product turns scattered personal obligations into an ordered, authorized handoff packet.

4. **Detemplating changes** — Revised away from generic healthcare cyan cards and pure neumorphism. The palette now combines trust teal, ink blue, mist surfaces, seal amber, and risk brick red. Typography uses a Chinese-readable system with a restrained serif display only for the brand/seal moments, not full editorial pages. Layout is plan-first, not module-first: `预案` is the object that owns matters, files, helpers, trigger rules, and actions.

5. **Rejected defaults** — Avoided warm cream + terracotta serif landing style, near-black + acid accent security style, and broadsheet hairline columns. Also rejected app-store screenshot landing and bright healthcare dashboard defaults.

### Detemplating Q&A

| Question | Answer |
| --- | --- |
| What is the one concrete subject and audience? | A mobile app named `安心` for ordinary people who need an executable emergency/失联托付预案 without specialist knowledge. |
| What is this page's single job? | Establish the app UI direction and first prototype surface for plan status, plan creation, execution state, and calm risk explanation. |
| Do palette, type, and layout pull from the subject's world? | Yes: flat dossier layers, file tabs, release bands, audit stamps, confirmation timelines, and calm medical/legal trust colors. |
| Is the hero/opening a thesis, not a template? | Yes. The opening visual should show a flat sealed plan layer becoming active, not a big SaaS metric or generic gradient hero. |
| If using a stat or gradient, why? | Avoid stats as hero. Use progress only as product state, such as `预案已生效 3/5`, because completion status is the user's core reassurance. |
| Would the typography appear on any random SaaS app? | The body system could, but the restrained Chinese serif/seal utility treatment makes brand moments specific to `安心`. |
| Is type a personality choice? | Yes: calm CJK sans for instructions, serif display for the `安心` mark and seal labels, tabular mono for dates, confirmation counts, and assist codes. |
| Do numbered markers encode real sequence? | Use numbers only for onboarding steps, trigger thresholds, and rehearsal timeline. Do not use `01/02/03` as decoration. |
| Do dividers/labels encode information? | Yes: flat file tabs denote category; seal bands denote release/trigger state; color labels always pair with text and icon. |
| What is the memory point? | The flat sealed plan layer with a release band that doubles as readiness and trigger timeline. |
| Where is the aesthetic risk? | Dossier language inside a polished mobile app without relying on realistic asset imagery. The risk is concentrated in plan/status surfaces. |
| Is boldness concentrated? | Yes. Most UI remains quiet, readable, and token-driven; only plan cards/status timelines carry the signature treatment. |
| Are copy names user-facing? | Yes. Use words such as `预案`, `协助人`, `确认周期`, `暂停保护`, `模拟演练`, not internal terms such as trigger-service or connector. |
| Do failures explain cause and fix? | Yes. Error states state what happened and next action, e.g. `短信未送达，请检查号码或改用邮件确认。` |

## Final Token Table

| Token | Hex / Value | Role | Usage |
| --- | --- | --- | --- |
| `color.background` | `#F3F8F7` | Mist background | App background, low-pressure canvas, avoids funeral black and sales white. |
| `color.surface` | `#FFFEFA` | Light surface | Primary cards and flat plan layers; slight warmth without becoming beige-dominant. |
| `color.surfaceMuted` | `#E7EFEC` | Muted panel | Secondary cards, file rows, disabled sections. |
| `color.primary` | `#0A6B63` | Trust teal | Primary CTA, active tab, positive status, status card header. |
| `color.primaryDeep` | `#174842` | Deep trust | Large text on mist/paper surfaces, status title, nav active text. |
| `color.ink` | `#1B2D3A` | Ink text | Body text, app chrome, high-contrast labels. |
| `color.mutedText` | `#607078` | Muted text | Descriptions and helper text. Must not be used below 14pt without contrast check. |
| `color.sealAmber` | `#B7791F` | Seal / warning | Seal band, review state, cold-period notices. |
| `color.safeGreen` | `#2F8A67` | Safe confirmation | Success status and completed checks. |
| `color.riskBrick` | `#8A2D2A` | High-risk | Irreversible actions, formal execution state, destructive warnings. |
| `color.border` | `#C9DAD5` | Soft border | Cards, input boundaries, separators. |
| `radius.card` | `24` | Card radius | Large mobile cards; flat plan layers may use 20-24 radius. |
| `radius.control` | `16` | Control radius | Buttons, inputs, chips. |
| `space.grid` | `4 / 8 pt` | Spacing | Use 8pt vertical rhythm; 16/24/32 section tiers. |
| `shadow.packet` | `0 8 18 rgba(27,45,58,0.08)` | Soft layer depth | One restrained UI shadow only; no realistic object shadow, low-contrast neumorphism, or photo cutout edge. |

## Typography

| Role | Typeface | Usage |
| --- | --- | --- |
| Display / brand | `Noto Serif SC` Semibold or platform serif fallback | Brand welcome, seal labels, packet title moments only. Avoid long paragraphs. |
| UI / body | `Noto Sans SC`, `PingFang SC`, `Source Han Sans SC`, system sans | All app text, forms, settings, instructions. |
| Utility / data | `IBM Plex Mono` or `SF Mono` fallback | Confirmation dates, assist code, audit stamps, trigger counters. |

Type scale:

- Screen title: 28-32pt / 1.18, 700
- Section title: 20-22pt / 1.28, 650
- Card title: 17-18pt / 1.35, 600
- Body: 15-16pt / 1.55, 400
- Helper: 13-14pt / 1.45, 400
- Utility label: 11-12pt / 1.2, 500, uppercase only for codes/stamps

## Layout Concept

`安心` should feel like a calm plan workspace, not a dashboard cockpit: the home screen shows one flat sealed active plan layer, then the next confirmation and unfinished plan tasks, with execution kept visible but not alarming.

```text
Mobile shell

┌─────────────────────────────┐
│ 首页                         │
│ 你的托付预案保持正常          │
│ ┌─────────────────────────┐ │
│ │ [flat seal band] 当前正常 │ │
│ │ 下次确认 06.28          │ │
│ │ 预案已生效 3/5          │ │
│ └─────────────────────────┘ │
│ 快捷动作: 新建预案 / 保险箱   │
│ 待完善: 文件权限 / 协助人确认 │
│ 最近执行记录: 暂无触发        │
│ ─────────────────────────── │
│ 首页  预案  执行  我的        │
└─────────────────────────────┘
```

### Top-Level Navigation

| Tab | Job | Primary modules |
| --- | --- | --- |
| 首页 | State reassurance and next best action | active plan packet, next confirmation, completion, quick vault entry, rehearsal entry |
| 预案 | Create and manage complete plan units | plan list, plan wizard, matters, files, helpers, trigger rules, actions |
| 执行 | Triggered or rehearsal execution tracking | execution status, timeline, helper receipts, audit records, empty safe state |
| 我的 | Identity, safety, legal, and preferences | account, 2FA, country/region, confirmation settings, help, privacy/legal |

### Core Screens For First Prototype

1. Welcome / brand screen
2. Onboarding value explanation
3. First plan wizard
4. Home dashboard
5. Plan list
6. Plan detail
7. Matter template selection / new matter
8. Vault list and file permission
9. Trigger rule settings
10. Execution center
11. Assist-code limited view
12. My / security settings

## Copy Tone

- Register: calm, concrete, not sentimental, not salesy.
- Vocabulary: `预案`, `协助人`, `事项`, `文件释放`, `确认周期`, `暂停保护`, `模拟演练`, `执行记录`.
- Empty states: explain next action, e.g. `还没有预案。先创建一个 8 分钟内可生效的基础预案。`
- Risk states: always pair cause + boundary + recovery, e.g. `连续 2 次未确认后，只会进入预警，不会直接释放文件。`
- CTA consistency: `创建预案`, `完成确认`, `暂停保护`, `开始演练`, `查看执行记录`.

## Interaction And Accessibility Guardrails

- Every primary tap target is at least 44pt tall, with 8pt minimum gap.
- Icon-only controls require accessible labels; structural icons use Lucide-compatible vector language, not emoji.
- High-risk actions are separated from primary flow and require an explanation screen.
- Status is never conveyed by color alone: pair color with icon, text, and state label.
- Motion is sparse: flat plan layers lift in 180-220ms; trigger timeline expands step-by-step; risk screens avoid decorative movement.
- Support `prefers-reduced-motion` equivalent by disabling layer lift and timeline stagger.
- Forms use visible labels, helper text, and error text near the field.
- Safe-area padding is mandatory for top headers, tab bars, and bottom CTAs.

## § Preview Index

| Preview | Spec doc | Description |
| --- | --- | --- |
| `designs/previews/anxin-mobile-app-desktop.png` | `designs/images/anxin-mobile-app-desktop.md` | Desktop design board showing the app system across three phone frames: home, plan detail, execution timeline. |
| `designs/previews/anxin-mobile-app-mobile.png` | `designs/images/anxin-mobile-app-mobile.md` | Single mobile home dashboard preview focused on current status, plan readiness, next confirmation, and bottom navigation. |

## § Implementation Notes

- Primary CTA label: `创建预案`
- Secondary CTA label: `先了解怎么运作`
- First safe-state label: `当前正常`
- High-risk boundary line: `不会因单次未响应直接执行`
- Main components to build first: app shell, bottom tabs, status packet card, plan readiness checklist, next confirmation card, plan list card, trigger timeline, assist-code panel, vault file row.
- Explicit non-goals for this pass: no partner marketplace UI, no automation connector management, no legal document generation UI, no backend admin console, no custom script builder.
