# Trust Ease Handoff TODO

更新时间：2026-06-09
仓库：`D:\github\buddydeus\trust-ease`
当前分支：`refactor/all`
当前恢复入口：先读本文件，再读 `AGENTS.md`、`README.md`、`docs/operations/macos-ios-handoff.md`

## 1. 项目需求摘要

`Trust Ease` 是基于 Expo Router 的移动端原型，当前产品语境是“安心 App”：

- 帮用户在本地整理重要事项、可信联系人、触发策略和备份。
- 单机 MVP 不依赖后端、账号、云同步、短信、邮件或推送。
- 产品表达要温和、克制、可信，避免恐惧、殡葬化、销售化和不可逆自动执行暗示。
- 当前能力不是遗嘱、公证、律师意见或第三方账号接管方案。
- 远程皮肤能力只允许下载 manifest 和静态资源，不允许执行远程 React、JavaScript 或插件代码。

当前路线：

1. 先完成单机 App MVP。
2. 用可重复 QA gate 进入测试。
3. 在 macOS / iOS 真机上验证。
4. 修复 `.bugs/*.md` 记录的问题。
5. 单机 MVP 稳定后，再考虑 monorepo 物理拆分和联网 App 能力。

## 2. 会话上下文与已确认决策

- 不修改 `.ai/`，除非用户明确要求。
- OpenFlow / Superpowers 计划按旧标准放在 `docs/superpowers/plans/`。
- AI 代理协作入口是 `AGENTS.md`，作用类似 Claude Code 的 `CLAUDE.md`。
- 依赖使用 `pnpm@11.5.0`，`pnpm-lock.yaml` 必须保留并提交。
- 运行时截图必须走真实 Expo Web bundle：`pnpm thumbs` / `pnpm check:qa:runtime`。
- 前端 QA 问题记录到 `.bugs/*.md`，字段至少包含问题描述、复现路径、问题定位、建议修复方式、验证方式。
- 当前不建议切换到 Vite/Vitest 主链路；移动 MVP 继续使用 Expo / Metro / Jest。以后可以只给纯 TS package 局部引入 Vitest。
- Windows 侧已经完成 QA gate 和文档整理；下一阶段重点是上传 GitHub 后在 macOS 上打 iOS 真机测试包。

## 3. 当前仓库状态

截至 2026-06-09 当前核对结果：

- Git 分支：`refactor/all`
- Git 工作区：本次文档更新前干净；当前有待提交的 handoff 文档更新
- 最近提交：

```text
3553d86 style: normalize React imports and tooling config
4d0b676 style: format local app implementation
d164dbc feat: add single device MVP QA gate
70ceaa5 docs: refresh handoff TODO
f78d835 docs: archive local backup export import
5366298 feat: add local backup export import
```

- OpenSpec active changes：无
- OpenSpec 全量 strict 校验：17 passed / 0 failed
- 当前物理结构：仍是单 Expo app，尚未进行 monorepo 物理拆分
- iOS 真机打包状态：
  - `package.json` 已有 `build:ios: expo run:ios`
  - `app.json` 尚未配置 `ios.bundleIdentifier`
  - 仓库尚未新增 `eas.json`
  - Windows 不能本地打 iOS 原生包；后续建议在 macOS/Xcode 或 EAS Build 上继续

最近已验证命令：

```bash
npm.cmd exec --package=@fission-ai/openspec -- openspec list
npm.cmd exec --package=@fission-ai/openspec -- openspec validate --all --strict
```

预期：

- `openspec list` -> `No active changes found.`
- `openspec validate --all --strict` -> `17 passed, 0 failed`

## 4. 已完成内容

### 4.1 协作入口与项目规则

- `AGENTS.md` 已建立仓库级代理协作规则。
- `README.md` 已记录项目定位、安装、常用命令、QA gate、真实截图链路、皮肤运行时说明。
- `.bugs/README.md` 已定义前端 QA bug 报告格式。

### 4.2 产品规划到技术方案

已完成并归档：

- `define-monorepo-product-technical-plan`
- `normalize-project-structure-contracts`

主规格包含：

- `openspec/specs/monorepo-architecture/spec.md`
- `openspec/specs/operations-delivery-plan/spec.md`
- `openspec/specs/product-technical-plan/spec.md`
- `openspec/specs/security-compliance-plan/spec.md`
- `openspec/specs/documentation-contracts/spec.md`
- `openspec/specs/project-structure-contracts/spec.md`

### 4.3 Skin 运行时与远程皮肤基础设施

已完成并归档：

- `add-skin-downloader-init-state-machine`
- `add-remote-skin-source-adapter`
- `add-skin-runtime-status-ui`
- `add-skin-package-hash-canonicalization`
- `add-skin-package-publishing-tooling`
- `add-remote-skin-download-qa-entry`

当前能力：

- staging -> validation -> ready promotion
- active / last ready / bundled fallback 启动恢复
- canonical `packageHash`
- `pnpm skin:package -- check <skin-dir>`
- `pnpm skin:package -- update <skin-dir>`
- `pnpm skin:qa:remote`
- 本地 fixture / dependency injection QA，不引入真实远程商店

### 4.4 单机 App MVP

已完成并归档：

- `add-local-trust-item-data-model`
- `add-local-item-crud-workflow`
- `add-local-helper-contact-workflow`
- `add-local-trigger-policy-simulation`
- `add-local-readiness-summary`
- `add-local-backup-export-import`

当前本地闭环：

- 首次启动 welcome
- 正式申报记录
- 本地事项 create / edit / archive
- 本地 helper/contact create / edit / archive
- 事项关联 helper
- trigger policy simulation：开始演练、暂停、恢复、重置
- readiness summary
- 本地 backup export / import
- 皮肤运行时状态展示
- 三语文案：`zh-CN`、`zh-TW`、`en-US`

### 4.5 单机 MVP QA gate

已完成并归档：

- `add-single-device-mvp-qa-gate`

新增命令：

```bash
pnpm check:qa
pnpm check:qa:runtime
pnpm check:qa:all
```

覆盖：

- TypeScript strict check
- locale alignment
- core Jest suites
- remote skin QA fixture
- OpenSpec full strict validation
- runtime thumbnails through real Expo Web bundle

主规格：

- `openspec/specs/single-device-mvp-qa-gate/spec.md`

## 5. macOS 设备恢复步骤

1. 克隆仓库并切换到 `refactor/all` 或包含最新提交的分支。

2. 确认工具：

```bash
node --version
corepack --version
xcodebuild -version
```

要求：

- Node.js >= 22
- pnpm >= 11
- Xcode 已安装并完成首次启动
- 如果本地原生构建需要 CocoaPods，按 Xcode / Expo 提示安装

3. 安装依赖：

```bash
corepack enable
corepack pnpm install --frozen-lockfile
```

4. 先跑仓库健康检查：

```bash
pnpm check:qa
pnpm check:qa:runtime
npm exec --package=@fission-ai/openspec -- openspec validate --all --strict
```

5. 启动开发预览：

```bash
pnpm start
```

在 Expo 终端中：

- 按 `w` 测 Web
- 用 iPhone / Expo Go 扫码做轻量预览

## 6. iOS 真机测试计划

详细操作见：

- `docs/operations/macos-ios-handoff.md`

推荐顺序：

1. 补 `app.json` 的 `ios.bundleIdentifier`。
2. 新增 `eas.json`，定义 `preview` internal distribution profile。
3. 在 macOS 或 EAS 环境先跑：

```bash
pnpm check:qa
pnpm check:qa:runtime
```

4. 选择一种 iOS 真机路径：

本地 Mac / Xcode：

```bash
pnpm build:ios
```

EAS 云构建：

```bash
npm install --global eas-cli
eas login
eas build:configure
eas device:create
eas build --platform ios --profile preview
```

5. QA 使用 iPhone 安装后，重点测试：

- 首次启动 welcome
- 开始设置 -> home
- 再次打开不重复进入 welcome
- items CRUD
- helpers CRUD
- item-helper association
- trigger-state simulation
- readiness summary
- backup export/import
- my page skin runtime status
- 三语展示
- iOS 文件选择、分享、存储相关行为

6. 问题写入 `.bugs/*.md`，修复后重跑：

```bash
pnpm check:qa
pnpm check:qa:runtime
```

## 7. 后续计划

### P0：上传 GitHub 前

- 执行 `/commit-helper`，提交当前文档更新。
- 确认 `git status --short` 干净。
- 推送 `refactor/all` 或按需要创建 PR。

建议命令：

```bash
git status --short
pnpm check:qa
npm exec --package=@fission-ai/openspec -- openspec validate --all --strict
```

### P1：macOS / iOS 真机准备

建议新开 OpenFlow change：

```text
add-ios-device-testing-build-profile
```

范围：

- `app.json` 增加 `ios.bundleIdentifier`
- 新增 `eas.json`
- 更新 iOS QA / install docs
- 验证 `pnpm check:qa`
- 在 macOS 或 EAS 上产出 iOS 真机测试包

### P2：单机 MVP QA 循环

- 运行 `pnpm check:qa:all`
- 做真机手工 QA
- 将问题记录到 `.bugs/*.md`
- 修复问题
- 重跑 QA gate
- 每个修复阶段执行 `/commit-helper`

### P3：稳定后再做结构演进

稳定后再考虑：

- monorepo 物理拆分
- shared domain package
- backend skeleton
- account / sync / notification / remote helper workflow
- future pure-TS Vitest slice

## 8. 常见坑

- 不要把 `.ai/` 当作需要上传给 QA 的正式交接入口。
- 不要在 iOS 真机测试前切 Vite/Vitest 主链路。
- Windows 上不能本地打 iOS 原生包；要用 macOS/Xcode 或 EAS Build。
- `app.json` 当前缺 `ios.bundleIdentifier`，EAS/iOS 构建前必须补。
- `eas.json` 当前不存在，EAS 构建前必须补。
- `pnpm thumbs` 是真实运行时截图，不是设计预览。
- `.bugs/*.md` 是 QA 问题的长期记录位置。
- OpenSpec CLI 建议通过 `npm exec --package=@fission-ai/openspec -- openspec ...` 调用。
- Windows 上的 LF/CRLF 警告通常不是功能问题，但提交前需要看真实 diff。
