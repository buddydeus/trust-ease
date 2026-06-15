# TODO

更新日期：2026-06-15

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
  该设计新增“每天首次进入 App 时的申报状态页面”，但尚未进入代码实现。

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

## 后续需要做的内容

### P0 - 实现已确认的简化设计

- 新增“每天首次进入 App 时的申报状态页面”：
  - 按本地自然日判断今日是否已有正式申报记录。
  - 今日未申报时，首次进入 App 先展示申报状态页。
  - 点击 `我今天平安` 写入与 `report` 页面等价的正式申报记录，不能实现旁路
    “假申报”。
  - 如果欢迎页当天已经写入正式申报记录，当天不应重复强制申报。
  - 未申报状态不得暗示单次失联会触发正式执行。
- 按简化设计改造首页：
  - 顶部展示今日申报状态 banner。
  - 减少同时出现的信息块，只保留当前状态、准备摘要和下一步行动。
  - 保留可暂停、可修改、不会误触发的边界文案。
- 按简化设计改造事项页：
  - 顶部保留圆形 `+` 新建入口。
  - 保持列表优先，不恢复多选操作。
  - 状态不只靠颜色表达。
- 补齐三语文案：
  - `src/locals/zh-CN.json`
  - `src/locals/zh-TW.json`
  - `src/locals/en-US.json`
- 补齐页面、状态和路由测试：
  - 今日首次进入 gating。
  - 今日已申报跳过。
  - 欢迎页同日申报记录复用。
  - `report` 与每日申报共用同一语义。
- 更新截图脚本或截图配置，确保新增/调整页面能被设计预览和真实运行截图覆盖。

### P1 - QA 与真机验证

- 页面实现后先运行：
  - `pnpm check:type`
  - `pnpm check:local`
  - 相关 Jest 测试
- 进入视觉 QA 前运行：
  - `pnpm check:qa`
  - `pnpm check:qa:runtime`
- 前端 QA 发现的问题记录到 `.bugs/*.md`，包含问题描述、复现路径、问题定位、
  建议修复方式和验证方式。
- iOS 真机验证前补齐：
  - `app.json` 的 `ios.bundleIdentifier`
  - `eas.json` 的 internal distribution build profile

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
