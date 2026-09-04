# 深度学习证据账本

> 当前版本核验日：**2026-08-30**。本页记录一手来源支持什么、不能推出什么，以及什么变化会触发课程更新。

## 来源准入规则

- 经典机制使用原论文；现代能力使用近三年技术报告、正式会议与公开模型卡。
- 厂商报告的参数、token、GPU 小时和领先成绩保留其自报属性与硬件口径。
- 不同模型必须尽量归一化数据、训练 token/FLOPs、采样预算、精度和硬件。
- 生成样本与演示视频不作为物理、因果或通用能力的充分证据。
- 评测/解释方法必须有独立 gold、干预或反例，不只展示相关与可视化。

## 核心证据

| 日期 | 来源 | 本课程采用的证据 | 不外推到 |
|---|---|---|---|
| 2010 | [Understanding the Difficulty of Training Deep Feedforward Neural Networks](https://proceedings.mlr.press/v9/glorot10a.html) | fan-in、fan-out 与激活函数共同决定训练初期的前向和反向尺度，Xavier 初始化给出可检验的起点。 | 方差推导使用独立性等近似；尺度稳定不能保证收敛、泛化或适配任意现代架构。 |
| 2014-12-22 | [Adam: A Method for Stochastic Optimization](https://arxiv.org/abs/1412.6980) | Adam 维护梯度的一阶矩与二阶原始矩估计，并通过偏差修正和逐坐标缩放产生更新。 | 二阶原始矩不是 Hessian；原论文不能证明 Adam 在所有任务、预算和超参数下占优。 |
| 2015-02-06 | [Delving Deep into Rectifiers](https://arxiv.org/abs/1502.01852) | He 初始化把整流激活对信号二阶矩的影响写入权重尺度，并展示深层整流网络的训练证据。 | 原始视觉实验不能直接覆盖 Transformer、门控网络、残差缩放或所有低精度配置。 |
| 2015-02-11 | [Batch Normalization](https://arxiv.org/abs/1502.03167) | BatchNorm 使用批量统计、可学习仿射参数与运行统计改变激活尺度和训练行为。 | 内部协变量偏移不是唯一得到确认的因果解释；小批量、跨设备和分布变化需单独验证。 |
| 2015-12-10 | [Deep Residual Learning for Image Recognition](https://arxiv.org/abs/1512.03385) | 贡献是提供可扩展深度的优化接口，影响远超视觉。 | 原始结果不能代表今天最优骨干；残差也不保证任意深度/尺度稳定。 |
| 2016-07-21 | [Layer Normalization](https://arxiv.org/abs/1607.06450) | LayerNorm 在单个样本的指定特征轴内计算统计，不依赖同批其他样本或运行均值。 | 原始序列实验不能证明任何归一化位置、维度与现代架构组合都稳定。 |
| 2017-10-11 | [Mixed Precision Training](https://arxiv.org/abs/1710.03740) | 低精度计算、高精度权重副本与损失缩放可以联合提高训练效率，并暴露溢出与跳步监测需求。 | 收益和安全范围依硬件、算子、格式与实现；不能把一种混合精度配方直接迁移到所有模型。 |
| 2018-10-17 | [Automatic Differentiation in Machine Learning: a Survey](https://arxiv.org/abs/1502.05767) | 贡献是让反传被理解为通用程序变换而非神经网络特例。 | 综述不替代具体框架在随机、控制流、复数和分布式算子上的实现文档。 |
| 2019-01-04 | [Decoupled Weight Decay Regularization](https://arxiv.org/abs/1711.05101) | 贡献是修正广泛使用的优化器正则实现。 | 具体优势依任务和调参；AdamW 也不会自动解决学习率、数据或数值问题。 |
| 2019-12-05 | [PyTorch: An Imperative Style, High-Performance Deep Learning Library](https://arxiv.org/abs/1912.01703) | 贡献是建立现代研究代码的执行模型。 | 框架持续演进，论文中的编译与分布式能力已非 2026 完整状态；必须查当前官方文档。 |
| 2021-02-26 | [Learning Transferable Visual Models From Natural Language Supervision](https://arxiv.org/abs/2103.00020) | 贡献是把自然语言监督变成开放视觉接口。 | 互联网数据偏差、粗粒度配对和提示敏感性限制 grounding；不是物理世界理解证明。 |
| 2021-06-03 | [An Image is Worth 16x16 Words](https://arxiv.org/abs/2010.11929) | 贡献是证明视觉可统一成 token 序列建模。 | 小数据、边缘延迟和密集预测需要独立对照，不能从 ImageNet 迁移成绩概括。 |
| 2021-10-16 | [LoRA](https://arxiv.org/abs/2106.09685) | 贡献是形成参数高效适配的基础范式。 | 最优 rank/层依任务；多适配器、灾难性覆盖和数据质量仍需评估。 |
| 2022-03-02 | [A ConvNet for the 2020s](https://arxiv.org/abs/2201.03545) | 贡献是用受控现代化削弱“注意力单独带来全部提升”的归因。 | 具体硬件效率与实现相关，架构消融也无法穷尽所有交互。 |
| 2022-03-29 | [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556) | 贡献是把数据量重新放回计算最优配比。 | 指数依数据质量、架构和训练制度；现代重复训练、MoE 与后训练不能简单套用。 |
| 2022-06-23 | [FlashAttention](https://arxiv.org/abs/2205.14135) | 贡献是把硬件内存层级变成算法设计变量。 | 收益依 GPU、序列形状、内核和后续版本；不能把理论 FLOPs 当实际速度。 |
| 2022-12-19 | [Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748) | 贡献是把可扩展 Transformer 主干引入扩散。 | ImageNet 类条件不代表开放文本/视频；FID 与 guidance 配置影响排名。 |
| 2023-05-29 | [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) | 贡献是降低偏好对齐工程复杂度并形成广泛基线。 | 离线偏好覆盖、reference 和超参会限制效果；DPO 不自动解决标签偏差或分布外过优化。 |
| 2023-08-28 | [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110) | 贡献是评测透明度、场景化和多指标报告框架。 | 场景与模型会过时；统一适配也可能不等于每个模型的最佳使用方式。 |
| 2023-12-01 | [Mamba: Linear-Time Sequence Modeling with Selective State Spaces](https://arxiv.org/abs/2312.00752) | 贡献是让内容选择与线性状态更新结合成强通用骨干。 | 指标来自特定模型、硬件与 2023 基线；精确回忆和现代混合架构需重新测试。 |
| 2024-07-23 | [The Llama 3 Herd of Models](https://arxiv.org/abs/2407.21783) | 贡献是相对完整地公开模型族训练与后训练设计。 | 训练数据细节和基础设施仍不完全开放，厂商自评与公开 benchmark 存在污染/选择风险。 |
| 2024-12-27 | [DeepSeek-V3](https://arxiv.org/abs/2412.19437) | 贡献是展示稀疏模型、KV/attention 压缩和系统工程的协同。 | 总/激活参数与真实延迟不能脱离通信拓扑、并发和内核比较。 |
| 2025-01-22 | [DeepSeek-R1](https://arxiv.org/abs/2501.12948) | 贡献是提供可验证奖励驱动 reasoning 的大规模证据与训练配方。 | 厂商自报且依赖具体数据/奖励/预算；基准表现不能证明忠实思维过程或开放任务通用性。 |
| 2025-06-30 | [Transition Matching](https://arxiv.org/abs/2506.23589) | 贡献是扩展扩散/flow 与 AR 之间的设计空间，并强调受控比较。 | 2025 预印本结论来自特定图像设置；“统一”不等于在所有模态和规模领先。 |
| 2025-07-27 | [Verify with Caution](https://aclanthology.org/2025.findings-acl.1175/) | 贡献是把评价器可靠性本身变成必须本地验证的对象。 | 事实性只是模型质量一维；结论也随新 Judge 发展而需更新。 |
| 2026-02-11 | [Selective Underfitting in Diffusion Models](https://openreview.net/forum?id=yqTajvdkjv) | 贡献是给泛化解释提出可干预、可证伪机制。 | 解释仍是特定模型/数据证据，不应扩张成所有生成模型的普遍内部真相。 |
| 2026-04-16 | [Mixture-of-Experts Flow Matching for Faster Language Inference](https://arxiv.org/abs/2604.15009) | 贡献是探索 AR 之外少步语言生成的效率路径。 | 单篇预印本、任务与延迟口径特定；并行生成的可控性和开放部署仍需复现。 |
| 2026-04-30 | [World Model for Robot Learning: A Comprehensive Survey](https://arxiv.org/abs/2605.00080) | 贡献是提供 2026 年统一问题地图和持续更新资源。 | 综述不是新算法的独立性能证据，且快速领域中的覆盖会过时。 |
| 2026-06-16 | [PAIWorld](https://arxiv.org/abs/2606.18375) | 贡献是把显式几何通信引入多视角世界基础模型。 | 预印本排行榜与生成指标仍需真实策略和跨硬件独立复现。 |

## 冲突证据

### Attention vs 线性序列模型

Mamba 支持长序列吞吐和选择性状态，注意力支持直接内容寻址。课程不预判替代关系，而是用精确回忆、聚合、长度与硬件联合评测。

### 生成逼真 vs 世界正确

DiT/flow 的视觉质量进展与机器人世界模型的物理、几何批评同时保留；前者支持生成能力，后者限制其用于控制和规划。

## 更新触发器

- 新架构在同数据/计算/硬件下稳定改变 Transformer、SSM 或生成范式的主要权衡
- 公开训练报告修订关键 token、FLOPs、数据或评测数字
- 新量化/推理方法在目标硬件和真实并发下改变 Pareto 前沿
- 基准污染、Judge 偏差或模型安全事件改变现有发布门禁

## 版本解释

“新鲜”不等于只保留新论文。基础定理、经典算法和稳定标准作为机制前置；近三年材料负责修正能力边界、真实基准、实现条件与监管状态。预印本与厂商报告会明确标注，不能获得与独立复现、正式标准相同的证据权重。
