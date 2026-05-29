# 实现计划：normalize-project-structure-contracts

## 来源

- 提案：openspec/changes/normalize-project-structure-contracts/proposal.md
- 设计：openspec/changes/normalize-project-structure-contracts/design.md
- 规格：openspec/changes/normalize-project-structure-contracts/specs/
- 任务：openspec/changes/normalize-project-structure-contracts/tasks.md

## 实现步骤

### Task 1: 强化结构契约测试

- 目标：把当前目录边界、根文档引用和截图脚本契约写进可执行测试。
- 改动文件：tests/support/source-structure.test.ts
- 验证方式：pnpm test tests/support/source-structure.test.ts --runInBand

步骤：

1. 更新 `tests/support/source-structure.test.ts`，让测试读取根目录
   `README.md` 和 `AGENTS.md`，并断言它们包含 `src/app/`、
   `src/pages/`、`src/store/`、`src/skin/`、`scripts/` 的当前职责说明。
2. 在同一测试文件中加入截图命令契约断言：`pnpm design` 对应
   `scripts/render_current_app_screens.py`，`pnpm thumbs` 对应
   `scripts/capture_runtime_thumbs.js`。
3. 在同一测试文件中加入 `src/app` 路由边界断言，避免 route wrapper
   重新承载大段页面 UI、manifest 解析或旧目录深层导入。
4. 运行 `pnpm test tests/support/source-structure.test.ts --runInBand`，
   预期失败或通过取决于当前文档是否已满足新契约；若失败，失败信息应指向
   后续文档或结构修正。

### Task 2: 对齐根文档

- 目标：让根文档与当前代码、脚本和目录职责一致，同时保持 `.ai/` 不变。
- 改动文件：README.md、AGENTS.md
- 验证方式：pnpm test tests/support/source-structure.test.ts --runInBand；
  git diff -- .ai

步骤：

1. 更新 `README.md` 中与当前目录、截图命令、语言集合或皮肤存储职责不一致的
   描述。
2. 更新 `AGENTS.md` 中与实现契约不一致或遗漏的根级代理协作说明。
3. 确认没有修改 `.ai/`：运行 `git diff -- .ai`，预期无输出。
4. 运行 `pnpm test tests/support/source-structure.test.ts --runInBand`，
   预期通过。

### Task 3: 拆分 RootLayout 启动副作用

- 目标：让 `src/app/_layout.tsx` 只负责 provider 和 Stack 组合，把启动副作用
  移到 route 层局部 hook。
- 改动文件：src/app/_layout.tsx；新增或修改 src/app 下的局部 hook 文件。
- 验证方式：pnpm test tests/support/source-structure.test.ts --runInBand；
  pnpm check:type

步骤：

1. 新增 route 层 hook，封装 preview route redirection，保持现有
   `router.replace(preview.route)` 条件不变。
2. 新增 route 层 hook，封装 skin storage hydrate 和 store subscription，
   保持 `loadSkinStorageState`、`useAppStore.setState`、
   `saveSkinStorageState` 的调用语义不变。
3. 新增 route 层 hook，封装 web preview-ready DOM dataset 标记，保持
   `previewReady`、`previewRoute`、`previewLocale` 和
   `requestAnimationFrame` 行为不变。
4. 更新 `src/app/_layout.tsx` 调用这些 hook，并保留 `ThemeProvider`、
   `Stack.Screen` 和 preview marker 组合。
5. 运行 `pnpm test tests/support/source-structure.test.ts --runInBand` 和
   `pnpm check:type`，预期通过。

### Task 4: 拆分 MyScreen 局部组件

- 目标：降低 `src/pages/my/MyScreen.tsx` 的职责密度，保持页面 API 与交互不变。
- 改动文件：src/pages/my/MyScreen.tsx；新增或修改 src/pages/my 下的局部
  类型与组件文件。
- 验证方式：pnpm test tests/pages/my/my-screen.test.tsx --runInBand；
  pnpm check:type

步骤：

1. 抽出 `IMyScreenProps`、copy 类型和 skin option 类型到 `src/pages/my/`
   的局部类型文件，并保持 `MyScreen` 当前 props API。
2. 抽出状态高亮卡、触发状态入口卡、身份安全卡等静态卡片组合到局部组件。
3. 抽出语言选择器组件，保持 `onUseSystemLocale`、`onSetManualLocale`、
   picker 展开/收起行为和文案来源不变。
4. 抽出皮肤选择器组件，保持兼容性禁用、当前皮肤标记、`onSetActiveSkin`
   和 picker 展开/收起行为不变。
5. 更新 `MyScreen` 只负责页面组合和局部状态协调。
6. 运行 `pnpm test tests/pages/my/my-screen.test.tsx --runInBand` 和
   `pnpm check:type`，预期通过。

### Task 5: 按需拆分 skin manifest parser

- 目标：为未来 bundled/downloaded skin 复用同一 manifest 解析入口铺路，同时保持
  当前 parser 行为稳定。
- 改动文件：src/skin/manifest.ts；可新增 src/skin 下的 parser helper 文件；
  tests/skin/manifest.test.ts
- 验证方式：pnpm test tests/skin/manifest.test.ts --runInBand；pnpm check:type

步骤：

1. 判断 `src/skin/manifest.ts` 在前序任务后是否仍是维护压力点；如果当前文件已足够
   清晰，则跳过源文件拆分，仅记录不改动。
2. 若拆分，先移动 layout/page/component/palette 白名单到 skin-local helper 文件，
   保持导入路径只在 `src/skin` 内部使用。
3. 若拆分，再移动 `isRecord`、必填/可选字符串读取等 field reader helper，
   保持错误消息文本不变。
4. 若拆分，最后移动 page config 或 asset parsing helper，保持
   `parseSkinManifest` 与 `SkinManifestParseError` 的公开行为不变。
5. 运行 `pnpm test tests/skin/manifest.test.ts --runInBand` 和
   `pnpm check:type`，预期通过。

### Task 6: 最终验证和边界确认

- 目标：确认本次重构只改变结构和文档契约，不改变产品行为，不修改 `.ai/`。
- 改动文件：无新增实现文件要求；只运行验证并检查工作区。
- 验证方式：完整执行下列命令。

步骤：

1. 运行 `pnpm test tests/support/source-structure.test.ts --runInBand`，预期通过。
2. 运行 `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`，预期通过。
3. 若 skin parser 文件有改动，运行
   `pnpm test tests/skin/manifest.test.ts --runInBand`，预期通过。
4. 若 docs 或截图脚本契约有改动，运行
   `pnpm test tests/support/export-scripts.test.ts --runInBand`，预期通过。
5. 运行 `pnpm check:type`，预期通过。
6. 运行 `git diff -- .ai`，预期无输出。
7. 汇总任何无法运行的命令及原因，不用猜测通过。
