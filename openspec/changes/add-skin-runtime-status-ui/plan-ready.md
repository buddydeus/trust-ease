# 实现计划：add-skin-runtime-status-ui

## 来源

- 提案：`openspec/changes/add-skin-runtime-status-ui/proposal.md`
- 设计：`openspec/changes/add-skin-runtime-status-ui/design.md`
- 规格：`openspec/changes/add-skin-runtime-status-ui/specs/`
- 任务：`openspec/changes/add-skin-runtime-status-ui/tasks.md`

## 实现步骤

### Task 1: 定义 My 页 skin 状态 props 与文案模型

- 目标：让 My 页能够接收 active skin、init status、fallback 和 package state 信息。
- 改动文件：
  - `src/pages/my/types.ts`
  - `src/pages/my/MyScreen.tsx`
- 步骤：
  - 增加 `ISkinRuntimeStatus` 或等价对象类型。
  - 扩展 `IMyScreenCopy`，加入状态标题、状态枚举文案、fallback 文案。
  - 扩展 `IMyScreenProps`，让路由可注入 runtime status。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`

### Task 2: 添加 My 页状态测试

- 目标：先用测试锁定 ready、fallback、failed、incompatible 的显示行为。
- 改动文件：
  - `tests/pages/my/my-screen.test.tsx`
- 步骤：
  - 添加默认 ready 状态渲染断言。
  - 添加 fallback note 断言。
  - 添加 failed package 状态断言。
  - 添加 incompatible package 状态断言。
  - 保留现有 skin picker 行为测试。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.test.tsx --runInBand`

### Task 3: 实现 My 页 skin runtime 状态 UI

- 目标：在 My/settings 区域增加一个紧凑状态卡片。
- 改动文件：
  - `src/pages/my/SkinRuntimeStatus.tsx`
  - `src/pages/my/MyScreen.tsx`
  - `src/pages/my/my.styled.tsx`（仅当现有样式不够用）
- 步骤：
  - 渲染当前风格、初始化状态、fallback note。
  - 遍历存在的 package state rows。
  - 优先显示 skin display name，未知时显示简化 skin id。
  - 避免把 downloader 或 remote adapter 细节带入页面。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.test.tsx --runInBand`

### Task 4: 从 My route 注入 store 状态

- 目标：让 My 页显示真实 store-backed 状态，同时保持 route thin。
- 改动文件：
  - `src/app/(tabs)/my.tsx`
- 步骤：
  - 从 `useAppStore` 读取 `activeSkinId`、`skinInitStatus`、`skinInitUsedFallback`、`skinPackageStates`。
  - 结合现有 `skinOptions` 生成页面所需 status props。
  - 不在 route 中格式化文案，不导入 downloader/manifest/remote adapter。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand`

### Task 5: 同步三语文案与 i18n 测试

- 目标：新增用户可见文案时保持三语一致。
- 改动文件：
  - `src/locals/zh-CN.json`
  - `src/locals/zh-TW.json`
  - `src/locals/en-US.json`
  - `tests/pages/my/my-screen.i18n.test.tsx`
  - `tests/i18n/check-locals.test.ts`（仅当需要聚焦新 key）
- 步骤：
  - 添加状态标题、active skin、fallback 和 package state 文案。
  - 确认三语 key 完全一致。
  - 添加或更新 My 页 i18n 测试。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.i18n.test.tsx --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/i18n --runInBand`

### Task 6: 最终验证

- 目标：完成 build 前的可归档验证。
- 改动文件：
  - `openspec/changes/add-skin-runtime-status-ui/tasks.md`
- 步骤：
  - 标记 tasks 完成。
  - 跑 OpenSpec 严格校验。
  - 跑类型、My 页、i18n、结构测试。
  - 确认 `.ai/` 未被修改。
- 验证方式：
  - `npm.cmd exec -- openspec validate add-skin-runtime-status-ui --strict`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.test.tsx --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.i18n.test.tsx --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/i18n --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand`
  - `git diff -- .ai`
