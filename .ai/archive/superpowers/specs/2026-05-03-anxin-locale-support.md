# 安心 App 多语言支持设计

## 目标

为当前 Expo 版 `安心 App` 增加三语支持：

- `简体中文` `zh-CN`
- `繁体中文` `zh-TW`
- `English` `en-US`

并同时满足两种语言来源：

- 首次启动时跟随系统语言
- 用户可在 App 内手动切换并覆盖系统语言

## 范围

本次只覆盖当前已有前台页面与路由标题：

- `report`
- `home`
- `items`
- `new item`
- `my`
- `trigger state`
- `tabs` 标题

不引入远程文案平台，不做服务端下发，不做复数规则系统化扩展。

## 方案

采用轻量自研文案层，不引入重量级 i18n 框架。

### 状态模型

在 `useAppStore` 中增加：

- `locale`
- `localeMode`

其中：

- `localeMode = system | manual`
- `locale` 只允许 `zh-CN | zh-TW | en-US`

### 语言决策规则

1. 如果用户已经手动选择语言，则始终使用手动选择结果
2. 如果还没有手动选择，则读取系统 locale 并映射到支持语言
3. 未识别语言一律回退到 `zh-CN`

### 系统语言映射

- `zh-Hant*`, `zh-TW`, `zh-HK`, `zh-MO` -> `zh-TW`
- `zh*` -> `zh-CN`
- `en*` -> `en-US`
- 其他 -> `zh-CN`

### 文案结构

新增集中式文案表，按页面与语义 key 组织。

示例：

- `home.statusLabel`
- `home.heroTitle`
- `my.title`
- `tabs.items`

页面组件不再直接硬编码中文文案。

### 使用方式

新增轻量 `useI18n()`：

- 返回当前 `locale`
- 返回 `t(key)` 查询函数
- 返回 `setManualLocale(locale)`
- 返回 `useSystemLocale()`

### 交互入口

在“我的”页增加语言设置区，至少包含：

- 跟随系统
- 简体中文
- 繁體中文
- English

## 测试

至少覆盖：

1. 系统语言映射逻辑
2. 手动覆盖优先级
3. 首页在英文下的关键文案
4. 我的页显示语言设置入口
5. Tab 路由标题切换后仍可正常渲染
