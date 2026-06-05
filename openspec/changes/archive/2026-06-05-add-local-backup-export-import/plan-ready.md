# 实现计划：add-local-backup-export-import

## 来源

- 提案：`openspec/changes/add-local-backup-export-import/proposal.md`
- 设计：`openspec/changes/add-local-backup-export-import/design.md`
- 规格：`openspec/changes/add-local-backup-export-import/specs/`
- 任务：`openspec/changes/add-local-backup-export-import/tasks.md`

## 实现步骤

### Task 1: 本地备份序列化与解析

- 目标：新增纯逻辑备份 envelope、导出序列化、导入解析和预览能力，复用现有
  `ITrustDataSnapshot` 与 `parseTrustDataSnapshot`。
- 改动文件：
  - `tests/store/trust/backup.test.ts`
  - `src/store/trust/backup.ts`
  - `src/store/trust/index.ts`
- 验证方式：
  - 先添加备份导出/导入测试并观察 RED。
  - 实现后运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/backup.test.ts --runInBand`。
  - 断言 envelope product/version/exportedAt/trust schema 字段、snapshot 校验、导入错误、preview counts 和输入不变性。

### Task 2: 本地文件 IO adapter 边界

- 目标：把写入备份文件、选择备份文件和读取文本文件封装为可注入 adapter，避免
  页面组件和测试直接依赖 native 文件 API。
- 改动文件：
  - `src/store/trust/backupFileAdapter.ts` 或 `src/app/my/backupFileAdapter.ts`
  - `tests/store/trust/backup-file-adapter.test.ts` 或相关 route/controller 测试
  - 如 build 阶段确认必须新增 Expo 文件选择/分享依赖，再同步 `package.json` 和 `pnpm-lock.yaml`
- 验证方式：
  - 使用 mock adapter 覆盖成功、取消、读失败、写失败。
  - 若新增依赖，运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type` 确认类型契约。

### Task 3: 备份工作流 UI

- 目标：在 My/settings 区域加入备份入口或焦点页，展示本地说明、导出、导入、错误、
  preview、替换警告、确认和取消操作。
- 改动文件：
  - `tests/pages/my/my-screen.test.tsx` 或 `tests/pages/backup/backup-screen.test.tsx`
  - `src/pages/my/MyScreen.tsx` 或 `src/pages/backup/BackupScreen.tsx`
  - `src/pages/my/types.ts` 或新增 backup 页面 types
  - 对应 `*.styled.tsx`
- 验证方式：
  - 先补 UI 测试并观察 RED。
  - 实现后运行 focused page test。
  - 断言页面不出现 cloud restore、account recovery、legal authority、automatic delivery、third-party account control、encryption promise 等不安全语义。

### Task 4: 路由和本地存储接入

- 目标：让 route/controller 负责 i18n、加载当前 snapshot、调用导出 helper 和 file
  adapter、解析导入 preview、确认后通过 `saveTrustDataSnapshot` 写入。
- 改动文件：
  - `src/app/(tabs)/my.tsx` 或 `src/app/my/backup.tsx`
  - `tests/pages/my/my-screen.test.tsx` 或相关 route test
  - `src/store/trust/backup.ts`
- 验证方式：
  - 运行 focused route/controller tests。
  - 断言 export 会读取当前 snapshot，import preview 不写 storage，cancel 不写 storage，confirm 只写 parsed snapshot。
  - 断言 malformed/unsupported/invalid/cancel/read-fail/write-fail 分支都保留当前本地数据。

### Task 5: 三语文案与安全表达

- 目标：补齐备份工作流所有用户可见文案，保持“本地、用户管理、先预览、确认后替换”
  的低压表达。
- 改动文件：
  - `src/locals/zh-CN.json`
  - `src/locals/zh-TW.json`
  - `src/locals/en-US.json`
  - 相关 i18n/page tests
- 验证方式：
  - 运行 `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local`。
  - 断言三语 key 完整，且不承诺云同步、账号恢复、法律效力、自动通知或加密保护。

### Task 6: 最终验证和任务状态同步

- 目标：完成实现后勾选 `tasks.md`，并确认 OpenSpec、类型、文案和 focused tests 均通过。
- 改动文件：
  - `openspec/changes/add-local-backup-export-import/tasks.md`
- 验证方式：
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand`
  - focused backup/My page tests
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
  - `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local`
  - `npm.cmd exec -- openspec validate add-local-backup-export-import --strict`
  - `npm.cmd exec -- openspec validate --all --strict`
  - `git diff -- .ai`
