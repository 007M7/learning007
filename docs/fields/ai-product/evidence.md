# AI 产品经理证据账本

> 当前版本核验日：**2026-08-30**。本页记录一手来源支持什么、不能推出什么，以及什么变化会触发课程更新。

## 来源准入规则

- 能力/成本/采用使用官方报告并保留样本定义
- 产品方法用原始指南/论文并以本地实验验证
- 法规只引用官方现行页面并标日期/角色
- 厂商研究视为有价值但有选择偏差的证据

## 核心证据

| 日期 | 来源 | 本课程采用的证据 | 不外推到 |
|---|---|---|---|
| 1984-01-01 | [Wizard of Oz Method](https://dl.acm.org/doi/10.1145/800049.801973) | 把学习与昂贵实现解耦。 | 人工模拟可能比真实系统更聪明/一致，必须记录可自动化性和操作成本。 |
| 2017-03-01 | [The ML Test Score](https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/) | 为 AI 发布门禁提供经典骨架。 | 生成式系统、Agent 权限与现代供应链需扩充，分数不等于安全认证。 |
| 2017-05-01 | [Online Controlled Experiments](https://experimentguide.com/) | 为 AI 功能的价值验证提供因果骨架。 | AI 输出非确定、稀有事故和长周期影响需要额外风险设计。 |
| 2019-01-01 | [People + AI Guidebook](https://pair.withgoogle.com/guidebook/) | 提供 AI PM/设计/工程共同语言。 | 实践指南不是因果证据；具体模式需在用户和风险场景验证。 |
| 2019-01-28 | [Model Cards](https://arxiv.org/abs/1810.03993) | 把供应商模型能力主张转成可审查输入。 | 卡片由提供方编写，需独立验证且常缺系统级风险。 |
| 2023-12-18 | [ISO/IEC 42001](https://www.iso.org/standard/42001) | 治理从单项目文档提升为组织能力。 | 标准付费正文且认证不证明单个模型安全或合法。 |
| 2024-07-26 | [NIST AI RMF Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) | 建立生成 AI 产品通用风险词汇。 | 非强制且不替代地区法律、领域标准或具体安全论证。 |
| 2024-12-19 | [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) | 形成产品/架构共同的复杂度语言。 | 厂商实践文章不是独立对照实验，模式须用本地任务证据选择。 |
| 2025-10-13 | [OpenAI GDPval](https://evals.openai.com/) | 推动产品评测接近真实工作产物。 | 任务样本、评分和模型版本限制外推；不能替代企业自己的流程结果。 |
| 2025-10-13 | [Evals Drive the Next Chapter of AI](https://openai.com/index/evals-drive-next-chapter-of-ai/) | 强化‘先评测合同后迭代’的交付流程。 | 厂商指南需补独立评价器、人评校准和跨供应商可移植性。 |
| 2026-01-29 | [AI Assistance Coding Skills RCT](https://www.anthropic.com/research/AI-assistance-coding-skills) | 支持把认知参与设计成体验指标。 | 短期编码任务不应外推所有知识工作。 |
| 2026-04-06 | [AI Index 2026](https://hai.stanford.edu/assets/files/ai_index_report_2026.pdf) | 支持把战略重心移到互补资产和学习速度。 | 宏观趋势不决定单个市场，需结合客户集中与单位经济。 |
| 2026-06-10 | [Economic Index 2026](https://www.anthropic.com/research/economic-index-june-2026-report) | 支持以工作流深度而非通用聊天流量评估战略。 | 单平台选择偏差与短期使用不能直接证明长期生产率。 |
| 2026-06-16 | [Agentic Coding Expertise](https://www.anthropic.com/research/claude-code-expertise) | 表明组织流程、领域知识和使用习惯本身是互补资产。 | 观察性关联不证明单一培训干预会产生同等收益。 |
| 2026-08-02 | [EU AI Act applicability](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) | 必须把产品角色/用途映射到具体义务和时间。 | 官方概览不是法律意见；修订、指南与成员国执行需持续核对。 |
| 2026-08-26 | [Independent Research on Real-World AI Use](https://www.anthropic.com/research/enabling-independent-research) | 支持运营数据的独立验证与透明机制。 | 项目机制和可访问数据范围仍受平台约束，不能替代产品自己的监控。 |

## 冲突证据

### 自动化率 vs 真实价值

任务完成更快可能转移审查、返工和技能成本；必须测端到端结果。

### 通用模型能力 vs 垂直护城河

模型快速扩散削弱静态接入优势，却提高工作流、评测和数据权的互补价值。

## 更新触发器

- 基础模型价格/能力改变架构 Pareto
- 真实用户研究改变任务和结果定义
- 评价器与线上结果相关性下降
- 法律、标准、供应商数据条款或高风险分类变化

## 版本解释

“新鲜”不等于只保留新论文。基础定理、经典算法和稳定标准作为机制前置；近三年材料负责修正能力边界、真实基准、实现条件与监管状态。预印本与厂商报告会明确标注，不能获得与独立复现、正式标准相同的证据权重。
