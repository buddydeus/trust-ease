# 实现计划：add-local-trust-item-data-model

## 来源

- 提案：`openspec/changes/add-local-trust-item-data-model/proposal.md`
- 设计：`openspec/changes/add-local-trust-item-data-model/design.md`
- 规格：`openspec/changes/add-local-trust-item-data-model/specs/`
- 任务：`openspec/changes/add-local-trust-item-data-model/tasks.md`

## 实现步骤

### Task 1: 定义本地 trust 数据契约

- 目标：建立后续事项 CRUD、协助人、触发策略、备份能力共用的 durable TypeScript contract。
- 改动文件：
  - `src/store/trust/types.ts`
  - 如需要：`src/store/trust/index.ts`
- 步骤：
  - 新增 `TRUST_DATA_SCHEMA_VERSION = 1`。
  - 定义 `ITrustDataSnapshot`，包含 `schemaVersion`、`items`、`helpers`、`triggerPolicy`、`updatedAt`。
  - 定义 `ITrustItem`，包含 `id`、`title`、`kind`、`summary`、`helperIds`、`status`、`createdAt`、`updatedAt`。
  - 定义 `ITrustedHelper`，包含 `id`、`displayName`、`relationship`、`contactMethod`、`notes`、`status`、`createdAt`、`updatedAt`。
  - 定义 `ILocalTriggerPolicy`，包含 `missedCheckInThreshold`、`checkInIntervalDays`、`missingStateEnabled`、`simulationEnabled`、`updatedAt`。
  - 保持类型中不出现 backend、sync、push、remote execution 字段。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`

### Task 2: 增加默认快照和纯选择器

- 目标：让空存储、异常存储和后续页面都能得到完整可用的默认数据，并能区分 active/archived。
- 改动文件：
  - `src/store/trust/defaults.ts`
  - 如需要：`src/store/trust/selectors.ts`
  - `src/store/trust/index.ts`
- 步骤：
  - 实现 `createDefaultTrustDataSnapshot()`，返回完整 `ITrustDataSnapshot`。
  - 默认 `items` 和 `helpers` 为空数组。
  - 默认 `triggerPolicy.missedCheckInThreshold` 使用保守非零值，例如 `3`。
  - 默认 `triggerPolicy.checkInIntervalDays` 使用保守非零值，例如 `1`。
  - 默认 `missingStateEnabled` 和 `simulationEnabled` 为 `false`。
  - 实现 `getActiveTrustItems(snapshot)`。
  - 实现 `getArchivedTrustItems(snapshot)`。
  - 实现 `getActiveTrustedHelpers(snapshot)`。
  - 确保选择器只 filter，不 mutate 输入 snapshot。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/storage.test.ts --runInBand`
  - 首次执行时测试文件可能尚未存在，完成 Task 4 后应通过。

### Task 3: 添加 AsyncStorage 持久化和安全解析

- 目标：用现有 AsyncStorage 风格实现 load/save/clear，并保证启动时不会因坏数据崩溃。
- 改动文件：
  - `src/store/trust/storage.ts`
  - `src/store/trust/index.ts`
- 步骤：
  - 定义 namespaced storage key，例如 `trust-ease:trust-data:v1`。
  - 实现 `loadTrustDataSnapshot()`。
  - 实现 `saveTrustDataSnapshot(snapshot)`。
  - 实现 `clearTrustDataSnapshot()`。
  - 实现内部 `parseTrustDataSnapshot(raw)` 或等价函数。
  - 当 AsyncStorage 返回 `null` 时返回默认快照。
  - 当 JSON parse 失败时返回默认快照。
  - 当 parse 后不是 object 时返回默认快照。
  - 当 `schemaVersion` 缺失或不是当前版本时返回默认快照。
  - 当 `items`、`helpers` 或 `triggerPolicy` 结构非法时返回默认快照。
  - 保存时使用 `JSON.stringify(snapshot)` 写入 AsyncStorage。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`

### Task 4: 补齐本地 trust 存储测试

- 目标：用 Jest 锁住空值、坏值、版本边界、round-trip 和 archive 语义。
- 改动文件：
  - `tests/store/trust/storage.test.ts`
- 步骤：
  - 使用 `@react-native-async-storage/async-storage` mock，并在每个测试前 `clear()`。
  - 测试空 AsyncStorage 返回 `createDefaultTrustDataSnapshot()`。
  - 直接写入 malformed JSON，断言 `loadTrustDataSnapshot()` 返回默认快照且不 throw。
  - 直接写入结构非法 JSON，断言返回默认快照。
  - 构造有效 snapshot，调用 `saveTrustDataSnapshot()` 后再 load，断言 durable data round-trip。
  - 写入 `schemaVersion` 大于当前版本的 snapshot，断言返回默认快照。
  - 构造 active/archived item 和 helper，断言 active selector 排除 archived，archived selector 返回 archived，原 snapshot 保留全部记录。
  - 调用 `clearTrustDataSnapshot()` 后断言再次 load 返回默认快照。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/storage.test.ts --runInBand`

### Task 5: 最终验证和任务勾选

- 目标：确认本阶段只新增本地数据底座，并满足 OpenSpec 严格校验。
- 改动文件：
  - `openspec/changes/add-local-trust-item-data-model/tasks.md`（build 阶段勾选）
  - 如执行计划需要：`docs/superpowers/plans/YYYY-MM-DD-add-local-trust-item-data-model.md`
- 步骤：
  - 运行聚焦测试。
  - 运行类型检查。
  - 运行当前 change 严格校验。
  - 运行全量 OpenSpec 严格校验。
  - 确认 `.ai/` diff 为空。
  - build 阶段完成后勾选 `tasks.md`。
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/storage.test.ts --runInBand`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
  - `npm.cmd exec -- openspec validate add-local-trust-item-data-model --strict`
  - `npm.cmd exec -- openspec validate --all --strict`
  - `git diff -- .ai`
