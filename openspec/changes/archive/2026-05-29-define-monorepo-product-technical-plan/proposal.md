# Define Monorepo Product Technical Plan

## Summary

补齐“安心 App”从产品规划到完整技术方案之间缺少的关键工程内容，并以
monorepo 方式定义后续项目组织。该变更只产出规划、架构和规格文档，不移动
当前代码，也不实现后端或新功能。

## Problem

当前仓库已有移动端 Expo 原型、PRD、UX/UI 策略、皮肤运行时基础设施和项目结构
重构规格。但从产品落地角度看，仍缺少一组可指导长期工程实施的完整技术方案：

- monorepo 应如何组织 mobile、web、backend、admin、worker、shared packages。
- 产品模块如何映射为稳定的领域边界和服务边界。
- 账户身份、联系人授权、托付事项、文件保险箱、触发判断、通知编排、执行路由、
  审核风控、审计日志等核心域的数据模型和接口边界。
- 高敏感产品所需的安全、合规、隐私、加密、误触发防护和人工复核策略。
- 从 MVP 到生产化的交付节奏、测试策略、监控、发布、备份和迁移方案。

如果这些内容不先明确，后续重构、后端建设、触发引擎和文件保险箱实现会容易各自
长出不同的边界，最后变成“每个模块都合理，但系统整体不好解释”的局面。

## Goals

- 定义 monorepo 目标目录结构和每个 app/package 的职责。
- 定义产品能力到技术域、服务、数据模型和事件流的映射。
- 定义 MVP、扩展阶段、生产阶段的技术路线。
- 定义核心状态机：用户配置、存活确认、预警、材料审核、正式执行、冻结/申诉。
- 定义安全与合规基线：最小权限、敏感数据加密、审计、复核、误触发防护。
- 定义工程交付基线：测试分层、CI、环境、发布、监控、备份、数据迁移。
- 为后续 OpenFlow changes 提供拆分依据，而不是一次性实现全部系统。

## Non-Goals

- 不实现 monorepo 迁移。
- 不移动当前 Expo app 代码。
- 不实现后端、数据库、文件保险箱、触发引擎或通知系统。
- 不选择云厂商的最终商业合同或具体付费方案。
- 不提供法律意见，不替代律师、公证或合规顾问评审。
- 不修改 `.ai/` 文件。

## Proposed Scope

### 1. Monorepo Target Architecture

Define a future repository organization with:

- `apps/mobile` for the current Expo Router app.
- `apps/admin` for platform reviewer and operations console.
- `apps/contact-portal` for trusted contacts / executors.
- `services/api` for public API and backend-for-frontend logic.
- `services/worker` for async workflows, notifications, evidence review, and execution routing.
- `packages/domain` for shared domain types and state-machine contracts.
- `packages/api-contracts` for request/response schemas.
- `packages/config` for environment and feature configuration.
- `packages/ui` for reusable design primitives after the mobile UI stabilizes.
- `packages/testing` for fixtures and contract test helpers.
- `infra/` for deployment, observability, and environment definitions.
- `docs/` for human-facing product and technical documentation.

### 2. Product-to-Technology Mapping

Map PRD modules into bounded contexts:

- Identity & Account
- Contact & Authorization
- Trust Item Catalog
- Secure Vault
- Trigger Engine
- Notification Orchestration
- Execution Routing
- Review & Risk Control
- Audit & Compliance
- Skin & Client Experience

### 3. Core Technical Design

Document data entities, events, API surfaces, state machines, security controls,
storage boundaries, and operational workflows needed for a complete product plan.

### 4. Delivery Roadmap

Break implementation into practical phases:

1. Monorepo foundation and shared contracts.
2. Backend domain skeleton and local API contracts.
3. Secure vault and authorization model.
4. Trigger engine and notification orchestration.
5. Review/admin workflows.
6. Production hardening.

## Success Criteria

- A future engineer can understand how the current mobile app grows into a
  monorepo product system.
- Every major PRD module has a matching technical domain and owner boundary.
- Critical missing areas are covered: backend, data model, trigger engine,
  security, compliance, operations, testing, and delivery roadmap.
- The plan is decomposable into future OpenFlow changes.
- The current app remains untouched during this planning change.
- `.ai/` remains unchanged.

## Constraints

- Preserve the current mobile stack: Expo Router, React Native, TypeScript,
  Zustand, i18n, and controlled skin runtime.
- Keep the product tone: gentle, credible, restrained, clear, orderly, and
  reversible.
- Maintain the product non-goals: no legal substitute, no plaintext third-party
  password custody, no promise to take over all accounts/assets.
- Treat current code and `package.json` as implementation truth when older
  planning documents conflict.
