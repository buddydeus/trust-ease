# 实现计划：add-skin-package-hash-canonicalization

## 来源

- 提案：`openspec/changes/add-skin-package-hash-canonicalization/proposal.md`
- 设计：`openspec/changes/add-skin-package-hash-canonicalization/design.md`
- 规格：`openspec/changes/add-skin-package-hash-canonicalization/specs/`
- 任务：`openspec/changes/add-skin-package-hash-canonicalization/tasks.md`

## 实现步骤

### Task 1: 增加 canonical package hash helper

- 目标：提供一个稳定、跨平台、可测试的 skin package hash 计算入口。
- 改动文件：
  - `src/skin/packageHash.ts`
  - `src/skin/index.ts`（仅当需要导出）
- 步骤：
  - 定义 package hash 输入类型，包含 package identity、manifestSource 和 file entries。
  - 实现 path normalization：`\` 转 `/`、移除开头 `/`、拒绝空路径、`..`、绝对路径和 URL-like path。
  - 实现递归稳定序列化，确保 object key 顺序不影响 hash。
  - 在 canonical manifest 输入中排除 `packageHash`，避免自引用。
  - 返回带算法前缀的 hash 字符串。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`

### Task 2: 增加 package hash focused tests

- 目标：先锁定 canonical hash 的跨平台和确定性行为。
- 改动文件：
  - `tests/skin/package-hash.test.ts`
- 步骤：
  - 添加 Windows/POSIX path separator 等价测试。
  - 添加 file entries 不同输入顺序的等价测试。
  - 添加 manifest property 不同插入顺序的等价测试。
  - 添加 invalid path rejection 测试。
  - 添加 hash prefix 断言。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/package-hash.test.ts --runInBand`

### Task 3: 让 remote adapter 使用 canonical default hash

- 目标：移除 remote adapter 默认 hash 的 ad hoc JSON fallback。
- 改动文件：
  - `src/skin/remoteSourceAdapter.ts`
  - `tests/skin/remote-source-adapter.test.ts`
- 步骤：
  - 引入 canonical package hash helper。
  - descriptor 有显式 `packageHash` 时保持现有行为。
  - descriptor 无 `packageHash` 时，用 manifestSource 和 fetched asset hashes 构造 canonical hash 输入。
  - 更新测试，断言默认 hash 与 canonical helper 输出一致。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-source-adapter.test.ts --runInBand`

### Task 4: 保持 downloader/validation failure 语义

- 目标：确保 hash canonicalization 不破坏现有 recoverable failure 规则。
- 改动文件：
  - `src/skin/downloader.ts`（仅当需要捕获 hash calculation failure）
  - `src/skin/packageValidation.ts`（仅当需要调整输入或错误路径）
  - `tests/skin/downloader.test.ts`
  - `tests/skin/package-validation.test.ts`
- 步骤：
  - 确认 package hash mismatch 仍映射到 `package-hash-mismatch`。
  - 如果 canonical hash 计算异常发生在 source adapter 阶段，确保 downloader 仍把操作标记为 recoverable `failed`。
  - 补充 mismatch 或 calculation failure 不会 promote ready 的测试。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/package-validation.test.ts --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/downloader.test.ts --runInBand`

### Task 5: 最终验证

- 目标：确认 skin runtime、结构契约和 OpenSpec 都保持一致。
- 改动文件：
  - `openspec/changes/add-skin-package-hash-canonicalization/tasks.md`（build 阶段勾选）
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand`
  - `npm.cmd exec -- openspec validate add-skin-package-hash-canonicalization --strict`
  - `git diff -- .ai`
