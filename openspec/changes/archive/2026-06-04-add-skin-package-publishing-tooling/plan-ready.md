# 实现计划：add-skin-package-publishing-tooling

## 来源

- 提案：`openspec/changes/add-skin-package-publishing-tooling/proposal.md`
- 设计：`openspec/changes/add-skin-package-publishing-tooling/design.md`
- 规格：`openspec/changes/add-skin-package-publishing-tooling/specs/`
- 任务：`openspec/changes/add-skin-package-publishing-tooling/tasks.md`

## 实现步骤

### Task 1: 建立发布工具核心 helper

- 目标：先把可测试的发布/校验规则放入项目代码边界，避免脚本里堆业务逻辑。
- 改动文件：
  - `src/skin/publishingTool.ts`
  - `tests/skin/publishing-tool.test.ts`
- 步骤：
  - 定义 check/update 输入、结果、错误类型和 manifest source 数据形态。
  - 实现读取本地 `manifest.json` 的 helper，测试可使用临时目录 fixture。
  - 从 manifest 中提取声明的 static asset paths。
  - 复用安全路径规则，拒绝空路径、遍历、绝对路径、URL-like path 和重复 normalized path。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/publishing-tool.test.ts --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`

### Task 2: 实现 asset hash 与 canonical package hash

- 目标：让本地 package 目录生成与 runtime 一致的 manifest asset hashes 和 package hash。
- 改动文件：
  - `src/skin/publishingTool.ts`
  - `tests/skin/publishing-tool.test.ts`
- 步骤：
  - 对每个 manifest-declared asset 读取本地文件内容并计算当前 asset hash。
  - 缺失文件时返回清晰失败结果或抛出可测试错误。
  - 调用 `calculateSkinPackageHash` 生成 canonical package hash。
  - 测试生成值与直接调用 `calculateSkinPackageHash` 一致。
  - 测试 manifest `packageHash` 更新后无需多次运行才能收敛。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/publishing-tool.test.ts --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/package-hash.test.ts --runInBand`

### Task 3: 实现 check / update 模式

- 目标：提供 CI 可用的只读校验模式，以及开发者可用的 manifest 写回模式。
- 改动文件：
  - `src/skin/publishingTool.ts`
  - `tests/skin/publishing-tool.test.ts`
- 步骤：
  - check mode 对 stale asset hash 失败但不写文件。
  - check mode 对 stale package hash 失败但不写文件。
  - update mode 写回 asset `hash` 字段和 top-level `packageHash`。
  - update mode 连续运行两次时第二次不产生进一步内容变化。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/publishing-tool.test.ts --runInBand`
  - `git diff --check`

### Task 4: 增加本地脚本/命令入口

- 目标：让开发者可以通过项目命令对本地 skin package 目录执行 check/update。
- 改动文件：
  - `scripts/skin_package_tool.*`
  - `package.json`
  - 需要时更新 `README.md` 或 `TODO.md`
- 步骤：
  - 增加薄脚本入口，只负责解析参数并调用 publishing helper。
  - 支持 package directory 参数和 check/update mode。
  - package script 通过 pinned pnpm 环境运行。
  - 明确脚本不访问远程 URL、不写 Expo runtime storage。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm <新增命令> -- --help`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm <新增命令> -- check <fixture-or-skin-dir>`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`

### Task 5: 完成回归验证

- 目标：确认 publishing tooling 没有破坏现有 skin runtime、OpenSpec 和 AI 文档边界。
- 改动文件：
  - `openspec/changes/add-skin-package-publishing-tooling/tasks.md`（build 阶段勾选）
  - `docs/superpowers/plans/YYYY-MM-DD-add-skin-package-publishing-tooling.md`（build 阶段生成）
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/publishing-tool.test.ts --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/package-hash.test.ts --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
  - `npm.cmd exec -- openspec validate add-skin-package-publishing-tooling --strict`
  - `git diff -- .ai`
