# Trust Ease Handoff TODO

更新时间：2026-06-05
仓库：`D:\github\buddydeus\trust-ease`
当前分支：`refactor/all`

## 当前状态

- Git 当前 `HEAD`：`7de24cd docs: archive local item CRUD workflow`。
- 当前本地 `refactor/all` 与 `origin/refactor/all` 的差异计数为 `0 0`，本地引用显示已同步。
- OpenSpec 当前没有 active changes。
- OpenSpec 全量严格校验通过：12 个 items，0 failed。
- `.ai/` 不应被修改；最近单机 MVP 阶段执行也没有要求改动 `.ai/`。
- 项目仍是单 Expo app 物理结构，monorepo 拆分尚未开始；当前优先级仍是完成单机 App MVP 数据闭环。

最近关键提交：

```text
7de24cd docs: archive local item CRUD workflow
f34acc4 feat: add local item CRUD workflow
d13c495 docs: specify local item CRUD workflow
b6f488f docs: propose local item CRUD workflow
412df05 docs: archive local trust data model spec
144e8cf feat: add local trust data model
5dbf213 docs: specify local trust data model
8e2e490 docs: propose local trust data model
a72ebce docs: plan standalone MVP phases
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

### 4. Skin 运行时与远程皮肤基础设施

已完成并归档的 change：

- `add-skin-downloader-init-state-machine`
- `add-remote-skin-source-adapter`
- `add-skin-runtime-status-ui`
- `add-skin-package-hash-canonicalization`
- `add-skin-package-publishing-tooling`
- `add-remote-skin-download-qa-entry`

当前能力：

- 皮肤下载使用 staging -> validation -> ready promotion。
- 运行时启动通过 `resolveSkinInitState` 恢复 active / last ready / fallback。
- 远程 source adapter 只下载 manifest 和静态资源，不执行远程 React、JavaScript 或插件代码。
- package hash 已 canonicalize，覆盖 manifest key 排序、路径规范化、自引用规避和不安全路径拒绝。
- `pnpm skin:package -- check <skin-dir>` 只校验，不写文件。
- `pnpm skin:package -- update <skin-dir>` 写回 asset hashes 和 canonical `packageHash`。
- `pnpm skin:qa:remote` 使用本地临时 fixture 与依赖注入，不引入真实网络或用户可见入口。

### 5. 依赖锁定策略

已通过 OpenFlow / OpenSpec 完成并归档：

- `define-dependency-lock-strategy`

完成内容：

- `package.json` 固定 `packageManager: pnpm@11.5.0`
- `pnpm-lock.yaml` 已提交
- `.npmrc` 默认 registry 使用官方 npm registry
- `openspec/specs/dependency-reproducibility/spec.md` 已进入主规格

### 6. 真实运行截图链路

已修复并提交：

- `pnpm thumbs` 可完成 Expo Web 真实导出，并用 Playwright/系统 Chrome 截图。
- Windows 中 `pnpm.cmd` / cmd script spawn 已兼容。
- `react-native-css-interop@0.2.4` 已声明为直接依赖。
- Playwright 托管 Chromium 缺失时，截图脚本可 fallback 到本机 Chrome / Edge。
- `thumbs/` 可生成三语 21 张真实运行截图，尺寸为 `780x1688`。

## 单机 App MVP 当前进度

单机 MVP 当前优先级高于 monorepo 物理拆分。目标是先完成无后端、无账号、无同步、无推送依赖的本地产品闭环。

### Phase 1：本地 trust 数据模型

已完成 build、close、commit，并归档：

- `add-local-trust-item-data-model`

完成内容：

- 新增 `src/store/trust/types.ts`
- 新增 `src/store/trust/defaults.ts`
- 新增 `src/store/trust/storage.ts`
- 新增 `src/store/trust/selectors.ts`
- 新增 `tests/store/trust/storage.test.ts`
- 主规格已合并：`openspec/specs/local-trust-data-model/spec.md`

能力边界：

- 本地 AsyncStorage-backed versioned snapshot。
- 支持 items、helpers、triggerPolicy。
- corrupted / missing / unsupported future schema version 会安全回退默认 snapshot。
- archived records 保留在本地，但 active selector 会排除。

### Phase 2：本地事项 CRUD workflow

已完成 build、close、commit，并归档：

- `add-local-item-crud-workflow`

关键提交：

- `b6f488f docs: propose local item CRUD workflow`
- `d13c495 docs: specify local item CRUD workflow`
- `f34acc4 feat: add local item CRUD workflow`
- `7de24cd docs: archive local item CRUD workflow`

完成内容：

- 新增 `src/store/trust/items.ts`
- 新增 `tests/store/trust/items.test.ts`
- `ItemsScreen` 改为渲染本地 active items、空状态、编辑动作、归档动作。
- `ItemFormScreen` 支持 title、kind、summary、必填校验、保存动作、initialValues。
- `src/app/(tabs)/items.tsx` 从本地 trust snapshot 加载 active items。
- `src/app/items/new.tsx` 创建并持久化本地事项。
- 新增 `src/app/items/[id].tsx` 编辑已有事项。
- 新用户可见文案已同步 `zh-CN`、`zh-TW`、`en-US`。
- 主规格已合并：`openspec/specs/local-item-crud-workflow/spec.md`

最近通过的 Phase 2 验证：

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/items --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec -- openspec validate add-local-item-crud-workflow --strict
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

验证结果：

- 全量 Jest：37 suites / 157 tests passed。
- `check:type`：通过。
- `check:local`：通过。
- OpenSpec 全量：12 items passed。
- `.ai/` diff：空。

## 当前主规格清单

`npm.cmd exec -- openspec validate --all --strict` 最近通过的主规格：

- `app-init-state-machine`
- `dependency-reproducibility`
- `documentation-contracts`
- `local-item-crud-workflow`
- `local-trust-data-model`
- `monorepo-architecture`
- `operations-delivery-plan`
- `product-technical-plan`
- `project-structure-contracts`
- `security-compliance-plan`
- `skin-downloader-runtime`
- `skin-package-publishing-tooling`

## 下一步

下一阶段应从这里开始：

```text
/openflow proposal add-local-helper-contact-workflow
```

目标：新增本地托付联系人/协助人维护，并把协助人关联到事项。

建议规格覆盖：

- helper/contact 的创建、编辑、归档。
- 字段：姓名、关系、联系方式、说明/备注。
- 事项关联：至少能把 helper id 关联到本地 item 的 `helperIds`。
- 文案必须明确：App 不会自动发送消息、不提供法律执行、不替代公证/律师意见。
- 不接入通讯录权限、后端、推送或真实网络。
- 三语文案同步。
- 页面和 route 仍保持现有边界：`src/app` 做路由和存储绑定，`src/pages` 做 UI，`src/store/trust` 做本地数据逻辑。

后续阶段顺序：

1. `add-local-helper-contact-workflow`
2. `add-local-trigger-policy-simulation`
3. `add-local-readiness-summary`
4. `add-local-backup-export-import`
5. `add-single-device-mvp-qa-gate`
6. 单机 MVP 稳定后再考虑 monorepo 物理拆分

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
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm skin:qa:remote
npm.cmd exec --package=pnpm@11.5.0 -- pnpm thumbs
```

## 已知非阻塞情况

- Git 可能提示 unreachable loose objects 较多，这是仓库维护提示；不要在未明确要求时自动执行 `git prune`。
- 在当前沙箱环境中，直接调用 `openspec.cmd` 可能不可用；优先使用 `npm.cmd exec -- openspec ...`。
- 当前沙箱读取用户级 git ignore 可能提示 `C:\Users\buddy\.config\git\ignore` permission denied；这不代表仓库文件不可用。
- 如果本地缺少 Playwright 托管 Chromium，`pnpm thumbs` 会使用系统 Chrome / Edge fallback。

## 继续工作边界

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
