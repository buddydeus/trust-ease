# Trust Ease Handoff TODO

更新时间：2026-06-04
仓库：`D:\github\buddydeus\trust-ease`
当前分支：`refactor/all`

## 当前状态

- Git 工作区在本次更新前是干净的，`refactor/all` 与 `origin/refactor/all` 同步。
- 当前已创建 active OpenSpec change：
  - `add-remote-skin-download-qa-entry`
- OpenSpec 主规格全量严格校验通过：10 个 specs，0 failed。
- `.ai/` 未被最近几轮实现、归档和本次交接更新修改。
- 真实运行截图链路 `pnpm thumbs` 已修复并通过，可生成三语 21 张手机截图。

最近关键提交：

```text
092d05d docs: archive skin package publishing spec
f3c2bb8 feat: add skin package publishing tooling
4559365 docs: archive skin package hash spec
6c634de feat: canonicalize skin package hashes
5a5e3ba fix: restore runtime thumbnail export
0f15aa5 docs: archive skin runtime status UI spec
1f5ffbd feat: add skin runtime status UI
603de13 feat: add remote skin downloads and dependency locking
e7da87d feat: add skin downloader and init state machine
7adfe10 refactor: normalize project structure contracts
```

## 已完成内容

### 1. 仓库协作入口

- 根目录 `AGENTS.md` 已作为本仓库 AI 代理协作入口，作用类似 Claude Code 的
  `CLAUDE.md`。
- 已明确项目定位、技术栈、目录边界、i18n 规则、皮肤运行时规则、测试命令和
  禁止事项。

### 2. 产品规划到技术方案

已通过 OpenFlow / OpenSpec 完成并归档：

- `define-monorepo-product-technical-plan`

主规格已包含：

- `openspec/specs/monorepo-architecture/spec.md`
- `openspec/specs/operations-delivery-plan/spec.md`
- `openspec/specs/product-technical-plan/spec.md`
- `openspec/specs/security-compliance-plan/spec.md`

### 3. 项目结构契约重构

已通过 OpenFlow / OpenSpec 完成并归档：

- `normalize-project-structure-contracts`

完成内容：

- 强化 `tests/support/source-structure.test.ts`，把目录结构、根文档、截图脚本和
  route boundary 写成可执行契约。
- 拆分 `src/app/_layout.tsx` 的启动副作用。
- 拆分 `src/pages/my/MyScreen.tsx` 的本地组件和类型。
- 拆分 `src/skin/manifest.ts` 内部 helper。
- 主规格已合并：
  - `openspec/specs/documentation-contracts/spec.md`
  - `openspec/specs/project-structure-contracts/spec.md`

### 4. Skin downloader + app init state machine

已通过 OpenFlow / OpenSpec 完成 build 和 close，并归档：

- `add-skin-downloader-init-state-machine`

完成内容：

- `src/skin/initStateMachine.ts`
- `src/skin/packageValidation.ts`
- `src/skin/downloader.ts`
- `src/skin/paths.ts`
- 对应 `tests/skin/*`
- `src/app/useSkinStorageSync.ts` 通过 `resolveSkinInitState` 决定
  `activeSkinId` / `lastReadySkinId` / fallback，并写回持久化状态。
- 主规格已合并：
  - `openspec/specs/app-init-state-machine/spec.md`
  - `openspec/specs/skin-downloader-runtime/spec.md`

### 5. 依赖锁定策略

已通过 OpenFlow / OpenSpec 完成并归档：

- `define-dependency-lock-strategy`

完成内容：

- 新增 `openspec/specs/dependency-reproducibility/spec.md`
- `package.json` 固定 `packageManager: pnpm@11.5.0`
- `pnpm-lock.yaml` 已提交
- `.npmrc` 默认 registry 使用官方 npm registry
- `.gitignore` 忽略本地缓存目录

### 6. 真实远程 skin source adapter

已通过 OpenFlow / OpenSpec 完成 build 和 close，并归档：

- `add-remote-skin-source-adapter`

完成内容：

- 新增 `src/skin/remoteSourceAdapter.ts`
- 新增 `tests/skin/remote-source-adapter.test.ts`
- 支持 direct manifest URL、可选 asset base URL、progress callback、retry policy、
  cancellation signal 和依赖注入。
- 远程包仍复用 `downloadSkinPackage` 的 staging、validation、promotion、fallback 和
  package state 规则。
- 远程 adapter 只下载 manifest 与静态资源，不执行远程 React 组件、JavaScript 或插件代码。

### 7. Skin runtime status UI

已通过 OpenFlow / OpenSpec 完成 build 和 close，并归档：

- `add-skin-runtime-status-ui`

完成内容：

- My 页新增 `src/pages/my/SkinRuntimeStatus.tsx`
- `src/app/(tabs)/my.tsx` 注入 active skin、init status、fallback 和 package states。
- 三语新增状态文案。
- 覆盖 ready、fallback、failed、incompatible package state 展示。
- 主规格已合并：
  - `openspec/specs/app-init-state-machine/spec.md`
  - `openspec/specs/skin-downloader-runtime/spec.md`

### 8. Skin package hash canonicalization

已通过 OpenFlow / OpenSpec 完成 build 和 close，并归档：

- `add-skin-package-hash-canonicalization`

完成内容：

- 新增 `src/skin/packageHash.ts`
- package hash canonicalization 固定路径分隔符、文件排序、manifest key 排序、
  `packageHash` 自引用规避和不安全路径拒绝规则。
- `src/skin/remoteSourceAdapter.ts` 在 descriptor 未提供显式 `packageHash` 时，改用
  canonical helper。
- 新增/更新：
  - `tests/skin/package-hash.test.ts`
  - `tests/skin/remote-source-adapter.test.ts`

### 9. Skin package publishing tooling

已通过 OpenFlow / OpenSpec 完成 build 和 close，并归档：

- `add-skin-package-publishing-tooling`

完成内容：

- 新增 `src/skin/contentHash.ts`
- 新增 `src/skin/publishingTool.ts`
- 新增 `scripts/skin_package_tool.js`
- 新增 `pnpm skin:package`
- 新增 `tests/skin/publishing-tool.test.ts`
- `pnpm skin:package -- check <skin-dir>` 校验 manifest asset hashes 与 canonical
  `packageHash`，不写文件。
- `pnpm skin:package -- update <skin-dir>` 写回 asset hashes 与 canonical
  `packageHash` 到 `manifest.json`。
- 主规格已合并：
  - `openspec/specs/skin-package-publishing-tooling/spec.md`

### 10. 真实运行截图链路

已修复并提交：

- `pnpm thumbs` 可完成 Expo Web 真实导出，并用 Playwright/系统 Chrome 截图。
- Windows 下 `pnpm.cmd` / cmd script spawn 已兼容。
- `react-native-css-interop@0.2.4` 已声明为直接依赖。
- Playwright 托管 Chromium 缺失时，截图脚本可 fallback 到本机 Chrome / Edge。
- `thumbs/` 已重新生成三语 21 张真实运行截图，尺寸为 `780x1688`。

## 当前 active change

### `add-remote-skin-download-qa-entry`

已完成 proposal：

- `openspec/changes/add-remote-skin-download-qa-entry/proposal.md`

目标：

- 增加内部 QA/dev 入口，把链路串起来：

```text
local fixture/package -> publishing tool -> remote manifest URL -> source adapter -> downloader -> validation -> ready -> My 状态 UI
```

边界：

- 不是正式用户皮肤商店。
- 不引入生产远程 index 服务。
- 不新增远程 JavaScript、React component 或插件执行能力。
- 不改变当前 runtime storage 规则。

下一步：

```bash
/openflow spec add-remote-skin-download-qa-entry
```

## 最近验证摘要

最近已通过：

```bash
npm.cmd exec -- openspec list
npm.cmd exec -- openspec validate --all --strict
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm skin:package -- --help
git diff -- .ai
git diff --check
```

验证结果：

- OpenSpec：10 个 specs 全部通过，0 failed。
- `tests/skin`：13 个 test suites，73 个 tests，通过。
- source structure 测试：5 个 tests，通过。
- `.ai/` diff：空。

已知非阻塞情况：

- Git 可能提示 unreachable loose objects 较多，这是仓库维护提示；之前没有自动执行
  `git prune`。
- 部分 OpenSpec 主规格仍有归档生成的 `Purpose TBD` 文案，不影响当前实现。
- 如果本地缺少 Playwright 托管 Chromium，`pnpm thumbs` 会使用系统 Chrome / Edge
  fallback。

## 换电脑后恢复步骤

1. 克隆仓库并切到 `refactor/all` 或包含上述提交的分支。
2. 安装依赖：

```bash
corepack pnpm install --frozen-lockfile
```

如果本地网络需要镜像，使用临时覆盖，不要写回仓库配置：

```bash
pnpm --config.registry=https://registry.npmmirror.com install
```

3. 确认 OpenSpec 状态：

```bash
npm.cmd exec -- openspec list
```

预期：存在 active change `add-remote-skin-download-qa-entry`。

4. 跑核心验证：

```bash
pnpm check:type
pnpm test tests/skin --runInBand
pnpm test tests/support/source-structure.test.ts --runInBand
pnpm thumbs
```

## 后续建议

### P1：展开并实现 remote skin 下载 QA 入口

下一步执行：

```bash
/openflow spec add-remote-skin-download-qa-entry
```

然后按 OpenFlow build/close 完成内部 QA 链路。

### P1：建立固定手动验收脚本

建议后续开 change，把常用回归命令沉淀为脚本，例如：

```bash
pnpm check:skin
pnpm check:runtime
```

当前建议最小回归：

```bash
pnpm check:type
pnpm test tests/skin --runInBand
pnpm test tests/i18n --runInBand
pnpm test tests/pages/my/my-screen.test.tsx --runInBand
pnpm test tests/support/source-structure.test.ts --runInBand
pnpm test tests/support/thumbs-export.test.ts --runInBand
pnpm thumbs
npm.cmd exec -- openspec validate --all --strict
```

### P2：清理 i18n unused keys / check:local

后续应让 `pnpm check:local` 重新成为可靠阻塞项。若当前仍有历史 unused keys，应开一个小
change 清理或调整检查策略。

### P2：OpenSpec Purpose 清理

部分主规格仍保留自动归档生成的 `Purpose TBD` 文案。可以后续开小 change 统一补齐。

### P2：monorepo 物理拆分

产品/技术方案已经有 monorepo 规划规格，但当前代码仍是单 Expo app 项目。建议等 remote
skin QA 链路稳定后，再拆：

- `apps/mobile`
- `packages/core`
- `packages/skin-runtime`
- `packages/i18n`
- `packages/config`

## 继续工作边界

- 不要修改 `.ai/`，除非用户明确要求。
- 新实现优先跟随：
  - `src/app`：路由和启动 hook
  - `src/pages`：页面 UI
  - `src/store`：全局状态聚合
  - `src/skin`：皮肤下载、验证、初始化、运行时、存储、发布工具
- 项目根 `skins/` 只作为 bundled skin 源或本地 QA fixture 输入，不作为移动端运行时存储。
- 下载 skin 包只能进入 Expo FileSystem `documentDirectory/skins/`。
- 不允许远程任意 React 组件执行。
- 新用户可见文案必须同步三语。
