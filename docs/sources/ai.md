# AI 应用与 Agent 来源目录

核验日：2026-08-31。AI API 与实践变化快，章节优先保留供应商无关的系统边界；具体参数始终回到当前官方文档。

| 来源 | 版本/状态 | 支持节点 | 使用边界 |
|---|---|---|---|
| [OpenAI API 文档](https://developers.openai.com/api/docs/) | 活文档 | AI01—04、AI09、AI16、AI18 | 结构化输出/工具/评测等具体接口；概念不绑定单供应商 |
| [RAG 原始论文](https://arxiv.org/abs/2005.11401) | NeurIPS 2020；v4 2021-04 | AI05—08 | 提出参数记忆＋非参数检索；不等于现代 RAG 全部实践 |
| [ReAct 原始论文](https://arxiv.org/abs/2210.03629) | 2022；ICLR 2023 | AI12—13 | 理解推理与行动交替；生产 runtime 仍需状态/权限/恢复 |
| [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25) | 2025-11-25 当前稳定版 | AI09—11 | Host/Client/Server、features、生命周期与安全原则 |
| [OpenTelemetry GenAI SemConv](https://opentelemetry.io/docs/specs/semconv/gen-ai/) | 版本化活规范 | AI15、AI18 | 生成式 AI 遥测命名；注意稳定性标记与隐私 |
| [OpenAI Evals](https://developers.openai.com/api/docs/guides/evals) | 活文档 | AI16 | 评测实现参考；数据集/rubric 方法可跨供应商 |
| [OWASP GenAI Top 10](https://genai.owasp.org/llm-top-10/) | 2025 版 | AI04、AI08—11、AI17 | Prompt Injection、过度代理、输出处理等应用风险 |
| [NIST AI RMF 1.0](https://www.nist.gov/itl/ai-risk-management-framework) | 1.0，2023 | AI17—19 | Govern/Map/Measure/Manage 的组织风险框架 |
| [NIST AI 600-1 GenAI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) | 2024-07；页面 2026-04-08 更新 | AI17—19 | GenAI 跨行业风险与行动；自愿框架，不替代法规 |
| [JSON Schema 2020-12](https://json-schema.org/specification) | 2020-12 | AI03、AI09 | 数据形状与验证语言；业务正确性需额外规则 |

## 可选进阶来源

| 来源 | 版本/状态 | 支持节点 | 使用边界 |
|---|---|---|---|
| [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | 2017；原始 Transformer 论文 | AAI01—06 | 核心 attention 架构；不代表所有现代模型实现 |
| [PyTorch Documentation](https://docs.pytorch.org/docs/stable/) | stable 活文档 | AAI01—06 | 张量、autograd、训练/分布式；具体 API 按安装版本 |
| [LoRA](https://arxiv.org/abs/2106.09685) | 2021 原始论文 | AAI07—09 | 低秩适配的研究证据；不能直接外推所有任务/模型 |
| [Hugging Face PEFT](https://huggingface.co/docs/peft/) | 官方活文档 | AAI07—09 | LoRA/PEFT 工程实现；版本与 base 兼容需锁定 |
| [vLLM Documentation](https://docs.vllm.ai/en/latest/) | latest 活文档 | AAI10—12 | serving、quantization、parallelism、observability；性能依硬件/workload |
| [PagedAttention 论文](https://arxiv.org/abs/2309.06180) | 2023 | AAI10—12 | KV cache 分页管理；不替代端到端容量评测 |
| [Microsoft GraphRAG](https://microsoft.github.io/graphrag/) | 官方活文档 | AAI13—15 | 图索引、local/global search；官方提示索引成本较高 |
| [AutoGen 论文](https://arxiv.org/abs/2308.08155) | 2023 | AAI16—18 | 多 Agent conversation 框架/案例；不证明普遍优于单 Agent |

## Agent 前沿强化来源

独立专题维护 2023-08-31—2026-08-30 的一手证据、首次公开/修订日期、冲突观点与更新触发器。最新核心材料为 2026-08-27 提交的 AgentJudgeBench。详见 [Agent 论文证据库](/frontier/agents/evidence)。

## 三类结论必须分开

1. **规范/接口事实**：MCP 消息、JSON Schema、API 参数，以版本化原文为准；
2. **研究证据**：论文在特定数据、模型、指标上的结论，不直接外推所有产品；
3. **工程建议**：最小权限、幂等、检查点、分层评测，由多种标准和项目失败模式综合，应在你的约束下验证。

## 易过时项

模型名称、上下文长度、价格、SDK、API 参数、供应商数据政策不写死进通识课程，使用时实时查官方文档。PyTorch/PEFT/vLLM/GraphRAG 当前行为按季度复核；MCP 新稳定规范、OWASP/NIST 新版、Embedding/Tokenizer/Prompt/工具 Schema 变化都触发评测集与安全边界复核。
