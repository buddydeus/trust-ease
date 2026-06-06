# Frontend QA Bug Reports

`.bugs/` 用于记录单机 App MVP 自动化或手工前端 QA 中发现的问题。每个问题使用一个
Markdown 文件，文件名建议包含日期和简短 slug，例如：

```text
.bugs/2026-06-06-home-readiness-overlap.md
```

每个报告至少包含：

## 问题描述

说明用户会看到什么异常，以及影响范围。

## 复现路径

记录路由、语言、操作步骤、截图命令或浏览器视口等可复现信息。

## 问题定位

记录疑似文件、组件、样式、状态模块或脚本位置。

## 建议修复方式

给出优先修复方向，不要求在报告中完成实现。

## 验证方式

记录修复后需要重跑的命令或手工检查，例如：

```bash
pnpm check:qa
pnpm check:qa:runtime
```
