# TODO

更新日期：2026-06-18

本文件用于记录当前交接状态和下一步工作。若本文件与代码、`package.json` 或
`docs/spec/` 冲突，以当前代码和核心规格文档为准。

## 当前状态

- 项目是基于 Expo Router 的单 Expo 移动端原型，当前聚焦“安心 App”的单机
  MVP、本地数据闭环、三语文案、真实截图 QA 和受控皮肤运行时。
- 长期有效规格入口已集中到 `docs/spec/`：
  - `docs/spec/project-requirements.md`
  - `docs/spec/technical-solution.md`
  - `docs/spec/design-requirements.md`
- OpenSpec 已移除，当前实现依据不再依赖历史归档目录。
- 当前页面重点包括 `welcome`、`home`、`items`、`report`、`my`、
  `trigger-state`、`new-item`、`helpers`。
- 当前底部 Tab 仍是 `home / items / my`；`首页 / 预案 / 执行 / 我的` 只是
  后续产品化 IA 方向，不能直接当作当前路由事实。
- 当前只支持 `zh-CN`、`zh-TW`、`en-US`，不要重新引入裸 `en`。
- 已确认新版简化设计方向：`designs/specs/anxin-simple-daily-redesign.md`。
  该设计新增“每天首次进入 App 时的申报状态页面”，当前已完成正式代码实现。
- 已确认个人轻量版重新设计：`designs/specs/anxin-personal-lite-redesign.md`。
  当前已进入正式开发并完成首轮代码还原，重点覆盖 `welcome`、`report`、`home`、
  `items`、`new-item`、`helpers`、`my`、`trigger-state` 的浅色清新布局。
- 阶段 1 已完成：正式申报时间已持久化，应用入口会按本地自然日判断今天是否
  已申报；今日未申报进入申报页，今日已申报进入首页。
- 阶段 2 已完成：申报页、首页和事项页已按简化设计改造，并同步三语文案。
- 阶段 3 已完成：设计预览脚本已同步简化设计语言，真实运行截图链路覆盖
  `welcome / report / home / items / new-item / my / trigger-state` 三语页面，
  且本地生成物 `.tmp/`、`thumbs/` 已作为 QA 产物忽略。
- 阶段 4 已完成当前可脚本化部分：本机已有 iOS 26.3 simulator runtime，
  iPhone 17 模拟器可启动；Expo 55 依赖已与 `expo install --check` 期望版本对齐，
  iOS bundle 能在 Expo Go 中成功加载并显示欢迎页。
- 阶段 5 已完成：已按确认版个人轻量设计正式改造运行界面，完成三语文案同步、
  页面测试、确定性 QA、真实 runtime 截图和 iOS 模拟器首屏加载验证。
- 阶段 6 已完成：修复确认版 UI 的首轮反馈，二级页面补充返回按钮，事项页新增
  按钮改为稳定圆形背景，新增事项页线上 / 线下类型选择具备明确选中态。
- 阶段 7 已完成：完成一次全面 QA 回归，修复与当前 UI 不一致的路由 / i18n 测试断言，
  更新内置皮肤 stale `packageHash`，并用 iOS 模拟器确认当前 bundle 中二级页返回按钮、
  事项页圆形新增按钮、新增事项页线上 / 线下选择均可见。
- 当前 iOS 完整手动交互验证仍待继续：本机未开放 macOS 辅助访问，`simctl` 也没有
  tap 能力，因此“点击开始设置后进入每日申报 / 首页”等完整点按链路需要人工点按或
  补充 Maestro / idb / Appium 等移动端自动化工具后继续。

## 已完成内容概述

- 完成核心规格整理：项目需求、技术方案、设计需求已集中到 `docs/spec/`。
- 完成 README 与 AGENTS 协作入口整理，明确包管理器、命令、目录约定、产品边界
  和 AI 修改规则。
- 完成 OpenSpec 相关清理，避免继续把历史归档作为当前实现依据。
- 已有首次启动流程：
  - 第一次打开进入 `welcome`。
  - 点击 `开始设置` 写入 `hasSeenWelcome = true`。
  - 同时写入与 `report` 页面等价的正式申报记录。
  - 完成后进入 `home`。
- 已有本地单机 MVP 能力：
  - 本地事项创建、编辑、归档。
  - 本地可信协助人创建、编辑、归档。
  - 事项与协助人关联。
  - 本地触发策略查看、暂停、恢复和模拟演练。
  - 首页 readiness summary。
  - 本地备份导出与导入预览。
- 已有三语文案、真实运行截图链路和 QA gate：
  - `pnpm check:local`
  - `pnpm check:qa`
  - `pnpm check:qa:runtime`
  - `pnpm thumbs`
- 已有受控皮肤运行时基础：
  - 内置 `skin-001 / 海盐蓝绿`。
  - manifest 解析、featureVersion 兼容、资源 hash、package hash、staging /
    ready 流程、启动回退和远程下载本地 fixture QA。
  - 不允许远程 React 组件、远程 JavaScript 或插件执行。
- 已确认并提交简化版 UI 设计图：
  - 设计规格：`designs/specs/anxin-simple-daily-redesign.md`
  - 实现交接：`designs/specs/anxin-simple-daily-redesign-implementation.md`
  - 预览图：
    `designs/previews/anxin-simple-daily-redesign-desktop.png`
    `designs/previews/anxin-simple-daily-redesign-mobile.png`
- 已确认并实现个人轻量版 UI：
  - 设计规格：`designs/specs/anxin-personal-lite-redesign.md`
  - 实现交接：`designs/specs/anxin-personal-lite-redesign-implementation.md`
  - 设计总览：`designs/previews/anxin-personal-lite-redesign-overview.png`
  - 当前实现主色回到确认的淡雅绿色 `#4F907C`，整体保持浅色、克制、个人工具感。
- 已修复首轮 UI 反馈：
  - `items/new`、`items/[id]`、`helpers`、`helpers/new`、`helpers/[id]`、
    `my/trigger-state` 增加返回按钮。
  - 事项页顶部 `+` 使用显式原生样式，确保圆形背景稳定显示。
  - 新增事项页类型卡片随当前类型切换选中态，线上事项可见、可选、可提交。

## 后续需要做的内容

### P0 - 实现已确认的简化设计

- [x] 新增“每天首次进入 App 时的申报状态页面”的状态基础：
  - [x] 按本地自然日判断今日是否已有正式申报记录。
  - [x] 今日未申报时，首次进入 App 先展示申报页。
  - [x] 点击 `我今天平安` 写入与 `report` 页面等价的正式申报记录，不能实现旁路
        “假申报”。
  - [x] 如果欢迎页当天已经写入正式申报记录，当天不应重复强制申报。
  - [x] 未申报状态不得暗示单次失联会触发正式执行。
- [x] 将申报页视觉改为已确认设计中的“今天先确认一次”每日状态页。
- [x] 按简化设计改造首页：
  - [x] 顶部展示今日申报状态 banner。
  - [x] 减少同时出现的信息块，只保留当前状态、准备摘要和下一步行动。
  - [x] 保留可暂停、可修改、不会误触发的边界文案。
- [x] 按简化设计改造事项页：
  - [x] 顶部保留圆形 `+` 新建入口。
  - [x] 保持列表优先，不恢复多选操作。
  - [x] 状态不只靠颜色表达。
- [x] 补齐三语文案：
  - [x] `src/locals/zh-CN.json`
  - [x] `src/locals/zh-TW.json`
  - [x] `src/locals/en-US.json`
- [x] 补齐页面、状态和路由测试：
  - [x] 今日首次进入 gating。
  - [x] 今日已申报跳过。
  - [x] 欢迎页同日申报记录复用。
  - [x] `report` 与每日申报共用同一语义。
  - [x] Tab 路由能加载改造后的首页、事项页和我的页。
- [x] 更新截图脚本或截图配置，确保新增/调整页面能被设计预览和真实运行截图覆盖。
  - [x] `scripts/render_current_app_screens.py` 已按新版简化设计更新。
  - [x] 设计预览脚本只清理三语输出目录，不删除 `designs/specs/`、
        `designs/images/` 或 `designs/previews/`。
  - [x] `pnpm thumbs` / `pnpm check:qa:runtime` 覆盖真实 App bundle 的三语截图。

### P1 - QA 与真机验证

- 页面实现后先运行：
  - `pnpm check:type`
  - `pnpm check:local`
  - 相关 Jest 测试
- 进入视觉 QA 前运行：
  - `pnpm check:qa`：2026-06-15 已通过；2026-06-16 iOS 依赖与运行期修复后再次通过；
    2026-06-18 个人轻量 UI 正式开发后再次通过；同日全面回归再次通过，32 个测试套件、
    183 个测试通过。
  - `pnpm check:qa:runtime`：2026-06-15 已通过；2026-06-18 通过 `pnpm thumbs`
    完成 21 张 runtime thumbnails。
  - `pnpm test --runInBand`：2026-06-18 全量通过，44 个测试套件、223 个测试通过。
  - `pnpm skin:package -- check skins/skin-001`：2026-06-18 发现内置皮肤
    `packageHash` 陈旧，已通过 `pnpm skin:package -- update skins/skin-001`
    更新并复查通过。
- 前端 QA 发现的问题记录到 `.bugs/*.md`，包含问题描述、复现路径、问题定位、
  建议修复方式和验证方式。
- [x] iOS 构建前置配置：
  - [x] `app.json` 的 `ios.bundleIdentifier`
  - [x] `eas.json` 的 internal distribution build profile
  - [x] `eas.json` 的 simulator build profile
- [ ] iOS 模拟器验证：
  - [x] 确认本机 Xcode 可用，且需要清理旧 `SDKROOT` 环境变量。
  - [x] 安装可用 iOS Simulator runtime。
    - 2026-06-16 已确认 `xcrun simctl list runtimes` 包含
      `iOS 26.3 (26.3.1 - 23D8133)`。
  - [x] 使用 iOS Simulator 运行 App。
    - 使用 iPhone 17 模拟器和 Expo Go 55.0.34。
    - 需要通过
      `env -u SDKROOT DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer`
      清理旧 `SDKROOT`。
    - 依赖对齐到 Expo 55 期望版本后，iOS bundle 可成功完成；最近一次清缓存
      bundle 用时约 10 秒，无 Expo Router 非路由文件警告和 i18n/store 循环引用警告。
    - 已截图确认欢迎页能在 iOS 模拟器显示。
    - 2026-06-18 使用 iPhone 17 模拟器和 Expo Go，经
      `pnpm exec expo start --ios --localhost` 成功完成 iOS bundle，并截图确认
      新版每日申报页可加载显示。直接 LAN 地址曾停在 Expo Go `Opening project...`，
      localhost 模式可避开该网络路径问题。
    - 2026-06-18 重新以 `--clear` 启动 Metro，并 terminate / reopen Expo Go 后确认
      当前 iOS bundle 已刷新；截图确认 `items` 页顶部 `+` 为圆形背景，
      `items/new` 页有返回按钮，且线上事项选项可见、可选。
  - [ ] 验证首次进入、每日申报、首页、事项、我的、触发设置、备份入口。
    - 当前脚本化验证已覆盖页面加载与深链截图；完整点按链路仍需要人工点按或安装
      移动端自动化工具继续。
  - [ ] 如发现问题，记录到 `.bugs/*.md`。

### P2 - 产品化后续

- 补齐完整 first plan wizard：联系人、事项、文件线索、确认周期和预案确认。
- 将当前 `items` 心智逐步演进到 `预案` 心智，但需单独规格、路由、i18n、
  截图脚本和测试。
- 完善联系人 / 协助人视角，让其理解“下一步该做什么”。
- 继续扩展触发演练和执行状态时间线，但保持本地 MVP 不暗示真实通知、审核后台或
  外部执行能力。
- 稳定单机 App MVP 后，再评估后端、账号、同步、通知、远程协作和 monorepo
  物理拆分。

## 修改时优先验证

- 类型或跨模块契约：`pnpm check:type`
- 文案或语言：`pnpm check:local`
- 页面或状态行为：对应 `pnpm test <test-file> --runInBand`
- 皮肤能力：`pnpm test tests/skin --runInBand`
- 截图链路：`pnpm check:qa:runtime`
- 单机 MVP QA gate：`pnpm check:qa`
