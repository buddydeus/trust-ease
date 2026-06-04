# 实现计划：add-remote-skin-download-qa-entry

## 来源

- 提案：`openspec/changes/add-remote-skin-download-qa-entry/proposal.md`
- 设计：`openspec/changes/add-remote-skin-download-qa-entry/design.md`
- 规格：`openspec/changes/add-remote-skin-download-qa-entry/specs/`
- 任务：`openspec/changes/add-remote-skin-download-qa-entry/tasks.md`

## 实现步骤

### Task 1: 定义 remote QA fixture/harness

- 目标：建立一个可测试的内部 QA 链路入口，先准备 remote-style skin package fixture。
- 改动文件：
  - `tests/skin/remote-download-qa.test.ts`
  - 如需要：`src/skin/remoteDownloadQa.ts` 或 `scripts/remote_skin_qa.js`
- 步骤：
  - 定义 manifest、asset content、package identity 和失败变体 fixture 输入。
  - 使用 `runSkinPackagePublishing` 或 `pnpm skin:package` 等价逻辑生成有效 asset hashes 和 package hash。
  - 确保 fixture 生成只读写本地临时目录，不写 Expo runtime storage。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-download-qa.test.ts --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`

### Task 2: 串联 remote adapter 与 downloader

- 目标：证明 valid QA package 可以通过 remote adapter + downloader 进入 ready。
- 改动文件：
  - `tests/skin/remote-download-qa.test.ts`
  - 如需要：`src/skin/remoteDownloadQa.ts`
- 步骤：
  - 用 fixture manifest URL / dependency-injected fetch 模拟 remote manifest。
  - 用 `createRemoteSkinPackageSource` stage manifest 和 assets。
  - 用 `downloadSkinPackage` 执行 checking/downloading/validation/promotion。
  - 断言 `ready`、`activeSkinId`、`lastReadySkinId` 和 `skinPackageStates`。
  - 断言 project-root `skins/` 未作为 runtime storage。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-download-qa.test.ts --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand`

### Task 3: 覆盖 recoverable failure

- 目标：证明 stale hash 场景不会替换前一个 ready skin。
- 改动文件：
  - `tests/skin/remote-download-qa.test.ts`
- 步骤：
  - 构造 stale package hash fixture。
  - 构造 stale asset hash fixture。
  - 断言 operation 为 failed，并包含对应 validation failure reason。
  - 断言前一个 `activeSkinId` / `lastReadySkinId` 不变。
  - 断言没有 partial package 进入 ready。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-download-qa.test.ts --runInBand`

### Task 4: 验证状态 UI 边界

- 目标：让 QA 结果能通过已有 My/settings 状态模型展示，而不是让页面导入 downloader 内部。
- 改动文件：
  - `tests/pages/my/my-screen.test.tsx`
  - 如需要：`src/pages/my/SkinRuntimeStatus.tsx`
- 步骤：
  - 添加 QA ready package state 的页面测试。
  - 添加 QA failed package state 的页面测试。
  - 保持页面只通过 props/store-backed data 获取状态。
  - 不把 downloader、remote adapter 或 publishing helper import 到页面组件。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.test.tsx --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand`

### Task 5: 文档、命令和最终验证

- 目标：让开发者知道如何运行 QA flow，并确保 OpenSpec/代码边界稳定。
- 改动文件：
  - `README.md`
  - `AGENTS.md`
  - 如需要：`package.json`
  - `openspec/changes/add-remote-skin-download-qa-entry/tasks.md`（build 阶段勾选）
  - `docs/superpowers/plans/YYYY-MM-DD-add-remote-skin-download-qa-entry.md`（build 阶段生成）
- 步骤：
  - 记录 QA flow 的本地运行命令或测试命令。
  - 如新增 script，确认它只运行 QA harness，不暴露用户皮肤商店。
  - 勾选 tasks 并记录 build plan。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-download-qa.test.ts --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.test.tsx --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
  - `npm.cmd exec -- openspec validate add-remote-skin-download-qa-entry --strict`
  - `git diff -- .ai`
