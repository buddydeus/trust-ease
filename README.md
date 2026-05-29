# Trust Ease

`Trust Ease` 是一个基于 Expo Router 的移动端原型项目，当前聚焦“安心 App”的界面实现、国际化预览，以及受控皮肤运行时的基础设施。

## 当前重点

- 移动端页面实现：`welcome`、`home`、`items`、`report`、`my`、`trigger-state`、`new-item`
- 国际化：当前支持 `zh-CN`、`zh-TW`、`en-US`
- 皮肤运行时 v1：先以内置 `skin-001 / 海盐蓝绿` 驱动语义配色与页面布局配置
- 缩略图导出：批量生成多语言手机界面 PNG 预览
- 首次安装第一次打开时会先进入 `welcome`
- 点击 `开始设置` 会直接完成一次正式申报并进入 `home`

## 常用命令

```bash
pnpm start
pnpm test
pnpm check:type
pnpm design
pnpm thumbs
```

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
- [src/skin/runtime.ts](./src/skin/runtime.ts)
- [src/skin/storage.ts](./src/skin/storage.ts)

`skin-001` 当前已经从 TS 对象迁移为项目根 `skins/skin-001/manifest.json`。这个目录是构建期 bundled skin 源，不是移动端运行时可读写目录。

真实 App 运行时下载的 skin 包应写入 Expo FileSystem 的 `documentDirectory/skins/`。项目根 `skins/` 不能作为移动端运行时读写目录使用；后续下载到本地的 skin 包应复用同一套 `manifest.json` 解析与兼容性检查入口。

`SkinRuntime` 当前对外暴露只读快照，避免 UI 层误改运行时对象后污染全局状态。

## 测试

皮肤运行时相关测试位于：

- [tests/skin/feature-version.test.ts](./tests/skin/feature-version.test.ts)
- [tests/skin/compatibility.test.ts](./tests/skin/compatibility.test.ts)
- [tests/skin/runtime.test.ts](./tests/skin/runtime.test.ts)
- [tests/skin/storage.test.ts](./tests/skin/storage.test.ts)

如果继续推进皮肤初始化、下载和页面接入，建议优先沿用现有的 `tests/skin/*` 分层方式补测试。
