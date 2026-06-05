# 实现计划：add-local-readiness-summary

## 来源

- 提案：`openspec/changes/add-local-readiness-summary/proposal.md`
- 设计：`openspec/changes/add-local-readiness-summary/design.md`
- 规格：`openspec/changes/add-local-readiness-summary/specs/`
- 任务：`openspec/changes/add-local-readiness-summary/tasks.md`

## 实现步骤

### Task 1: 本地 readiness resolver

- 目标：新增纯派生 readiness 类型与 resolver，把 `ITrustDataSnapshot`
  转换成 UI 可用的本地准备度 view model。
- 改动文件：
  - `tests/store/trust/readiness.test.ts`
  - `src/store/trust/readiness.ts`
  - `src/store/trust/index.ts`
- 验证方式：
  - 先新增 resolver 测试并观察 RED。
  - 实现后运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/readiness.test.ts --runInBand`。
  - 断言 empty snapshot、active counts、archived exclusion、covered/uncovered items、trigger paused/not-rehearsed gaps 和 input snapshot immutability。

### Task 2: Readiness summary 页面组件

- 目标：新增或扩展页面级组件，展示准备度标题、分区摘要、计数、本地-only 说明和下一步动作。
- 改动文件：
  - `tests/pages/home/home-screen.test.tsx` 或新增 `tests/pages/readiness/readiness-summary-screen.test.tsx`
  - `src/pages/home/HomeScreen.tsx` 或新增 `src/pages/readiness/ReadinessSummaryScreen.tsx`
  - 对应 `*.styled.tsx`
- 验证方式：
  - 先补页面测试并观察 RED。
  - 实现后运行对应 focused page test。
  - 断言页面不显示数字评分、严厉 pass/fail、法律完成、自动通知或第三方账号控制文案。

### Task 3: 路由/父级页面接入现有本地流程

- 目标：在选定入口加载 local trust snapshot，调用 readiness resolver，并把 next actions 映射到现有 item、helper、assignment、trigger-state 流程。
- 改动文件：
  - `src/app/(tabs)/home.tsx` 或选定入口 route
  - `src/pages/home/HomeScreen.tsx` 或选定页面组件
  - 相关 focused tests
- 验证方式：
  - 运行所选页面/路由测试。
  - 断言 route 只负责 i18n、storage binding、readiness mapping 和 navigation callbacks，不把 storage 读写塞进 page 组件。
  - 断言 next actions 能指向现有 `items/new`、`helpers/new`、item edit/assignment 或 `my/trigger-state` 流程。

### Task 4: 三语文案和安全 copy 边界

- 目标：补齐 readiness summary 三语文案，并确保“本地、建议性、可修改、不自动通知、不产生法律授权”表达稳定。
- 改动文件：
  - `src/locals/zh-CN.json`
  - `src/locals/zh-TW.json`
  - `src/locals/en-US.json`
  - 相关页面/i18n 测试
- 验证方式：
  - 运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local`。
  - 运行 readiness focused tests。
  - 断言不存在 legal authority、notarization、automatic delivery、safety score 等不安全语义。

### Task 5: 最终验证和任务状态同步

- 目标：完成本阶段全部验证，通过后勾选 OpenSpec tasks。
- 改动文件：
  - `openspec/changes/add-local-readiness-summary/tasks.md`
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand`
  - readiness focused page tests
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local`
  - `npm.cmd exec -- openspec validate add-local-readiness-summary --strict`
  - `npm.cmd exec -- openspec validate --all --strict`
  - `git diff -- .ai`
