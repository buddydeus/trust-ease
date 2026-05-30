# 实现计划：add-skin-downloader-init-state-machine

## 来源

- 提案：openspec/changes/add-skin-downloader-init-state-machine/proposal.md
- 设计：openspec/changes/add-skin-downloader-init-state-machine/design.md
- 规格：openspec/changes/add-skin-downloader-init-state-machine/specs/
- 任务：openspec/changes/add-skin-downloader-init-state-machine/tasks.md

## 实现步骤

### Task 1: 定义初始化与下载器契约

- 目标：先建立类型边界，让后续状态机、验证器和下载器共享同一组语义。
- 改动文件：`src/skin/types.ts`，必要时新增 `src/skin/packageTypes.ts` 或同级局部类型文件。
- 验证方式：`pnpm check:type`。

步骤：

1. 扩展或新增皮肤包身份、包操作结果、初始化状态、失败原因类型，并复用现有
   `SkinPackageState`。
2. 确认类型命名符合项目 `I*Props` / PascalCase / const export 风格。
3. 运行 `pnpm check:type`，预期通过。

### Task 2: 先实现纯初始化状态机

- 目标：让启动时 active/last-ready/fallback 的决策可测试、可复用。
- 改动文件：新增 `src/skin/initStateMachine.ts`，新增
  `tests/skin/init-state-machine.test.ts`。
- 验证方式：`pnpm test tests/skin/init-state-machine.test.ts --runInBand`。

步骤：

1. 编写测试覆盖无持久化状态、持久化 ready active、active 缺失、selected 失败、
   incompatible、bundled fallback。
2. 实现纯 resolver，输入持久化 snapshot、包 ready/compatibility 信息和 bundled
   默认包，输出 resolved active/last-ready/package state。
3. 确认 failed、partial、incompatible 不会覆盖 `lastReadySkinId`。
4. 运行对应测试，预期通过。

### Task 3: 增加皮肤包验证器

- 目标：把 manifest、hash、compatibility 校验从下载流程中独立出来。
- 改动文件：新增 `src/skin/packageValidation.ts`，新增
  `tests/skin/package-validation.test.ts`。
- 验证方式：`pnpm test tests/skin/package-validation.test.ts --runInBand`。

步骤：

1. 编写测试覆盖 manifest 解析成功、skin id 不匹配、asset hash 不匹配、
   packageHash 不匹配、featureVersion 不兼容。
2. 实现验证 helper，复用 `parseSkinManifest`、`isSkinCompatible` 和
   `getCurrentFeatureVersion`。
3. 明确 hash 计算的确定性文件顺序和失败结果。
4. 运行对应测试，预期通过。

### Task 4: 实现 downloader staging/promote 生命周期

- 目标：让下载或 staged package 只能在验证后进入 ready 状态。
- 改动文件：新增 `src/skin/downloader.ts`，按需扩展 `src/skin/paths.ts` 和
  `src/skin/storage.ts`，新增 `tests/skin/downloader.test.ts`。
- 验证方式：`pnpm test tests/skin/downloader.test.ts --runInBand`。

步骤：

1. 编写测试覆盖 source 成功/失败、staging、验证失败、incompatible、promotion
   成功/失败。
2. 实现 source adapter 接口，第一版支持本地或 staged package 输入，保留未来网络
   adapter 接入点。
3. 写入 staging 目录，验证通过后再 promote 到 ready package 目录。
4. 确认任何 partial/staging 目录都不会被视为 ready。
5. 运行 downloader 测试，预期通过。

### Task 5: 接入 store 与路由启动 hook

- 目标：让 App 启动通过 init resolver 决定可渲染皮肤，同时保持 `src/app` 轻薄。
- 改动文件：`src/store/useAppStore.ts`、`src/store/index.ts`、
  `src/app/useSkinStorageSync.ts` 或新增 `src/app/useSkinInitialization.ts`。
- 验证方式：`pnpm test tests/support/source-structure.test.ts --runInBand`、
  `pnpm check:type`。

步骤：

1. 在 store 中暴露最小 init status 和 package outcome，不暴露 downloader 内部实现。
2. 将 route-layer hook 改成调用 init resolver/runtime helper，并只负责应用 store
   与持久化结果。
3. 确认 `src/app` 中没有 manifest parsing、hash validation、promotion 细节。
4. 运行结构契约测试和 typecheck，预期通过。

### Task 6: 保持页面行为并处理最小 UI 状态

- 目标：不重做 My 页面，只确保现有皮肤选择行为仍然可用。
- 改动文件：按需修改 `src/pages/my/*`、`src/locals/*.json`、对应测试。
- 验证方式：`pnpm test tests/pages/my/my-screen.test.tsx --runInBand`；若修改文案，
  运行 `pnpm check:local`。

步骤：

1. 保持 bundled `skin-001` 的现有选择器行为。
2. 如果需要展示 checking/downloading/failed/incompatible，使用最小文案并同步三语。
3. 运行 My 页面测试和必要的 i18n 校验，预期通过。

### Task 7: 文档与最终验证

- 目标：确认下载器和初始化行为落地，且 `.ai/` 没有变化。
- 改动文件：`README.md`、`AGENTS.md` 仅在需要描述新运行时边界时更新。
- 验证方式：完整执行下列命令。

步骤：

1. 如文档描述 skin runtime，更新根文档，继续强调项目根 `skins/` 不是运行时存储。
2. 运行 `pnpm test tests/skin --runInBand`。
3. 运行 `pnpm test tests/support/source-structure.test.ts --runInBand`。
4. 运行 `pnpm check:type`。
5. 若修改用户可见文案，运行 `pnpm check:local`。
6. 运行 `git diff -- .ai`，预期无输出。
