# check:local 误报大量 unused locale keys

## 问题描述

自动化前端 QA 第一轮执行：

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
```

命令失败，报告 `zh-CN` baseline 中有 76 个 unused keys。失败列表包含大量当前页面仍在使用的 key，例如：

- `home.heroTitle`
- `items.title`
- `my.skinRuntimeTitle`
- `triggerState.title`
- `welcome.title`

这会让 `pnpm check:local` 不能作为可靠的本地/CI 阻塞项。

## 问题定位

定位文件：

- `scripts/check-locals.js`
- `tests/i18n/check-locals.test.ts`

根因是 `collectUsedBaselinePaths()` 只识别旧形态：

```ts
messages['some.key']
getMessage(messages, 'some.key')
```

但当前页面实现大量使用 hook 返回的单参数读取方式：

```ts
const { getMessage } = useI18n();
getMessage('home.heroTitle')
```

因此脚本没有把这些真实运行中的文案读取计入 used keys，导致误报 unused。

## 建议修复方式

1. 扩展 `scripts/check-locals.js` 的 key usage 检测，识别当前代码中的：
   - `getMessage('key')`
   - `getMessage("key")`
   - `getMessage(\n  'key'\n)`
2. 保留已有 `messages['key']` / `getMessage(messages, 'key')` 支持，避免破坏旧测试。
3. 更新 `tests/i18n/check-locals.test.ts`，增加单参数 `getMessage('key')` 的 fixture。
4. 重新运行：

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/i18n/check-locals.test.ts --runInBand
```

## 修复状态

已修复。

修复内容：

- `scripts/check-locals.js` 新增单参数 `getMessage('key')` / `getMessage("key")` 检测。
- `tests/i18n/check-locals.test.ts` 新增当前 hook 用法 fixture，避免后续回归。

验证结果：

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/i18n/check-locals.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
```

两条命令均已通过。
