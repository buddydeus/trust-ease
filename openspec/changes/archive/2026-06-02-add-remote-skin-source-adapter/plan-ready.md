# 实现计划：add-remote-skin-source-adapter

## 来源

- 提案：`openspec/changes/add-remote-skin-source-adapter/proposal.md`
- 设计：`openspec/changes/add-remote-skin-source-adapter/design.md`
- 规格：`openspec/changes/add-remote-skin-source-adapter/specs/skin-downloader-runtime/spec.md`
- 任务：`openspec/changes/add-remote-skin-source-adapter/tasks.md`

## 实现步骤

### Task 1: 定义远程 adapter 契约

- 目标：建立远程 skin 下载所需的 descriptor、progress、retry、cancel 和依赖注入类型。
- 改动文件：
  - `src/skin/types.ts`
  - `src/skin/remoteSourceAdapter.ts`
- 步骤：
  - 在 `src/skin/remoteSourceAdapter.ts` 中定义 `RemoteSkinPackageDescriptor`、`RemoteSkinPackageProgress`、`RemoteSkinPackageRetryPolicy`、`RemoteSkinPackageAdapterDependencies`。
  - 如果需要区分取消或超时，在 `src/skin/types.ts` 中扩展 `SkinPackageFailureReason`。
  - 确保 descriptor 的 `skinId` / `skinVersion` 可转换为现有 `SkinPackageIdentity`。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`

### Task 2: 编写远程 adapter 单元测试

- 目标：先用测试锁定远程下载、进度、失败、重试和取消行为。
- 改动文件：
  - `tests/skin/remote-source-adapter.test.ts`
- 步骤：
  - 添加 manifest fetch 成功测试。
  - 添加 asset staging 成功和 URL resolution 测试。
  - 添加 progress callback 顺序测试。
  - 添加 manifest fetch failure、asset fetch failure、retry exhaustion 和 cancellation 测试。
  - 通过注入 mock fetch、mock file writer 和 mock scheduler 避免真实网络和真实等待。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-source-adapter.test.ts --runInBand`

### Task 3: 实现远程 source adapter

- 目标：让远程 descriptor 能生成现有 downloader 可消费的 `SkinPackageSourceAdapter`。
- 改动文件：
  - `src/skin/remoteSourceAdapter.ts`
- 步骤：
  - 实现 `createRemoteSkinPackageSource` 或等价工厂。
  - fetch 远程 manifest，把它作为未信任 JSON 保留给现有验证管线。
  - 只为了发现 assets 读取 manifest 的 `assets[].path`。
  - 将远程 assets 写入 downloader 提供的 staging 目录。
  - 返回 `SkinPackageSourcePayload`，包括 `manifestSource`、`assetHashes`、`packageHash`。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-source-adapter.test.ts --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`

### Task 4: 接入现有 downloader 生命周期

- 目标：证明远程 adapter 不绕过 staging、validation、promotion 和 fallback 规则。
- 改动文件：
  - `tests/skin/downloader.test.ts`
  - `tests/skin/remote-source-adapter.test.ts`
- 步骤：
  - 添加 valid remote package 通过 `downloadSkinPackage` promoted to ready 的测试。
  - 添加 manifest failure / asset failure / cancellation 不改变 `activeSkinId` 和 `lastReadySkinId` 的测试。
  - 确认 incompatible 和 validation failure 仍由现有 package validation 处理。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand`

### Task 5: 更新文档与结构边界

- 目标：让仓库入口文档记录远程 skin 下载边界，同时保持 route/page 不承载网络下载细节。
- 改动文件：
  - `README.md`
  - `AGENTS.md`
  - `tests/support/source-structure.test.ts`（仅当需要强化结构契约）
- 步骤：
  - 在 README/AGENTS 的皮肤运行时章节补充远程 adapter 只下载数据和资源，不执行远程组件或 JS。
  - 说明远程 skin 仍进入 `documentDirectory/skins/` staging，再经校验后 ready。
  - 不新增用户可见 UI 文案；因此不改三语 locale。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand`
  - `git diff -- .ai`

### Task 6: 最终验证

- 目标：完成 build 前的可归档验证。
- 改动文件：
  - `openspec/changes/add-remote-skin-source-adapter/tasks.md`
- 步骤：
  - 标记 tasks 完成。
  - 跑 OpenSpec 严格校验。
  - 跑类型、skin 测试和结构测试。
  - 确认 `.ai/` 未被修改。
- 验证方式：
  - `npm.cmd exec -- openspec validate add-remote-skin-source-adapter --strict`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand`
  - `git diff -- .ai`
