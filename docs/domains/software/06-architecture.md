# 06 · 权限、质量属性与架构决策

<div class="lesson-meta"><span>SW14—SW16</span><span>核心＋项目</span><span>预计 3 × 60 分钟</span><span>前置：SW01—SW13</span></div>

## 本章可观察目标

你能区分认证、授权、租户隔离和审计；把“快、稳定、安全”转化为可测场景；以 ADR 记录约束、方案、取舍和演进触发器，并完成一条纵向切片。

## SW14 · 身份、权限、租户与审计

认证回答“你是谁”，授权回答“你能对哪个资源做什么”。多租户系统还要把 `tenant/workspace_id` 带进每次查询和写入边界；只在前端隐藏按钮不是授权。

推荐审查顺序：

1. 身份凭证在哪里验证、过期与撤销？
2. 动作需要什么角色/属性/资源所有权？
3. 查询是否强制带租户条件？
4. 高风险动作是否二次确认或职责分离？
5. 审计是否记录 actor、action、resource、result、time、request/trace ID？

审计日志不应记录密钥、完整 Token 或不必要的个人数据，也不能允许普通业务用户篡改。

## SW15 · 用质量属性驱动架构

“高可用”太抽象，改写为场景：**当单个 worker 在任务执行中崩溃时，系统在 2 分钟内检测，任务不丢失，最多重复一次且重复副作用被幂等保护。** 一个质量属性场景包括刺激源、刺激、环境、对象、响应和可测指标。

| 属性 | 先问什么 | 常见代价 |
|---|---|---|
| 性能 | 哪条路径、多少并发、p95/p99 多久 | 缓存与异步增加一致性复杂度 |
| 可用性 | 允许停多久、数据可丢多少 | 冗余与演练增加成本 |
| 安全 | 资产、威胁、权限和审计 | 摩擦、延迟与运营成本 |
| 可修改性 | 哪类变化最频繁 | 抽象过多也会降低速度 |
| 成本 | 单用户/单任务预算 | 降级可能牺牲质量或延迟 |

ADR 记录：背景与约束、候选、决定、正反后果、验证方法、复审触发器。它不是长篇论文，也不是为既定方案补理由。

## SW16 · 纵向切片里程碑

构建“多租户任务运行器”最小切片：

```text
Web 表单 → POST /runs → 应用用例 → runs/outbox 事务
                                     ↓
状态页 ← GET/SSE ← worker ← queue/publisher
```

验收必须包括：输入 Schema；租户隔离；幂等创建；显式状态机；取消意图；结构化错误；数据库约束；一张 C4 容器图；至少一份 ADR。先做单进程/单数据库版本，再由质量属性触发队列、缓存或拆服务。

<DecisionCard title="一开始要拆微服务吗？" prompt="团队只有 1—3 人，领域边界还在变化，但未来可能有大量 worker。" answer="先做模块化单体：HTTP 与 worker 可作为不同进程，共享明确领域模块和数据库边界；把队列/模型/存储放在适配器。只有独立伸缩、故障隔离、团队所有权或合规边界形成可测压力时，再拆服务。" />

## 练习：一次完整架构审查

使用本站[需求与约束画布](/templates/requirements)、[C4 与数据流](/templates/system-map)和[ADR 模板](/templates/adr)，回答：用户是谁、核心用例、三条不变量、信任边界、三项质量场景、首个瓶颈、故障恢复和下一次演进触发器。

常见误区：把 JWT 解码等同授权；遗漏租户过滤；审计只有自然语言；先选技术再找问题；用平均延迟掩盖尾部；图中没有外部系统、数据存储或信任边界。

<EvidenceTracker lesson="software-06-architecture" />

## 本章完成标准

提交可运行纵向切片、C4 图、状态表和一份 ADR；同伴或 AI 按模板提出的高风险问题均有证据回应。基本评估达到 7/10；跨日期再完成一次约束变化审查，达到 8.5/10 才记为熟练。

<div class="source-note">主要来源（访问于 2026-08-31）：<a href="https://c4model.com/">C4 model</a>、<a href="https://spec.openapis.org/oas/latest.html">OpenAPI 3.2.0</a>、<a href="https://www.postgresql.org/docs/current/">PostgreSQL 18</a>、<a href="https://owasp.org/www-project-application-security-verification-standard/">OWASP ASVS</a>。</div>
