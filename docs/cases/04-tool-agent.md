# 案例 04 · 有审批的工具 Agent

<div class="lesson-meta"><span>进阶 AI 项目</span><span>AI09—AI19</span><span>SW13/14</span><span>Q12—Q16</span></div>

## 需求与安全边界

Agent 读取客户资料、生成跟进计划，并可创建 CRM 草稿、起草邮件；真正发送邮件和修改成交阶段必须由用户确认。它不能访问其他租户，不能执行任意 SQL/代码，单次运行有时间与金额预算。

## Runtime 与工具

```text
User → Task/Run → Planner (structured plan)
                    ↓ policy gate
      read tools ─→ Step/Event/Trace
      write tool ─→ preview → bound approval → idempotent executor
                               ↓
                           CRM / Email
```

工具按业务能力设计：`get_customer_summary(customer_id)`、`create_email_draft(...)`、`send_approved_draft(draft_id, approval_id)`。服务端从身份重取 tenant 与资源，不接收模型决定的 owner。批准绑定 run、step、参数 hash 和有效期，参数变化后必须重批。

Run 保存 step、预算、检查点和工具结果引用。等待审批时释放 worker；重复批准、恢复和消息投递由唯一键抑制。取消对未执行步骤立即生效；已发邮件只能记录/补偿，不能宣称回滚。

## MCP 边界

Host 执行策略、授权、同意和 UI；每个 MCP Server 只获得必要 scope。Server 工具描述和结果都视为不可信。远程连接使用最小 OAuth scope，不能把同一高权限 Token 转发给多个 Server。

## 评测与事故门

硬门：跨租户 0 次、未确认写入 0 次、重复发送 0 次、超预算必须终止。软门：计划质量、人工改写率、p95、单次成本。Kill switch 可禁用所有写工具而保留只读。

<DecisionCard title="用户点过一次‘始终允许发送邮件’是否足够？" prompt="这样能减少确认摩擦。" answer="只能在非常窄、可撤销的策略下考虑，例如特定收件人域、模板、频率和期限；仍展示审计与撤销。开放式邮件内容和收件人属于对外副作用，长期全局授权会放大提示注入和误操作。" />

## 你的变化任务

加入“安排会议”工具。处理时区、参会人身份、重复邀请、冲突检查、外部联系人隐私、修改/取消和确认预览；更新安全模板与评测集。
