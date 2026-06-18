# 个人安心小记实现说明

## 状态

当前为设计确认阶段，未进入代码实现。用户确认 Option 1 后再开始实现。

## 实现范围

- `src/pages/welcome/`
- `src/pages/report/`
- `src/pages/home/`
- `src/pages/items/`
- `src/pages/helpers/`
- `src/pages/trigger-state/`
- `src/pages/my/`
- `src/constants/`
- `src/locals/zh-CN.json`
- `src/locals/zh-TW.json`
- `src/locals/en-US.json`
- 截图脚本与相关测试

## 组件建议

- `SimplePageHeader`
- `StatusBlock`
- `GroupedList`
- `ListRow`
- `StatusTag`
- `PlainField`
- `BottomAction`
- `BoundaryNote`

## 行为不变要求

- 首次安装第一次打开进入 `welcome`。
- 点击 `开始设置` 写入 `hasSeenWelcome = true`。
- 同一次点击写入与 `report` 页面等价的正式申报记录。
- 完成后进入 `home`。
- 当天已申报不重复强制申报。
- `report` 与欢迎页触发的申报共享同一语义。
- 事项页顶部保留圆形 `+`。
- 不恢复事项多选。
- 当前底部 Tab 继续保持 `home / items / my`。

## 验证建议

- `pnpm check:type`
- `pnpm check:local`
- 相关页面 Jest 测试
- `pnpm thumbs` / `pnpm check:qa:runtime`
- iOS 模拟器逐页截图确认

