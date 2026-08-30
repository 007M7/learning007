# 06 · Trace、评测、安全与生产治理

<div class="lesson-meta"><span>AI15—AI19</span><span>核心＋项目</span><span>预计 5 × 55 分钟</span><span>前置：AI01—AI14、Q12</span></div>

## 本章可观察目标

你能追踪一次 Agent 运行；建立代表真实风险的评测集和门禁；防护 Prompt Injection、敏感信息和过度代理；设计模型网关、降级、成本与发布策略；完成受控 Agent 里程碑。

## AI15 · Agent Trace

Trace 连接用户请求、模型调用、检索、工具、人工确认与最终结果。每个 span 记录操作名、模型/工具版本、延迟、Token/成本、状态和错误；敏感输入按策略脱敏。Trace 用于诊断，不等于长期保存所有思考文本。

## AI16 · 评测是版本比较系统

先定义任务与失败成本，再收集真实、边界和对抗样例。评测记录数据集版本、Prompt/模型/检索/工具版本。自动 grader 适合格式、精确匹配、引用存在等；开放质量可用量表＋盲审/人工抽样。用同一模型当唯一裁判会产生偏差。

```text
离线回归：正确性 / 引用 / 工具选择 / 安全 / 成本 / 延迟
     ↓ 达到门槛
影子或小流量：真实分布、无副作用或严格隔离
     ↓ 观察窗
逐步发布：业务指标 + SLO + 用户反馈 + 回滚条件
```

## AI17 · 安全与风险

核心威胁包括直接/间接 Prompt Injection、敏感信息泄露、供应链/数据投毒、不当输出处理、过度代理、向量/Embedding 弱点、错误信息和无界消耗。防线是组合：信任分层、最小权限、输入/输出验证、工具确认、隔离、配额、来源、监控和红队测试。没有通用 Prompt 能“彻底防注入”。

NIST AI RMF GenAI Profile 用治理、映射、测量、管理的方式把可信与风险控制纳入生命周期。高影响场景还需领域专家、法律/合规与申诉机制。

## AI18 · 生产网关与演进

把供应商调用放在网关/适配层：统一认证、路由、配额、超时、重试、缓存、日志、红action和成本；业务层依赖自己的能力接口而非某个模型字段。降级可能是更小模型、无 RAG 模板结果、只读模式或转人工，必须预先定义质量差异。

任何模型、Prompt、Embedding、chunking、reranker 或工具 Schema 变化都视为版本变化：离线评测 → 小流量 → 观察 → 扩量/回退。

## AI19 · 里程碑：受控执行 Agent

在任务运行器上实现：结构化计划；只允许白名单工具；写工具显示预览并确认；每步持久化；可取消/恢复；回答带证据；Trace 串联；评测集覆盖成功、拒答、注入、重复、越权、预算耗尽和 worker 崩溃。

<DecisionCard title="离线评测涨 5%，可以直接全量吗？" prompt="新模型回答质量更好，但单次成本翻倍，工具调用次数也增加。" answer="不能只看总分。检查分桶风险、安全、工具正确率、成本与延迟；在影子/小流量验证真实分布，设预算和回滚阈值。若收益只在低价值样例而高风险分桶退化，应阻止发布。" />

## 练习：发布门禁

建立至少 30 条版本化评测：正常 12、边界 6、不可答 4、注入 4、越权 2、无界循环/预算 2。定义硬门（Schema、越权、重复副作用必须 100%）和软门（质量、成本、p95）；输出逐样例差异而非只有平均分。

常见误区：只看漂亮 demo；测试集被 Prompt 作者反复调到过拟合；只评最终文本不评工具轨迹；Trace 泄漏敏感数据；无限循环/Token；模型升级没有回归；安全全交给 system prompt。

<EvidenceTracker lesson="ai-06-evals-safety" />

## 本章完成标准

一次版本发布能回答“改了什么、哪些样例变好/变坏、成本/延迟变化、是否越权、如何回退”；高风险硬门全部通过；在测试环境完成取消、恢复、重复投递与注入演练。

<div class="source-note">主要来源（访问于 2026-08-31）：<a href="https://developers.openai.com/api/docs/guides/evals">OpenAI Evals</a>、<a href="https://opentelemetry.io/docs/specs/semconv/gen-ai/">OpenTelemetry GenAI Semantic Conventions</a>、<a href="https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence">NIST AI 600-1 GenAI Profile</a>（页面 2026-04-08 更新）、<a href="https://genai.owasp.org/llm-top-10/">OWASP GenAI Top 10 2025</a>。</div>
