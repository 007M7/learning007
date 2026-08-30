# 机器学习证据账本

> 当前版本核验日：**2026-08-30**。本页记录一手来源支持什么、不能推出什么，以及什么变化会触发课程更新。

## 来源准入规则

- 算法机制可使用经典原论文/教材；能力与排名优先近三年论文和可复现基准。
- 预印本保留版本与日期，不把作者报告的领先写成独立事实。
- 实验数字必须同时记录数据集、切分、预算、硬件、指标和比较基线。
- 公平、医疗、金融等结论不跨人群、地区或时间无条件外推。
- 来源冲突时保留双方，转化为本地消融或适用区间，而非选一个喜欢的结论。

## 核心证据

| 日期 | 来源 | 本课程采用的证据 | 不外推到 |
|---|---|---|---|
| 2016-06-10 | [XGBoost: A Scalable Tree Boosting System](https://arxiv.org/abs/1603.02754) | 贡献是把 boosting 的目标、缺失方向和工程并行结合成可复用系统。 | 原论文年代较早；现代 CatBoost、LightGBM 和表格基础模型需要在同一预算下重测。 |
| 2017-08-06 | [On Calibration of Modern Neural Networks](https://arxiv.org/abs/1706.04599) | 贡献是让部署者把概率质量作为独立目标，而非准确率附属品。 | ECE 依赖分箱且可能隐藏条件校准失败；温度缩放也不保证分布偏移后的可靠性。 |
| 2017-09-28 | [The ML Test Score](https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/) | 贡献是建立 ML 生产成熟度的共同语言。 | 2017 清单需补充现代基础模型、安全与法规要求；评分也不能替代领域风险判断。 |
| 2018-01-25 | [Double/Debiased Machine Learning](https://academic.oup.com/ectj/article/21/1/C1/5056401) | 贡献是把预测器作为因果估计组件而非因果结论本身。 | 它依赖识别、收敛率和正值性等条件；不能处理任意未观测混杂。 |
| 2018-09-18 | [UMAP: Uniform Manifold Approximation and Projection](https://arxiv.org/abs/1802.03426) | 贡献是把局部流形、图构建和可扩展优化组合成通用工具。 | 二维布局仍高度依赖预处理、距离、参数和随机性，不能当聚类或统计显著性证据。 |
| 2019-01-28 | [Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993) | 它把模型选择从排行榜问题改成有适用范围的系统声明。 | 模板本身不能保证内容真实，也不能替代独立评测、风险审批或持续监控。 |
| 2019-11-13 | [Tuned Models Often Do Not Improve upon Default Configurations](https://arxiv.org/abs/1910.11757) | 贡献是把“调参一定有价值”变成可检验命题。 | 默认值与软件版本不断变化，具体排名不能外推到所有任务和现代系统。 |
| 2021-10-13 | [WILDS: A Benchmark of in-the-Wild Distribution Shifts](https://arxiv.org/abs/2012.07421) | 它让真实偏移成为可重复实验对象，也挑战“换一个 OOD 算法即可解决”的想象。 | 十个数据集仍不能覆盖每个业务的反馈回路；基准域标签也可能比现实更清楚。 |
| 2021-11-29 | [Data Cascades in High-Stakes AI](https://research.google/pubs/data-cascades-in-high-stakes-ai/) | 贡献是把数据治理纳入系统与组织设计。 | 质性研究不提供普遍故障率，团队仍需本地量化证据。 |
| 2024-07-26 | [NIST Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) | 贡献是把技术指标放回影响、责任和持续治理。 | 自愿框架不是法律合规证明，也不能替代领域法规和具体测试阈值。 |
| 2025-01-09 | [Accurate Predictions on Small Data with TabPFN](https://doi.org/10.1038/s41586-024-08328-6) | 贡献是证明摊销的任务级预训练可成为表格学习新范式。 | 论文适用规模、GPU条件和基准组成明确；不能外推到任意大表、时间偏移和高维文本字段。 |
| 2025-01-15 | [Causal Chambers as a Real-world Physical Testbed](https://www.nature.com/articles/s42256-024-00964-x) | 贡献是把真实干预和可重复地面真值引入算法评测。 | 小型受控装置仍与社会、医疗等开放系统差距大，不能证明跨领域外部有效性。 |
| 2025-03-11 | [CausalBench](https://www.nature.com/articles/s42003-025-07764-y) | 贡献是用真实干预数据挑战合成基准的乐观排序。 | 基因网络的测量噪声、部分干预和领域指标不等同于一般产品 A/B 因果问题。 |
| 2025-07-13 | [Adapting Prediction Sets to Distribution Shifts Without Labels](https://proceedings.mlr.press/v286/kasa25a.html) | 它展示测试时适配可以改变可靠性，但同时增加选择与假设层。 | 保证不再是原始交换性下的无条件结论；模型不确定性失真时调整也会失败。 |
| 2026-05-27 | [High Performance, Low Reliability](https://arxiv.org/abs/2605.28554) | 贡献是提供性能—可靠性的二维证据。 | 预印本、特定 conformal score 与基准集合不允许外推为所有 TFM 的永久排序。 |
| 2026-06-23 | [Leakage-Aware Comparative Benchmark](https://arxiv.org/abs/2606.24944) | 贡献是把泄漏假设显式变成可复现的实验变量。 | 单疾病、单数据集的具体排名不能作为通用医疗 AI 采购依据。 |
| 2026-06-29 | [Beyond IID](https://arxiv.org/abs/2606.30410) | 贡献是给持续评测提供按任务形态组织数据的范式。 | 公开基准仍不同于企业特有反馈、延迟标签和政策改变。 |
| 2026-08-12 | [Diagnosing Conformal Prediction Failures Under Distribution Shift](https://proceedings.mlr.press/v337/lee26g.html) | 贡献是把覆盖失败从事后数字变成部署前要测的机制问题。 | 单一医疗时间序列不能代表全部偏移；诊断也不自动恢复形式保证。 |

## 冲突证据

### 表格基础模型 vs GBDT

TabPFN v2 支持“小中型标准基准上摊销推断很强”，BeyondArena 支持“非 IID、大规模和高维下传统模型仍领先”。课程保留两者，并要求按任务形态路由。

### 理论覆盖 vs 真实偏移

Conformal 的边际覆盖在交换性下成立；2025—2026 的偏移研究显示条件一旦破坏就需适配和诊断。保证与失效证据属于同一结论的条件两侧。

## 更新触发器

- 新的表格基础模型在公开非 IID、大规模和高维基准上改变主要结论
- conformal、公平或因果方法出现跨领域独立复现并改变当前适用边界
- 主流库的默认实现、许可或数据来源发生实质变化
- 任何课程数字被用于医疗、金融、就业等高风险决策

## 版本解释

“新鲜”不等于只保留新论文。基础定理、经典算法和稳定标准作为机制前置；近三年材料负责修正能力边界、真实基准、实现条件与监管状态。预印本与厂商报告会明确标注，不能获得与独立复现、正式标准相同的证据权重。
