# 安心 App 皮肤运行时 v1 设计

## 目标

为当前 Expo 版 `安心 App` 引入一套可下载、可缓存、可版本校验的皮肤机制。

皮肤负责定义：

- 页面布局方式
- 页面内组件顺序
- 页面内组件显隐
- 组件与页面的语义配色

当前首个皮肤定义为：

- `skin-001`
- 中文名：`海盐蓝绿`

## 范围

本次只做 v1，目标是让皮肤成为前台页面布局和样式的唯一运行时来源。

覆盖页面：

- `home`
- `items`
- `new item`
- `report`
- `my`
- `trigger state`
- `tabs`

本次不做：

- 远程下发任意 React 组件
- 远程执行 JS
- 完整可视化皮肤编辑器
- 多皮肤市场页
- 皮肤内单独定义文案国际化系统

## 核心原则

1. 页面结构仍由本地受控组件集合渲染，不允许远程任意结构注入。
2. 皮肤包必须完整下载到本地后，才允许切换或加载。
3. 皮肤兼容性由 `App 功能版本` 决定，不兼容时不能启用。
4. 页面不再直接依赖硬编码 token；运行时 token 来自当前皮肤。

## 方案

采用 `远程 manifest + 本地完整资源包 + 本地受控页面编排`。

### 皮肤包组成

每个皮肤包包含：

- `manifest.json`
- 资源文件集合

资源文件可包括：

- 页面背景图
- 装饰插画
- 局部纹理
- 图标替换资源

v1 中，页面布局本身由 manifest 控制，资源只作为样式增强。

### 皮肤标识

每个皮肤至少包含以下元信息：

- `skinId`
- `displayName`
- `skinVersion`
- `minFeatureVersion`
- `maxFeatureVersion` 或 `targetFeatureVersion`
- `packageHash`
- `assets`

示例：

```json
{
  "skinId": "skin-001",
  "displayName": "海盐蓝绿",
  "skinVersion": "1.0.0",
  "minFeatureVersion": "0.0",
  "maxFeatureVersion": "0.1",
  "packageHash": "sha256:...",
  "assets": [
    {
      "id": "homeMistBg",
      "path": "backgrounds/home-mist.png",
      "hash": "sha256:..."
    }
  ]
}
```

## 功能版本规则

### 功能版本定义

`featureVersion = app semver 的 major.minor`

当前仓库内没有单独的 App version 配置源，v1 在开发期直接读取：

- `package.json.version = 0.0.1`

因此当前功能版本为：

- `0.0`

后续如果 Expo 配置或原生发布链提供正式 App version，可替换版本来源，但规则不变。

### 兼容判定

当皮肤包声明的最低功能版本高于当前 App 功能版本时：

- 不允许加载该皮肤
- 不允许切换到该皮肤
- 提示用户：`升级当前 App，或更换风格`

当皮肤包兼容当前功能版本时：

- 可下载
- 可缓存
- 完整下载并校验通过后可切换

## 本地下载与切换规则

### 状态模型

引入皮肤运行时状态：

- `idle`
- `checking`
- `downloading`
- `ready`
- `failed`
- `incompatible`

以及本地皮肤记录：

- `selectedSkinId`
- `activeSkinId`
- `lastReadySkinId`
- `packageState`

### 切换前提

只有在以下条件全部满足时，才允许切换：

1. 皮肤与当前功能版本兼容
2. `manifest.json` 已落地
3. manifest 引用的全部资源文件已落地
4. 资源 hash 校验通过
5. 资源包整体 hash 校验通过

### 不完整资源包行为

若皮肤包下载不完整：

- 不允许切换
- 不允许加载
- 若它是用户指定皮肤，则继续显示当前已可用皮肤
- 若当前没有可用皮肤，则回退到内置默认皮肤

### 原子切换

下载新皮肤时：

1. 先下载到临时目录
2. 校验 manifest 与资源完整性
3. 校验通过后再原子替换到正式目录
4. 更新 `activeSkinId`

不允许边下载边部分渲染。

## 初始化流程

App 启动时执行：

1. 读取本地皮肤运行时记录
2. 计算当前 `featureVersion`
3. 同步服务端返回的用户目标皮肤信息
4. 校验该皮肤与当前功能版本是否兼容
5. 若不兼容：
   - 使用本地最后一个可用皮肤
   - 若没有，则使用内置默认皮肤
   - 弹出提示：`升级当前 App，或更换风格`
6. 若兼容且本地已有完整包：
   - 直接加载
7. 若兼容但本地无完整包：
   - 后台下载
   - 下载完整并校验通过后切换

## 页面渲染模型

### 受控组件集合

每个页面只允许从本地受控组件集合中选择与编排。

以 `home` 为例，可用组件可包括：

- `statusLabel`
- `heroTitle`
- `streakCard`
- `reportButton`
- `itemsSummary`
- `helpersSummary`
- `decorativeBackground`

皮肤只能决定：

- 哪些组件显示
- 显示顺序
- 采用哪种布局模式
- 使用哪套语义色

皮肤不能定义新的未知组件。

### 页面布局定义

每个页面在 manifest 中包含：

- `layoutMode`
- `sections`
- `componentVisibility`
- `componentOrder`
- `componentVariants`

示例：

```json
{
  "pages": {
    "home": {
      "layoutMode": "hero-top",
      "sections": [
        "hero",
        "summaryRow"
      ],
      "componentVisibility": {
        "statusLabel": true,
        "streakCard": true,
        "itemsSummary": true,
        "helpersSummary": true
      },
      "componentOrder": [
        "statusLabel",
        "heroTitle",
        "streakCard",
        "reportButton"
      ]
    }
  }
}
```

### 语义配色

皮肤提供一套语义色板，而不是页面直接消费固定 token。

例如：

- `pageBg`
- `cardBg`
- `cardBorder`
- `textPrimary`
- `textMuted`
- `actionPrimary`
- `actionPrimaryText`
- `offlineAccent`
- `onlineAccent`

基础组件如 `AppScreen`、`AppCard`、`AppText`、`AppPill`、`FloatingAddButton` 全部改为读取当前皮肤语义色。

## 首个皮肤：skin-001 海盐蓝绿

`skin-001` 作为首个官方皮肤，v1 中需要提供：

- 完整色板定义
- 七个页面的布局定义
- Tabs 样式定义
- 所需背景和装饰资源

它将作为：

- 首个远程可同步皮肤
- 首个本地完整缓存皮肤
- v1 默认参考实现

## 本地目录建议

建议缓存目录按皮肤与版本组织：

- `skins/skin-001/1.0.0/manifest.json`
- `skins/skin-001/1.0.0/assets/...`

并记录一个索引文件：

- `skins/index.json`

用于保存：

- 已下载版本
- 已激活版本
- 包完整性状态

## 回退策略

出现以下任一情况时回退：

- 资源缺失
- hash 校验失败
- manifest 解析失败
- 皮肤不兼容当前功能版本

回退顺序：

1. `lastReadySkinId`
2. 内置默认皮肤

回退后保留错误信息，供设置页提示用户。

## 与现有代码的接入点

v1 建议新增：

- `src/skin/manifest.ts`
- `src/skin/runtime.ts`
- `src/skin/storage.ts`
- `src/skin/compatibility.ts`
- `src/skin/default-skins/skin-001.ts`
- `src/skin/useSkin.ts`

并改造：

- `src/design/tokens.ts`
- `src/ui/AppScreen.tsx`
- `src/ui/AppCard.tsx`
- `src/ui/AppText.tsx`
- `src/ui/AppPill.tsx`
- `src/ui/FloatingAddButton.tsx`
- 各页面 feature 组件
- `app/_layout.tsx` 启动初始化入口
- `useAppStore` 中新增皮肤状态

## 测试

至少覆盖：

1. 从 app version 推导 `featureVersion`
2. 皮肤兼容性判定
3. 未完整下载时不可切换
4. 完整下载后可切换
5. 资源损坏时回退到最后可用皮肤
6. 页面根据皮肤顺序和显隐渲染受控组件
7. `skin-001` 可作为默认可用皮肤成功加载

## 分阶段建议

### Phase 1

- 建立皮肤 manifest 类型
- 建立本地默认皮肤 `skin-001`
- 让基础 UI 组件读取皮肤语义色

### Phase 2

- 建立初始化同步与兼容校验
- 建立完整下载后切换能力

### Phase 3

- 页面布局改为读取皮肤定义
- 设置页加入皮肤状态与切换入口
