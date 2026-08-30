# 论文证据库与更新规则

> 本页版本：2026-08-31；检索截止：**2026-08-30 23:59（Asia/Shanghai）**。核心窗口：2023-08-31—2026-08-30。

## 新鲜度规则

1. 技术结论只使用论文原文、官方技术报告、系统卡、协议规范和项目方复现实验；二手榜单与媒体只可作为线索。
2. 同时记录首次公开日和当前使用版本。论文更新后不静默覆盖旧结论，先检查方法、样本、模型和指标是否改变。
3. “最新”只对本页截止日有效。每月检查 2026 年材料，每季度重跑核心 benchmark；模型、scaffold 或环境发生大版本变化时立即复核。
4. 论文结果是特定实验的条件句，不写成普遍事实。供应商系统卡能说明其系统设计和自报评测，不能代替独立复现。
5. 截止日前 arXiv 最近工作日批次为 8 月 28 日；本库最新核心论文 AgentJudgeBench 的 v1 实际提交时间为 8 月 27 日 UTC。

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
| 2025-11-25 | [MCP 2025-11-25 Specification](https://modelcontextprotocol.io/specification/2025-11-25) | 版本协商、JSON Schema、auth、sampling、tasks | `tasks` 在该版仍标为 experimental |
| 2026-02-05 | [Infrastructure Noise](https://www.anthropic.com/engineering/infrastructure-noise) | RAM/CPU/超时怎样混入 agentic coding 分数 | 单实验室/若干 benchmark，仍需跨平台重复 |
| 2026-02-11 | [Agent-Diff](https://arxiv.org/abs/2602.11224) | 企业 API 任务的状态差分合约 | 224 项任务和四类服务不能代表所有业务流程 |
| 2026-03 | [ARC-AGI-3 Technical Report](https://arcprize.org/media/ARC_AGI_3_Technical_Report.pdf) | 未知交互环境中的探索、适应和样本效率 | 游戏环境是能力探针，不等于生产代理 |
| 2026-03-24 | [Long-running Harness Design](https://www.anthropic.com/engineering/harness-design-long-running-apps) | planner/generator/evaluator 与 scaffold 退役 | 案例成本高、样本有限，不作为普遍最优拓扑 |
| 2026-04-08 | [Managed Agents](https://www.anthropic.com/engineering/managed-agents) | 稳定执行层与易变 harness 解耦 | 特定供应商平台经验 |
| 2026-04-12 | [Agent² RL-Bench](https://arxiv.org/abs/2604.10547) | Agent 是否能自主完成 RL 工程闭环 | 六项任务中只有部分在线 RL 显著胜出 |
| 2026-05-27 | [Unified Agent Evaluation](https://arxiv.org/abs/2605.27898) | 固定 ReAct scaffold、离线快照与错误归因 | 统一接口也可能抹平 benchmark 原生优势 |
| 2026-06-15 | [Agentic Automata Learning](https://arxiv.org/abs/2606.16576) | Agent 能否通过查询发现隐藏世界模型 | DFA 是受控代理问题，不代表开放世界全部复杂性 |
| 2026-07-13 | [MM-ToolSandbox](https://arxiv.org/abs/2607.11818) | 多图、多轮、500+ 工具下的视觉精度瓶颈 | 合成视觉场景与现实 UI 漂移仍有差距 |
| 2026-07-20 | [Adaptive Adversaries](https://arxiv.org/abs/2607.18063) | 多轮自适应攻击为何突破静态安全集 | 21 个场景且 defender 无跨轮记忆，边界需保留 |
| 2026-07-28 / 08-03 v3 | [HANDBOOK.md](https://arxiv.org/abs/2607.25398) | 20—124 页长期 policy 是否持续约束动作 | 65 项任务仍只是五类模拟企业环境 |
| 2026-08-15 | [Harness the Memory](https://arxiv.org/abs/2608.15008) | 记忆介质在 QA/决策/规模下为何需要路由 | 代码待接收后发布，暂不能完全独立复现 |
| 2026-08-27 | [AgentJudgeBench](https://arxiv.org/abs/2608.26623) | DAG 工具任务中 Judge 的难度上限与 ground-truth 锚定 | EMNLP 2026 论文仍需外部复现；结论依 rubric/prompt |

## 冲突证据怎样保留

LATS 展示搜索与反思的增益，Agentless 则说明固定流程可能更强、更便宜；两者不互相否定。前者支持“环境反馈＋搜索可扩展行动候选”，后者挑战“自治决策是软件工程任务的必要条件”。正确做法是建立 `single call → deterministic workflow → single agent → multi-agent` 的阶梯基线，而不是选一派站队。

Mem0 报告结构化记忆相对其基线的精度/延迟收益，Harness the Memory 则进一步表明介质排名随任务和规模改变。因而本课程不把某个 memory product 写成标准答案，而把“写入、冲突、检索、路由、遗忘”作为可评测生命周期。

## 下次更新触发器

- 新论文改变了 AgentJudgeBench、HANDBOOK.md、ARC-AGI-3、SWE-bench 或 OSWorld 的主要结论；
- MCP 发布新稳定规范，auth/tasks/sampling 的稳定性发生改变；
- 主要 benchmark 公开数据污染、Judge 缺陷或环境不可复现问题；
- 2026 年出现可独立复现、跨模型/跨 scaffold 的 Agent 训练或 memory 结论；
- 本专题中的任何数字被用于采购、上线或高风险权限决策。
