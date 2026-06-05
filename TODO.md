# Trust Ease Handoff TODO

更新时间：2026-06-05
仓库：`D:\github\buddydeus\trust-ease`
当前分支：`refactor/all`

## 当前状态

- 当前已验证提交：`2473580 docs: archive local readiness summary`
- 本地分支相对 `origin/refactor/all`：ahead 11 commits（本 TODO 提交后会继续增加）
- OpenSpec active changes：无
- OpenSpec 全量 strict 校验：15 passed / 0 failed
- 工作区在本 TODO 更新前为干净状态
- `.ai/` 本轮不应修改，最近 build / close 均保持 `.ai/` diff 为空
- 项目仍是单 Expo app 物理结构；monorepo 物理拆分尚未开始
- 当前优先级：先完成单机 App MVP 的本地数据闭环，再考虑联网能力和 monorepo 物理拆分

## 最近关键提交

```text
2473580 docs: archive local readiness summary
8e7be9a feat: add local readiness summary
b1656d2 docs: specify local readiness summary
46dad4c docs: propose local readiness summary
2f9d5dd docs: archive local trigger policy simulation
0e79f3d feat: add local trigger policy simulation
b281cdf docs: specify local trigger policy simulation
16f08ce docs: propose local trigger policy simulation
58986cf docs: refresh handoff TODO
8e3ebc0 docs: archive local helper contact workflow
190d323 feat: add local helper contact workflow
7de24cd docs: archive local item CRUD workflow
f34acc4 feat: add local item CRUD workflow
d13c495 docs: specify local item CRUD workflow
b6f488f docs: propose local item CRUD workflow
412df05 docs: archive local trust data model spec
```

## 已完成内容

### 协作入口与项目规则

- 根目录 `AGENTS.md` 已作为本仓库 AI 代理协作入口，作用类似 Claude Code 的 `CLAUDE.md`。
- 已明确项目定位、技术栈、目录边界、i18n 规则、皮肤运行时规则、测试命令和禁止事项。
- `.ai/archive/` 只作为历史背景，不作为当前实现事实。
- OpenFlow / Superpowers 执行计划按旧标准放在 `docs/superpowers/plans/`。

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

主规格已包含：

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
- 启动恢复支持 active / last ready / bundled fallback。
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
- `pnpm thumbs` 使用 Expo Web 真实导出 + Playwright/系统 Chrome 截图，不应回退到设计预览图

## 单机 App MVP 进度

单机 MVP 目标：无后端、无账号、无同步、无推送依赖，先完成本地产品闭环。

### Phase 1：本地 trust 数据模型

已完成 build / close / commit / archive：

- `add-local-trust-item-data-model`

能力：

- AsyncStorage-backed versioned snapshot
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
- route 轻薄，由 `src/app` 绑定 storage / i18n / navigation
- 三语文案已同步

主规格：

- `openspec/specs/local-item-crud-workflow/spec.md`

### Phase 3：本地 helper/contact workflow

已完成 build / close / commit / archive：

- `add-local-helper-contact-workflow`

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

### Phase 4：本地 trigger policy simulation

已完成 build / close / commit / archive：

- `add-local-trigger-policy-simulation`

能力：

- 本地 `triggerPolicy` 更新、暂停、恢复、开始演练、重置演练
- 状态 resolver 派生 `normal`、`paused`、`warning`、`waiting-confirmation`、`simulated-review`
- `trigger-state` 页面展示 check-in interval、missed threshold、本地状态、下一步动作和 local-only 说明
- 已移除“死亡 = 3 次未申报”等高压/不可逆文案
- 不发送真实通知，不联系协助人，不产生法律授权或自动执行
- 三语文案已同步

主规格：

- `openspec/specs/local-trigger-policy-simulation/spec.md`

### Phase 5：本地 readiness summary

已完成 build / close / commit / archive：

- `add-local-readiness-summary`

能力：

- 新增 `src/store/trust/readiness.ts`，从本地 snapshot 纯派生 readiness view model，不写入持久数据
- 汇总 active items、active helpers、事项协助覆盖、trigger policy / rehearsal 状态
- archived helpers 不计入 active coverage；只关联 archived helper 的 item 视为 uncovered
- Home 页面展示本地准备度卡片：状态、分区、计数、local-only 说明和下一步动作
- Home route 读取 local trust snapshot，并把 actions 映射到现有本地流程
- 文案明确“本地、建议性、可修改、不自动通知、不产生法律授权”
- 三语文案已同步

主规格：

- `openspec/specs/local-readiness-summary/spec.md`

最近验证：

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/home --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

结果：

- Trust store tests：5 suites / 31 tests passed
- Home tests：2 suites / 5 tests passed
- OpenSpec：15 passed / 0 failed
- `.ai/` diff：空

## 下一步

当前建议优先继续：

```text
/openflow proposal add-local-backup-export-import
```

目标：补齐单机 App MVP 的本地数据可迁移能力，解决“数据只存在本机、无法备份/恢复/换机”的最大缺口。

建议规格覆盖：

- 从本地 `ITrustDataSnapshot` 导出备份文件
- 导入备份文件并做 schema/version 校验
- 导入前展示会发生什么，避免误覆盖
- 支持 dry-run / preview imported snapshot
- 支持安全失败：格式错误、版本不支持、结构不合法时不覆盖现有数据
- 不接入云同步、账号、真实网络或远程恢复
- 不导出皮肤运行时目录或远程缓存
- 三语文案同步
- route / page / store 边界继续遵守现有结构

后续阶段顺序：

1. `add-local-backup-export-import`
2. `add-single-device-mvp-qa-gate`
3. 单机 MVP 稳定后，评估是否 push 当前 `refactor/all`
4. 单机 MVP 稳定后，再考虑 monorepo 物理拆分
5. 联网 App 能力继续后置，包括账号、同步、加密备份、通知、远程协助人流程等

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

1. 克隆仓库并切到 `refactor/all`，或包含上述提交的分支。

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
  - `src/skin`：皮肤下载、校验、初始化、运行时、存储、发布工具
- 项目根 `skins/` 只作为 bundled skin 源或本地 QA fixture 输入，不作为移动端运行时存储。
- 下载 skin 包只能进入 Expo FileSystem `documentDirectory/skins/`。
- 不允许远程任意 React 组件执行。
- 新用户可见文案必须同步三语。
