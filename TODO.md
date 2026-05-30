# Trust Ease Handoff TODO

更新时间：2026-05-30  
仓库：`D:\github\buddydeus\trust-ease`

## 当前状态

- OpenSpec 当前没有 active change：`openspec list` 显示 `No active changes found.`。
- `.ai/` 未被本轮工作修改。
- 最近几个 OpenFlow change 已完成 build 和 close，并归档到
  `openspec/changes/archive/`。
- 当前工作区仍有未提交改动。换电脑前建议先提交到 GitHub。

## 已完成内容

### 1. 仓库协作入口

- 新增/完善根目录 `AGENTS.md`，作为本仓库 AI 代理协作入口，作用类似
  Claude Code 的 `CLAUDE.md`。
- 明确了项目定位、技术栈、目录边界、i18n 规则、皮肤运行时规则、测试命令和
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
- 扩展 skin 类型：
  - `SkinPackageKey`
  - `SkinPackageFailureReason`
  - `SkinInitStatus`
  - `SkinPackageIdentity`
  - `SkinPackageOperationResult`
- 扩展 store 最小初始化状态：
  - `skinInitStatus`
  - `skinInitUsedFallback`
  - `setSkinInitStatus`
- `src/app/useSkinStorageSync.ts` 现在通过 `resolveSkinInitState` 决定
  `activeSkinId` / `lastReadySkinId` / fallback，并写回持久化状态。
- `README.md` 和 `AGENTS.md` 已同步 skin runtime 边界说明。
- 主规格已合并：
  - `openspec/specs/app-init-state-machine/spec.md`
  - `openspec/specs/skin-downloader-runtime/spec.md`

## 历史执行与验证摘要

最近已通过的验证：

```bash
npm.cmd exec -- openspec validate add-skin-downloader-init-state-machine --strict
jest tests/skin --runInBand
jest tests/support/source-structure.test.ts --runInBand
jest tests/pages/my/my-screen.test.tsx --runInBand
tsc --noEmit
git diff -- .ai
```

验证结果：

- `tests/skin`：10 个 test suite，44 个 tests，通过。
- `tests/support/source-structure.test.ts`：通过。
- `tests/pages/my/my-screen.test.tsx`：通过。
- TypeScript：通过。
- `.ai/` diff：空。
- `git diff --check`：无空白错误，仅 Windows CRLF 提示。

已知非阻塞情况：

- `node scripts/check-locals.js` 当前会因为项目既有 unused baseline keys 失败。
  本次没有新增用户可见文案，因此没有把它作为阻塞项。
- 仓库 `.npmrc` 使用 `registry=https://registry.npmmirror.com`。如果新电脑安装依赖时
  遇到 Expo 包镜像滞后，可以临时使用官方 registry：

```bash
pnpm --config.registry=https://registry.npmjs.org install
```

## 当前未提交内容

截至本文件生成时，`git status --short --untracked-files=all` 显示的相关未提交内容包括：

```text
M  AGENTS.md
M  README.md
M  src/app/useSkinStorageSync.ts
M  src/skin/paths.ts
M  src/skin/types.ts
M  src/store/useAppStore.ts
M  tests/skin/paths.test.ts
?? docs/superpowers/plans/2026-05-29-add-skin-downloader-init-state-machine.md
?? openspec/changes/archive/2026-05-29-add-skin-downloader-init-state-machine/
?? openspec/specs/app-init-state-machine/spec.md
?? openspec/specs/skin-downloader-runtime/spec.md
?? src/skin/downloader.ts
?? src/skin/initStateMachine.ts
?? src/skin/packageValidation.ts
?? tests/skin/downloader.test.ts
?? tests/skin/init-state-machine.test.ts
?? tests/skin/package-validation.test.ts
```

提交前建议再跑：

```bash
npm.cmd exec -- openspec list
npm.cmd exec -- openspec validate --strict
jest tests/skin --runInBand
jest tests/support/source-structure.test.ts --runInBand
jest tests/pages/my/my-screen.test.tsx --runInBand
tsc --noEmit
git diff -- .ai
```

## 换电脑后恢复步骤

1. 克隆仓库并切到包含本次提交的分支。
2. 安装依赖：

```bash
pnpm install
```

如果镜像缺包，改用：

```bash
pnpm --config.registry=https://registry.npmjs.org install
```

3. 确认 OpenSpec 状态：

```bash
npm.cmd exec -- openspec list
```

预期：没有 active changes。

4. 跑核心验证：

```bash
jest tests/skin --runInBand
jest tests/support/source-structure.test.ts --runInBand
jest tests/pages/my/my-screen.test.tsx --runInBand
tsc --noEmit
```

## 后续建议

### 优先级 P0：先提交当前成果

- 当前工作区包含已经完成并归档的 OpenSpec change 和实现文件。
- 建议先 commit，再开始新 change，避免后续工作混入。

### 优先级 P1：依赖锁定策略

- 当前项目未明确提交 `pnpm-lock.yaml`。
- 建议开一个独立 OpenFlow change 处理依赖锁定策略，避免不同机器解析出不同
  Expo/Jest/React 版本。
- 之前验证中已遇到过：
  - `npmmirror` 镜像滞后导致 Expo 相关包解析失败。
  - Jest 30 与 React Native/Jest Expo 29 系列环境不匹配。
  - `react-test-renderer` 需要与实际 React 版本对齐。

### 优先级 P1：真实远程 skin source adapter

当前 downloader 已经有 source adapter 边界，但第一版实现主要覆盖 staged/local package
生命周期。下一步可以新增：

- 远程 URL source adapter。
- 下载进度。
- 网络失败、重试、取消。
- 远程 manifest/index 获取策略。
- 包签名或更强 integrity 策略。

建议新开：

```text
/openflow proposal add-remote-skin-source-adapter
```

### 优先级 P1：skin UI 状态展示

当前 store 已暴露最小状态：

- `skinInitStatus`
- `skinInitUsedFallback`
- `skinPackageStates`

但页面没有新增 UI 文案或状态展示。后续可以决定是否在 My 页或设置页展示：

- checking
- downloading
- failed
- incompatible
- fallback occurred

如果做 UI，需要同步三语：

- `src/locals/zh-CN.json`
- `src/locals/zh-TW.json`
- `src/locals/en-US.json`

并运行：

```bash
pnpm check:local
```

注意：当前 `check-locals.js` 有既有 unused keys 失败，可能需要先修脚本策略或清理未使用文案。

### 优先级 P2：包 hash 真实算法

当前 package validation 已有 packageHash 和 asset hash 契约，但真实 package hash 计算策略仍可深化：

- 确定文件排序。
- 确定 hash 输入格式。
- 区分 manifest hash、asset hash、archive hash。
- 处理平台路径分隔符。

建议放在 downloader 后续 change 中做。

### 优先级 P2：完整 monorepo 物理拆分

产品/技术方案已经有 monorepo 规划规格，但当前代码仍是单 Expo app 项目。未来可以逐步拆：

- `apps/mobile`
- `packages/core`
- `packages/skin-runtime`
- `packages/i18n`
- `packages/config`

拆分前建议先确保依赖锁定策略完成。

### 优先级 P2：文档 Purpose 清理

部分 OpenSpec archive 生成的主规格可能仍有自动生成的：

```text
Purpose
TBD - created by archiving change ...
```

可以后续开一个小 change 统一补齐主规格 Purpose，不影响当前实现。

## 继续工作时的边界提醒

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
