# 02 · 结构化输出、Prompt 与上下文工程

<div class="lesson-meta"><span>AI03—AI04</span><span>必修核心</span><span>预计 2 × 60 分钟</span><span>前置：AI01—AI02、SW02</span></div>

## 本章可观察目标

你能用 Schema 把模型输出接入程序；把 Prompt 作为版本化配置；选择、排序、压缩和隔离上下文，并抵抗“不可信内容伪装成指令”。

## AI03 · 结构化输出是接口，不是信任证明

自由文本适合给人读，程序分支应使用 JSON Schema/类型化输出。Schema 定义字段、枚举、必填与嵌套形状；调用后仍要处理拒绝、截断、超时和业务验证。

```json
{
  "type": "object",
  "properties": {
    "category": { "enum": ["billing", "technical", "other"] },
    "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
    "needs_human": { "type": "boolean" }
  },
  "required": ["category", "confidence", "needs_human"],
  "additionalProperties": false
}
```

Schema 合法只证明形状正确，不证明分类正确。金额、ID、权限、引用是否存在仍用普通代码校验。保存原始响应还是解析结果，要按隐私、审计和重放需求决定。

## AI04 · Prompt 与 Context Engineering

Prompt 至少分：角色/目标、输入边界、可用事实、输出合同、拒绝/不确定性策略、示例。放进版本库，给版本号与评测结果，不要散落在业务代码字符串里。

上下文工程解决“本次给模型什么”：

1. 从授权范围选择候选信息；
2. 去重、排序和过滤低质量内容；
3. 标注来源、时间和可信等级；
4. 把不可信数据包在清晰分隔符内；
5. 长对话压缩为可验证状态，而非无限拼接；
6. 记录最终上下文构成，便于复现。

来自网页、邮件、文档、工具描述的文字都是**数据**，其中“忽略之前指令”不能获得更高权限。系统/开发者政策、用户目标、外部内容和工具结果必须有清晰信任层级。

<DecisionCard title="把整份数据库 Schema 和所有历史消息都发给模型？" prompt="这样似乎不容易漏信息，但请求越来越慢，回答也开始混乱。" answer="按任务选择最小充分上下文：先由确定性代码选相关表/字段和近期状态，摘要需保留来源与未决事项；对高风险事实重新读取原始数据。容量不是相关性，过量上下文会增加成本、攻击面与注意力干扰。" />

## 练习：把自由输出改成契约

选择一个“AI 生成任务计划”功能：定义 JSON Schema；列出业务校验（工具是否授权、截止时间范围、依赖是否成环）；设计拒绝/截断/Schema 不匹配分支；建立 10 条输入评测集并版本化 Prompt。

常见误区：正则解析自然语言 JSON；把结构合法等同内容可信；Prompt 改了不留版本；把密钥放入 system prompt；上下文无限增长；外部文档能覆盖系统规则。

<EvidenceTracker lesson="ai-02-context" />

## 本章完成标准

程序能稳定处理合法输出、拒绝、截断和业务非法四类结果；每次结果可追溯到 Prompt 版本和上下文来源；对一条注入样例证明工具权限没有改变。

<div class="source-note">主要来源（访问于 2026-08-31）：<a href="https://developers.openai.com/api/docs/guides/structured-outputs">OpenAI Structured Outputs</a>、<a href="https://genai.owasp.org/llm-top-10/">OWASP Top 10 for LLM & GenAI Apps 2025</a>。</div>
