# 论文证据库与更新规则

> 本页版本：2026-09-04；核验日：2026-09-04；检索截止：**2026-09-03 23:59（Asia/Shanghai）**。核心窗口：2023-09-04—2026-09-03。

## 新鲜度规则

1. 技术结论只使用论文原文、官方技术报告、系统卡、协议规范和项目方复现实验；二手榜单与媒体只可作为线索。
2. 同时记录首次公开日和当前使用版本。论文更新后不静默覆盖旧结论，先检查方法、样本、模型和指标是否改变。
3. “最新”只对本页截止日有效。每月检查 2026 年材料，每季度重跑核心 benchmark；模型、scaffold 或环境发生大版本变化时立即复核。
4. 论文结果是特定实验的条件句，不写成普遍事实。供应商系统卡能说明其系统设计和自报评测，不能代替独立复现。
5. 截止日前已核验 arXiv 9 月 2 日 UTC 提交批次；检索到更新日期不等于完成证据升级，只有逐条阅读原文并记录外推边界后才进入课程。

## 窗口外基础：只做前置

| 材料 | 日期 | 为什么保留 | 边界 |
|---|---:|---|---|
| [ReAct](https://arxiv.org/abs/2210.03629) | 2022-10；ICLR 2023 | 建立 reasoning/action/observation 交替直觉 | 不是生产 runtime，也未解决权限、恢复和长时状态 |
| [Reflexion](https://arxiv.org/abs/2303.11366) | 2023-03；NeurIPS 2023 | 语言反馈写入 episodic memory | 口头反思可能合理但错误，需外部 verifier |
| [Toolformer](https://arxiv.org/abs/2302.04761) | 2023-02 | 研究模型如何自监督学习 API 调用 | 与有状态、多轮、授权工具执行不同 |
| [AutoGen](https://arxiv.org/abs/2308.08155) | 2023-08-16 | 多 Agent conversation 框架代表作 | 比窗口早 15 天；案例不证明多 Agent 普遍更优 |

## 近三年核心证据

| 日期 | 一手材料 | 本专题用它回答什么 | 不能外推到哪里 |
|---:|---|---|---|
| 2023-10-06 | [LATS](https://arxiv.org/abs/2310.04406) | MCTS、价值估计、反思和环境反馈怎样组合 | HumanEval/WebShop 结果不等于所有长程任务都值得树搜索 |
| 2023-10-10 | [SWE-bench](https://arxiv.org/abs/2310.06770) | 真实仓库 issue、执行环境与测试式评分 | 数据污染、镜像和测试质量会改变结论 |
| 2023-10-12 | [MemGPT](https://arxiv.org/abs/2310.08560) | 虚拟上下文、分层记忆与模型发起换页 | OS 类比不是神经记忆机制证明 |
| 2023-11-21 | [GAIA](https://arxiv.org/abs/2311.12983) | 工具、浏览、多模态组合能力 | 466 题不能代表全部研究任务 |
| 2024-04-11 | [OSWorld](https://arxiv.org/abs/2404.07972) | 可复位真实桌面、POMDP 与执行式评分 | 369 项任务和特定 OS/应用会老化 |
| 2024-05-06 | [SWE-agent](https://arxiv.org/abs/2405.15793) | Agent-computer interface 对行为与性能的影响 | 12.5% 是特定模型、预算、版本和任务集结果 |
| 2024-05-25 | [Devil's Advocate](https://arxiv.org/abs/2405.16334) | 行动前预判失败、行动后对齐与回退 | WebArena 的零样本增益不证明通用反思有效 |
| 2024-06-17 | [τ-bench](https://arxiv.org/abs/2406.12045) | 用户交互、业务规则、状态差分与 `pass^k` | LLM 用户模拟器不能完全代表真人 |
| 2024-06-19 | [AgentDojo](https://arxiv.org/abs/2406.13352) | 不可信工具数据上的 prompt injection 攻防 | 环境覆盖有限，攻击与防御会共同演化 |
| 2024-07-01 | [Agentless](https://arxiv.org/abs/2407.01489) | 固定“定位—修复—验证”何时胜过自治循环 | SWE-bench Lite 的结论不直接外推所有开发任务 |
| 2024-08-08 | [ToolSandbox](https://arxiv.org/abs/2408.04682) | 状态依赖、信息不足、用户模拟与轨迹里程碑 | 合成任务仍不同于真实企业权限体系 |
| 2024-11-25 | [MCP 发布](https://www.anthropic.com/news/model-context-protocol) | Host/Client/Server 标准化工具与资源连接 | 互操作性不自动带来最小权限或正确授权 |
| 2024-12-18 | [TheAgentCompany](https://arxiv.org/abs/2412.14161) | 真实工作环境中的网页、代码和沟通任务 | 模拟软件公司不是全部白领工作 |
| 2024-12-19 | [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) | workflow/agent 分界和最小复杂度原则 | 官方工程经验，不是同预算随机对照论文 |
| 2025-01-23 | [Computer-Using Agent](https://openai.com/index/computer-using-agent/) | GUI perception、RL、自纠错和远程环境 | 厂商自报分数需在同 scaffold 下独立复现 |
| 2025-02-17 | [SWE-Lancer](https://arxiv.org/abs/2502.12115) | 真实付费任务和经济价值怎样进入评测 | Upwork 样本与美元价值不等于组织内完整产出 |
| 2025-02-25 | [Deep Research System Card](https://openai.com/index/deep-research-system-card/) | 浏览、代码执行、隐私、注入与系统级缓解 | 系统卡披露有限且不是独立审计 |
| 2025-04-02 | [PaperBench](https://arxiv.org/abs/2504.01848) | 研究复现、分层 rubric 与 Judge 校准 | 20 篇 AI 论文不代表一般科学发现 |
| 2025-04-16 | [BrowseComp](https://arxiv.org/abs/2504.12516) | 难检索事实上的持续浏览与短答案评分 | 有意回避长报告、歧义与真实用户分布 |
| 2025-04-21 | [A Self-Improving Coding Agent](https://arxiv.org/abs/2504.15228) | Agent 修改自身 scaffold 的开放式搜索 | 小样本提升可能过拟合 benchmark，必须 held-out |
| 2025-04-28 | [Mem0](https://arxiv.org/abs/2504.19413) | 记忆抽取、整合、检索和图关系 | LOCOMO 与 LLM Judge 不能覆盖全部长期状态任务 |
| 2025-06-13 | [Anthropic Multi-agent Research](https://www.anthropic.com/engineering/multi-agent-research-system) | lead/subagent 并行研究、协调、评测与成本 | 官方生产经验，适用查询分布和内部系统未完全公开 |
| 2025-07-17 | [ChatGPT agent System Card](https://openai.com/index/chatgpt-agent-system-card/) | 浏览器、终端、连接器合并后的风险边界 | 风险等级与缓解是特定产品版本快照 |
| 2025-08-05 | [Agent Lightning](https://arxiv.org/abs/2508.03680) | 执行与训练解耦、MDP 轨迹和分层信用分配 | 三类任务的增益不证明任意 Agent 都易于 RL |
| 2026-02-05 | [Infrastructure Noise](https://www.anthropic.com/engineering/infrastructure-noise) | RAM/CPU/超时怎样混入 agentic coding 分数 | 单实验室/若干 benchmark，仍需跨平台重复 |
| 2026-02-11 | [Agent-Diff](https://arxiv.org/abs/2602.11224) | 企业 API 任务的状态差分合约 | 224 项任务和四类服务不能代表所有业务流程 |
| 2026-03 | [ARC-AGI-3 Technical Report](https://arcprize.org/media/ARC_AGI_3_Technical_Report.pdf) | 未知交互环境中的探索、适应和样本效率 | 游戏环境是能力探针，不等于生产代理 |
| 2026-03-24 | [Long-running Harness Design](https://www.anthropic.com/engineering/harness-design-long-running-apps) | planner/generator/evaluator 与 scaffold 退役 | 案例成本高、样本有限，不作为普遍最优拓扑 |
| 2026-04-08 | [Managed Agents](https://www.anthropic.com/engineering/managed-agents) | 稳定执行层与易变 harness 解耦 | 特定供应商平台经验 |
| 2026-04-12 | [Agent² RL-Bench](https://arxiv.org/abs/2604.10547) | Agent 是否能自主完成 RL 工程闭环 | 六项任务中只有部分在线 RL 显著胜出 |
| 2026-05-27 | [UniACE](https://arxiv.org/abs/2605.27898) | 固定 ReAct scaffold、离线快照与错误归因 | 统一接口也可能抹平 benchmark 原生优势 |
| 2026-06-15 | [Agentic Automata Learning](https://arxiv.org/abs/2606.16576) | Agent 能否通过查询发现隐藏世界模型 | DFA 是受控代理问题，不代表开放世界全部复杂性 |
| 2026-07-13 | [MM-ToolSandbox](https://arxiv.org/abs/2607.11818) | 多图、多轮、500+ 工具下的视觉精度瓶颈 | 合成视觉场景与现实 UI 漂移仍有差距 |
| 2026-07-20 | [Adaptive Adversaries](https://arxiv.org/abs/2607.18063) | 多轮自适应攻击为何突破静态安全集 | 21 个场景且 defender 无跨轮记忆，边界需保留 |
| 2026-07-28 | [MCP 2026-07-28 Specification](https://modelcontextprotocol.io/specification/2026-07-28) | 无状态、自包含请求、逐请求能力信息及扩展机制怎样改变 Agent 连接层 | 互操作性不自动提供业务授权、幂等或可信工具描述；旧版教程需单独兼容测试 |
| 2026-07-28 / 08-03 v3 | [HANDBOOK.md](https://arxiv.org/abs/2607.25398) | 20—124 页长期 policy 是否持续约束动作 | 65 项任务仍只是五类模拟企业环境 |
| 2026-08-15 | [Harness the Memory](https://arxiv.org/abs/2608.15008) | 记忆介质在 QA/决策/规模下为何需要路由 | 代码待接收后发布，暂不能完全独立复现 |
| 2026-08-27 | [AgentJudgeBench](https://arxiv.org/abs/2608.26623) | DAG 工具任务中 Judge 的难度上限与 ground-truth 锚定 | EMNLP 2026 论文仍需外部复现；结论依 rubric/prompt |
| 2026-09-01 | [Agent Memory Is a Surface for Endogenous Authorization Laundering](https://arxiv.org/abs/2609.01836) | 持久记忆怎样误写权限，并把错误权力传给后续执行者 | 五个 writer、两个 executor 和三个领域不能代表全部系统；论文比例不可写成生产常数 |
| 2026-09-01 | [Epistemic Sybil Resistance](https://arxiv.org/abs/2609.01873) | 为什么增加 Agent 报告数不等于增加独立证据，聚合为何要追踪证据祖先与相关性 | 受控合成文档和特定模型不证明所有多 Agent 拓扑都会失准 |
| 2026-09-02（v2） | [OpenAgentFlow](https://arxiv.org/abs/2609.00015) | 跨 GUI、API 与工具执行路径共享 action-commit 边界和策略控制面 | 300 项受控集、TS-Bench 与 Android 实验仍是特定系统证据；不构成通用安全保证 |
| 2026-09-02 | [ClaimReceipt](https://arxiv.org/abs/2609.01992) | 评测证据“足以重算主张”和“覆盖了承诺实验集合”为什么是两个问题 | 小规模预印本且作者自报规范仍有歧义；不构成通用审计标准 |
| 2026-09-02 | [When Agents Implement Systems](https://arxiv.org/abs/2609.01985) | coding agent 在 schema、异步编排与配置约束中怎样产生缺陷，以及“声称修复却未重测”的风险 | 单会话、单 Agent 和替代性 HotpotQA 实验只适合作为案例证据 |
| 2026-09-02 | [Monitoring Web Agents Without Internal Signals](https://arxiv.org/abs/2609.02057) | 只用可观察轨迹特征与关键错误边界，怎样预测 web agent 是否正走向失败 | WebArena-Lite、Online Mind2Web 与五个 backbone 的结果需跨环境复现 |
| 2026-09-02 | [Coverage, Not Targeting](https://arxiv.org/abs/2609.02417) | 终态 verifier 信息稀疏时，credit assignment 为什么先受链路覆盖约束 | tau²-bench、BFCL 和特定训练设置中的相变不可直接当作其他任务阈值 |
| 2026-09-02 | [CHIME](https://arxiv.org/abs/2609.02074) | 先区分规划错误与执行错误，再选择写入哪类层级记忆的近期方案 | 四个 benchmark 的作者实验与待发布代码仍需独立验证，不证明记忆自演化通用有效 |
| 2026-09-02 | [MASkills](https://arxiv.org/abs/2609.02094) | 多 Agent 技能库如何以信用分配、聚合和精炼持续更新 | HotpotQA、LoCoMo、GAIA 的结果不能证明在线自改写在生产中安全或稳定 |

## 正文引用补充台账

下表登记正文参考资料区已经采用、此前未以精确 URL 进入本页的官方规范与一手材料。相同 RFC 的不同官方入口分别保留，日期化规范路径也不与 latest 地址合并。

| 来源 | 版本/年份 | 支持页面或节点 | 用途 | 外推边界 | 核验记录 |
|---|---|---|---|---|---|
| [MCP 2026-07-28 发布说明](https://blog.modelcontextprotocol.io/posts/2026-07-28/) | 官方公告，2026-07-28 | AGF07—09 | 配合最终规范说明无状态、自包含请求与逐请求能力信息的发布背景 | 维护者公告不能证明第三方实现正确或已经完成升级 | 2026-09-04 核验；截止 2026-09-03 23:59 |
| [MCP Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) | 2026-07-28 规范章节 | AGF07—12、阶段二复盘 | 核对 HTTP 传输授权、资源绑定、scope 与 issuer 校验 | 该章节限于传输授权，不定义退款业务政策或对象级批准 | 2026-09-04 核验；截止 2026-09-03 23:59 |
| [RFC 8707 HTML 入口](https://www.rfc-editor.org/rfc/rfc8707.html) | Standards Track，2020-02 | AGF07—09、AGF28—30 | 核对 OAuth token 的目标资源与 audience 绑定 | 资源绑定不等于订单、金额、字段或一次性业务批准 | 2026-09-04 核验；截止 2026-09-03 23:59 |
| [NIST NCCoE Software and AI Agent Identity and Authorization](https://www.nccoe.nist.gov/projects/software-and-ai-agent-identity-and-authorization) | 官方项目页与概念稿，2026-02 | AGF07—12、专题总结 | 支持 Agent 身份、委派、最小权限和审计的问题框架 | 公开征求意见材料不是完成验证的规范或合规结论 | 2026-09-04 核验；截止 2026-09-03 23:59 |
| [NIST SP 800-63A-4 Privacy Considerations](https://pages.nist.gov/800-63-4/sp800-63a/privacy/) | 最终版相关章节，2025-07-31 | AGF10—12 | 支持数据最小化、修改删除与选择性披露原则 | 数字身份指南不能替代具体业务的法律、保留和访问政策 | 2026-09-04 核验；截止 2026-09-03 23:59 |
| [W3C WebDriver 2](https://www.w3.org/TR/webdriver2/) | Working Draft，2026-07-02 | AGF13—15 | 核对浏览器远程控制、元素定位、状态与交互的规范语义 | 工作草案可能变化，协议命令成功也不证明业务目标或授权成立 | 2026-09-04 核验；截止 2026-09-03 23:59 |
| [NIST AI RMF 1.0 发布页](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10) | 正式框架，2023-01 | AGF25—30、阶段五复盘 | 支持记录测量不确定性、独立审阅、风险责任人与持续管理 | 自愿且跨行业的框架不是具体评测器，也不替代适用法律与发布责任 | 2026-09-04 核验；截止 2026-09-03 23:59 |
| [OpenAI 抵抗 prompt injection 的 Agent 设计](https://openai.com/index/designing-agents-to-resist-prompt-injection/) | 官方安全说明，2026 | AGF28—30 | 支持把注入作为系统问题处理，并限制模型受骗后的影响 | 供应商经验不提供本地过滤准确率，也不能替代独立网关和红队 | 2026-09-04 核验；截止 2026-09-03 23:59 |
| [GPT-6 Astra System Card](https://deploymentsafety.openai.com/gpt-6-astra) | 官方系统卡，2026-09-03 | AGF28—30 | 支持分层披露隔离、阻断评测、轨迹监测及其可规避性 | 特定模型与部署的自报材料不能完整独立复算，也不能证明其他 Agent 达到相同性能 | 2026-09-04 核验；截止 2026-09-03 23:59 |
| [RFC 8693 IETF HTML 入口](https://datatracker.ietf.org/doc/html/rfc8693) | Standards Track，2020-01 | AGF28—30 | 支持区分委派和冒充，并表达 subject、actor 与 token exchange | RFC 不规定部署信任模型，也不绑定金额、对象版本或一次性批准 | 2026-09-04 核验；截止 2026-09-03 23:59 |
| [RFC 8693 RFC Editor 入口](https://www.rfc-editor.org/rfc/rfc8693) | Standards Track，2020-01 | AGF28—30、阶段五复盘 | 为委派者、执行者与 token exchange 提供正式标准入口 | 与 IETF HTML 入口是同一 RFC，仍不能代替对象级业务授权 | 2026-09-04 核验；截止 2026-09-03 23:59 |
| [RFC 8707 RFC Editor 入口](https://www.rfc-editor.org/rfc/rfc8707) | Standards Track，2020-02 | AGF28—30、阶段五复盘 | 为资源指示和受众限制提供正式标准入口 | 与 HTML 后缀入口是同一 RFC，资源 audience 仍未限制具体对象、字段或动作 | 2026-09-04 核验；截止 2026-09-03 23:59 |

## 冲突证据怎样保留

LATS 展示搜索与反思的增益，Agentless 则说明固定流程可能更强、更便宜；两者不互相否定。前者支持“环境反馈＋搜索可扩展行动候选”，后者挑战“自治决策是软件工程任务的必要条件”。正确做法是建立 `single call → deterministic workflow → single agent → multi-agent` 的阶梯基线，而不是选一派站队。

Mem0 报告结构化记忆相对其基线的精度/延迟收益，Harness the Memory 则进一步表明介质排名随任务和规模改变。因而本课程不把某个 memory product 写成标准答案，而把“写入、冲突、检索、路由、遗忘”作为可评测生命周期。

## 下次更新触发器

- 新论文改变了 AgentJudgeBench、HANDBOOK.md、ARC-AGI-3、SWE-bench 或 OSWorld 的主要结论；
- MCP 发布新规范，授权、扩展与工具语义发生改变；
- 主要 benchmark 公开数据污染、Judge 缺陷或环境不可复现问题；
- 2026 年出现可独立复现、跨模型/跨 scaffold 的 Agent 训练或 memory 结论；
- 本专题中的任何数字被用于采购、上线或高风险权限决策。
