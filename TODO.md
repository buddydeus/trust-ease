# Trust Ease Handoff TODO

更新时间：2026-06-05
仓库：`D:\github\buddydeus\trust-ease`
当前分支：`refactor/all`

## 当前状态

- Git 工作区在本次 TODO 更新前是干净的。
- 当前分支 `refactor/all` 领先 `origin/refactor/all` 7 个提交，尚未 push。
- OpenSpec 当前没有 active changes。
- OpenSpec 主规格全量严格校验已通过：10 个 specs，0 failed。
- `.ai/` 最近几轮实现、归档和交接更新均未改动。
- 前端当前仍是单 Expo app 结构，monorepo 物理拆分尚未开始。

最近关键提交：

```text
757ee82 docs: record frontend QA outcome
f45f912 fix: detect current locale key usage
dc3e9f3 docs: refresh handoff TODO
6b2445e docs: archive remote skin QA spec
14c5783 test: add remote skin download QA entry
d8233b2 docs: specify remote skin QA flow
74d4634 docs: propose remote skin QA flow
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

- 根目录 `AGENTS.md` 已作为本仓库 AI 代理协作入口，作用类似 Claude Code 的 `CLAUDE.md`。
- 已明确项目定位、技术栈、目录边界、i18n 规则、皮肤运行时规则、测试命令和禁止事项。

### 2. 产品规划到技术方案

已通过 OpenFlow / OpenSpec 完成并归档：

- `define-monorepo-product-technical-plan`

主规格已经包含：

- `openspec/specs/monorepo-architecture/spec.md`
- `openspec/specs/operations-delivery-plan/spec.md`
- `openspec/specs/product-technical-plan/spec.md`
- `openspec/specs/security-compliance-plan/spec.md`

### 3. 项目结构契约重构

已通过 OpenFlow / OpenSpec 完成并归档：

- `normalize-project-structure-contracts`

完成内容：

- 强化 `tests/support/source-structure.test.ts`，把目录结构、根文档、截图脚本和 route boundary 写成可执行契约。
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
- `src/app/useSkinStorageSync.ts` 通过 `resolveSkinInitState` 决定 `activeSkinId` / `lastReadySkinId` / fallback，并写回持久化状态。
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
- 支持 direct manifest URL、可选 asset base URL、progress callback、retry policy、cancellation signal 和依赖注入。
- 远程包仍复用 `downloadSkinPackage` 的 staging、validation、promotion、fallback 和 package state 规则。
- 远程 adapter 只下载 manifest 与静态资源，不执行远程 React 组件、JavaScript 或插件代码。

### 7. Skin runtime status UI

已通过 OpenFlow / OpenSpec 完成 build 和 close，并归档：

- `add-skin-runtime-status-ui`

完成内容：

- My 页面新增 `src/pages/my/SkinRuntimeStatus.tsx`
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
- package hash canonicalization 固定路径分隔符、文件排序、manifest key 排序、`packageHash` 自引用规避和不安全路径拒绝规则。
- `src/skin/remoteSourceAdapter.ts` 在 descriptor 未提供显式 `packageHash` 时，改用 canonical helper。
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
- `pnpm skin:package -- check <skin-dir>` 校验 manifest asset hashes 与 canonical `packageHash`，不写文件。
- `pnpm skin:package -- update <skin-dir>` 写回 asset hashes 与 canonical `packageHash` 到 `manifest.json`。
- 主规格已合并：
  - `openspec/specs/skin-package-publishing-tooling/spec.md`

### 10. Remote skin download QA entry

已通过 OpenFlow / OpenSpec 完成 proposal、spec、build、close，并归档：

- `add-remote-skin-download-qa-entry`

完成内容：

- 新增 `tests/skin/remote-download-qa.test.ts`
- 新增 `pnpm skin:qa:remote`
- QA harness 使用本地临时 fixture，复用 `runSkinPackagePublishing` 准备 canonical hashes。
- QA harness 串联：

```text
local fixture -> publishing helper -> remote source adapter -> downloadSkinPackage -> validation -> ready/failed state -> My status UI boundary
```

- 覆盖 valid package ready promotion。
- 覆盖 stale package hash / stale asset hash 的可恢复失败。
- 覆盖 My 页面通过 props/status model 展示 remote QA ready/failed package state。
- 主规格已合并：
  - `openspec/specs/skin-downloader-runtime/spec.md`
  - `openspec/specs/skin-package-publishing-tooling/spec.md`

### 11. 真实运行截图链路

已修复并提交：

- `pnpm thumbs` 可完成 Expo Web 真实导出，并用 Playwright/系统 Chrome 截图。
- Windows 中 `pnpm.cmd` / cmd script spawn 已兼容。
- `react-native-css-interop@0.2.4` 已声明为直接依赖。
- Playwright 托管 Chromium 缺失时，截图脚本可 fallback 到本机 Chrome / Edge。
- `thumbs/` 可生成三语 21 张真实运行截图，尺寸为 `780x1688`。

## 最近验证摘要

最近已通过：

```bash
npm.cmd exec -- openspec list
npm.cmd exec -- openspec validate --all --strict
npm.cmd exec --package=pnpm@11.5.0 -- pnpm skin:qa:remote
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.test.tsx --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand
git diff -- .ai
```

验证结果：

- OpenSpec：10 个 specs 全部通过，0 failed。
- `tests/skin`：14 个 test suites，77 个 tests，通过。
- My 页面测试：9 个 tests，通过。
- source structure 测试：5 个 tests，通过。
- `.ai/` diff：空。

已知非阻塞情况：

- Git 可能提示 unreachable loose objects 较多，这是仓库维护提示；之前没有自动执行 `git prune`。
- 如果本地缺少 Playwright 托管 Chromium，`pnpm thumbs` 会使用系统 Chrome / Edge fallback。

## 自动化前端 QA 循环

本轮执行状态：已完成。

发现并修复的问题：

- `pnpm check:local` 误报 76 个 unused baseline keys。
- 问题记录：`.bugs/2026-06-05-check-local-unused-keys.md`
- 修复提交：`f45f912 fix: detect current locale key usage`
- 根因：`scripts/check-locals.js` 未识别当前代码中大量使用的单参数 `getMessage('key')` 形态。
- 修复：扩展 key usage 检测并补充 `tests/i18n/check-locals.test.ts` 回归 fixture。

本轮已通过的自动化 QA：

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm skin:qa:remote
npm.cmd exec --package=pnpm@11.5.0 -- pnpm thumbs
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

截图 QA：

- `pnpm thumbs` 已生成 21 张真实运行截图。
- 自动化截图体检通过：21 张、尺寸 `780x1688`、非空白。
- 抽查 `zh-CN/welcome.png`、`zh-CN/my.png`、`en-US/new-item.png`，未发现崩溃页或明显渲染错误。

若后续继续发现前端问题：

- 在 `.bugs/YYYY-MM-DD-<short-slug>.md` 中记录。
- 文档必须包含问题描述、问题定位、建议修复方式。
- 优先修复真实代码问题，不把失败测试简单改成放行。
- 修复后重新运行对应失败命令和完整 QA 命令。
- 每轮修复完成后按 commit-helper 提交。

建议后续固定化的 QA 命令顺序：

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm skin:qa:remote
npm.cmd exec --package=pnpm@11.5.0 -- pnpm thumbs
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

若发现问题：

- 在 `.bugs/YYYY-MM-DD-<short-slug>.md` 中记录。
- 优先修复真实代码问题，不把失败测试简单改成放行。
- 修复后重新运行对应失败命令和完整 QA 命令。
- 每轮修复完成后按 commit-helper 提交。

## 单机 App MVP 阶段规划

详细路线图已记录在：

- `docs/superpowers/plans/2026-06-05-single-device-mvp-roadmap.md`

单机 MVP 当前优先级高于 monorepo 物理拆分。原因是现有项目已经具备 Expo 原型、皮肤运行时、远程 skin QA 和截图 QA 底座，但核心产品闭环仍需要从静态页面推进到本地可用数据流。

单机 MVP 完成标准：

- 用户能完成 welcome/onboarding，并在后续启动进入正常主流程。
- 用户能创建、编辑、归档和查看本地重要事项。
- 用户能维护本地托付联系人/协助人，并把协助人关联到事项。
- 用户能配置并演练本地失联/申报触发策略，且不会触发不可逆执行。
- 首页或 My 页面能展示本地预案是否完整、下一步该做什么。
- 用户能本地导出/导入备份，且文案明确说明文件由用户自行保管。
- 全部能力不依赖后端、账户、同步、推送或远程任意代码执行。

阶段顺序：

1. `add-local-trust-item-data-model`：建立本地事项、协助人、触发策略、版本化存储契约。
2. `add-local-item-crud-workflow`：把事项页和新建事项页接入真实本地数据。
3. `add-local-helper-contact-workflow`：新增本地协助人/联系人维护和事项关联。
4. `add-local-trigger-policy-simulation`：把触发状态页推进为可撤回的本地策略与模拟演练。
5. `add-local-readiness-summary`：在 Home/My 展示预案完整度和下一步行动。
6. `add-local-backup-export-import`：提供本地备份导出/导入能力。
7. `add-single-device-mvp-qa-gate`：沉淀 `pnpm check:qa` 或等价 MVP QA 命令。

每个阶段必须独立执行：

```text
/openflow proposal <change-id>
/openflow spec <change-id>
/openflow build <change-id>
/openflow close <change-id>
/commit-helper
```

阶段末验证固定要求：

```bash
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

并按阶段范围追加：

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test <focused-test> --runInBand
```

下一步应从这里开始：

```text
/openflow proposal add-local-trust-item-data-model
```

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
npm.cmd exec -- openspec validate --all --strict
```

预期：

- `openspec list` 显示 `No active changes found.`
- `openspec validate --all --strict` 全部通过。

4. 跑核心验证：

```bash
pnpm check:type
pnpm test tests/skin --runInBand
pnpm test tests/support/source-structure.test.ts --runInBand
pnpm skin:qa:remote
pnpm thumbs
```

## 后续建议

### P1：执行自动化前端 QA 循环

当前会按用户要求立即执行。重点覆盖：

- 类型检查
- i18n 文案检查
- 全量 Jest
- skin runtime / remote QA
- 真实截图导出
- OpenSpec 全量严格校验

### P1：建立固定手动/本地回归脚本

建议后续开 change，把常用回归命令沉淀为脚本，例如：

```bash
pnpm check:skin
pnpm check:runtime
pnpm check:qa
```

### P2：清理 i18n unused keys / check:local

应让 `pnpm check:local` 成为可靠阻塞项。若当前仍有历史 unused keys，应开小 change 清理或调整检查策略。

### P2：OpenSpec Purpose 清理

部分主规格可能仍保留自动归档生成的 `Purpose TBD` 文案。可后续开小 change 统一补齐。

### P2：monorepo 物理拆分

产品/技术方案已有 monorepo 规划规格，但当前代码仍是单 Expo app 项目。建议等自动化 QA 稳定后再拆：

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
