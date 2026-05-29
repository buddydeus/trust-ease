# 实现计划：define-monorepo-product-technical-plan

## 来源

- 提案：openspec/changes/define-monorepo-product-technical-plan/proposal.md
- 设计：openspec/changes/define-monorepo-product-technical-plan/design.md
- 规格：openspec/changes/define-monorepo-product-technical-plan/specs/
- 任务：openspec/changes/define-monorepo-product-technical-plan/tasks.md

## 实现步骤

### Task 1: 建立产品级技术文档目录

- 目标：创建面向产品到技术落地的文档集合，不移动当前代码。
- 改动文件：docs/product/、docs/architecture/、docs/security/、docs/operations/
- 验证方式：检查文档路径存在；运行 `git diff -- .ai`。

步骤：

1. 创建 `docs/product/README.md`，概述产品定位、非目标、角色、核心流程和
   MVP/后续阶段边界。
2. 创建 `docs/architecture/README.md`，概述 monorepo 目标结构、技术域、
   服务边界和共享包边界。
3. 创建 `docs/security/README.md`，概述安全、合规、权限、加密、审计、
   误触发防护、冻结和申诉策略。
4. 创建 `docs/operations/README.md`，概述测试、环境、发布、监控、备份、
   恢复和后续 OpenFlow 拆分。
5. 运行 `git diff -- .ai`，预期无输出。

### Task 2: 补齐 monorepo 组织方案

- 目标：把当前单 Expo app 如何演进为 monorepo 讲清楚。
- 改动文件：docs/architecture/monorepo.md
- 验证方式：文档包含 `apps/`、`services/`、`packages/`、`infra/`、`docs/`
  五类边界。

步骤：

1. 写入目标目录树，包含 `apps/mobile`、`apps/admin`、
   `apps/contact-portal`、`services/api`、`services/worker`、
   `services/integrations`。
2. 写入 shared packages 规则，包含 `packages/domain`、
   `packages/api-contracts`、`packages/config`、`packages/i18n`、
   `packages/ui`、`packages/testing`。
3. 写入迁移原则：本 planning change 不移动当前代码，后续通过独立 change
   迁移 mobile。
4. 写入 workspace 技术方向：pnpm workspaces、TypeScript-first、先保持脚本
   简单，必要时再引入构建缓存。

### Task 3: 补齐产品域、数据模型和 API 边界

- 目标：把 PRD 模块映射为技术域、聚合根、API groups 和状态机。
- 改动文件：docs/architecture/product-domains.md、docs/architecture/api-boundaries.md
- 验证方式：文档覆盖所有核心域和聚合根。

步骤：

1. 在 `product-domains.md` 写入十个技术域：identity/account、
   contact/authorization、trust items、secure vault、trigger engine、
   notification orchestration、execution routing、review/risk control、
   audit/compliance、client experience。
2. 在同一文档写入聚合根：`UserAccount`、`IdentityVerification`、
   `TrustedContact`、`AuthorizationGrant`、`TrustItem`、`VaultDocument`、
   `TriggerPolicy`、`TriggerIncident`、`NotificationAttempt`、
   `ExecutionTask`、`ReviewCase`、`AuditEvent`。
3. 在同一文档写入核心状态机：plan lifecycle、trigger lifecycle、
   vault release lifecycle、execution task lifecycle。
4. 在 `api-boundaries.md` 写入 API groups：auth、account、contacts、
   authorizations、items、vault、trigger-policy、trigger-incidents、
   notifications、execution-tasks、review、audit、skins。
5. 写明 admin/contact portal 可以有独立 BFF 或 response contract。

### Task 4: 补齐安全、合规和风险控制方案

- 目标：让高敏感产品的安全底线成为工程输入，而不是上线前补丁。
- 改动文件：docs/security/baseline.md、docs/security/threat-model.md
- 验证方式：文档覆盖非目标、最小权限、加密、审计、误触发、冻结和申诉。

步骤：

1. 在 `baseline.md` 写明产品非目标：不替代遗嘱/公证/法律意见，不托管明文第三方
   密码，不承诺接管全部账号或资产。
2. 写入 least privilege 规则：contact、executor、partner、reviewer、
   service role 均按授权范围访问。
3. 写入 vault 加密要求：敏感记录和文件加密，必要时使用 envelope encryption。
4. 写入 immutable audit 要求：敏感读写、释放、审批、下载、冻结、申诉均记审计。
5. 在 `threat-model.md` 写入误触发防护：单一 missed check 不触发不可逆动作；
   pre-alert、contact verification、pending-review、manual gate 必须存在。
6. 写入 freeze/appeal 路径和人工复核边界。

### Task 5: 补齐运维、测试和交付路线图

- 目标：给后续实现一个能落地的阶段路线，而不是把所有模块一次性开工。
- 改动文件：docs/operations/delivery-roadmap.md、docs/operations/testing-strategy.md
- 验证方式：文档覆盖 delivery phases、test layers、observability、
  backup/restore、release safety 和 future changes。

步骤：

1. 在 `delivery-roadmap.md` 写入 Phase 0 到 Phase 5：planning/contracts、
   monorepo foundation、backend skeleton、core product MVP、
   trigger/review workflows、production hardening。
2. 写入未来 OpenFlow changes：setup-pnpm-monorepo-workspace、
   move-mobile-app-to-apps-mobile、add-domain-contract-package、
   add-api-contract-package、add-trigger-state-machine-contracts、
   add-secure-vault-architecture、add-review-admin-architecture、
   add-operations-security-docs。
3. 在 `testing-strategy.md` 写入测试分层：domain unit、API contract、
   service integration、worker fake clock、client route/page、E2E smoke、
   security regression。
4. 写入生产运维要求：structured logs、metrics、traces、alerts、
   backup/restore、retention、migration、rollback、feature flags、
   environment separation。

### Task 6: OpenSpec 校验和边界确认

- 目标：确认规划规格有效，没有误改 `.ai/` 或应用源代码。
- 改动文件：无。
- 验证方式：执行 OpenSpec 和 git 检查。

步骤：

1. 运行 `npm.cmd exec -- openspec validate define-monorepo-product-technical-plan --strict`，
   预期通过。
2. 运行 `git diff -- .ai`，预期无输出。
3. 运行 `git diff -- src tests scripts skins package.json`，预期无输出。
4. 汇总新增 docs 和 OpenSpec 文件，等待进入 `/openflow build`。
