# 04 · Tool Calling、权限与 MCP

<div class="lesson-meta"><span>AI09—AI11</span><span>必修核心</span><span>预计 3 × 60 分钟</span><span>前置：AI02—AI04、SW09、SW14</span></div>

## 本章可观察目标

你能把工具设计成窄、可验证、可授权的能力；在执行副作用前重新校验身份与参数；解释 MCP 的 host/client/server、生命周期与信任边界。

## AI09 · Tool Calling 是提议—验证—执行循环

模型输出工具名和结构化参数，**应用**决定是否允许并执行，再把结果返回模型。模型不是权限主体，也不能直接拥有数据库管理员密钥。

```text
模型提议 tool_call
   ↓ Schema 校验
授权：用户/租户/资源/动作
   ↓ 风险策略：自动 / 确认 / 禁止
幂等与配额检查
   ↓ 执行器（超时、隔离、审计）
结构化结果/错误 → 模型或用户
```

工具应按单一业务能力设计，如 `create_draft_invoice`，而非任意 `execute_sql`。Schema 包含格式，但服务端仍重新获取真实资源、验证所有权和业务状态，不能信任模型传来的 `tenant_id`。

## AI10 · 权限、确认、沙箱与副作用

风险分级：只读且低敏可自动；可逆写入可在明确范围自动；发消息、付款、删除、公开发布、执行代码等需要预览/确认或禁止。确认界面要展示真实参数和影响，不是“Agent 要执行操作，是否同意？”

幂等键绑定用户意图；工具执行有截止时间、最大输出和审计。代码/浏览器/文件工具要限制网络、文件根、命令、凭证和资源。工具返回文本仍是不可信数据，可能包含间接 Prompt Injection。

## AI11 · MCP：标准化上下文和工具连接

MCP 使用 JSON-RPC 2.0；Host 是承载 LLM 的应用，Client 是 host 内与某个 Server 连接的组件，Server 暴露 resources、prompts、tools。连接会进行初始化和能力协商，也定义进度、取消、错误与日志等机制。

```text
Host（AI 应用，执行用户控制/同意）
  ├─ MCP Client A ↔ Server A：企业文档 resources
  └─ MCP Client B ↔ Server B：业务 tools
```

协议标准化通信，不自动解决信任。Server 描述、工具注解和返回内容可能不可信；Host 仍负责明确同意、数据最小化、授权、展示与审计。远程 MCP 还需验证授权服务器、Token 受众、重定向 URI 和最小 scope。

<DecisionCard title="给 Agent 一个通用 SQL 工具，还是业务工具？" prompt="团队希望最快连接数据库，让模型自己查询和更新。" answer="默认提供参数化、最小权限的业务查询/命令工具；只读分析可在隔离副本提供受限查询并设语句、表、行数和时间上限。通用写 SQL 会绕过业务状态机、租户授权与审计，速度优势不值得。" />

## 练习：工具威胁建模

设计 `send_email` 工具：Schema、允许收件人范围、草稿预览、确认数据、幂等键、配额、附件限制、超时、失败分类、审计字段和注入测试。再把它映射为 MCP tool，画出 Host 与 Server 各自责任。

常见误区：工具描述等于授权；把用户/租户 ID 交给模型决定；高风险确认不显示参数；超时后直接重复写；工具结果原样进入下一轮；MCP Server 获得宿主全部文件权限。

<EvidenceTracker lesson="ai-04-tools-mcp" />

## 本章完成标准

对一个只读和一个写工具完成 Schema、授权、风险分级、幂等、审计和失败测试；能在图上指出模型、Host、MCP Client、Server 与真实资源的信任边界。

<div class="source-note">主要来源（访问于 2026-08-31）：<a href="https://modelcontextprotocol.io/specification/2025-11-25">MCP Specification 2025-11-25</a>（当前稳定版本）、<a href="https://developers.openai.com/api/docs/guides/function-calling">OpenAI Function Calling</a>、<a href="https://genai.owasp.org/llm-top-10/">OWASP 2025 Excessive Agency / Improper Output Handling</a>。</div>
