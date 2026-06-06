# Trust Ease

`Trust Ease` 是一个基于 Expo Router 的移动端原型项目，当前聚焦“安心 App”的界面实现、国际化预览，以及受控皮肤运行时的基础设施。

## 当前重点

- 移动端页面实现：`welcome`、`home`、`items`、`report`、`my`、`trigger-state`、`new-item`
- 国际化：当前支持 `zh-CN`、`zh-TW`、`en-US`
- 皮肤运行时 v1：先以内置 `skin-001 / 海盐蓝绿` 驱动语义配色与页面布局配置
- 缩略图导出：批量生成多语言手机界面 PNG 预览
- 首次安装第一次打开时会先进入 `welcome`
- 点击 `开始设置` 会直接完成一次正式申报并进入 `home`

## 安装与依赖锁定

本仓库使用 `pnpm@11.5.0`，并提交 `pnpm-lock.yaml` 作为跨电脑协作和
CI 风格验证的依赖锁定来源。

```bash
corepack pnpm install --frozen-lockfile
```

如果本机没有启用 Corepack，也可以使用全局安装的同版本 pnpm 执行相同命令。
仓库默认 registry 使用官方 npm registry。若本地网络需要镜像，请用命令行
临时覆盖，不要把镜像地址写回仓库配置：

```bash
pnpm --config.registry=https://registry.npmmirror.com install
```

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
```

### `pnpm check:qa`

`pnpm check:qa` 是 single-device MVP 的确定性 QA gate，用于进入前端 QA 或换电脑继续
开发前的基线验证。它会按顺序运行类型检查、三语文案检查、核心 Jest 套件、远程皮肤
本地 fixture QA，以及 OpenSpec 全量严格校验。任一子检查失败时，命令会以非零状态退出。

`pnpm check:qa:runtime` 单独运行真实运行时截图链路，也就是现有的 `pnpm thumbs`。该命令
必须继续使用 Expo Web 导出的真实 App bundle，不应退回到设计预览图。运行前端视觉 QA 前
应执行它；如果本地浏览器或 Expo Web 导出不可用，需要把失败作为环境问题记录，而不是绕过。

`pnpm check:qa:all` 会先运行确定性 QA gate，再运行 runtime 截图 QA。

前端 QA 发现的问题记录到 `.bugs/*.md`，每个报告应包含问题描述、复现路径、问题定位、
建议修复方式和验证方式。

### `pnpm design`

运行 `pnpm design` 会执行 [scripts/render_current_app_screens.py](./scripts/render_current_app_screens.py)，把当前界面的多语言 PNG 预览导出到项目根目录的 `designs/`。

这些图片是按当前页面语义手工绘制的脚本预览，不是 App 运行时的真实截图。

### `pnpm thumbs`

运行 `pnpm thumbs` 会执行 [scripts/capture_runtime_thumbs.js](./scripts/capture_runtime_thumbs.js)，先执行 Expo Web 真实导出，再用 Playwright Chromium 渲染导出的 App bundle，按真实路由与真实国际化配置逐页截图，并把 PNG 输出到项目根目录的 `thumbs/`。

`pnpm thumbs` 不使用 `scripts/render_current_app_screens.py`，也不调用手工绘制函数。它的输入必须是 Expo 导出的真实 App 页面内容；如果当前环境无法运行 Playwright 浏览器渲染，命令应失败，而不是退回到设计预览图。

脚本现在会输出：

- 当前阶段：开始导出、清理目录、切换到哪个语言
- 当前文件：例如 `thumbs/zh-CN/home.png` 或 `designs/zh-CN/home.png`
- 最终汇总：总导出数量和耗时

### `pnpm skin:package`

运行 `pnpm skin:package -- check <skin-dir>` 会校验本地皮肤包的 manifest 资源
hash 和 canonical `packageHash`，不会写入文件。

运行 `pnpm skin:package -- update <skin-dir>` 会把当前资源 hash 和 canonical
`packageHash` 写回该目录下的 `manifest.json`。这个命令用于构建期 bundled skin
源或未来远程 skin QA fixture，不会写入 Expo `documentDirectory/skins/` 运行时目录。

### `pnpm skin:qa:remote`

运行 `pnpm skin:qa:remote` 会执行内部远程皮肤下载 QA harness。它使用本地临时目录生成
remote-style skin fixture，复用 `skin:package` 的 canonical hash 逻辑，并通过 remote
source adapter 与 downloader 验证 ready promotion 和可恢复失败。这个命令只用于开发/QA，
不会开启用户可见的皮肤商店，也不会把项目根 `skins/` 当作移动端运行时目录。

## 目录说明

- `src/app/`
  Expo Router 路由入口
- `src/pages/`
  具体页面与业务视图
- `src/components/`
  通用 UI 组件
- `src/constants/`
  UI tokens 与静态业务常量
- `src/i18n/`
  文案与语言切换
- `src/skin/`
  皮肤类型、版本兼容、运行时与本地存储
- `src/store/`
  全局 zustand 状态，以及 onboarding、reporting、preview 等运行时状态辅助模块
- `tests/`
  Jest 测试
- `scripts/`
  截图、预览、检查等项目脚本
- `docs/`
  面向产品、架构、安全与运维的人类正式文档
- `thumbs/`
  真实运行页面截图
- `designs/`
  脚本绘制的设计预览图，属于可再生成产物，默认不纳入版本管理

## 皮肤运行时

当前皮肤系统遵循“本地受控组件 + 运行时清单编排”的原则：

- 页面结构仍由本地代码控制，不允许远程执行任意组件
- 皮肤决定布局模式、组件顺序、组件显隐和语义配色
- 功能版本取自 app semver 的 `major.minor`
- 只有完整下载并通过校验的皮肤包才允许切换

目前已落地的基础文件包括：

- [src/skin/types.ts](./src/skin/types.ts)
- [src/skin/featureVersion.ts](./src/skin/featureVersion.ts)
- [src/skin/compatibility.ts](./src/skin/compatibility.ts)
- [src/skin/manifest.ts](./src/skin/manifest.ts)
- [src/skin/registry.ts](./src/skin/registry.ts)
- [skins/skin-001/manifest.json](./skins/skin-001/manifest.json)
- [src/skin/paths.ts](./src/skin/paths.ts)
- [src/skin/packageValidation.ts](./src/skin/packageValidation.ts)
- [src/skin/packageHash.ts](./src/skin/packageHash.ts)
- [src/skin/publishingTool.ts](./src/skin/publishingTool.ts)
- [src/skin/downloader.ts](./src/skin/downloader.ts)
- [src/skin/initStateMachine.ts](./src/skin/initStateMachine.ts)
- [src/skin/runtime.ts](./src/skin/runtime.ts)
- [src/skin/storage.ts](./src/skin/storage.ts)

`skin-001` 当前已经从 TS 对象迁移为项目根 `skins/skin-001/manifest.json`。这个目录是构建期 bundled skin 源，不是移动端运行时可读写目录。

真实 App 运行时下载的 skin 包应写入 Expo FileSystem 的 `documentDirectory/skins/`。项目根 `skins/` 不能作为移动端运行时读写目录使用；后续下载到本地的 skin 包应复用同一套 `manifest.json` 解析与兼容性检查入口。

下载皮肤包会先进入运行时 staging 目录，只有 manifest、资源 hash、package hash 和 featureVersion 兼容性全部通过后才会进入 ready 状态。启动时会优先恢复已 ready 的选中皮肤；失败、缺失或不兼容时回退到最近 ready 皮肤，最终兜底为内置 `skin-001`。

远程 skin source adapter 只负责拉取远程 manifest 与声明的静态资源，并把它们写入
`documentDirectory/skins/` 下的 staging 目录；它不会执行远程 React 组件、远程
JavaScript 或插件代码。远程包仍必须经过现有 staging、manifest 解析、资源 hash、
package hash、featureVersion 兼容性和 promotion 流程后才能 ready。

本地发布或 QA 皮肤包可先用 `pnpm skin:package -- check <skin-dir>` 校验；需要更新
manifest 中资源 hash 与 canonical package hash 时，使用
`pnpm skin:package -- update <skin-dir>`。

远程下载链路的内部 QA 可运行 `pnpm skin:qa:remote`，该命令使用临时 fixture、依赖注入的
remote fetch 和现有 downloader，不执行远程组件或远程 JavaScript。
`SkinRuntime` 当前对外暴露只读快照，避免 UI 层误改运行时对象后污染全局状态。

## 测试

皮肤运行时相关测试位于：

- [tests/skin/feature-version.test.ts](./tests/skin/feature-version.test.ts)
- [tests/skin/compatibility.test.ts](./tests/skin/compatibility.test.ts)
- [tests/skin/runtime.test.ts](./tests/skin/runtime.test.ts)
- [tests/skin/storage.test.ts](./tests/skin/storage.test.ts)
- [tests/skin/init-state-machine.test.ts](./tests/skin/init-state-machine.test.ts)
- [tests/skin/package-validation.test.ts](./tests/skin/package-validation.test.ts)
- [tests/skin/package-hash.test.ts](./tests/skin/package-hash.test.ts)
- [tests/skin/publishing-tool.test.ts](./tests/skin/publishing-tool.test.ts)
- [tests/skin/downloader.test.ts](./tests/skin/downloader.test.ts)
- [tests/skin/remote-download-qa.test.ts](./tests/skin/remote-download-qa.test.ts)

如果继续推进皮肤初始化、下载和页面接入，建议优先沿用现有的 `tests/skin/*` 分层方式补测试。
