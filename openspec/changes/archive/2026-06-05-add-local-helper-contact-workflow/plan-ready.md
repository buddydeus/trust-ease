# 实现计划：add-local-helper-contact-workflow

## 来源

- 提案：`openspec/changes/add-local-helper-contact-workflow/proposal.md`
- 设计：`openspec/changes/add-local-helper-contact-workflow/design.md`
- 规格：`openspec/changes/add-local-helper-contact-workflow/specs/`
- 任务：`openspec/changes/add-local-helper-contact-workflow/tasks.md`

## 实现步骤

### Task 1: 本地 helper mutation helpers

- 目标：新增本地协助人 create/update/archive 纯函数，作为 UI 和 route 的唯一 snapshot mutation 入口。
- 改动文件：
  - `tests/store/trust/helpers.test.ts`
  - `src/store/trust/helpers.ts`
  - `src/store/trust/index.ts`
- 验证方式：
  - 先运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/helpers.test.ts --runInBand` 看到 RED。
  - 实现后重跑同一命令看到 GREEN。
  - 覆盖 display name 必填、contact method 必填、missing helper 安全失败、createdAt 保留、updatedAt 更新、原 snapshot 不变。

### Task 2: 本地 item helper assignment helper

- 目标：新增把 active helper ids 关联到 item 的纯函数，拒绝 missing item、unknown helper 和 archived helper。
- 改动文件：
  - `tests/store/trust/helpers.test.ts`
  - `src/store/trust/helpers.ts` 或 `src/store/trust/items.ts`
- 验证方式：
  - 扩展 store 测试，先观察 assignment RED。
  - 实现后运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/helpers.test.ts --runInBand`。
  - 断言 helper ids 去重、顺序稳定，并保留 item title/kind/summary/status/createdAt 和 unrelated snapshot fields。

### Task 3: Helper list/form page components

- 目标：新增可独立渲染的 helper list 和 helper form 页面组件，页面只接收 view model、copy 和 callbacks。
- 改动文件：
  - `tests/pages/helpers/helper-screen.test.tsx`
  - `src/pages/helpers/HelpersScreen.tsx`
  - `src/pages/helpers/HelperFormScreen.tsx`
  - `src/pages/helpers/*.styled.tsx`
- 验证方式：
  - 先写页面测试并运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/helpers --runInBand` 看到 RED。
  - 实现后重跑同一命令看到 GREEN。
  - 覆盖 active list、empty state、edit/archive callbacks、form validation、submit payload 和 local-only explanation copy。

### Task 4: Helper routes and navigation entry

- 目标：把 helper list/create/edit route 接到 AsyncStorage-backed trust snapshot，并从现有产品表面提供入口。
- 改动文件：
  - `src/app/helpers/index.tsx`
  - `src/app/helpers/new.tsx`
  - `src/app/helpers/[id].tsx`
  - `src/app/(tabs)/my.tsx` 或其他现有入口 route
  - `tests/pages/helpers/helper-screen.test.tsx`
  - 可能涉及 `tests/pages/my/*`
- 验证方式：
  - 先补 route persistence/navigation 测试并观察 RED。
  - 实现后运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/helpers --runInBand`。
  - 若入口放在 My 页，追加运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my --runInBand`。

### Task 5: Item form helper assignment

- 目标：在 item edit/create workflow 中展示 active helper choices，并把选择保存到 `ITrustItem.helperIds`。
- 改动文件：
  - `tests/pages/items/item-form-screen.test.tsx`
  - `tests/pages/items/items-screen.test.tsx` 如需要
  - `src/pages/items/ItemFormScreen.tsx`
  - `src/pages/items/item-form.styled.tsx`
  - `src/app/items/new.tsx`
  - `src/app/items/[id].tsx`
- 验证方式：
  - 先补 item assignment 页面/route 测试并观察 RED。
  - 实现后运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/items --runInBand`。
  - 断言 active helper 可选、archived helper 不在默认选择里、保存后 helperIds 持久化，且原 item CRUD 行为不回退。

### Task 6: Localization and final verification

- 目标：补齐三语文案并完成本阶段验证。
- 改动文件：
  - `src/locals/zh-CN.json`
  - `src/locals/zh-TW.json`
  - `src/locals/en-US.json`
  - `openspec/changes/add-local-helper-contact-workflow/tasks.md`
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/helpers --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/items --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
  - `npm.cmd exec -- openspec validate add-local-helper-contact-workflow --strict`
  - `npm.cmd exec -- openspec validate --all --strict`
  - `git diff -- .ai`
