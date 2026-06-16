# 项目技术方案

## 当前技术栈

- 包管理器：`pnpm@11.5.0`
- 运行环境：Node.js `>=22`
- 应用框架：Expo 55、Expo Router、React 19、React Native 0.85
- 状态管理：Zustand
- 表单与校验：React Hook Form、Zod
- 样式：styled-components、NativeWind / Tailwind 配置
- 测试：Jest、React Native Testing Library
- 语言：TypeScript 严格模式

## 当前实现边界

当前仓库仍是一个单 Expo App，不是物理 monorepo。现阶段边界如下：

- `src/app/`：Expo Router 路由入口。路由层负责参数、导航、文案装配和副作用绑定。
- `src/pages/`：页面级 UI 与业务视图。页面组件和样式文件按页面目录组织。
- `src/components/`：跨页面通用 UI 组件。
- `src/constants/`：UI tokens 与静态业务常量。
- `src/i18n/`：国际化解析、语言类型与 `useI18n`。
- `src/locals/`：`zh-CN`、`zh-TW`、`en-US` 三语 JSON 文案源。
- `src/store/`：全局 Zustand 状态，以及 onboarding、reporting、preview、本地 trust
  数据等运行时辅助模块。
- `src/skin/`：皮肤类型、manifest 解析、兼容性、注册表、运行时、存储、下载、
  package hash 和发布工具。
- `scripts/`：截图、设计预览、文案检查、QA gate、皮肤包校验等脚本。
- `skins/`：构建期 bundled skin 源，不是移动端运行时读写目录。
- `tests/`：Jest 测试。

路由层应保持轻薄，不应内嵌页面视觉实现、manifest 解析、下载器、hash 校验或
业务状态机细节。

## 当前页面与路由事实

当前实现重点页面包括：

- `welcome`
- `home`
- `items`
- `report`
- `my`
- `trigger-state`
- `new-item`
- `helpers`

当前底部 Tab 实现仍是 `home / items / my`。设计目标文档中提出的
`首页 / 预案 / 执行 / 我的` 是后续产品化设计方向，迁移时需要单独规格和测试，
不能把设计方向直接当作当前路由事实。

## 本地数据方案

单机 MVP 的核心业务数据是 versioned local trust snapshot，使用 AsyncStorage
持久化。快照应包含：

- 重要事项。
- 可信协助人或联系人。
- 事项与协助人的关联。
- 本地触发 / 确认策略。
- 创建和更新时间等元数据。

本地存储要求：

- 缺失、JSON 损坏、结构无效或未来版本不支持时，安全回退到完整默认快照。
- 归档记录不硬删除，默认列表只展示 active 数据。
- 加载失败不应让 App 启动崩溃。
- 本地数据模型本身不引入后端、同步、推送、API 或远程执行。

## 本地工作流

### 事项工作流

- 列表显示本地 active items。
- 支持创建、编辑、归档。
- 创建和编辑要校验标题、类型等字段。
- 归档保留记录，只从默认 active 列表隐藏。
- 不引入 helper 管理、触发模拟或备份行为之外的副作用。

### 协助人工作流

- 列表显示本地 active helpers。
- 支持创建、编辑、归档。
- 支持将 active helpers 关联到 active items。
- 不请求设备通讯录权限。
- 不发送真实短信、邮件、推送或电话。
- 文案必须明确这是本地预案记录，不暗示法律授权或自动执行。

### 触发策略与演练

- 展示本地确认周期、漏确认阈值、是否暂停。
- 支持本地更新、暂停、恢复。
- 支持本地模拟演练，不发送真实消息，不发网络请求，不执行外部动作。
- 模拟状态使用可测试时钟或依赖注入，避免真实时间驱动测试。
- 文案不得把漏确认直接表述为死亡、法律执行或自动交付。

### Readiness Summary

- 从本地快照派生，不修改原始数据。
- 展示 active item、active helper、事项协助人覆盖情况和触发演练状态。
- 只给出本地下一步建议，不展示为法律有效性、安全评分或保证。
- 不引入后端、通知、备份或执行行为。

### 本地备份导入导出

- 导出为带产品标记、备份版本、导出时间、trust schema version 和 trust snapshot
  的本地文件。
- 导出前通过当前 trust parser 校验源快照。
- 导出不包含皮肤运行时目录、远程 skin 包、截图、日志、构建产物或密钥。
- 导入必须先解析、校验、预览，不得直接覆盖。
- 确认导入后通过现有 local trust storage 写入，语义是替换本设备当前本地预案。
- 导入不执行 JavaScript、React 组件、插件或任何可执行内容。
- 不承诺加密、云同步或账号恢复，除非后续真实实现。

## 国际化方案

当前只支持：

- `zh-CN`
- `zh-TW`
- `en-US`

要求：

- 不重新引入裸 `en`。
- 新增或修改用户可见文案时，同步更新三语 JSON。
- 页面代码通过 `src/i18n` 稳定出口读取文案，不硬编码长期 UI 文案。
- 文案变更后运行 `pnpm check:local` 或相关 i18n 测试。
- 截图和缩略图导出应覆盖不同国际化配置。

## 皮肤运行时方案

皮肤系统遵循“本地受控组件 + manifest 编排”：

- 页面结构由本地代码控制。
- 皮肤可以决定布局模式、组件顺序、组件显隐和语义配色。
- 不允许远程任意 React 组件、JavaScript 或插件执行。
- 当前内置皮肤是 `skin-001 / 海盐蓝绿`。
- `featureVersion = app semver major.minor`，用于皮肤与应用特性兼容判断。
- 每个皮肤有自己的 `skinVersion`，并声明可适配的 `featureVersion` 范围。
- 皮肤要求的功能版本高于当前 App 时，提示升级 App 或更换风格。

运行时下载要求：

- 真实 App 运行时下载 skin 包只写入 Expo FileSystem 的
  `documentDirectory/skins/`。
- 项目根 `skins/` 是构建期 bundled skin 源，不作为移动端运行时读写目录。
- 下载先进入 staging 目录。
- manifest、资源 hash、canonical package hash、featureVersion 兼容性全部通过后，
  才能进入 ready 状态。
- 启动时优先恢复已 ready 的选中皮肤；失败、缺失或不兼容时回退到最近 ready
  皮肤，最终兜底为内置 `skin-001`。
- `SkinRuntime` 对外暴露只读快照，UI 层不直接修改运行时对象。

皮肤发布和 QA：

- `pnpm skin:package -- check <skin-dir>` 只检查，不写文件。
- `pnpm skin:package -- update <skin-dir>` 写回 manifest 中资源 hash 和 canonical
  `packageHash`。
- `pnpm skin:qa:remote` 使用本地临时 fixture、依赖注入 remote fetch 和现有
  downloader，不是真实皮肤商店，不引入远程执行能力。

## 安全与合规技术原则

- 默认最小权限。
- 不保管第三方明文密码作为核心方案。
- 单次漏确认不得触发不可逆执行。
- Restricted 数据和文件必须加密存储。
- 敏感读写、授权变更、文件释放、下载、冻结、申诉和审核决定必须有审计事件。
- MVP 阶段不可逆或高风险动作必须人工复核。
- 高风险流程必须支持冻结和申诉。

未来后端化时，必须优先证明：

- 联系人 A 不能访问联系人 B 的材料。
- 执行人不能访问无关文件。
- 审核员不能越权访问未分配案件。
- 文件释放必须经过 eligible 和 approval。
- 敏感读取会产生 audit event。

## 目标架构

未来目标是 TypeScript-first monorepo：

```text
apps/
  mobile/
  admin/
  contact-portal/

services/
  api/
  worker/
  integrations/

packages/
  domain/
  api-contracts/
  config/
  i18n/
  ui/
  testing/

infra/
  local/
  deploy/
  observability/
```

目标技术域：

- Identity & Account
- Contact & Authorization
- Trust Item Catalog
- Secure Vault
- Trigger Engine
- Notification Orchestration
- Execution Routing
- Review & Risk Control
- Audit & Compliance
- Skin & Client Experience

迁移规则：

- 当前规划不等于立即移动代码。
- 移动 mobile app 必须单独变更，并保留路由、测试、截图、i18n、皮肤运行时行为。
- 先迁移 contracts，再迁移后端行为。
- 共享包定义合同，不成为服务业务逻辑杂物箱。

## API 边界方向

未来 API 组包括：

- `/auth`
- `/account`
- `/contacts`
- `/authorizations`
- `/items`
- `/vault`
- `/trigger-policy`
- `/trigger-incidents`
- `/notifications`
- `/execution-tasks`
- `/review`
- `/audit`
- `/skins`

Mobile、Admin、Contact Portal 可使用不同 BFF 或明确契约，不能为了复用移动端
response shape 而牺牲权限和场景表达。

## QA 与命令

常用命令：

```bash
pnpm install
pnpm start
pnpm test
pnpm check:type
pnpm check:local
pnpm check:qa
pnpm check:qa:runtime
pnpm check:qa:all
pnpm design
pnpm thumbs
pnpm skin:package -- check <skin-dir>
pnpm skin:package -- update <skin-dir>
pnpm skin:qa:remote
pnpm fix:all
```

QA 约束：

- `pnpm check:qa` 是单机 MVP 确定性 QA gate，覆盖类型、三语文案、核心 Jest、
  远程皮肤本地 fixture QA。
- `pnpm check:qa:runtime` 等价于 `pnpm thumbs`，必须通过真实 Expo Web bundle
  和 Playwright 截图。
- `pnpm thumbs` 不得退回到 `pnpm design` 或手工绘制设计预览。
- 前端 QA 问题记录到 `.bugs/*.md`，包含问题描述、复现路径、定位、建议修复、
  验证方式。

## iOS 真机准备

当前 iOS 构建前置配置已补齐：

- `app.json` 已声明 `ios.bundleIdentifier`。
- `eas.json` 已提供 internal distribution 和 simulator build profile。
- 在 macOS 或 EAS 环境跑 `pnpm check:qa` 和 `pnpm check:qa:runtime`。
- 使用 Expo Go 做轻量预览，使用 EAS 或本地 Xcode 构建做真机 QA。
- iOS 模拟器验证需要本机 Xcode 安装可用 iOS Simulator runtime；如果本地
  `SDKROOT` 指向旧 SDK，运行 iOS 命令时需要清理该环境变量。
