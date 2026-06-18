# 安心 App 个人安心小记全页面设计规格

## Header

- User brief: 确认现有页面结构，基于该结构重新设计 UI；要求简洁、轻量、便于用户操作，减少商业感觉，贴合个人普通用户。
- Stack: Expo Router / React Native / styled-components / TypeScript
- Slug: `anxin-personal-lite-redesign`
- Iteration date: 2026-06-18
- Status: Designer Step 3c 待用户确认
- Source: `designs/specs/anxin-functional-style-reset.md`

Designer Progress:

- [x] Step 0: Confirmed `ui-ux-pro-max` and `frontend-design` are installed
- [x] Step 1: Base design system
- [x] Step 2: De-templating critique
- [x] Step 3: Spec and full-page previews
- [ ] Step 4: Implement UI prototype
- [ ] Step 5: Delivery pass

## Base System

当前已确认页面结构：

- 启动分流：`index -> welcome / report / home`
- 主导航：`home / items / my`
- 二级页面：`items/new`、`items/[id]`、`helpers`、`helpers/new`、`helpers/[id]`、`my/trigger-state`

本版设计重点：

- 不做营销感首页。
- 不强调概念隐喻。
- 不做复杂卡片墙、路线图、仪表盘、商业产品包装。
- 用普通用户熟悉的“分组列表、清楚状态、少量按钮、可见表单标签”完成主要操作。

采用的交互约束：

- 每屏只有一个主动作。
- 所有主按钮触控高度不低于 44pt。
- 表单字段必须有可见 label。
- 状态使用文字 + 图形/标签，不只靠颜色。
- 高风险说明保持在动作附近。
- 当前底部 Tab 继续保持 `home / items / my`。

## Revised Direction

### 方向名称

个人安心小记。

### 设计意图

这个 App 应该像普通人手机里的一个安静小工具：每天打开看一眼，确认今天状态，偶尔补一条事项，添加一个协助人，查看触发规则。它不需要像商业 SaaS、保险 App 或高端安全产品。

### 记忆点

“少量分组 + 清楚下一步”。每个页面顶部给出当前状态，主体只放当前页面最需要完成的列表或表单，底部保留最明确的操作。

### 视觉性格

- 白底偏多，背景仅有轻微浅绿。
- 分割线、列表、轻面板为主。
- 主色回到上上一版本的鼠尾草绿，主按钮使用较明确的绿底 + 白色文字，保留清晰操作感。
- 圆角适中，不做厚重阴影。
- 文案像个人备忘，不像销售文案。
- 图标简洁、功能性强。

### 审美风险

主动降低视觉表现力，避免“设计感过重”。风险是看起来更朴素，但这更符合个人普通用户和高敏感主题的长期使用需求。

## Detemplating Answers

- Subject: 本地安心预案 App。
- Audience: 普通个人用户，以及可能未来需要理解下一步的家属/协助人。
- Single job: 让用户每天确认状态，并逐步补齐事项和协助人。
- Palette source: 普通手机设置页、个人备忘、家庭清单，而不是商业落地页、法律文书或保险产品。
- Opening thesis: Welcome 只说明这个工具能帮用户提前交代重要事项，不做品牌营销。
- Typography: 系统 CJK sans，使用清楚层级，不用装饰字体。
- Structure: 分组和列表对应真实功能，不使用装饰性编号或路线。
- Copy: 动作直接：确认、保存、添加、查看、暂停、演练。

## Token Table

| Token | Hex | Use |
| --- | --- | --- |
| `appBackground` | `#F6FAF8` | 页面背景 |
| `surface` | `#FFFFFF` | 主内容面 |
| `surfaceSoft` | `#EEF6F2` | 轻提示与状态底 |
| `primary` | `#4F907C` | 主按钮、完成状态 |
| `primaryStrong` | `#3E7666` | 小面积强调、图标、当前 Tab |
| `actionText` | `#FFFFFF` | 主按钮文字 |
| `primaryText` | `#213934` | 标题文字 |
| `bodyText` | `#2F3B3F` | 正文 |
| `mutedText` | `#6F7E7B` | 辅助说明 |
| `line` | `#D7E5DF` | 分割线 |
| `warningBg` | `#F8EBD8` | 待补充提示 |
| `warning` | `#A56A21` | 待补充文字 |
| `danger` | `#8A2D2A` | 高风险动作，少量使用 |

## Layout Concept

### Welcome

```text
small brand
plain headline
3 assurance rows
what happens after start
bottom start button
```

### Report

```text
small page label only
encouraging sentence
date
large circular confirm button
short confirmed-state hint
no big title
no explanatory subtitle
no secondary reminder action
no explanatory rows
```

### Home

```text
today status
next action
readiness grouped rows
quick entries
bottom nav
```

### Items

```text
title + plus
simple filters
plain item rows
status tag + helper hint
bottom nav
```

### New Item / Item Detail

```text
title
visible-label fields
linked helper field
small safety/helper note
bottom save button
```

### Helpers

```text
title + plus
local boundary note
plain helper rows
linked item count
```

### Helper Form

```text
title
visible-label fields
authorization summary
local boundary note
bottom save button
```

### Trigger State

```text
status summary
policy values
stage rows
pause/simulation actions
boundary note
```

### My

```text
account summary
setting groups
backup group
help/legal group
bottom nav
```

## Copy Tone

- 像普通 App 设置和备忘：短句、直接、具体。
- 避免“守护人生”“传承”“财富安排”等商业或高压表达。
- Report 页可以加入一句轻鼓励，例如“今天也照顾好自己。”
- Report 页只保留每日确认动作，避免在确认按钮旁堆叠风险说明。
- 边界说明在需要解释规则的页面直接写事实：本地记录、不因一次失联执行。
- 空状态给一个清楚动作。

## Preview Index

| Preview | Prompt doc | Purpose |
| --- | --- | --- |
| `designs/previews/anxin-personal-lite-redesign-overview.png` | `designs/images/anxin-personal-lite-redesign-overview.md` | 全页面总览 |
| `designs/previews/anxin-personal-lite-redesign-welcome.png` | `designs/images/anxin-personal-lite-redesign-welcome.md` | Welcome |
| `designs/previews/anxin-personal-lite-redesign-report.png` | `designs/images/anxin-personal-lite-redesign-report.md` | Report |
| `designs/previews/anxin-personal-lite-redesign-home.png` | `designs/images/anxin-personal-lite-redesign-home.md` | Home |
| `designs/previews/anxin-personal-lite-redesign-items.png` | `designs/images/anxin-personal-lite-redesign-items.md` | Items |
| `designs/previews/anxin-personal-lite-redesign-item-form.png` | `designs/images/anxin-personal-lite-redesign-item-form.md` | New Item / Item Detail |
| `designs/previews/anxin-personal-lite-redesign-helpers.png` | `designs/images/anxin-personal-lite-redesign-helpers.md` | Helpers |
| `designs/previews/anxin-personal-lite-redesign-helper-form.png` | `designs/images/anxin-personal-lite-redesign-helper-form.md` | Helper Form |
| `designs/previews/anxin-personal-lite-redesign-trigger-state.png` | `designs/images/anxin-personal-lite-redesign-trigger-state.md` | Trigger State |
| `designs/previews/anxin-personal-lite-redesign-my.png` | `designs/images/anxin-personal-lite-redesign-my.md` | My |
