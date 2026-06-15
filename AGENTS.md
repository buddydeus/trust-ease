# AGENTS.md

本文件是本仓库的代理协作入口，作用类似 Claude Code 的
`CLAUDE.md`。任何 AI 代理在修改本仓库前，都应先读取本文件，再按任务
需要读取根目录 `README.md` 和 `docs/spec/` 中的核心规格文档。

## 适用范围与优先级

- 本文件适用于整个仓库。
- 用户在当前对话中的明确要求优先于本文件。
- 如果 `docs/spec/`、README 和代码互相冲突，以当前代码和
  `package.json` 为准，并在必要时同步更新文档。

## 项目定位

`Trust Ease` 是基于 Expo Router 的移动端原型项目，当前聚焦“安心 App”
的界面实现、国际化预览，以及受控皮肤运行时基础设施。

产品语境是高敏感的“意外、失联、身后事务授权编排”。实现和文案都要遵守
这些边界：

- 产品不是遗嘱、公证或律师意见的替代品。
- 不以直接保管第三方平台明文密码作为核心方案。
- 不承诺接管全部第三方账号或转移全部资产。
- 不直接办理需要法定身份、法院文书、公证文书才能完成的事项。
- 对外体验优先使用“安心”“托付”“意外预案”“失联托付”“授权执行”
  “重要事项交代”等表述，减少直接使用“死亡后”“身后”等高压词。

## 技术栈

- 包管理器：`pnpm`
- 依赖锁定：`packageManager` 固定为 `pnpm@11.5.0`，`pnpm-lock.yaml`
  需要提交到版本控制
- 应用框架：Expo 55、Expo Router、React 19、React Native 0.85
- 状态管理：Zustand
- 表单与校验：React Hook Form、Zod
- 样式：styled-components、NativeWind/Tailwind 配置
- 测试：Jest、React Native Testing Library
- 语言：TypeScript 严格模式

## 常用命令

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

- `pnpm design` 使用 `scripts/render_current_app_screens.py` 导出手工绘制
  的多语言设计预览到 `designs/`。
- `pnpm thumbs` 使用 `scripts/capture_runtime_thumbs.js`，先做 Expo Web
  导出，再用 Playwright 渲染真实 App bundle 并截图到 `thumbs/`。
- `pnpm thumbs` 不应回退到设计预览图；如果真实浏览器渲染不可用，应让命令
  失败。
- `pnpm skin:package -- check <skin-dir>` 校验本地皮肤包的 manifest 资源 hash
  和 canonical `packageHash`，不写文件。
- `pnpm skin:package -- update <skin-dir>` 将当前资源 hash 和 canonical
  `packageHash` 写回该目录下的 `manifest.json`。它用于构建期 bundled skin 源
  或未来远程 skin QA fixture，不写入移动端运行时目录。
- `pnpm skin:qa:remote` 运行内部远程皮肤下载 QA harness，使用本地临时
  fixture、依赖注入的 remote fetch 和现有 downloader；它不是用户可见皮肤商店。
- `pnpm check:qa` 是单机 App MVP 的确定性 QA gate，覆盖类型检查、三语文案、
  核心 Jest 和远程皮肤本地 fixture QA。
- `pnpm check:qa:runtime` 运行真实 App bundle 截图链路，即 `pnpm thumbs`；它不应
  回退到设计预览图。
- `pnpm check:qa:all` 先运行确定性 QA gate，再运行 runtime 截图 QA。
- 前端 QA 发现的问题记录到 `.bugs/*.md`，报告应包含问题描述、复现路径、问题定位、
  建议修复方式和验证方式。
- 新电脑或 CI 风格验证优先使用 `corepack pnpm install --frozen-lockfile`。
  仓库默认 registry 是官方 npm registry；如本地网络需要镜像，用
  `pnpm --config.registry=https://registry.npmmirror.com install` 临时覆盖，
  不要把镜像地址写回仓库配置。

## 目录约定

- `src/app/`：Expo Router 路由入口。路由文件尽量只做参数、文案和副作用
  绑定。
- `src/pages/`：页面级 UI 与业务视图。页面组件和对应 `*.styled.tsx`
  文件放在同一页面目录。
- `src/components/`：跨页面通用 UI 组件。
- `src/constants/`：UI tokens 与静态业务常量。
- `src/i18n/`：国际化解析、语言类型与 `useI18n`。
- `src/locals/`：三语 JSON 文案源。
- `src/skin/`：皮肤类型、清单解析、兼容性、注册表、路径、运行时和存储。
- `src/store/`：全局 Zustand 状态，以及 onboarding、reporting、preview
  等运行时状态辅助模块。
- `scripts/`：截图、预览、检查等项目脚本。
- `skins/`：构建期 bundled skin 源。不要把它当作移动端运行时读写目录。
- `tests/`：Jest 测试。
- `docs/spec/`：项目需求、技术方案、设计需求的当前核心文档入口。

## AI 文档规则

- 长期有效的产品、技术、设计说明统一维护在 `docs/spec/`。
- 临时 AI 中间记录不要作为当前事实入口；确需留档时优先使用已忽略的工作记录目录。
- 不要重新引入已清理的历史归档目录作为当前实现依据。

## 当前产品与页面事实

当前移动端页面重点包括：

- `welcome`
- `home`
- `items`
- `report`
- `my`
- `trigger-state`
- `new-item`

首次启动流程已经有专门约束：

- 首次安装第一次打开进入 `welcome`。
- 点击 `开始设置` 会写入 `hasSeenWelcome = true`。
- 同一次点击还会写入与 `report` 页面等价的正式申报记录。
- 申报时间使用按钮点击时刻。
- 完成后跳转到 `home`。
- 再次打开时不再进入 `welcome`，而是进入正常主流程。

欢迎页触发的申报必须与 `report` 页申报共享同一语义，不要实现一套旁路的
“假申报”。

## UI / UX 原则

来自 `docs/spec/design-requirements.md` 和已确认决策：

- 体验关键词：温和、可信、克制、清晰、有秩序、可撤回。
- 避免殡葬感、沉重黑白风、保险推销感、纯工具后台感，以及过度科技化的
  冷硬安全产品感。
- 高风险动作要先解释“会发生什么”，再让用户操作。
- 优先暴露通知、预警、模拟演练等可逆动作；不可逆动作必须更深、更明确。
- 高敏感流程一屏只做一件事，避免同时要求用户理解规则、填写复杂表单和
  作出风险判断。
- 首页和 onboarding 要先传达：信息不会立刻公开、可暂停/修改、默认不会
  误触发正式执行。
- 联系人或家属视角必须能理解“下一步该做什么”，不要只呈现技术字段。
- 组件优先使用 Expo UI；简单布局壳可以继续使用 React Native 基础组件。
- 所有页面按手机长宽比展示。
- 首页未申报态单独设计，不显示底部导航。
- 事项页顶部使用圆形 `+` 按钮新建事项。
- 事项页不恢复多选操作。
- 底部导航使用 icon，不使用上方圆点指示。

## 国际化规则

- 当前只支持 `zh-CN`、`zh-TW`、`en-US`。
- 不要重新引入裸 `en` 语言枚举。
- 新增或修改用户可见文案时，同步更新 `src/locals/zh-CN.json`、
  `src/locals/zh-TW.json` 和 `src/locals/en-US.json`。
- 页面代码通过 `src/i18n` 的稳定出口读取文案，不要在页面里硬编码长期存在
  的中文或英文 UI 文案。
- 导出截图和缩略图时，需要覆盖不同国际化配置。
- 文案修改后运行 `pnpm check:local` 或相关 i18n 测试。

## 皮肤运行时规则

当前皮肤系统遵循“本地受控组件 + 运行时清单编排”：

- 页面结构仍由本地代码控制，不允许远程执行任意 React 组件。
- 皮肤可以决定布局模式、组件顺序、组件显隐和语义配色。
- 当前内置皮肤是 `skin-001 / 海盐蓝绿`。
- `featureVersion = app semver major.minor`，只用于皮肤与应用特性兼容判断。
- 每个皮肤有自己的 `skinVersion`，并声明可适配的 `featureVersion` 范围。
- 皮肤要求的功能版本高于当前 app 时，应提示升级 app 或更换风格。
- 只有完整下载并通过校验的皮肤包才允许切换或加载。
- 下载皮肤包先进入运行时 staging 目录，只有 manifest、资源 hash、package
  hash 和 featureVersion 兼容性全部通过后才允许进入 ready 状态。
- 远程 skin source adapter 只允许下载 manifest 与声明的静态资源，并写入
  `documentDirectory/skins/` 下的 staging 目录；不允许执行远程 React 组件、
  远程 JavaScript 或插件代码。
- 启动时优先恢复已 ready 的选中皮肤；失败、缺失或不兼容时回退到最近 ready
  皮肤，最终兜底为内置 `skin-001`。
- `skins/skin-001/manifest.json` 是构建期 bundled skin 源。
- 真实 App 运行时下载的 skin 包应写入 Expo FileSystem 的
  `documentDirectory/skins/`。
- 项目根 `skins/` 不能作为移动端运行时读写目录使用。
- `SkinRuntime` 对外暴露只读快照，UI 层不要直接修改运行时对象。
- 远程下载 QA 入口仅用于开发/测试，应保持本地临时 fixture 和依赖注入，不要
  引入真实网络依赖、用户可见入口或远程组件执行能力。

修改皮肤能力时，优先检查并更新：

- `src/skin/types.ts`
- `src/skin/manifest.ts`
- `src/skin/compatibility.ts`
- `src/skin/runtime.ts`
- `src/skin/storage.ts`
- `src/skin/packageValidation.ts`
- `src/skin/packageHash.ts`
- `src/skin/publishingTool.ts`
- `src/skin/downloader.ts`
- `src/skin/initStateMachine.ts`
- `skins/skin-001/manifest.json`
- `tests/skin/*`

## 实现约定

- 修改前先读现有实现和测试，不要只按历史计划或归档内容改代码。
- 保持路由层轻薄：`src/app/*` 负责路由、文案装配和副作用绑定；
  页面 UI 放在 `src/pages/*`。
- 共享业务副作用优先放到 store 或对应运行时辅助模块，避免每个页面重复实现。
- 新增页面时同步考虑路由、页面组件、样式、i18n、皮肤页面键、截图脚本和测试。
- TypeScript 接口命名遵守当前 ESLint 规则，接口使用 PascalCase，项目中常见
  `I*Props` / `I*Copy` 形式。
- import 排序遵守 `eslint.config.js` 的 `jshow/sort-import` 分组。
- 不要引入未被项目采用的大型状态、路由或 UI 框架。
- 不要重构与任务无关的文件。
- 不要回滚用户已有改动；遇到脏工作区时只处理当前任务相关文件。

## 测试与验证

按变更范围选择最小但足够的验证：

- 类型或跨模块契约变更：`pnpm check:type`
- 文案或语言变更：`pnpm check:local`、`tests/i18n/*`
- 页面或状态行为变更：对应 `pnpm test <test-file> --runInBand`
- 皮肤变更：`pnpm test tests/skin --runInBand`
- 截图链路变更：`pnpm thumbs` 或相关 `tests/support/*`
- 单机 MVP QA gate：`pnpm check:qa`，前端视觉 QA 前追加 `pnpm check:qa:runtime`
- 全量回归：`pnpm test` + `pnpm check:type`

如果验证命令因本地环境缺失失败，要在交付说明中写清楚失败命令和原因。

## 需要优先避免的事

- 不要把高敏感主题做成压迫、恐惧、殡葬或销售导向体验。
- 不要把触发规则表现得像可随意开启的自动执行开关。
- 不要让单次失联直接触发不可逆执行。
- 不要新增远程任意组件执行能力。
- 不要把项目根 `skins/` 当移动端运行时存储。
- 不要只更新一种语言的文案。
- 不要把 `thumbs` 当成手工设计预览脚本。
