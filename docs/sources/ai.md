# AI 应用与 Agent 来源目录

核验日：2026-09-04；检索截止：2026-09-03 23:59（Asia/Shanghai）。AI API 与实践变化快，章节优先保留供应商无关的系统边界；具体参数始终回到当前官方文档。

## 核心学习来源

| 来源 | 版本/状态 | 支持节点 | 使用边界 |
|---|---|---|---|
| [OpenAI API 文档](https://developers.openai.com/api/docs/) | 活文档 | AI01—04、AI09、AI16、AI18 | 结构化输出/工具/评测等具体接口；概念不绑定单供应商 |
| [tiktoken](https://github.com/openai/tiktoken) | 活跃开源仓库 | AI01—02 | BPE/Token 计数的具体实现入口；不同供应商、消息封装与多模态计费不可照搬 |
| [Neural Text Degeneration](https://arxiv.org/abs/1904.09751) | ICLR 2020 | AI01—02 | 解码策略与 nucleus sampling 的原始研究；不提供任意 API 的最佳参数 |
| [Non-Determinism of “Deterministic” LLM Settings](https://arxiv.org/abs/2408.04667) | 2024 预印本 | AI01—02、AI16 | 支持重复运行与方差意识；有限模型/任务结果不是生产系统常数 |
| [Lost in the Middle](https://arxiv.org/abs/2307.03172) | TACL 2024 | AI01—04 | 上下文容量不等于可靠利用；具体位置效应仍需按当前模型实测 |
| [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) | 活文档 | AI03—04 | 支持的 Schema 子集与拒绝/未完成处理；结构合法不等于事实和业务语义正确 |
| [JSON Schema 2020-12](https://json-schema.org/specification) | 2020-12 | AI03、AI09 | 数据形状与验证语言；业务正确性、事实和权限需额外规则 |
| [RAG 原始论文](https://arxiv.org/abs/2005.11401) | NeurIPS 2020；v4 2021-04 | AI05—08 | 提出参数记忆＋非参数检索；不等于现代 RAG 全部实践 |
| [ColBERTv2](https://aclanthology.org/2022.naacl-main.272/) | NAACL 2022 | AI05—08 | late interaction 与多向量检索证据；论文数据与配置不代表你的语料收益 |
| [OWASP Vector and Embedding Weaknesses](https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/) | 2025 | AI05—08、AI17 | RAG 数据、访问和向量边界风险；清单不替代本地威胁模型 |
| [MCP Specification](https://modelcontextprotocol.io/specification/2026-07-28) | 2026-07-28 当前规范 | AI09—11 | Host/Client/Server、无状态核心、逐请求能力信息与安全原则；旧会话式教程需重验 |
| [MCP Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) | 2026-07-28 当前规范 | AI09—11 | 工具输入/输出 Schema、发现与不可信 annotations；协议不负责业务授权与幂等 |
| [OWASP GenAI Top 10](https://genai.owasp.org/llm-top-10/) | 2025 版 | AI04、AI08—11、AI17 | Prompt Injection、过度代理、输出处理等应用风险 |
| [ReAct 原始论文](https://arxiv.org/abs/2210.03629) | 2022；ICLR 2023 | AI12—13 | 理解推理与行动交替；生产 Runtime 仍需状态、权限、恢复和终止 |
| [Temporal Workflow Execution](https://docs.temporal.io/workflow-execution) | 活文档 | AI12—14 | durable execution 与事件历史的实现参考；课程抽象不绑定其平台保证 |
| [Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) | AWS Builders' Library | AI09、AI13 | 客户端请求标识、幂等与重试边界；不可逆动作仍需查询和补偿 |
| [MemGPT](https://arxiv.org/abs/2310.08560) | 2023 预印本 | AI14 | 分层上下文/外部记忆研究起点；OS 类比不证明某种产品通用有效 |
| [Authorization Laundering in Agent Memory](https://arxiv.org/abs/2609.01836) | 2026-09-01 预印本 | AI14、AI17 | 记忆错误保存权限并影响后续动作的近期证据；有限模型和领域结果不可作系统常数 |
| [OpenTelemetry GenAI Semantic Conventions](https://github.com/open-telemetry/semantic-conventions-genai) | 持续开发中的活规范，核验于 2026-09-04 | AI15、AI18 | 生成式 AI span、metric 与 event 的命名入口；并非稳定字段合同，采用时需固定版本并审查敏感数据 |
| [OpenAI Evaluation Best Practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | 活文档 | AI16 | 任务特定数据、边界/对抗样本与持续评测；不提供通用样本量和阈值 |
| [ClaimReceipt](https://arxiv.org/abs/2609.01992) | 2026-09-02 预印本 | AI15—16、AI19 | 区分证据充分性与实验覆盖；单篇预印本不构成通用评测标准 |
| [AgentJudgeBench](https://arxiv.org/abs/2608.26623) | 2026-08-27 预印本 | AI16 | Judge 评估与 ground-truth 锚定；特定任务/rubric 结果不可外推全部 Judge |
| [NIST AI RMF 1.0](https://www.nist.gov/itl/ai-risk-management-framework) | 1.0，2023；2026 年修订工作进行中 | AI17—19 | Govern/Map/Measure/Manage 的组织风险框架；修订完成前不能把草案方向当作正式要求 |
| [NIST AI 600-1 GenAI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) | 2024-07；页面 2026-04 更新 | AI17—19 | GenAI 跨行业风险与行动；自愿框架，不替代法规 |
| [OpenAI Responses create 参考](https://developers.openai.com/api/reference/resources/responses/methods/create) | 活文档，核验于 2026-09-04 | AI01—02 | 核对采样与截断参数的当前接口定义；不同模型未必支持同一参数，实验应一次只改一个变量 |
| [OpenAI Token counting 指南](https://developers.openai.com/api/docs/guides/token-counting) | 活文档，核验于 2026-09-04 | AI01—02 | 核对 Token 计数与消息封装开销；其他供应商、编码器和多模态输入可能采用不同规则 |
| [Lost in the Middle TACL 正式页](https://aclanthology.org/2024.tacl-1.9/) | TACL 2024 | AI01—04 | 支持长上下文位置效应的研究入口；特定模型与任务结果不能作为当前模型的固定规律 |
| [OWASP LLM01 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) | 2025 版，核验于 2026-09-04 | AI01—04、AI09—11、AI17—19 | 区分直接与间接提示注入；风险清单不能替代当前系统的数据流、权限和执行层威胁分析 |
| [Dense Passage Retrieval](https://arxiv.org/abs/2004.04906) | EMNLP 2020 | AI05—08 | 解释双编码器密集召回；开放问答结果不能直接外推到带权限、版本和专有名词的企业语料 |
| [BEIR](https://arxiv.org/abs/2104.08663) | NeurIPS Datasets and Benchmarks 2021 | AI05—08 | 说明检索器表现会随任务变化；公开数据集不能替代本地问题分布与逐切片评测 |
| [Introduction to Information Retrieval](https://nlp.stanford.edu/IR-book/information-retrieval-book.html) | 在线教材，2008 | AI05—08 | 支持召回、排序与倒排检索基础；现代神经重排仍需结合后续研究和本地实验 |
| [OWASP Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) | 2025 版，核验于 2026-09-04 | AI09—11、AI17—19 | 支持最小功能、权限、自治和高影响动作确认；通用指南不替代本地威胁模型与业务授权 |
| [RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) | Standards Track，2022-06 | AI09—14 | 核对 HTTP 方法的幂等语义与重试边界；业务写操作仍需自身的去重键、状态查询和恢复规则 |
| [RFC 9700 OAuth 2.0 Security BCP](https://www.rfc-editor.org/rfc/rfc9700.html) | Best Current Practice，2025-01 | AI09—11 | 支持 OAuth 2.0 授权流程的当前安全建议；登录或持有 token 不等于获得细粒度资源授权 |
| [The Chubby Lock Service](https://research.google/pubs/the-chubby-lock-service-for-loosely-coupled-distributed-systems/) | OSDI 2006 | AI12—14 | 解释锁服务、sequencer 与迟到执行者；fencing 是否成立仍取决于下游存储或服务实际校验 |
| [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://proceedings.neurips.cc/paper_files/paper/2023/hash/91f18a1287b398d378ef22505bf41832-Abstract-Datasets_and_Benchmarks.html) | NeurIPS 2023 | AI15—16、AI18 | 提供位置、冗长和自增强等 Judge 偏差的实证入口；聊天比较结果不能替代当前任务上的校准 |
| [JSON Schema Draft 2020-12 Validation](https://json-schema.org/draft/2020-12/json-schema-validation) | Draft 2020-12 | AI03—04 | 核对结构验证词汇；Schema 不负责事实正确性、权限或业务语义 |
| [ColBERT](https://arxiv.org/abs/2004.12832) | SIGIR 2020 | AI05—08 | 解释 late interaction 如何保留细粒度匹配；论文数据集收益不能直接成为本地采购语料承诺 |
| [Anthropic Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) | 官方工程文章，2024-12 | 核心学习总结、AAI16—18 | 支持 workflow、agent 分界及逐级增加复杂度；供应商经验不是同预算随机对照，也不定义本地采用门槛 |

## 可选进阶来源

| 来源 | 版本/状态 | 支持节点 | 使用边界 |
|---|---|---|---|
| [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | 2017；原始 Transformer 论文 | AAI01—06 | 核心 attention 架构；不代表所有现代模型实现 |
| [PyTorch Documentation](https://docs.pytorch.org/docs/stable/) | stable 活文档 | AAI01—06 | 张量、autograd、训练/分布式；具体 API 按安装版本 |
| [The Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/) | 2022 开放教程 | AAI04—06 | 可执行 attention/训练实现；教学实现不是当前生产栈 |
| [LoRA](https://arxiv.org/abs/2106.09685) | 2021 原始论文 | AAI07—09 | 低秩适配的研究证据；不能直接外推所有任务/模型 |
| [Hugging Face PEFT](https://huggingface.co/docs/peft/) | 官方活文档 | AAI07—09 | LoRA/PEFT 工程实现；版本与 base 兼容需锁定 |
| [vLLM Documentation](https://docs.vllm.ai/en/latest/) | latest 活文档 | AAI10—12 | serving、quantization、parallelism、observability；性能依硬件/workload |
| [PagedAttention](https://arxiv.org/abs/2309.06180) | SOSP 2023 | AAI10—12 | KV cache 分页管理；不替代端到端容量评测 |
| [Microsoft GraphRAG](https://microsoft.github.io/graphrag/) | 官方活文档 | AAI13—15 | 图索引、local/global search；官方提示索引成本较高 |
| [AutoGen](https://arxiv.org/abs/2308.08155) | 2023 | AAI16—18 | 多 Agent conversation 框架/案例；不证明普遍优于单 Agent |
| [Epistemic Sybil Resistance](https://arxiv.org/abs/2609.01873) | 2026-09-01 预印本 | AAI16—18 | 多份 Agent 报告不等于多份独立证据；单一实验设置仍需复现 |
| [Mathematics for Machine Learning](https://mml-book.github.io/book/mml-book.pdf) | 教材，2020 | AAI01—03、阶段一复盘、进阶总结 | 支持线性代数、概率与优化的机器学习语境；教材推导不能替代当前任务的数据验证 |
| [Probabilistic Machine Learning An Introduction](https://probml.github.io/pml-book/book1.html) | 教材，2022 | AAI01—03 | 支持概率、决策与 logistic 模型；示例分布不能直接照搬到政策查询流量 |
| [Deep Learning](https://www.deeplearningbook.org/) | 教材，2016 | AAI01—03 | 支持表示、数值计算与梯度优化；不代表 2026 年具体模型实现或训练栈 |
| [On Calibration of Modern Neural Networks](https://proceedings.mlr.press/v70/guo17a.html) | ICML 2017 | AAI01—03、阶段一复盘 | 支持误校准与温度缩放；图像和文档分类实验不能外推为生成模型或分布漂移下的通用保证 |
| [SentencePiece](https://aclanthology.org/D18-2012/) | EMNLP 2018 | AAI04—06 | 解释从原始文本训练子词模型；英日机器翻译实验不证明所有语言切分等价 |
| [Data Statements for NLP](https://aclanthology.org/Q18-1041/) | TACL 2018 | AAI04—06、阶段一复盘 | 支持记录语言数据组成、覆盖与外推边界；文档化不能替代许可、隐私和偏差审查 |
| [PyTorch FullyShardedDataParallel](https://docs.pytorch.org/docs/stable/fsdp.html) | stable 活文档，核验于 2026-09-04 | AAI04—06 | 核对当前分片语义与 state-dict 行为；接口会变化，实验必须锁定安装版本 |
| [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556) | arXiv 2022；Chinchilla 研究 | AAI04—06 | 支持特定范围内参数、数据与计算预算关系；不能直接套算小编码器微调或从短 pilot 线性外推 |
| [Hugging Face PEFT index](https://huggingface.co/docs/peft/index) | 官方活文档，核验于 2026-09-04 | AAI07—09 | 核对 adapter 配置、注入、量化集成与 checkpoint；API 和 base 兼容性需要锁定包版本 |
| [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) | arXiv v3，2024 | AAI07—09、阶段二复盘、进阶总结 | 支持 DPO 目标与原始实验范围；相对偏好优化不构成事实保证或通用安全证明 |
| [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155) | NeurIPS 2022 | AAI07—09 | 区分示范、排序反馈和策略优化；结果受模型、标注过程与提示分布限制 |
| [NLP Evaluation in Trouble](https://aclanthology.org/2023.findings-emnlp.722/) | Findings of EMNLP 2023 | AAI07—09 | 支持识别训练测试污染对评测结论的威胁；当前数据的污染程度仍须从自身谱系测量 |
| [Orca](https://www.usenix.org/conference/osdi22/presentation/yu) | OSDI 2022 | AAI10—12 | 支持 iteration-level scheduling 与 selective batching；175B 模型结果不能外推到课程小模型与本地负载 |
| [DistServe](https://www.usenix.org/conference/osdi24/presentation/zhong-yinmin) | OSDI 2024 | AAI10—12、阶段二复盘 | 支持 TTFT、TPOT 约束及 prefill、decode 干扰分析；是否分离仍依本地模型、网络和负载实测 |
| [AWQ](https://arxiv.org/abs/2306.00978) | MLSys 2024 | AAI10—12 | 支持 activation-aware 权重量化机制；不能假定任意任务、语言、adapter 或硬件均无回归 |
| [BEIR OpenReview 正式入口](https://openreview.net/forum?id=wCu6T5xFjeJ) | NeurIPS Datasets and Benchmarks 2021 | AAI13—15、阶段三复盘 | 支持跨任务比较词法、稀疏、稠密与重排方法；公开集合均值不能替代本项目失败切片 |
| [MuSiQue](https://aclanthology.org/2022.tacl-1.31/) | TACL 2022 | AAI13—15 | 支持构造依赖前序答案的多跳样本；数据集规模与难度不构成生产门槛 |
| [IRCoT](https://aclanthology.org/2023.acl-long.557/) | ACL 2023 | AAI13—15、阶段三复盘 | 支持查询随已取回证据继续展开；自然语言推理轨迹不替代结构化状态与授权验证 |
| [From Local to Global 官方研究页](https://www.microsoft.com/en-us/research/publication/from-local-to-global-a-graph-rag-approach-to-query-focused-summarization/) | TMLR 2024 | AAI13—15、阶段三复盘 | 支持实体图、社区报告与全局问答；百万 Token 语料上的 sensemaking 不能外推到精确资格判断 |
| [GraphRAG 索引架构](https://microsoft.github.io/graphrag/index/architecture/) | 官方活文档，核验于 2026-09-04 | AAI13—15 | 核对实体、关系、社区与报告流程；接口和默认实现会变化，必须锁定版本 |
| [ColPali](https://arxiv.org/abs/2407.01449) | arXiv 2024 | AAI13—15、阶段三复盘 | 支持页面图像、多向量与 late interaction；ViDoRe 结果不能证明金额等关键字段无需原件复核 |
| [ALCE](https://aclanthology.org/2023.emnlp-main.398/) | EMNLP 2023 | AAI13—15 | 支持区分回答质量与引用质量；自动指标仍需映射本项目的必要证据、权限和有效期 |
| [Anthropic Multi-agent Research](https://www.anthropic.com/engineering/multi-agent-research-system) | 官方工程复盘，2025-06 | AAI16—18、阶段三复盘、进阶总结 | 支持 orchestrator-workers、并行搜索与成本分析；供应商模型和内部评测数字只代表其设置 |
| [A2A 协议规范](https://a2a-protocol.org/latest/specification/) | 官方 latest 规范，核验于 2026-09-04 | AAI16—18 | 支持独立 Agent 的任务、消息与互操作语义；协议只约束通信格式，不证明任务拆分正确 |
| [OpenTelemetry Tracing API](https://opentelemetry.io/docs/specs/otel/trace/api/) | 官方活规范，核验于 2026-09-04 | AAI16—18、阶段三复盘 | 支持父子 span、link 与跨执行者 trace；可观测祖先不能替代业务证据祖先 |
| [From Local to Global arXiv 入口](https://arxiv.org/abs/2404.16130) | arXiv 2024；TMLR 版本对应研究入口 | AAI13—15、进阶总结 | 支持局部与全局图检索；特定语料和摘要评测不能证明所有多跳问题都应建图 |

## Agent 前沿强化来源

独立专题维护截至 2026-09-03 的近三年一手证据、首次公开/修订日期、冲突观点与更新触发器。当前已核验到 2026-09-02 的 ClaimReceipt、Agent Memory Authorization Laundering、OpenAgentFlow v2 等材料；新论文先作为条件性证据，不因日期新就自动成为课程主干。详见 [Agent 论文证据库](/frontier/agents/evidence)。

## 三类结论必须分开

1. **规范/接口事实**：MCP 消息、JSON Schema、API 参数，以版本化原文为准；
2. **研究证据**：论文在特定数据、模型、指标上的结论，不直接外推所有产品；
3. **工程建议**：最小权限、幂等、检查点、分层评测，由多种标准和项目失败模式综合，应在你的约束下验证。

## 易过时项

模型名称、上下文长度、价格、SDK、API 参数、供应商数据政策不写死进通识课程，使用时实时查官方文档。PyTorch/PEFT/vLLM/GraphRAG 当前行为按季度复核；MCP 新规范、OWASP/NIST 新版、Embedding/Tokenizer/Prompt/工具 Schema 变化都触发评测集与安全边界复核。2026-09 新收录预印本按月检查版本、代码与后续复现，不把摘要数字直接写成通用结论。
