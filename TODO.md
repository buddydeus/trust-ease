# Trust Ease Handoff TODO

更新时间：2026-06-04
仓库：`D:\github\buddydeus\trust-ease`
当前分支：`refactor/all`

## 当前状态

- Git 工作区在更新本文档前是干净的，`refactor/all` 与 `origin/refactor/all` 同步。
- OpenSpec 当前没有 active change：`npm.cmd exec -- openspec list` 显示 `No active changes found.`。
- OpenSpec 全量严格校验通过：9 个 specs，0 failed。
- `.ai/` 未被最近几轮实现、归档和修复工作修改。
- 真实运行截图链路 `pnpm thumbs` 已修复并通过，可生成三语 21 张手机截图。

最近关键提交：

```text
19ce6b5 fix: restore runtime thumbnail export
0f15aa5 docs: archive skin runtime status UI spec
1f5ffbd feat: add skin runtime status UI
603de13 feat: add remote skin downloads and dependency locking
e7da87d feat: add skin downloader and init state machine
7adfe10 refactor: normalize project structure contracts
d52bdd9 docs: monorepo product plan and agent contracts
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
- 拆分 `src/app/_layout.tsx` 的启动副作用：
  - `src/app/usePreviewRouteSync.ts`
  - `src/app/useSkinStorageSync.ts`
  - `src/app/usePreviewReadyMarker.ts`
- 拆分 `src/pages/my/MyScreen.tsx` 的本地组件和类型：
  - `src/pages/my/types.ts`
  - `src/pages/my/SettingsCard.tsx`
  - `src/pages/my/LanguagePicker.tsx`
  - `src/pages/my/SkinPicker.tsx`
- 拆分 `src/skin/manifest.ts` 内部 helper：
  - `src/skin/manifestError.ts`
  - `src/skin/manifestKeys.ts`
  - `src/skin/manifestReaders.ts`
  - `src/skin/manifestSections.ts`
- 主规格已合并：
  - `openspec/specs/documentation-contracts/spec.md`
  - `openspec/specs/project-structure-contracts/spec.md`

### 4. Skin downloader + app init state machine

已通过 OpenFlow / OpenSpec 完成 build 和 close，并归档：

- `add-skin-downloader-init-state-machine`

完成内容：

- 新增下载包初始化状态机：
  - `src/skin/initStateMachine.ts`
  - `tests/skin/init-state-machine.test.ts`
- 新增下载包验证器：
  - `src/skin/packageValidation.ts`
  - `tests/skin/package-validation.test.ts`
- 新增 downloader staging/promote 生命周期：
  - `src/skin/downloader.ts`
  - `tests/skin/downloader.test.ts`
- 扩展 runtime path：
  - `src/skin/paths.ts`
  - `tests/skin/paths.test.ts`
- 扩展 store 最小初始化状态：
  - `skinInitStatus`
  - `skinInitUsedFallback`
  - `skinPackageStates`
- `src/app/useSkinStorageSync.ts` 通过 `resolveSkinInitState` 决定
  `activeSkinId` / `lastReadySkinId` / fallback，并写回持久化状态。
- 主规格已合并：
  - `openspec/specs/app-init-state-machine/spec.md`
  - `openspec/specs/skin-downloader-runtime/spec.md`

### 5. 依赖锁定策略

已通过 OpenFlow / OpenSpec 完成并归档：

- `define-dependency-lock-strategy`

完成内容：

- 新增正式规格：`openspec/specs/dependency-reproducibility/spec.md`
- `package.json` 固定 `packageManager: pnpm@11.5.0`。
- `pnpm-lock.yaml` 已提交到版本控制。
- `.npmrc` 默认 registry 使用官方 npm registry。
- `.gitignore` 已忽略本地缓存：
  - `.npm-cache/`
  - `.pnpm-store/`
  - `.expo/`

### 6. 真实远程 skin source adapter

已通过 OpenFlow / OpenSpec 完成 build 和 close，并归档：

- `add-remote-skin-source-adapter`

完成内容：

- 新增远程 source adapter：`src/skin/remoteSourceAdapter.ts`
- 新增测试：`tests/skin/remote-source-adapter.test.ts`
- 远程 adapter 支持：
  - direct manifest URL
  - 可选 asset base URL
  - 远程 manifest 获取
  - manifest 声明 asset 的 URL 解析与 staging 写入
  - progress callback
  - retry policy
  - cancellation signal
  - fetch / file write / wait / package hash 依赖注入
- 远程包仍复用现有 `downloadSkinPackage` 的 staging、validation、promotion、
  fallback 和 package state 规则。
- 远程 adapter 只下载 manifest 与静态资源，不执行远程 React 组件、远程
  JavaScript 或插件代码。

### 7. Skin runtime status UI

已通过 OpenFlow / OpenSpec 完成 build 和 close，并归档：

- `add-skin-runtime-status-ui`

完成内容：

- My 页新增皮肤运行时状态卡：`src/pages/my/SkinRuntimeStatus.tsx`
- `src/app/(tabs)/my.tsx` 从 store 注入：
  - `activeSkinId`
  - `skinInitStatus`
  - `skinInitUsedFallback`
  - `skinPackageStates`
- 三语新增状态文案：
  - `src/locals/zh-CN.json`
  - `src/locals/zh-TW.json`
  - `src/locals/en-US.json`
- 新增/更新测试：
  - `tests/pages/my/my-screen.test.tsx`
  - `tests/pages/my/my-screen.i18n.test.tsx`
- 覆盖 ready、fallback、failed、incompatible package state 展示。
- 主规格已合并：
  - `openspec/specs/app-init-state-machine/spec.md`
  - `openspec/specs/skin-downloader-runtime/spec.md`

### 8. 真实运行截图链路

已修复并提交：

- `pnpm thumbs` 现在可以完成 Expo Web 真实导出，并用 Playwright/系统 Chrome 截图。
- Windows 下 `pnpm.cmd` / cmd script spawn 已兼容。
- `react-native-css-interop@0.2.4` 已声明为直接依赖，解决 pnpm 隔离依赖下 Expo
  Web bundling 找不到 `react-native-css-interop/jsx-runtime` 的问题。
- Playwright 托管 Chromium 缺失时，截图脚本可 fallback 到本机 Chrome / Edge。
- Expo typed routes 生成后，预览路由跳转已收窄为受支持的页面路径。
- `thumbs/` 已重新生成三语 21 张真实运行截图，尺寸为 `780x1688`。

## 最近验证摘要

最近已通过：

```bash
npm.cmd exec -- openspec list
npm.cmd exec -- openspec validate --all --strict
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/i18n --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.test.tsx --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.i18n.test.tsx --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/thumbs-export.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm thumbs
git diff -- .ai
git diff --check
```

验证结果：

- OpenSpec：9 个 specs 全部通过，0 failed。
- `tests/skin`：11 个 test suites，52 个 tests，通过。
- `tests/i18n`：2 个 test suites，6 个 tests，通过。
- My 页测试：7 个 tests，通过。
- source structure 测试：5 个 tests，通过。
- thumbs export 测试：6 个 tests，通过。
- `pnpm thumbs`：三语 21 张真实运行截图生成成功。
- `.ai/` diff：空。
- `git diff --check`：无空白错误，仅 Windows CRLF 提示。

已知非阻塞情况：

- Git 可能提示 unreachable loose objects 较多，这是仓库维护提示；之前没有自动执行
  `git prune`。
- 如果本地缺少 Playwright 托管 Chromium，`pnpm thumbs` 会使用系统 Chrome / Edge
  fallback。若希望完全使用 Playwright 托管浏览器，可另行运行：

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm exec playwright install chromium
```

## 换电脑后恢复步骤

1. 克隆仓库并切到 `refactor/all` 或包含上述提交的分支。
2. 安装依赖：

```bash
corepack pnpm install --frozen-lockfile
```

如果本机没有启用 Corepack，也可以使用全局同版本 `pnpm@11.5.0`。如果本地网络需要镜像，使用临时覆盖，不要写回仓库配置：

```bash
pnpm --config.registry=https://registry.npmmirror.com install
```

3. 确认 OpenSpec 状态：

```bash
npm.cmd exec -- openspec list
```

预期：没有 active changes。

4. 跑核心验证：

```bash
pnpm check:type
pnpm test tests/skin --runInBand
pnpm test tests/support/source-structure.test.ts --runInBand
pnpm thumbs
```

## 后续建议

### P0：提交本 TODO 更新

本文档更新后，工作区会只包含 `TODO.md` 的文档变更。建议提交后再开下一个
OpenFlow change。

### P1：固化 skin package hash canonicalization

建议下一个 OpenFlow change：

```bash
/openflow proposal add-skin-package-hash-canonicalization
```

目标：

- 明确 package hash 的 canonical 输入格式。
- 固定文件排序规则。
- 固定路径分隔符规则，保证跨平台一致。
- 区分 manifest hash、asset hash、package hash / archive hash。
- 增加跨平台稳定性测试。

这个优先级高，因为它直接影响远程 skin 包可信校验。

### P1：增加 remote skin 下载 QA 入口

在 package hash 规则稳定后，再做一个内部 QA/dev 入口，把链路串起来：

```text
remote manifest URL -> source adapter -> downloader -> validation -> ready package -> My 状态 UI
```

建议先做受控测试入口，不急着做正式用户皮肤商店。

### P1：建立固定手动验收清单

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

后续应让 `pnpm check:local` 重新成为可靠阻塞项。若当前仍有历史 unused keys，应开一个小 change 清理或调整检查策略。

### P2：monorepo 物理拆分

产品/技术方案已经有 monorepo 规划规格，但当前代码仍是单 Expo app 项目。建议等 skin 下载链路和 hash 契约稳定后，再拆：

- `apps/mobile`
- `packages/core`
- `packages/skin-runtime`
- `packages/i18n`
- `packages/config`

### P2：OpenSpec Purpose 清理

部分主规格可能仍保留自动归档生成的 `Purpose TBD` 文案。可以后续开小 change 统一补齐，不影响当前实现。

## 继续工作边界

- 不要修改 `.ai/`，除非用户明确要求。
- 新实现优先跟随：
  - `src/app`：路由和启动 hook
  - `src/pages`：页面 UI
  - `src/store`：全局状态聚合
  - `src/skin`：皮肤下载、验证、初始化、运行时、存储
- 项目根 `skins/` 只作为 bundled skin 源，不作为移动端运行时存储。
- 下载 skin 包只能进入 Expo FileSystem `documentDirectory/skins/`。
- 不允许远程任意 React 组件执行。
- 新用户可见文案必须同步三语。
