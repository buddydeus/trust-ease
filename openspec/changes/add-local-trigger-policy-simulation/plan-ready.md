# 实现计划：add-local-trigger-policy-simulation

## 来源

- 提案：`openspec/changes/add-local-trigger-policy-simulation/proposal.md`
- 设计：`openspec/changes/add-local-trigger-policy-simulation/design.md`
- 规格：`openspec/changes/add-local-trigger-policy-simulation/specs/`
- 任务：`openspec/changes/add-local-trigger-policy-simulation/tasks.md`

## 实现步骤

### Task 1: 本地 trigger policy mutation helpers

- 目标：新增本地触发策略更新、暂停、恢复、开始演练、重置演练的纯函数，作为 route 和 UI 的唯一 snapshot mutation 入口。
- 改动文件：
  - `tests/store/trust/trigger-policy.test.ts`
  - `src/store/trust/triggerPolicy.ts`
  - `src/store/trust/index.ts`
- 验证方式：
  - 先运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/trigger-policy.test.ts --runInBand` 观察 RED。
  - 实现后重跑同一命令观察 GREEN。
  - 断言 interval/threshold 必须是正有限数，pause/resume/simulation/reset 只更新 triggerPolicy 和 timestamps，并保留 items/helpers/unrelated snapshot fields。

### Task 2: 本地 simulation status resolver

- 目标：新增可测试的状态派生函数，把 policy 和注入输入转换为页面可用的本地状态与下一步动作。
- 改动文件：
  - `tests/store/trust/trigger-policy.test.ts`
  - `src/store/trust/triggerPolicy.ts`
- 验证方式：
  - 先补 resolver 测试并观察 RED。
  - 实现后运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/trigger-policy.test.ts --runInBand`。
  - 覆盖 `normal`、`paused`、`warning`、`waiting-confirmation`、`simulated-review`，并断言达到阈值时仍是 local review / rehearsal，不是 execution。

### Task 3: Trigger-state page view model and actions

- 目标：把 `TriggerStateScreen` 从本地 `useState` 原型升级为由 props 驱动的页面组件，展示 policy、状态、下一步动作和本地演练说明。
- 改动文件：
  - `tests/pages/trigger-state/trigger-state-screen.test.tsx`
  - `src/pages/trigger-state/TriggerStateScreen.tsx`
  - `src/pages/trigger-state/trigger-state.styled.tsx`
- 验证方式：
  - 先更新页面测试并观察 RED。
  - 实现后运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/trigger-state --runInBand`。
  - 断言页面显示 check-in interval、missed threshold、local-only explanation、next action，以及 rehearsal/pause/resume/reset callbacks。
  - 断言不再渲染“死亡 = 3 次未申报”或同等不可逆文案。

### Task 4: Trigger-state route persistence

- 目标：让 `src/app/my/trigger-state.tsx` 从 AsyncStorage-backed trust snapshot 读取 policy，并持久化暂停、恢复、演练、重置等动作。
- 改动文件：
  - `src/app/my/trigger-state.tsx`
  - `tests/pages/trigger-state/trigger-state-screen.test.tsx`
- 验证方式：
  - 先补 route persistence 测试并观察 RED。
  - 实现后运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/trigger-state --runInBand`。
  - 断言 route 只负责 i18n、storage binding、view-model mapping 和 callbacks，不直接在页面组件里读写 storage。

### Task 5: 三语文案和安全 copy 边界

- 目标：补齐 trigger policy simulation 文案，并替换现有高压或不可逆 trigger 文案。
- 改动文件：
  - `src/locals/zh-CN.json`
  - `src/locals/zh-TW.json`
  - `src/locals/en-US.json`
  - `tests/pages/trigger-state/trigger-state-screen.test.tsx`
  - 如需要：`tests/i18n/check-locals.test.ts`
- 验证方式：
  - 运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local`。
  - 运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/trigger-state --runInBand`。
  - 断言 copy 明确“本地演练/不会联系协助人/不会产生法律授权”，且三语 key 同步。

### Task 6: 最终验证和任务状态同步

- 目标：完成本阶段所有验证，并在通过后勾选 OpenSpec tasks。
- 改动文件：
  - `openspec/changes/add-local-trigger-policy-simulation/tasks.md`
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/trigger-state --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local`
  - `npm.cmd exec -- openspec validate add-local-trigger-policy-simulation --strict`
  - `npm.cmd exec -- openspec validate --all --strict`
  - `git diff -- .ai`
