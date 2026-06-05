# 实现计划：add-local-item-crud-workflow

## 来源

- 提案：`openspec/changes/add-local-item-crud-workflow/proposal.md`
- 设计：`openspec/changes/add-local-item-crud-workflow/design.md`
- 规格：`openspec/changes/add-local-item-crud-workflow/specs/`
- 任务：`openspec/changes/add-local-item-crud-workflow/tasks.md`

## 实现步骤

### Task 1: 本地 item mutation helper

- 目标：把 create/update/archive 逻辑放在 `src/store/trust`，避免 route 和 page 复制 snapshot mutation。
- 改动文件：
  - `src/store/trust/items.ts`
  - `src/store/trust/index.ts`
  - `tests/store/trust/items.test.ts`
- 步骤：
  - 先写失败测试：valid create 追加 active item，带 id、空 `helperIds`、`createdAt`、`updatedAt`。
  - 测试 empty title 和 unsupported kind 不改变 snapshot 并返回 validation failure。
  - 测试 update 只更新目标 item 的 title/kind/summary/updatedAt，保留 createdAt、helpers、triggerPolicy 和其它 items。
  - 测试 archive 把目标 item 标为 `archived`，刷新 `updatedAt`，不删除记录。
  - 实现 pure helpers，例如 `createTrustItem`、`updateTrustItem`、`archiveTrustItem`。
  - 从 `src/store/trust/index.ts` 导出 helper。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/items.test.ts --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`

### Task 2: ItemsScreen 接入本地 item view model

- 目标：让列表 UI 从 props 渲染真实 item，而不是硬编码两条示例。
- 改动文件：
  - `src/pages/items/ItemsScreen.tsx`
  - 如需要：`src/pages/items/types.ts`
  - `tests/pages/items/items-screen.test.tsx`
- 步骤：
  - 先更新/新增失败测试：无 active items 时显示 empty state 和创建动作。
  - 测试传入 active items 时显示每个 item 的 title、kind/meta、summary。
  - 测试圆形 add action 仍调用 `onCreateItem`。
  - 测试 edit/archive action 分别调用 `onEditItem(itemId)` 和 `onArchiveItem(itemId)`。
  - 实现 `items` prop、empty state、item card 渲染和 callbacks。
  - 保持页面不 import AsyncStorage 或 trust storage helper。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/items/items-screen.test.tsx --runInBand`

### Task 3: ItemFormScreen 支持 create/edit submit

- 目标：把新建事项页从静态向导壳推进到 MVP 表单，支持 title/kind/summary 和验证。
- 改动文件：
  - `src/pages/items/ItemFormScreen.tsx`
  - `tests/pages/items/item-form-screen.test.tsx`
- 步骤：
  - 先写失败测试：表单显示 title、kind、summary、save action。
  - 测试空 title save 显示 validation message，且不调用 submit。
  - 测试选择 offline/online kind 后提交 validated payload。
  - 测试传入 initial item values 时表单预填并可提交 edit payload。
  - 使用 React Hook Form + Zod 或等价本地校验实现表单。
  - 保持表单通过 `onSubmit` 回调交给 route，不直接写 storage。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/items/item-form-screen.test.tsx --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`

### Task 4: Route wiring 和持久化

- 目标：让 Items route 读取本地 snapshot，新建/编辑/归档操作写回 AsyncStorage。
- 改动文件：
  - `src/app/(tabs)/items.tsx`
  - `src/app/items/new.tsx`
  - 如需要新增：`src/app/items/[id].tsx` 或 `src/app/items/edit/[id].tsx`
  - `tests/pages/items/items-screen.test.tsx`
  - `tests/pages/items/item-form-screen.test.tsx`
  - 如需要新增 route 测试文件
- 步骤：
  - 测试 Items route 从 storage 加载 active items 并传给页面。
  - 测试 add action 仍导航到 `/items/new`。
  - 测试 New Item route valid submit 保存 snapshot 并返回 `/items` 或 tab route。
  - 测试 archive callback 保存 archived status 并刷新列表状态。
  - 如实现 edit route，测试 edit submit 更新已有 item。
  - 实现 route-level storage binding、navigation 和 local state refresh。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/items --runInBand`

### Task 5: i18n、截图链路兼容和最终验证

- 目标：确保新增 UI 文案三语齐全，且本阶段满足 OpenSpec 严格校验。
- 改动文件：
  - `src/locals/zh-CN.json`
  - `src/locals/zh-TW.json`
  - `src/locals/en-US.json`
  - `openspec/changes/add-local-item-crud-workflow/tasks.md`（build 阶段勾选）
  - 如执行计划需要：`docs/superpowers/plans/YYYY-MM-DD-add-local-item-crud-workflow.md`
- 步骤：
  - 新增 empty state、form label、save/edit/archive、validation 等三语 copy。
  - 删除 sample-only locale key 前先确认没有代码使用。
  - 跑 i18n 检查。
  - 跑页面和 trust store 聚焦测试。
  - 跑类型检查。
  - 跑当前 change 和全量 OpenSpec 严格校验。
  - 确认 `.ai/` diff 为空。
  - build 阶段完成后勾选 tasks。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/items --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
  - `npm.cmd exec -- openspec validate add-local-item-crud-workflow --strict`
  - `npm.cmd exec -- openspec validate --all --strict`
  - `git diff -- .ai`
