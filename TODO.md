# Trust Ease Handoff TODO

更新时间：2026-06-05
仓库：`D:\github\buddydeus\trust-ease`
当前分支：`refactor/all`

## 当前状态

- 当前 `HEAD`：`8e3ebc0 docs: archive local helper contact workflow`
- 本地分支相对 `origin/refactor/all`：ahead 2 commits
- OpenSpec active changes：无
- OpenSpec 全量 strict 校验：13 passed / 0 failed
- `.ai/` 本轮不应修改，最近 build/close 均保持 `.ai/` diff 为空
- 项目仍是单 Expo app 物理结构；monorepo 物理拆分尚未开始
- 当前优先级：先完成单机 App MVP 的本地数据闭环，再考虑联网能力和 monorepo 物理拆分

最近关键提交：

```text
8e3ebc0 docs: archive local helper contact workflow
190d323 feat: add local helper contact workflow
7de24cd docs: archive local item CRUD workflow
f34acc4 feat: add local item CRUD workflow
d13c495 docs: specify local item CRUD workflow
b6f488f docs: propose local item CRUD workflow
412df05 docs: archive local trust data model spec
144e8cf feat: add local trust data model
5dbf213 docs: specify local trust data model
8e2e490 docs: propose local trust data model
a72ebce docs: plan standalone MVP phases
```

## 已完成内容

### 协作入口与项目规则

- 根目录 `AGENTS.md` 已作为仓库 AI 代理协作入口，作用类似 Claude Code 的 `CLAUDE.md`。
- 已明确项目定位、技术栈、目录边界、i18n 规则、皮肤运行时规则、测试命令和禁止事项。
- `.ai/archive/` 仅作为历史背景，不作为当前实现事实。

### 产品规划到技术方案

已完成并归档：

- `define-monorepo-product-technical-plan`

主规格已包含：

- `openspec/specs/monorepo-architecture/spec.md`
- `openspec/specs/operations-delivery-plan/spec.md`
- `openspec/specs/product-technical-plan/spec.md`
- `openspec/specs/security-compliance-plan/spec.md`

### 项目结构契约重构

已完成并归档：

- `normalize-project-structure-contracts`

完成内容：

- 强化 `tests/support/source-structure.test.ts`
- 约束目录结构、根文档、截图脚本和 route boundary
- 拆分启动副作用、My 页面局部组件、skin manifest helper
- 主规格已合并：
  - `openspec/specs/documentation-contracts/spec.md`
  - `openspec/specs/project-structure-contracts/spec.md`

### Skin 运行时与远程皮肤基础设施

已完成并归档：

- `add-skin-downloader-init-state-machine`
- `add-remote-skin-source-adapter`
- `add-skin-runtime-status-ui`
- `add-skin-package-hash-canonicalization`
- `add-skin-package-publishing-tooling`
- `add-remote-skin-download-qa-entry`

当前能力：

- 皮肤下载遵循 staging -> validation -> ready promotion。
- 启动恢复 active / last ready / fallback。
- 远程 source adapter 只下载 manifest 和静态资源，不执行远程 React、JavaScript 或插件代码。
- package hash 已 canonicalize。
- `pnpm skin:package -- check <skin-dir>` 只校验。
- `pnpm skin:package -- update <skin-dir>` 写回 asset hashes 和 canonical `packageHash`。
- `pnpm skin:qa:remote` 使用本地临时 fixture 与依赖注入，不引入真实网络或用户可见入口。

### 依赖锁定与真实截图链路

已完成：

- `package.json` 固定 `packageManager: pnpm@11.5.0`
- `pnpm-lock.yaml` 已提交
- `.npmrc` 默认 registry 使用官方 npm registry
- `openspec/specs/dependency-reproducibility/spec.md` 已进入主规格
- `pnpm thumbs` 可完成 Expo Web 真实导出，并用 Playwright/系统 Chrome 截图
- 缺少 Playwright 托管 Chromium 时，截图脚本可 fallback 到本机 Chrome / Edge

## 单机 App MVP 进度

单机 MVP 目标：无后端、无账号、无同步、无推送依赖，先完成本地产品闭环。

### Phase 1：本地 trust 数据模型

已完成 build / close / commit / archive：

- `add-local-trust-item-data-model`

能力：

- 本地 AsyncStorage-backed versioned snapshot
- 支持 `items`、`helpers`、`triggerPolicy`
- corrupted / missing / unsupported future schema version 安全回退默认 snapshot
- archived records 保留在本地，active selectors 排除归档记录

主规格：

- `openspec/specs/local-trust-data-model/spec.md`

### Phase 2：本地事项 CRUD workflow

已完成 build / close / commit / archive：

- `add-local-item-crud-workflow`

能力：

- 本地事项 create / edit / archive
- `ItemsScreen` 渲染 active items、空状态、编辑和归档动作
- `ItemFormScreen` 支持 title、kind、summary、必填校验、保存、initialValues
- routes 保持轻薄，由 `src/app` 绑定 storage / i18n / navigation
- 三语文案已同步

主规格：

- `openspec/specs/local-item-crud-workflow/spec.md`

### Phase 3：本地 helper/contact workflow

已完成 build / close / commit / archive：

- `add-local-helper-contact-workflow`

关键提交：

- `190d323 feat: add local helper contact workflow`
- `8e3ebc0 docs: archive local helper contact workflow`

能力：

- 本地 trusted helper/contact create / edit / archive
- helper 列表、新建、编辑 routes 与页面
- My 页面增加 helper 管理入口
- 事项新建/编辑流程可选择 active helpers，并持久化 `helperIds`
- 不接入通讯录、后端、推送、真实网络或自动消息发送
- 文案明确 local-only，不暗示法律授权、公证或自动执行
- 三语文案已同步

主规格：

- `openspec/specs/local-helper-contact-workflow/spec.md`

最近验证：

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test --runInBand
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

结果：

- Jest：39 suites / 175 tests passed
- OpenSpec：13 passed / 0 failed
- `.ai/` diff：空

## 下一步

当前应继续：

```text
/openflow proposal add-local-trigger-policy-simulation
```

目标：新增本地触发策略与演练/模拟状态，让用户能理解预警、确认、暂停和演练状态，但不触发真实消息、推送、联网执行或不可逆动作。

建议规格覆盖：

- 本地 `triggerPolicy` 的可读配置与状态解释
- 演练/模拟入口，不产生真实通知
- 失联预警、等待确认、暂停、恢复等状态的本地状态机
- 首页或 trigger-state 页面展示当前状态与下一步动作
- 高风险动作必须可撤回、可解释，不把单次失联表现为自动执行
- 不接入后端、推送、短信、邮件、通讯录或真实联系人通知
- 三语文案同步
- route / page / store 边界继续遵守现有结构

后续阶段顺序：

1. `add-local-trigger-policy-simulation`
2. `add-local-readiness-summary`
3. `add-local-backup-export-import`
4. `add-single-device-mvp-qa-gate`
5. 单机 MVP 稳定后，再考虑 monorepo 物理拆分
6. 联网 App 能力放到单机闭环后，包括账户、同步、加密备份、通知、远程协助人流程等

每个阶段建议独立执行：

```text
/openflow proposal <change-id>
/openflow spec <change-id>
/openflow build <change-id>
/openflow close <change-id>
/commit-helper
```

阶段末固定验证：

```bash
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

按范围追加：

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test <focused-test> --runInBand
```

## 换电脑后恢复步骤

1. 克隆仓库并切到 `refactor/all` 或包含上述提交的分支。
2. 安装依赖：

```bash
corepack pnpm install --frozen-lockfile
```

如本地网络需要镜像，使用临时覆盖，不要写回仓库配置：

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
- `openspec validate --all --strict` 全部通过

4. 跑核心验证：

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm skin:qa:remote
npm.cmd exec --package=pnpm@11.5.0 -- pnpm thumbs
```

## 已知非阻塞情况

- Git 可能提示 unreachable loose objects 较多，这是仓库维护提示；不要在未明确要求时自动执行 `git prune`。
- 直接调用 `openspec.cmd` 可能不可用；优先使用 `npm.cmd exec -- openspec ...`。
- Windows 行尾可能提示 `LF will be replaced by CRLF`，当前不作为阻塞问题处理。
- 如本地缺少 Playwright 托管 Chromium，`pnpm thumbs` 会尝试使用系统 Chrome / Edge fallback。

## 工作边界

- 不要修改 `.ai/`，除非用户明确要求。
- 新实现优先跟随：
  - `src/app`：路由和启动 hook
  - `src/pages`：页面 UI
  - `src/store`：全局状态聚合和本地 trust 数据逻辑
  - `src/skin`：皮肤下载、验证、初始化、运行时、存储、发布工具
- 项目根 `skins/` 只作为 bundled skin 源或本地 QA fixture 输入，不作为移动端运行时存储。
- 下载 skin 包只能进入 Expo FileSystem `documentDirectory/skins/`。
- 不允许远程任意 React 组件执行。
- 新用户可见文案必须同步三语。
