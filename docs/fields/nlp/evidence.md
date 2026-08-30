# 自然语言处理（NLP）证据账本

> 当前版本核验日：**2026-08-30**。本页记录一手来源支持什么、不能推出什么，以及什么变化会触发课程更新。

## 来源准入规则

- 近三年前沿优先 ACL Anthology、论文/模型卡和官方数据页
- 经典机制保留原论文但用当前模型重测
- 模型自报数字标明数据、语言、预算与污染限制
- 文化/多语言能力必须有目标社群或母语评审证据

## 核心证据

| 日期 | 来源 | 本课程采用的证据 | 不外推到 |
|---|---|---|---|
| 2003-01-01 | [CoNLL-2003 Shared Task](https://aclanthology.org/W03-0419/) | 建立精确边界与实体类型的共同语言。 | 新闻英语/德语和窄类型无法代表嵌套、领域实体与真实系统成本。 |
| 2004-07-01 | [ROUGE](https://aclanthology.org/W04-1013/) | 提供稳定低成本信号。 | 重叠不能判定事实支持、遗漏或新颖表达，不能单独作为发布标准。 |
| 2016-08-09 | [BiLSTM-CRF for Sequence Tagging](https://aclanthology.org/P16-1101/) | 明确区分 token 表示与结构解码两层。 | 长依赖、预训练和现代硬件效率不是其优势，今天主要作为可解释基线。 |
| 2018-05-17 | [Data Statements for NLP](https://aclanthology.org/Q18-1041/) | 把‘数据来自哪里’升级为模型能力声明的一部分。 | 完整声明仍不能修复缺失群体、非法授权或错误标签，需要采样与治理动作。 |
| 2018-08-21 | [SentencePiece](https://aclanthology.org/D18-2012/) | 建立了现代多语言 tokenizer 的可复现基础。 | 语言无关实现不等于语言公平；训练混合和词表容量仍决定分配。 |
| 2019-08-27 | [Sentence-BERT](https://aclanthology.org/D19-1410/) | 把句表示从分类器中间态变成可索引产品接口。 | 独立编码损失跨文本交互，复杂否定和事实关系仍需重排。 |
| 2020-01-01 | [Universal Dependencies v2](https://aclanthology.org/L18-1289/) | 展示 schema、社区治理和自动验证怎样共同支持跨语言资源。 | 统一标签仍会压平语言特性，树库质量和覆盖差异必须保留。 |
| 2020-04-29 | [Dense Passage Retrieval](https://aclanthology.org/2020.emnlp-main.550/) | 证明监督稠密检索能学习超越词面重叠的匹配。 | 基准分布、假负例和最新性会影响真实知识库效果；不能省略 lexical/hybrid 基线。 |
| 2020-05-28 | [GPT-3](https://arxiv.org/abs/2005.14165) | 把 prompt 变成适配接口。 | 上下文学习不保证稳健推理或最新事实，闭源训练数据也限制污染审计。 |
| 2022-05-26 | [DynaSent: Dynamic Sentiment Analysis](https://aclanthology.org/2021.acl-long.186/) | 支持把失败样本持续回流为数据资产。 | 在环收集也会受当前模型诱导，不能代表全部自然分布。 |
| 2023-05-29 | [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) | 形成广泛使用的偏好优化基线。 | 偏好数据偏差、长度捷径和分布外行为不会因目标简化而消失。 |
| 2023-07-06 | [Lost in the Middle](https://aclanthology.org/2024.tacl-1.9/) | 建立长上下文位置压力测试范式。 | 模型代际已变化，具体曲线必须在当前模型和真实任务复测。 |
| 2024-12-13 | [Byte Latent Transformer](https://arxiv.org/abs/2412.09871) | 提供按信息复杂度而非固定词表分配计算的路线。 | 结果来自特定规模与训练配方；推理栈、缓存和真实多语言成本仍需独立测量。 |
| 2024-12-18 | [ModernBERT](https://arxiv.org/abs/2412.13663) | 提醒 NLP 选型不应默认所有任务都用 decoder LLM。 | 技术报告结果与特定硬件实现需在目标环境复验。 |
| 2025-05-15 | [FactBench](https://aclanthology.org/2025.acl-long.1587/) | 提供系统校准事实评价器的基准。 | 合成/收集错误仍不能覆盖开放世界全部事实，gold 也需审计。 |
| 2025-07-28 | [Verify with Caution](https://aclanthology.org/2025.findings-acl.1175/) | 反驳‘再用一个 LLM 检查即可’的简化方案。 | 模型快速迭代，具体数值会变化；测量框架比排行榜更稳定。 |
| 2025-11-05 | [FaStFact](https://aclanthology.org/2025.findings-emnlp.1295/) | 为大规模回归提供可部署评价方向。 | 自动化吞吐提升不消除来源质量、长尾 claim 与仲裁需求。 |
| 2026-03-30 | [TransGraph](https://aclanthology.org/2026.eacl-long.75/) | 把翻译评价从句子平均扩展到篇章结构。 | 新基准覆盖和语言范围有限，图构造本身也可能带误差。 |
| 2026-03-31 | [MLRBench](https://aclanthology.org/2026.eacl-long.290/) | 提供截至 2026 的多语言长上下文反证。 | 基准任务与模型列表有限；30% 是实验结果而非所有系统常数。 |
| 2026-05-17 | [LocQA](https://aclanthology.org/2026.acl-long.1344/) | 把本地效度纳入多语言能力声明。 | 问答只能覆盖部分文化经验；知识变化和社区内部差异需持续维护。 |
| 2026-05-19 | [MuBench](https://aclanthology.org/2026.findings-acl.794/) | 提供 2026 年大规模多语言诊断底座。 | 自动/现有数据聚合可能继承质量差异，分数不代表文化与真实服务完整性。 |

## 冲突证据

### 长窗口 vs 有效阅读

API 容量只给资源上限；Lost in the Middle 与 MLRBench 支持位置/语言条件下的显著利用缺口。

### 统一多语言模型 vs 本地服务

共享表示带来迁移，但 MuBench/LocQA 显示语言覆盖不能替代地方知识和社区验证。

## 更新触发器

- ACL/EMNLP/EACL 新基准改变多语言或长上下文结论
- 主流 tokenizer/byte 架构在等计算下形成新 Pareto
- 事实评价器在独立人评上显著改变严重错误召回
- 数据许可、语言社区或产品适用范围变化

## 版本解释

“新鲜”不等于只保留新论文。基础定理、经典算法和稳定标准作为机制前置；近三年材料负责修正能力边界、真实基准、实现条件与监管状态。预印本与厂商报告会明确标注，不能获得与独立复现、正式标准相同的证据权重。
