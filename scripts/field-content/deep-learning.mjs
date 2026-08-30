const u = (label, url) => ({ label, url });
const ev = (date, title, url, question, mechanism, result, contribution, limit) => ({ date, title, url, question, mechanism, result, contribution, limit });
const metrics = [
  ["任务质量", "主指标、切片、置信区间与失败样本", "确认改进是否稳定且可解释"],
  ["训练", "loss、梯度/激活、吞吐、显存、数据量、FLOPs", "区分算法收益和更多计算"],
  ["推理", "首 Token、每 Token、P50/P95、吞吐、峰值内存", "模型参数量不等于用户体验"],
  ["风险", "校准、偏移、攻击、记忆/污染与能耗", "把能力放入真实部署边界"],
];
const make = (x) => ({ stage: x.stage ?? "核心主线", duration: x.duration ?? "7 × 45 分钟", metrics, ...x });

const details = [
  make({
    prerequisite: "需要能计算向量、矩阵乘法、导数和复合函数；不会手推全部矩阵微积分也可以，但要理解维度和局部梯度。",
    goals: ["从标量链式法则推导多层网络反传", "解释动态图/静态图、叶子张量与梯度累积", "用数值梯度和形状断言定位一次错误"],
    concepts: [
      { id: "DLF01", name: "张量与算子", definition: "带形状、dtype、设备和布局的多维数据及变换", decision: "一次计算的语义和资源边界" },
      { id: "DLF02", name: "计算图", definition: "保存算子依赖和中间量以应用链式法则", decision: "哪些值需保留、重算或停止梯度" },
      { id: "DLF03", name: "自动微分", definition: "以 JVP/VJP 组合精确传播导数", decision: "前向/反向模式与验证方式" },
    ],
    thesis: "深度学习训练的第一性对象不是层的名字，而是张量值、计算依赖和梯度怎样穿过每个算子。",
    problem: "一个模型 loss 下降缓慢，可能来自错误标签、broadcast 造成的形状错位、detach、混合精度下溢、梯度累积未清零或真正的优化困难。只会调用 `backward()` 无法区分这些原因。自动微分给出代码所定义函数的导数，不保证代码表达了你想要的数学目标。",
    mechanismTitle: "反向模式自动微分",
    mechanism: "前向执行把输入沿算子图变成损失，并保存反向所需的局部信息；反向从标量损失的伴随 1 出发，对每个算子应用向量—Jacobian 乘积，将来自多条路径的梯度相加。神经网络参数很多、损失很少，因此反向模式比逐参数前向模式高效。checkpointing 用重算换激活内存，`no_grad` 与 detach 改变图的边界。",
    formula: String.raw`若 $z=f(x,y)$、$L=g(z)$，链式法则给出

$$
\frac{\partial L}{\partial x}=\frac{\partial L}{\partial z}\frac{\partial z}{\partial x}.
$$

多层网络 $h_l=\phi(W_lh_{l-1}+b_l)$ 的伴随递推为

$$
\bar h_{l-1}=W_l^T\left(\bar h_l\odot\phi'(a_l)\right),
\quad \frac{\partial L}{\partial W_l}=(\bar h_l\odot\phi'(a_l))h_{l-1}^T.
$$`,
    formulaNotes: ["广播维度在反向时需沿扩展轴求和", "非标量输出反向本质是 VJP，需要上游向量", "in-place 修改可能破坏保存的中间量", "数值梯度只适合小规模、双精度和避开不可微点"],
    evidence: [
      ev("2018-10-17", "Automatic Differentiation in Machine Learning: a Survey", "https://arxiv.org/abs/1502.05767", "自动微分与符号微分、数值差分的区别是什么？", "论文以计算图和基本算子分解前向/反向模式，说明 AD 在机器精度下应用链式法则，不需要展开巨大符号表达式。", "综述建立了 JVP、VJP、复杂度和实现的统一语言。", "贡献是让反传被理解为通用程序变换而非神经网络特例。", "综述不替代具体框架在随机、控制流、复数和分布式算子上的实现文档。"),
      ev("2019-12-05", "PyTorch: An Imperative Style, High-Performance Deep Learning Library", "https://arxiv.org/abs/1912.01703", "动态图如何兼顾 Python 交互式表达与高性能张量/自动微分？", "PyTorch 以 define-by-run 构建动态图，autograd 记录运行时操作；后端张量库、设备抽象和分布式组件承载性能。", "论文描述其设计与规模应用，解释易调试体验来自运行时图而不是牺牲全部性能。", "贡献是建立现代研究代码的执行模型。", "框架持续演进，论文中的编译与分布式能力已非 2026 完整状态；必须查当前官方文档。"),
    ],
    diagram: "flowchart LR\n  X[输入张量] --> O1[算子/形状/dtype]\n  O1 --> H[中间激活]\n  H --> L[标量损失]\n  L --> V[VJP 反向]\n  V --> G[参数梯度累积]\n  G --> C[梯度检查/裁剪]\n  C --> U[优化器更新]",
    caseTitle: "一个悄悄广播的回归损失",
    case: "预测形状为 `[B,1]`、标签为 `[B]`，框架可能广播成 `[B,B]` 而不报错。loss 仍会下降，却在比较每个预测与所有标签。修复方式是先写 shape contract 和最小手算样本，再对少量参数做 central difference；训练日志同时记录梯度范数、非有限值和每层激活统计。",
    protocol: ["仅用数组实现两层 MLP 前向和反向", "与框架 autograd 对比每个参数梯度", "故意加入 broadcast、detach 和未清梯度三类错误", "用形状断言、hook 和数值梯度分别定位"],
    decisions: ["模型入口和损失建立 shape/dtype/device 合同", "训练循环显式区分 forward、backward、step、zero_grad", "关键自定义算子附 gradcheck", "混合精度与 checkpointing 单独做数值/性能回归"],
    failures: ["相信能运行就维度正确", "把数值差分误差当 AD 错误", "跨 batch 意外累积梯度", "在需要梯度的路径 detach", "只监测 loss 不监测梯度和激活"],
    prompt: "请把这段训练代码画成张量计算图，逐算子标注 shape/dtype/device、需要保存的激活和梯度路径；检查广播、detach、in-place、累积与混合精度；为最小样本手算前后向并设计 central-difference gradcheck。不要先建议换模型。",
    exerciseTitle: "独立写出并验证反向传播",
    exercise: "实现线性层＋ReLU＋MSE 的前后向，随机抽五个参数做数值梯度；再制造一个广播 bug，解释为何 loss 仍可能下降。",
    misconceptions: ["自动微分等于符号推导", "梯度存在说明目标正确", "反向传播只能用于神经网络", "detach 只节省内存", "loss 下降能排除实现错误"],
    quiz: { question: "预测 `[B,1]` 与标签 `[B]` 计算 MSE 未报错，最先检查什么？", options: ["增加隐藏层", "广播后的实际损失张量形状", "换 AdamW"], answer: 1, explanation: "广播可能把逐样本损失变成两两比较。" },
    summary: ["AD 对代码定义的函数精确求导", "反向模式组合 VJP 并累加多路径梯度", "shape/dtype/device 是数学合同", "小型手算和 gradcheck 是自定义训练代码的底线"],
    mastery: { explain: "反向模式如何沿图传播 VJP", apply: "一个通过数值梯度的两层网络", boundary: "AD 正确但学习目标仍错误的情形" },
    sources: [u("AD Survey", "https://arxiv.org/abs/1502.05767"), u("PyTorch", "https://arxiv.org/abs/1912.01703")],
  }),
  make({
    prerequisite: "先完成计算图与梯度验证，并能读训练/验证 loss 曲线。",
    goals: ["解释 SGD/动量/AdamW 的更新差异", "诊断初始化、归一化、批量和精度造成的不稳定", "设计学习率、优化器与随机种子消融"],
    concepts: [
      { id: "DLF04", name: "优化轨迹", definition: "随机梯度、动量和自适应尺度共同决定参数路径", decision: "未收敛、鞍点还是噪声" },
      { id: "DLF05", name: "信号传播", definition: "初始化、残差和归一化控制激活/梯度尺度", decision: "深度增加后信息是否稳定" },
      { id: "DLF06", name: "稳定训练", definition: "学习率、批量、精度、裁剪和监控形成闭环", decision: "何时恢复、回滚或调整" },
    ],
    thesis: "稳定训练是数值、优化和数据三套动力学的交集；优化器名称本身解释不了一条训练曲线。",
    problem: "loss spike 可能由脏 batch、学习率暖启动、混合精度溢出、MoE 路由失衡或分布式通信错误造成。Adam 在某些配置更快降低训练损失，不代表在相同 token/算力下泛化更好。批量变化还会改变梯度噪声和有效学习率。",
    mechanismTitle: "梯度估计、动量与尺度控制",
    mechanism: "SGD 用 minibatch 给出总体梯度的噪声估计；动量平滑长期方向。Adam 对一阶、二阶矩做指数平均并按坐标缩放，AdamW 将权重衰减从自适应梯度更新中解耦。Xavier/He 初始化匹配前后向方差；残差提供短梯度路径；LayerNorm 按 token 特征归一化，适合序列模型。warmup 控制早期未校准激活下的更新。",
    formula: String.raw`动量 SGD 与 AdamW 的核心更新可概括为

$$
v_t=\beta v_{t-1}+g_t,\quad \theta_{t+1}=\theta_t-\eta v_t,
$$

$$
m_t=\beta_1m_{t-1}+(1-\beta_1)g_t,\quad
v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2,
$$

$$
\theta_{t+1}=(1-\eta\lambda)\theta_t-\eta\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}.
$$`,
    formulaNotes: ["权重衰减与 L2 正则在自适应优化器中不完全等价", "梯度裁剪掩盖爆炸原因时只能作为护栏", "混合精度 loss scaling 需监测溢出/跳步", "比较优化器必须固定 token、模型、数据顺序和搜索预算"],
    evidence: [
      ev("2019-01-04", "Decoupled Weight Decay Regularization", "https://arxiv.org/abs/1711.05101", "为什么把 L2 项加到 Adam 梯度中不等于直接衰减权重？", "论文分析自适应尺度会改变 L2 惩罚的坐标作用，提出 AdamW 将权重衰减独立于梯度更新。", "实验在图像分类与语言建模展示更可解释的超参数和泛化收益。", "贡献是修正广泛使用的优化器正则实现。", "具体优势依任务和调参；AdamW 也不会自动解决学习率、数据或数值问题。"),
      ev("2024-12-27", "DeepSeek-V3 Technical Report", "https://arxiv.org/abs/2412.19437", "大规模 MoE 训练怎样在较低激活参数和数值风险下保持稳定？", "报告描述 MLA、DeepSeekMoE、无辅助损失负载均衡、多 Token 预测、FP8 训练与系统协同；总参数 671B、每 Token 激活 37B，预训练 14.8T Token。", "作者报告 2.788M H800 GPU 小时，并称训练中无不可恢复 loss spike 或回滚。", "贡献是公开大规模稀疏模型在算法与系统层的联合稳定设计。", "厂商自报、硬件/集群高度特定；不能用总 GPU 小时直接与不同实现和会计口径比较。"),
    ],
    diagram: "flowchart LR\n  B[数据 batch] --> F[前向激活]\n  F --> L[loss/scale]\n  L --> G[反向梯度]\n  G --> N[范数/非有限/分布]\n  N --> O[优化器+schedule]\n  O --> W[参数/EMA/checkpoint]\n  W --> F\n  N --> A[告警/跳步/回滚]",
    caseTitle: "Transformer 训练第 8k 步尖峰",
    case: "先对尖峰 batch 重放，检查 token 长度、异常标签和 loss 分项；再检查 grad norm、FP8/FP16 overflow、学习率位置与各层激活。若只有某数据源触发，修数据和采样；若所有 batch 在 warmup 结束触发，检查 schedule。裁剪可防止模型损坏，但事故报告仍需找到根因。",
    protocol: ["在小模型上比较 SGD、Adam、AdamW，固定 token 和搜索次数", "记录每层激活/梯度均值、方差和范数", "分别移除残差、归一化、warmup，观察失效", "制造异常 batch 并验证检测、跳步和 checkpoint 恢复"],
    decisions: ["训练卡记录有效 batch、token、schedule 和优化器全部状态", "checkpoint 包含随机数、采样器与 scaler", "尖峰门禁区分数据异常、数值溢出和优化失稳", "大规模前先用缩放实验校准超参迁移"],
    failures: ["只保存模型权重无法精确续训", "用更强裁剪掩盖坏数据", "比较不同训练 Token 的优化器", "把 Adam 二阶矩叫 Hessian", "忽略分布式 worker 间数据/梯度差异"],
    prompt: "请诊断这条训练曲线，按数据 batch、前向激活、损失分项、梯度、混合精度、优化器、schedule 和分布式状态逐层排查；固定 token 与搜索预算设计 SGD/AdamW 消融；给出可重放尖峰 batch、完整 checkpoint 和回滚门禁。",
    exerciseTitle: "构建训练稳定性仪表盘",
    exercise: "训练一个 6 层网络，记录激活/梯度直方图、更新/参数比、overflow 和吞吐；故意删除归一化或提高学习率，写出诊断证据链。",
    misconceptions: ["Adam 总比 SGD 好", "权重衰减就是 Adam 中的 L2", "梯度裁剪解决爆炸根因", "batch 越大越稳定且越优", "恢复权重等于恢复训练"],
    quiz: { question: "AdamW 的关键区别是什么？", options: ["不使用动量", "将权重衰减与自适应梯度更新解耦", "只适合卷积网络"], answer: 1, explanation: "解耦避免自适应预条件改变 L2 的等效衰减。" },
    summary: ["训练稳定来自数据、数值和优化联合", "AdamW 解耦权重衰减", "激活/梯度监控比单 loss 更有诊断力", "可重放和完整 checkpoint 是恢复底线"],
    mastery: { explain: "AdamW 更新与 L2 的差别", apply: "一次 loss spike 的重放与归因", boundary: "梯度裁剪只能当护栏的原因" },
    sources: [u("AdamW", "https://arxiv.org/abs/1711.05101"), u("DeepSeek-V3", "https://arxiv.org/abs/2412.19437")],
  }),
  make({
    prerequisite: "需掌握卷积、矩阵乘法、反向传播和训练/验证对照。",
    goals: ["解释卷积的局部连接、权共享与等变性", "比较 ResNet、ViT 与现代卷积的归纳偏置", "按数据量、算力和延迟选择视觉骨干"],
    concepts: [
      { id: "DLF07", name: "卷积偏置", definition: "局部感受野和权共享编码平移结构", decision: "局部模式是否稳定可复用" },
      { id: "DLF08", name: "残差骨干", definition: "恒等捷径让深层网络学习增量变换", decision: "深度是否带来可优化收益" },
      { id: "DLF09", name: "视觉 Transformer", definition: "图像 patch token 通过全局注意力交互", decision: "数据/预训练是否支撑更弱偏置" },
    ],
    thesis: "CNN 与 ViT 的差异不是旧与新，而是谁把局部性、全局性和数据规模假设写进架构。",
    problem: "小型工业缺陷数据上，ViT 可能因缺乏预训练和错误增强而不如 CNN；大规模预训练后，ViT 又能获得更强迁移。模型参数相近不代表 FLOPs、内存访问和边缘延迟相同。图像分类分数也不代表定位、遮挡和域偏移下可靠。",
    mechanismTitle: "局部等变、残差优化与 patch 注意力",
    mechanism: "卷积核在空间滑动实现平移等变，池化/步幅扩大感受野并降低分辨率。ResNet 让块学习 $F(x)$ 并输出 $x+F(x)$，改善深网络信号传播。ViT 把 patch 投影为 token，加位置编码后用多头自注意力全局混合。ConvNeXt 等反向吸收 Transformer 的训练和宏观设计，说明性能来自一组设计而非单一算子。",
    formula: String.raw`二维卷积可写为

$$
y_{i,j,c_o}=\sum_{u,v,c_i}K_{u,v,c_i,c_o}x_{i+u,j+v,c_i}.
$$

残差块 $y=x+F(x)$ 的梯度包含恒等路径：

$$
\frac{\partial L}{\partial x}=\frac{\partial L}{\partial y}\left(I+\frac{\partial F}{\partial x}\right).
$$`,
    formulaNotes: ["卷积等变会被边界、步幅和池化改变", "感受野理论大小不等于有效感受野", "patch 大小决定序列长度和细粒度信息", "预训练数据与增强可能比骨干名字更影响结果"],
    evidence: [
      ev("2015-12-10", "Deep Residual Learning for Image Recognition", "https://arxiv.org/abs/1512.03385", "为什么更深网络出现退化，恒等捷径能否使其可优化？", "ResNet 用残差块和 shortcut 让网络学习相对恒等映射的增量，构建 50/101/152 层视觉网络。", "论文在 ImageNet 和检测任务取得当时领先，并显示普通深网络训练误差反而更高的退化现象。", "贡献是提供可扩展深度的优化接口，影响远超视觉。", "原始结果不能代表今天最优骨干；残差也不保证任意深度/尺度稳定。"),
      ev("2021-06-03", "An Image is Worth 16x16 Words", "https://arxiv.org/abs/2010.11929", "纯 Transformer 在足够预训练数据下能否替代卷积视觉骨干？", "ViT 将图像分 patch、线性嵌入并用标准 Transformer encoder；依赖大规模监督预训练后迁移到中等图像任务。", "作者报告在大预训练规模下匹配或超过强 CNN，同时训练计算更有竞争力。", "贡献是证明视觉可统一成 token 序列建模。", "小数据、边缘延迟和密集预测需要独立对照，不能从 ImageNet 迁移成绩概括。"),
      ev("2022-03-02", "A ConvNet for the 2020s", "https://arxiv.org/abs/2201.03545", "若逐步把现代训练和 Transformer 宏观设计移植到卷积，CNN 能否保持竞争力？", "ConvNeXt 从 ResNet 出发，调整 stage 比例、patchify stem、深度可分离卷积、LayerNorm、激活和训练策略。", "论文在分类、检测与分割展示与同规模 Transformer 竞争。", "贡献是用受控现代化削弱“注意力单独带来全部提升”的归因。", "具体硬件效率与实现相关，架构消融也无法穷尽所有交互。"),
    ],
    diagram: "flowchart LR\n  I[图像/增强] --> C[CNN 局部共享]\n  I --> P[Patch+ViT 全局注意]\n  C --> R[残差多尺度表示]\n  P --> R\n  R --> H[分类/检测/分割头]\n  H --> E[IID+遮挡+域偏移]\n  E --> D[质量/延迟/内存选型]",
    caseTitle: "产线表面缺陷检测",
    case: "只有 8,000 张图、缺陷尺寸小且相机固定。保留轻量 CNN 从头训练、预训练 ConvNeXt 和 ViT 三组；patch 不能大到吞掉细裂纹。按生产批次和相机分组测试，增加亮度、污染和遮挡切片。最终以漏检成本、边缘设备 P95 和校准选择，而非只看 ImageNet 架构声誉。",
    protocol: ["固定图像分辨率与训练预算比较 CNN/ViT", "从小数据到增加预训练逐级改变数据条件", "用遮挡/平移测试等变和鲁棒性", "在目标硬件测预处理、推理和后处理完整延迟"],
    decisions: ["骨干选型绑定数据规模、任务粒度和硬件", "增强变换需验证语义合法", "分类之外保留定位/区域证据", "延迟使用目标设备端到端测量"],
    failures: ["用参数量代替实际延迟", "patch 大小抹去小目标", "训练/测试拍摄批次泄漏", "使用翻转等不合法增强", "用分类准确率代表安全漏检"],
    prompt: "请为视觉任务设计 CNN、ConvNeXt、ViT 公平比较：固定数据、预训练条件、分辨率、训练 FLOPs 和调参预算；按实体/设备/批次切分；报告质量、校准、遮挡/光照/域偏移、目标硬件 P95 与内存。解释局部/全局归纳偏置，不按架构新旧选型。",
    exerciseTitle: "测量数据规模如何改变骨干排名",
    exercise: "在 10%、30%、100% 数据量下训练小 CNN 和小 ViT，分别加入/不加入预训练；画质量—数据—计算曲线并解释排名翻转。",
    misconceptions: ["ViT 已淘汰 CNN", "卷积天然平移不变", "参数少一定更快", "预训练收益等于架构收益", "ImageNet 领先等于领域任务领先"],
    quiz: { question: "小缺陷任务使用过大 patch 最直接的风险是什么？", options: ["梯度一定爆炸", "细粒度缺陷在 token 化时被平均或丢失", "模型参数变成零"], answer: 1, explanation: "patch 是信息瓶颈，粒度需匹配目标尺度。" },
    summary: ["CNN 编码局部共享，ViT 借数据学习关系", "残差结构改善深层优化", "现代训练模糊了架构二分", "选型必须联结任务、数据和硬件"],
    mastery: { explain: "CNN、ResNet 和 ViT 的归纳偏置", apply: "一份跨数据规模的视觉骨干对照", boundary: "ImageNet 排名无法直接迁移的条件" },
    sources: [u("ResNet", "https://arxiv.org/abs/1512.03385"), u("ViT", "https://arxiv.org/abs/2010.11929"), u("ConvNeXt", "https://arxiv.org/abs/2201.03545")],
  }),
  make({
    prerequisite: "需掌握矩阵乘法、残差/归一化、序列张量和基本复杂度。",
    goals: ["推导自注意力与因果掩码", "解释 KV cache、FlashAttention 和长序列瓶颈", "比较 Transformer 与选择性 SSM 的质量/吞吐/记忆"],
    concepts: [
      { id: "DLF10", name: "注意力", definition: "内容寻址的全局加权聚合", decision: "任务是否需要任意位置直接交互" },
      { id: "DLF11", name: "高效实现", definition: "通过分块、融合和缓存减少内存 IO/重复计算", decision: "瓶颈在 FLOPs、带宽还是容量" },
      { id: "DLF12", name: "选择性 SSM", definition: "输入依赖状态更新以线性扫描保留/遗忘信息", decision: "长序列和内容检索如何权衡" },
    ],
    thesis: "序列架构的竞争不是 $O(n^2)$ 与 $O(n)$ 的口号，而是内容检索、状态压缩、硬件利用和真实长度分布的联合问题。",
    problem: "标准注意力能让任意 token 直接比较，却为训练构造 $n^2$ 关系；自回归推理又被 KV cache 容量和内存带宽限制。线性 SSM 压缩历史，长序列吞吐更好，但固定状态可能丢失精确回忆。论文中的百万长度不代表每种任务都有效利用百万上下文。",
    mechanismTitle: "内容寻址、IO-aware attention 与选择性状态",
    mechanism: "Transformer 由 $QK^T$ 得到内容相关权重并聚合 $V$，因果 mask 阻止看未来。FlashAttention 不近似注意力，而是分块把中间矩阵留在片上 SRAM，减少 HBM 读写。Mamba 让 SSM 参数依输入变化，选择保留/忘记 token，并用 hardware-aware scan 并行训练、递归推理。",
    formula: String.raw`缩放点积注意力：

$$
\operatorname{Attn}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V.
$$

离散状态空间模型：

$$
h_t=\bar A(x_t)h_{t-1}+\bar B(x_t)x_t,\qquad y_t=C(x_t)h_t.
$$`,
    formulaNotes: ["softmax 权重是模型路由而非人类可解释因果", "FlashAttention 改变 IO 复杂度而非数学结果", "KV cache 大小随层、头、长度和 dtype 增长", "SSM 线性时间不保证精确任意位置检索"],
    evidence: [
      ev("2022-06-23", "FlashAttention", "https://arxiv.org/abs/2205.14135", "能否通过 IO-aware 精确算法加速注意力并降低内存？", "算法把 $Q,K,V$ 分块，在 SRAM 中在线维护 softmax 统计，避免物化完整注意力矩阵；并给出 HBM IO 分析。", "论文报告相对基线显著加速和节省内存，并支持更长上下文。", "贡献是把硬件内存层级变成算法设计变量。", "收益依 GPU、序列形状、内核和后续版本；不能把理论 FLOPs 当实际速度。"),
      ev("2023-12-01", "Mamba: Linear-Time Sequence Modeling with Selective State Spaces", "https://arxiv.org/abs/2312.00752", "SSM 如何获得内容相关选择能力并在语言上接近注意力？", "Mamba 使状态更新参数依输入变化，使用硬件感知并行 scan；网络不使用注意力或传统 MLP 块。", "论文报告 3B Mamba 超过同规模 Transformer、匹配约两倍规模模型，并称推理吞吐最高约 5 倍、长度线性扩展。", "贡献是让内容选择与线性状态更新结合成强通用骨干。", "指标来自特定模型、硬件与 2023 基线；精确回忆和现代混合架构需重新测试。"),
    ],
    diagram: "flowchart LR\n  X[Token 序列] --> A[Attention: 全局内容寻址]\n  X --> S[SSM: 选择性状态压缩]\n  A --> F[Flash/分块 IO]\n  A --> K[KV cache 推理]\n  S --> H[scan/递归状态]\n  F --> E[质量/长度/吞吐]\n  K --> E\n  H --> E",
    caseTitle: "百万日志序列异常定位",
    case: "任务既要检测长期趋势，也要精确找回某次关键错误。比较窗口 Transformer、Mamba 和混合层；数据按真实会话长度分层。指标包括异常 F1、关键事件 needle、多跳依赖、tokens/s、峰值显存和长序列衰减。若 SSM 吞吐领先但精确回忆失败，可用层次索引或局部 attention，而不是宣称架构绝对胜负。",
    protocol: ["手算四 token 单头注意力和 mask", "在同一参数/训练 token 下比较小 Transformer 与 Mamba", "按 1k/8k/32k 长度报告质量、吞吐和内存", "加入精确复制与长期聚合两类合成任务定位偏置"],
    decisions: ["序列骨干选择按任务记忆类型与长度分布", "训练和推理分别测 IO 与内存", "长上下文宣传需通过检索、聚合和缺失信息测试", "混合架构保留可消融层比例"],
    failures: ["把 $O(n)$ 当所有硬件都更快", "用 needle 检索代表长程推理", "忽略 KV cache 精度和并发", "把 attention map 当解释", "比较不同训练数据/参数的架构"],
    prompt: "请为序列任务比较 Transformer、FlashAttention 实现、选择性 SSM 与混合架构。固定参数、训练 token、数据和硬件；按长度报告任务质量、精确回忆、聚合、多跳、吞吐、首 token、峰值显存和 KV/状态容量；指出 IO、FLOPs 与内容记忆的不同瓶颈。",
    exerciseTitle: "让线性架构和注意力各赢一次",
    exercise: "构造一个长期平均任务和一个任意位置精确复制任务，在多长度下对照两类模型；解释归纳偏置而非只报总平均。",
    misconceptions: ["注意力天然可解释", "FlashAttention 是近似", "线性复杂度必然低延迟", "百万上下文等于百万有效推理", "KV cache 只与参数量有关"],
    quiz: { question: "FlashAttention 为什么能在数学结果近似不变时提速？", options: ["删除大部分 token", "分块减少 HBM 与片上内存之间的 IO", "把注意力换成卷积"], answer: 1, explanation: "核心是 IO-aware 精确计算。" },
    summary: ["注意力提供全局内容寻址", "FlashAttention 优化 IO 而非改变目标", "Mamba 用输入选择压缩历史", "真实选型需同时测记忆类型和系统性能"],
    mastery: { explain: "attention 与选择性 SSM 的状态差异", apply: "一个按长度分层的质量/吞吐对照", boundary: "线性复杂度不保证更优的条件" },
    sources: [u("FlashAttention", "https://arxiv.org/abs/2205.14135"), u("Mamba", "https://arxiv.org/abs/2312.00752")],
  }),
  make({
    stage: "强化核心",
    prerequisite: "需理解训练动力学、Transformer 和统计泛化；不要求具备集群运维经验。",
    goals: ["用缩放律区分参数、数据与计算", "审计训练数据混合、去重和污染", "阅读技术报告时归一化 token、FLOPs、硬件与能力主张"],
    concepts: [
      { id: "DLF13", name: "缩放律", definition: "在给定范式内拟合损失随模型、数据和计算的规律", decision: "如何分配有限预训练预算" },
      { id: "DLF14", name: "数据混合", definition: "质量、重复、领域和顺序共同塑造能力", decision: "收集、过滤、重采样和权利边界" },
      { id: "DLF15", name: "训练系统", definition: "并行、精度、通信和容错决定可实现算力", decision: "理论方案是否能稳定跑完" },
    ],
    thesis: "缩放律是特定数据与架构区间内的预算工具，不是“越大必然越智能”的自然定律。",
    problem: "参数量、训练 Token 和 FLOPs 经常被混为“规模”。重复低质量数据会降低有效信息，数据污染又让基准分数失真。技术报告中的 GPU 小时受芯片、利用率、精度和并行策略影响，不能直接横比。缩放拟合若跨越架构/数据制度变化，外推可能失败。",
    mechanismTitle: "计算最优分配与数据—系统协同",
    mechanism: "经验缩放律在固定范式下拟合 loss 随参数 $N$、数据 $D$ 或计算 $C$ 的幂律；Chinchilla 结论强调给定计算下模型与数据应共同扩展。数据管道进行语言/领域配比、质量过滤、去重、污染检测和权利治理。系统用数据/张量/流水线/专家并行与低精度提高利用率，但通信、负载不均和故障会改变有效计算。",
    formula: String.raw`常见经验形式：

$$
L(N,D)\approx L_\infty + A N^{-\alpha}+B D^{-\beta},
\qquad C\approx 6ND
$$

（常数与指数依实现和定义）。计算最优选择是在约束 $C$ 下最小化估计损失，而不是单独最大化 $N$。`,
    formulaNotes: ["幂律只在观测尺度和固定数据/架构制度内可信", "token 不是跨 tokenizer 完全可比的数据单位", "$6ND$ 是粗略 dense Transformer 训练估计", "下游能力、安全和涌现不能由预训练 loss 唯一决定"],
    evidence: [
      ev("2022-03-29", "Training Compute-Optimal Large Language Models", "https://arxiv.org/abs/2203.15556", "固定训练计算时，模型大小与训练 token 应怎样配置？", "Chinchilla 通过大量小规模训练拟合参数/数据缩放，提出当时许多大模型训练不足，并训练 70B 参数、1.4T token 模型对照。", "论文报告 Chinchilla 以更小参数在多个任务超过更大 Gopher，同时推理更便宜。", "贡献是把数据量重新放回计算最优配比。", "指数依数据质量、架构和训练制度；现代重复训练、MoE 与后训练不能简单套用。"),
      ev("2024-07-23", "The Llama 3 Herd of Models", "https://arxiv.org/abs/2407.21783", "开源权重级别的现代基础模型如何组织数据、规模、后训练和安全评测？", "报告描述最高 405B dense 模型、15T+ token 预训练、多语言/代码数据、扩展上下文及 SFT/偏好优化流程。", "作者跨知识、推理、代码、多语言和人工偏好给出广泛评测。", "贡献是相对完整地公开模型族训练与后训练设计。", "训练数据细节和基础设施仍不完全开放，厂商自评与公开 benchmark 存在污染/选择风险。"),
      ev("2024-12-27", "DeepSeek-V3", "https://arxiv.org/abs/2412.19437", "稀疏 MoE、MLA 和低精度系统怎样改变训练/推理资源分配？", "671B 总参数、37B 激活参数模型在 14.8T token 上训练，结合专家路由、MLA 和 FP8 系统设计。", "报告给出 2.788M H800 GPU 小时和广泛评测，显示稀疏激活的成本路径。", "贡献是算法/系统联合的开放技术报告。", "硬件、软件与计费口径特定，且总参数、激活参数与能力不可线性换算。"),
    ],
    diagram: "flowchart LR\n  B[能力/预算目标] --> S[小规模 scaling runs]\n  S --> N[参数/数据/计算分配]\n  N --> D[数据混合/去重/权利]\n  N --> Y[并行/精度/容错]\n  D --> T[预训练]\n  Y --> T\n  T --> E[loss+下游+污染评测]\n  E --> R[是否扩展/调整制度]",
    caseTitle: "训练一个 1B 中文领域模型",
    case: "预算不是先定 1B 参数再塞数据，而是用 50M/100M/300M 小模型在多个 token 配比做 pilot，拟合 loss 与下游任务；对领域数据去重并保留文档级时间切分。报告 tokenizer 后 token、有效样本、FLOPs、GPU 利用率和碳/费用。若领域 SFT/RAG 已达到目标，不因缩放曲线漂亮就启动全量预训练。",
    protocol: ["训练至少三个参数规模和三个数据量组合", "拟合幂律并保留未参与拟合的点验证", "对数据去重前后比较 memorization 与下游", "将 GPU 小时换算为硬件、精度、利用率和估计 FLOPs"],
    decisions: ["扩展前必须用 pilot 预测并设停止阈值", "数据账本记录来源、许可、语言/领域和去重", "benchmark 污染检查在评测前冻结", "训练成本和下游/安全收益同表决策"],
    failures: ["跨 tokenizer 直接比较 token 数", "用 GPU 小时代替 FLOPs/费用", "在少量尺度上过度外推", "重复数据制造表面 loss 收益", "把预训练 loss 当所有能力代理"],
    prompt: "请为预训练计划建立 compute/data/model 预算。设计多个 pilot 点拟合并外部验证缩放律；记录 tokenizer、有效 token、重复率、来源许可、领域配比；把 GPU 小时拆为硬件、精度、利用率和 FLOPs；给出下游、安全、污染与停止门槛，不从参数量直接推断能力。",
    exerciseTitle: "拟合一个会失败的缩放律",
    exercise: "用小规模运行拟合幂律，再故意在最大点改变数据质量或架构，观察外推残差；解释制度变化为何使旧曲线失效。",
    misconceptions: ["参数越多必然更强", "Chinchilla 比例是永久常数", "token 是统一信息单位", "GPU 小时可跨硬件直接比", "更多数据不需要权利和重复审计"],
    quiz: { question: "固定计算预算下，为什么不能只增大参数？", options: ["参数不参与训练", "数据不足会使大模型训练不足，需联合分配 N 与 D", "GPU 不支持参数"], answer: 1, explanation: "计算最优取决于参数和训练数据的联合缩放。" },
    summary: ["缩放律是局部经验预算模型", "参数、数据和计算需联合分配", "数据质量/权利与系统利用率决定有效规模", "任何制度变化都需重新校准外推"],
    mastery: { explain: "计算最优缩放与单纯放大参数的区别", apply: "一份含 pilot 外部验证的训练预算", boundary: "幂律跨制度外推失效的原因" },
    sources: [u("Chinchilla", "https://arxiv.org/abs/2203.15556"), u("Llama 3", "https://arxiv.org/abs/2407.21783"), u("DeepSeek-V3", "https://arxiv.org/abs/2412.19437")],
  }),
  make({
    stage: "强化核心",
    prerequisite: "需理解预训练、条件生成、策略/奖励基本概念和离线评测。",
    goals: ["区分 SFT、奖励建模、偏好优化与可验证 RL", "推导 DPO 和策略优化的核心比率", "建立行为回归、过优化和 reward hacking 门禁"],
    concepts: [
      { id: "DLF16", name: "监督指令微调", definition: "在示范分布上最大化期望回答似然", decision: "格式/任务适配是否已有高质量示范" },
      { id: "DLF17", name: "偏好优化", definition: "用成对/标量反馈改变输出相对偏好", decision: "反馈噪声与 KL 约束是否可控" },
      { id: "DLF18", name: "可验证 RL", definition: "在可检查结果上通过采样与奖励优化策略", decision: "探索能否带来真实推理而非投机" },
    ],
    thesis: "后训练改变的是策略在提示条件下的行为分布；它既能释放能力，也能把评价器漏洞放大成系统性行为。",
    problem: "SFT 可教格式却覆盖有限；偏好数据受标注者和采样策略影响；RL 在数学/代码等可验证任务上有清晰奖励，却可能学会长度、格式或测试漏洞。训练分数提升不等于知识增加，也不等于跨领域安全。需要保留基础模型、SFT、偏好/RL 多个 checkpoint 做同数据消融。",
    mechanismTitle: "从行为克隆到受约束策略优化",
    mechanism: "SFT 对专家示范做 teacher forcing。RLHF 训练奖励模型，再以 KL 约束策略不偏离参考；DPO 从 Bradley–Terry 偏好模型推导出直接比较 chosen/rejected 的分类目标，无需显式在线奖励模型。可验证 RL 用执行器/答案判定奖励采样轨迹；课程、采样温度、组相对优势与冷启动数据影响训练稳定和可读性。",
    formula: String.raw`DPO 常见目标为

$$
-\mathbb E\log\sigma\left(\beta\left[
\log\frac{\pi_\theta(y_w|x)}{\pi_{ref}(y_w|x)}-
\log\frac{\pi_\theta(y_l|x)}{\pi_{ref}(y_l|x)}
\right]\right).
$$

受 KL 约束的策略目标可概括为

$$
\max_\pi\mathbb E[r(x,y)]-\beta D_{KL}(\pi\|\pi_{ref}).
$$`,
    formulaNotes: ["偏好对不等于绝对正确答案", String.raw`$\beta$ 控制偏好强度和参考约束`, "奖励可验证只证明判定器覆盖的结果", "训练采样分布与部署提示分布可能不同"],
    evidence: [
      ev("2023-05-29", "Direct Preference Optimization", "https://arxiv.org/abs/2305.18290", "能否不用显式奖励模型和在线 RL 直接优化偏好？", "DPO 从 KL 约束奖励最优策略与 Bradley–Terry 偏好概率关系推导封闭目标，用 chosen/rejected 对训练策略。", "论文在摘要、对话等任务报告与 PPO 类方法竞争且训练简单稳定。", "贡献是降低偏好对齐工程复杂度并形成广泛基线。", "离线偏好覆盖、reference 和超参会限制效果；DPO 不自动解决标签偏差或分布外过优化。"),
      ev("2025-01-22", "DeepSeek-R1", "https://arxiv.org/abs/2501.12948", "大规模可验证 RL 能否在没有初始 SFT 时产生复杂推理行为？", "R1-Zero 直接对基础模型做 RL，观察到自我验证、反思与长推理，但出现可读性和语言混合；R1 加入 cold-start、分阶段 RL/SFT，并蒸馏到小模型。", "报告称 R1 在多项数学、代码和推理基准接近当时强闭源模型，并开放权重。", "贡献是提供可验证奖励驱动 reasoning 的大规模证据与训练配方。", "厂商自报且依赖具体数据/奖励/预算；基准表现不能证明忠实思维过程或开放任务通用性。"),
    ],
    diagram: "flowchart LR\n  B[预训练模型] --> S[SFT 示范]\n  S --> P[偏好数据/DPO]\n  S --> R[可验证任务/RL]\n  P --> C[候选策略]\n  R --> C\n  C --> E[能力/格式/安全/过优化]\n  E -->|通过| D[部署]\n  E -->|失败| B",
    caseTitle: "领域分析助手的后训练",
    case: "先用 2,000 个经专家审阅的示范教报告结构和引用格式；用偏好对训练是否承认不确定、是否引用充分。计算题和可执行查询才进入可验证 RL。每阶段在冻结集比较事实、任务完成、拒绝、长度、引用支持率和领域外安全；若奖励升高但长答案/套模板增加，判为 reward proxy 过优化。",
    protocol: ["在小模型上保留 base/SFT/DPO 三个 checkpoint", "同一提示集比较任务、格式、事实与 KL/长度变化", "构造偏好标签噪声和反事实顺序偏差", "为可验证奖励加入一个漏洞，观察策略是否利用"],
    decisions: ["每类后训练数据记录来源、标注政策与版本", "训练阶段 checkpoint 支持行为回归和回退", "奖励与 Judge 需红队并保留确定验证器", "能力提升和安全/风格变化分开门禁"],
    failures: ["把偏好等同真理", "只测奖励模型分数", "用同一 Judge 生成、训练和验收", "忽略长度/格式投机", "把推理文本当忠实内部机制"],
    prompt: "请为后训练目标选择 SFT、DPO 或可验证 RL。先定义想改变的行为与不可回归项；审计示范/偏好/奖励来源；保留 base 和每阶段 checkpoint；同集报告能力、事实、格式、KL、长度、安全和 Judge 偏差；设计奖励漏洞与分布外测试。",
    exerciseTitle: "让奖励上升而产品变差",
    exercise: "设计一个偏好数据偏爱长答案的实验，观察 DPO 后长度与真实正确率；再通过长度匹配、独立 rubric 或约束修正，解释哪个指标被投机。",
    misconceptions: ["SFT 会增加所有知识", "DPO 不需要任何奖励假设", "RL 奖励上升等于推理更真实", "chain-of-thought 是忠实解释", "后训练只影响风格"],
    quiz: { question: "R1-Zero 出现长推理行为最谨慎的结论是什么？", options: ["模型获得人类同构思维", "可验证 RL 改变了生成策略并提升相关基准，机制忠实性仍需验证", "SFT 已不再有用"], answer: 1, explanation: "行为与基准证据不能直接证明内部思维等价。" },
    summary: ["SFT、偏好和 RL 改变不同训练信号", "DPO 简化但不消除偏好偏差", "可验证奖励适合有可靠结果判定的任务", "每阶段需独立回归和 reward hacking 测试"],
    mastery: { explain: "SFT、DPO、可验证 RL 的目标差异", apply: "一个三 checkpoint 行为消融", boundary: "奖励提升不能证明真实推理的原因" },
    sources: [u("DPO", "https://arxiv.org/abs/2305.18290"), u("DeepSeek-R1", "https://arxiv.org/abs/2501.12948")],
  }),
  make({
    stage: "强化核心",
    prerequisite: "需掌握概率分布、最大似然、神经网络训练与常微分方程的基本直觉。",
    goals: ["区分自回归、扩散、score 与 flow matching", "推导前向扰动、反向去噪和速度场目标", "比较质量、覆盖、控制、采样步数和训练成本"],
    concepts: [
      { id: "DLF19", name: "自回归", definition: "按因子分解逐 token/位置建模联合分布", decision: "顺序结构与精确似然是否重要" },
      { id: "DLF20", name: "扩散/Score", definition: "学习从噪声逐步反演到数据的分数或去噪器", decision: "多步生成和条件控制是否可接受" },
      { id: "DLF21", name: "Flow Matching", definition: "回归连接噪声与数据分布的连续速度场", decision: "能否以更直路径和 ODE 采样" },
    ],
    thesis: "生成范式的核心区别是如何分解概率路径与计算：逐元素条件、随机去噪，或连续运输。",
    problem: "FID、似然和人类偏好测量不同维度；少步采样可能更快却损失覆盖，classifier-free guidance 增强条件一致性又降低多样性。视觉逼真也可能复制训练样本、违反物理或忽略文字条件。比较范式必须固定数据、骨干、参数、训练算力和采样预算。",
    mechanismTitle: "概率因子分解、随机反演与分布运输",
    mechanism: "自回归按链式法则建模 $p(x)=\prod p(x_i|x_{<i})$。扩散逐步加高斯噪声，网络预测噪声、score 或 velocity，再数十/数百步反向采样。Flow Matching 直接回归预设概率路径的条件速度场，推理通过 ODE 积分。DiT 用 Transformer 替代 U-Net 作为扩散骨干，显示生成性能可随计算扩展。",
    formula: String.raw`DDPM 前向过程：

$$
q(x_t|x_0)=\mathcal N(\sqrt{\bar\alpha_t}x_0,(1-\bar\alpha_t)I),
$$

常用噪声预测目标

$$
\mathbb E_{t,x_0,\epsilon}\lVert\epsilon-\epsilon_\theta(x_t,t,c)\rVert^2.
$$

Flow Matching 回归 $u_t$：

$$
\mathbb E\lVert v_\theta(x_t,t)-u_t(x_t)\rVert^2,\quad \dot x_t=v_\theta(x_t,t).
$$`,
    formulaNotes: ["不同参数化可对应相近目标但数值性质不同", "ODE/SDE 求解误差和步数影响样本", "guidance 改变采样分布并非免费控制", "FID 对特征网络、样本量和领域敏感"],
    evidence: [
      ev("2022-12-19", "Scalable Diffusion Models with Transformers", "https://arxiv.org/abs/2212.09748", "扩散骨干能否用 Transformer 并呈现可预测的计算扩展？", "DiT 对 VAE latent patchify，加入 timestep/class 条件，用 Transformer blocks 预测去噪目标；以 Gflops 分级模型。", "作者在 ImageNet 条件生成报告随模型计算增加 FID 改善，最大 DiT-XL/2 达到当时强结果。", "贡献是把可扩展 Transformer 主干引入扩散。", "ImageNet 类条件不代表开放文本/视频；FID 与 guidance 配置影响排名。"),
      ev("2025-06-30", "Transition Matching", "https://arxiv.org/abs/2506.23589", "能否用离散时间随机转移统一 flow 与连续自回归生成？", "TM 学习概率转移核，提出 DTM、ARTM、FHTM 三种变体；在固定架构、数据和超参下与 flow/连续 AR 比较。", "作者报告 DTM 的质量/文本一致性和采样效率，并称 FHTM 是首个在相关设置匹配/超过 flow 的全因果连续生成方法。", "贡献是扩展扩散/flow 与 AR 之间的设计空间，并强调受控比较。", "2025 预印本结论来自特定图像设置；“统一”不等于在所有模态和规模领先。"),
      ev("2026-02-11", "Selective Underfitting in Diffusion Models", "https://openreview.net/forum?id=yqTajvdkjv", "扩散为何不简单记住经验 score，泛化是否来自有选择的欠拟合？", "工作提出 selective underfitting：模型在数据空间某些区域更准确拟合 score、其他区域欠拟合，并设计干预验证区域差异与生成质量关系。", "ICLR 2026 论文给出对扩散泛化的新可检验解释。", "贡献是挑战“整体欠拟合”单一叙事。", "理论/实验仍依模型和数据设置，不能将局部解释当所有扩散模型的完整机制。"),
    ],
    diagram: "flowchart LR\n  D[数据分布] --> AR[AR 条件分解]\n  D --> DF[Diffusion 加噪/反演]\n  D --> FM[Flow 速度场]\n  AR --> S[逐步 token 采样]\n  DF --> S2[多步去噪]\n  FM --> S3[ODE/少步运输]\n  S --> E[质量/覆盖/速度/控制]\n  S2 --> E\n  S3 --> E",
    caseTitle: "可控工业零件图生成",
    case: "产品需要按零件类别和缺陷类型合成训练数据。自回归 latent、DiT 和 flow 使用同一图像集与编码器；比较条件一致性、缺陷几何覆盖、最近训练样本距离、下游检测增益和每张延迟。漂亮样本若不提高真实测试检测、或只复制训练图，就不能作为数据引擎证据。",
    protocol: ["在二维 toy distribution 可视化 AR/扩散/flow 覆盖", "固定骨干和训练步比较不同生成目标", "按采样步数画质量—速度曲线", "做最近邻/成员推断与下游 utility 评测"],
    decisions: ["生成系统报告路径、参数化、采样器和 guidance", "选择以任务 utility 与覆盖而非只看 FID", "合成数据进入训练前做重复、隐私和偏差审计", "步数/质量/成本作为可配置产品策略"],
    failures: ["只挑最好样本展示", "不同算力比较范式", "FID 下降就宣称语义正确", "guidance 提高后忽略多样性坍缩", "视觉逼真就假设物理正确"],
    prompt: "请为自回归、扩散/DiT、flow matching 设计公平比较。固定数据、编码器、骨干容量、训练 FLOPs 与条件；按采样步数报告质量、覆盖、条件一致性、最近训练样本、下游 utility、延迟和能耗；加入复制、隐私和物理/领域约束测试。",
    exerciseTitle: "画一条采样步数 Pareto 曲线",
    exercise: "对一个扩散或 flow 小模型使用多组采样步数，测质量、覆盖和延迟；找出产品可接受拐点，并说明指标冲突。",
    misconceptions: ["扩散生成等于随机加噪", "flow 一定一步生成", "FID 代表所有质量", "guidance 免费提升", "生成样本可直接当真实数据"],
    quiz: { question: "classifier-free guidance 增强条件一致性时常见代价是什么？", options: ["参数自动归零", "多样性或分布覆盖下降", "训练数据变多"], answer: 1, explanation: "强化条件方向会改变采样分布，常形成质量/一致性与覆盖权衡。" },
    summary: ["AR、扩散和 flow 选择不同概率路径", "DiT 让扩散骨干随计算扩展", "采样速度与分布覆盖需同测", "生成质量必须连接下游、复制和约束证据"],
    mastery: { explain: "三种生成范式的概率/计算分解", apply: "一条采样速度—质量—覆盖曲线", boundary: "FID 不能证明的生成质量" },
    sources: [u("DiT", "https://arxiv.org/abs/2212.09748"), u("Transition Matching", "https://arxiv.org/abs/2506.23589"), u("Selective Underfitting", "https://openreview.net/forum?id=yqTajvdkjv")],
  }),
  make({
    stage: "强化核心",
    prerequisite: "需理解视觉/序列模型、对比学习、条件生成和状态转移。",
    goals: ["解释跨模态对齐、融合与 grounding", "区分生成世界、可预测状态与可控动力学", "用多视角/时间/动作一致性评估世界模型"],
    concepts: [
      { id: "DLF22", name: "跨模态对齐", definition: "把配对文本、图像、音频等映射到可比较表示", decision: "共享空间能支持哪些检索与迁移" },
      { id: "DLF23", name: "多模态融合", definition: "以交叉注意或统一 token 交换细粒度信息", decision: "何时早融合、晚融合或工具化" },
      { id: "DLF24", name: "世界模型", definition: "预测状态/观察在动作条件下如何演化", decision: "用于规划、数据、评测还是想象" },
    ],
    thesis: "多模态表示解决“信息能否相遇”，世界模型还必须回答“动作后世界怎样变化”；视觉逼真不能替代动力学正确。",
    problem: "CLIP 相似可支持开放词汇识别，却可能依赖背景捷径；图文模型能描述物体，不代表知道抓取后的接触变化。视频生成看似真实，仍可能穿透、反重力或跨视角漂移。世界模型用于规划时，微小动力学偏差会被长轨迹放大。",
    mechanismTitle: "对比对齐、交叉融合与动作条件预测",
    mechanism: "对比学习拉近配对样本并推远 batch 内负例，获得粗粒度共享空间；cross-attention 让一种模态查询另一模态 token，支持细粒度 grounding。世界模型学习 $p(s_{t+1}|s_t,a_t)$ 或未来观察序列，可在潜空间 rollout 供规划/策略训练。机器人场景还需要多视角几何一致、接触和控制条件。",
    formula: String.raw`对称对比损失的一侧为

$$
\mathcal L_{i\to t}=-\frac1N\sum_i\log\frac{\exp(z_i^Iv_i^T/\tau)}{\sum_j\exp(z_i^Iv_j^T/\tau)}.
$$

动作条件世界模型最大化

$$
\sum_t\log p_\theta(o_{t+1}\mid o_{\le t},a_{\le t}),
$$

但像素似然高不保证任务相关状态和物理约束正确。`,
    formulaNotes: ["负例可能包含语义相同样本", "对齐空间的相似度不等于可组合推理", "世界模型需要区分观测随机性与动力学不确定性", "长 rollout 必须测误差累积和策略利用模型漏洞"],
    evidence: [
      ev("2021-02-26", "Learning Transferable Visual Models From Natural Language Supervision", "https://arxiv.org/abs/2103.00020", "互联网图文对能否训练可零样本迁移的视觉表示？", "CLIP 在 4 亿图文对上用双编码器对比学习，类别文本提示可作为零样本分类权重。", "论文跨 30+ 数据集展示强零样本迁移，同时报告分布偏移、OCR 和社会偏差等限制。", "贡献是把自然语言监督变成开放视觉接口。", "互联网数据偏差、粗粒度配对和提示敏感性限制 grounding；不是物理世界理解证明。"),
      ev("2026-04-30", "World Model for Robot Learning: A Comprehensive Survey", "https://arxiv.org/abs/2605.00080", "机器人世界模型在规划、策略、仿真、评测和数据生成中分别扮演什么角色？", "综述按架构、功能和具身应用整理预测模型，并连接视频世界模型、model-based planning、机器人学习与基准。", "作者指出世界模型已从想象式生成走向可控、结构化和基础模型规模，同时保留动力学、评测与耦合难题。", "贡献是提供 2026 年统一问题地图和持续更新资源。", "综述不是新算法的独立性能证据，且快速领域中的覆盖会过时。"),
      ev("2026-06-16", "PAIWorld", "https://arxiv.org/abs/2606.18375", "机器人多摄像头世界模型怎样保持跨视角三维一致？", "方法在 DiT 中加入几何感知跨视角注意、编码相机射线/外参的旋转位置表示和 3D 表征蒸馏。", "作者报告在 WorldArena 等多视角基准领先并支持规划、数据和策略后训练。", "贡献是把显式几何通信引入多视角世界基础模型。", "预印本排行榜与生成指标仍需真实策略和跨硬件独立复现。"),
    ],
    diagram: "flowchart LR\n  I[图像/视频] --> A[对比对齐]\n  T[文本/音频] --> A\n  A --> F[Cross-attention 融合]\n  F --> G[Grounding/状态]\n  G --> W[动作条件世界模型]\n  W --> R[Rollout/规划/数据]\n  R --> E[几何/物理/任务一致性]",
    caseTitle: "仓库机器人多视角预测",
    case: "顶置、腕部和第一视角摄像头观察同一抓取。共享表示先做物体/指令 grounding，世界模型接收相机外参和动作，预测多视角未来。评测分像素、3D 位置、接触事件、动作响应和下游规划成功；若视频好看但物体在视角间漂移，不能用于安全规划，只能作为有限数据增强。",
    protocol: ["训练小型图文对比模型并检查 hard negatives", "加入跨注意力做指代 grounding", "构造动作条件视频/状态预测", "比较单视角与多视角，并测 rollout 误差和策略成功"],
    decisions: ["共享表示、grounding 和动力学分别评测", "世界模型输入显式包含动作与传感器标定", "生成数据标记 synthetic provenance", "用于规划前需通过物理/任务闭环而非视觉评分"],
    failures: ["把 CLIP 相似当空间 grounding", "未加入动作却称世界模型", "只测一步预测", "多视角拼 token 不编码几何", "策略利用世界模型不真实漏洞"],
    prompt: "请拆分多模态系统的对齐、融合、grounding 和动作条件世界模型。分别定义检索、定位、跨视角几何、一步/长程动力学和下游策略指标；记录相机/传感器标定与 synthetic provenance；设计物理不可能、跨视角漂移和模型漏洞测试。",
    exerciseTitle: "区分看起来对与物理上对",
    exercise: "构造三个视觉逼真但物理错误的视频案例（穿透、跨视角漂移、动作无因果响应），为每类定义机器可测指标和下游后果。",
    misconceptions: ["共享 embedding 等于完整理解", "图文对齐自动产生 3D", "视频逼真就是世界模型", "一步误差低就能长程规划", "合成数据没有分布风险"],
    quiz: { question: "一个视频模型不接收动作，为什么不能直接作为控制世界模型？", options: ["视频太长", "无法预测不同动作对未来的因果条件变化", "不能使用 GPU"], answer: 1, explanation: "控制需要动作条件动力学，而非无条件未来外观。" },
    summary: ["对齐、融合、grounding 是不同层", "世界模型需显式条件化动作", "几何和物理一致独立于视觉质量", "规划价值必须由闭环任务验证"],
    mastery: { explain: "多模态对齐与世界模型的差别", apply: "一个多视角动作条件评测", boundary: "视觉生成指标无法证明的物理性质" },
    sources: [u("CLIP", "https://arxiv.org/abs/2103.00020"), u("World Model Survey 2026", "https://arxiv.org/abs/2605.00080"), u("PAIWorld", "https://arxiv.org/abs/2606.18375")],
  }),
  make({
    stage: "强化核心",
    prerequisite: "需理解 Transformer/生成模型结构、张量形状和目标硬件测量。",
    goals: ["区分参数、激活、KV、带宽和算力瓶颈", "解释 LoRA、量化、MoE 与推测解码", "建立质量—延迟—吞吐—内存—能耗 Pareto"],
    concepts: [
      { id: "DLF25", name: "参数高效适配", definition: "冻结主体并训练低秩/适配参数", decision: "存储、数据和任务隔离如何权衡" },
      { id: "DLF26", name: "压缩与稀疏", definition: "降低位宽或每 token 激活计算", decision: "误差、路由和硬件内核是否匹配" },
      { id: "DLF27", name: "推理系统", definition: "批处理、缓存、并行和解码决定端到端服务", decision: "用户延迟与容量怎样配置" },
    ],
    thesis: "“模型更小”只是一个静态属性；生产效率由权重、激活、KV cache、内存带宽、批量、解码和目标硬件共同决定。",
    problem: "4-bit 权重减少存储，但算子反量化或不匹配硬件可能不降延迟；MoE 每 token 激活参数少，却有专家通信与负载不均；LoRA 训练便宜但多适配器服务有路由/合并成本；推测解码只有小模型提案与大模型接受率足够高时获益。",
    mechanismTitle: "低秩增量、数值压缩与条件计算",
    mechanism: "LoRA 把权重更新限制为 $BA$ 低秩矩阵。PTQ/QAT 以 scale/zero-point 把连续值映射到低位整数，误差由离群值、分组和校准数据决定。MoE router 为每个 token 选择少数专家，以总参数换激活计算但引入 all-to-all。推测解码用 draft 并行提出多个 token，再由 target 一次验证并保持目标分布。",
    formula: String.raw`LoRA：

$$
W'=W+\Delta W=W+BA,\quad r\ll\min(d_{in},d_{out}).
$$

均匀量化近似为

$$
q=\operatorname{clip}(\operatorname{round}(x/s)+z),\quad \hat x=s(q-z).
$$

MoE 输出 $y=\sum_{i\in TopK(g(x))}p_i(x)E_i(x)$。`,
    formulaNotes: ["低秩假设不保证所有任务适配有效", "量化误差需按层/通道和真实输入校准", "稀疏 FLOPs 不等于低通信或低延迟", "吞吐最大化通常增加单请求排队延迟"],
    evidence: [
      ev("2021-10-16", "LoRA", "https://arxiv.org/abs/2106.09685", "大模型适配是否可限制在低秩权重增量而保持质量？", "LoRA 冻结预训练权重，在注意力等矩阵旁训练低秩分解，部署时可合并增量，不增加额外序列延迟。", "论文在 GPT/DeBERTa 等模型报告大幅减少可训练参数并与全量微调竞争。", "贡献是形成参数高效适配的基础范式。", "最优 rank/层依任务；多适配器、灾难性覆盖和数据质量仍需评估。"),
      ev("2024-12-27", "DeepSeek-V3", "https://arxiv.org/abs/2412.19437", "MoE、MLA 与 FP8 能否联合降低大模型训练/推理成本？", "报告用 671B 总参数、37B 激活的 MoE，MLA 压缩 attention 状态，并采用 FP8 混合精度和专家并行系统。", "作者报告强基准结果与特定 H800 训练成本。", "贡献是展示稀疏模型、KV/attention 压缩和系统工程的协同。", "总/激活参数与真实延迟不能脱离通信拓扑、并发和内核比较。"),
      ev("2026-04-16", "Mixture-of-Experts Flow Matching for Faster Language Inference", "https://arxiv.org/abs/2604.15009", "非自回归 flow 语言模型能否用专家速度场在少步内生成？", "工作提出 MoE-FM，并以 Transformer/Mamba 实例构建 YAN，在潜空间分解局部速度场。", "作者报告质量接近 AR/扩散基线，最少三步采样，在其设置中对 AR 最高约 40 倍加速。", "贡献是探索 AR 之外少步语言生成的效率路径。", "单篇预印本、任务与延迟口径特定；并行生成的可控性和开放部署仍需复现。"),
    ],
    diagram: "flowchart LR\n  M[基础模型] --> A[LoRA/adapter]\n  M --> Q[量化/剪枝]\n  M --> X[MoE 条件激活]\n  A --> S[服务引擎]\n  Q --> S\n  X --> S\n  S --> K[KV/批处理/并行/解码]\n  K --> P[质量/TTFT/TPOT/吞吐/能耗]",
    caseTitle: "本地部署领域助手",
    case: "候选为 8B dense 16-bit、4-bit PTQ、LoRA 适配版和云端 MoE。使用真实长度/并发负载，分别测 TTFT、TPOT、P95、tokens/s、峰值 RAM/VRAM、功耗和领域回归。量化若平均准确不变但关键数字抽取失败，不能通过；云端吞吐高但敏感数据不允许，则约束优先于性能。",
    protocol: ["对同一模型做 16/8/4-bit 量化并按层观察误差", "训练不同 rank 的 LoRA 与全量微调对照", "在单请求和多并发下测完整服务", "改变输入/输出长度，分解 prefill 与 decode 瓶颈"],
    decisions: ["模型卡同时列静态大小与目标硬件动态指标", "量化校准集覆盖真实长度和关键切片", "多 adapter 有隔离、路由和回滚版本", "容量计划用并发/长度分布而非单 benchmark"],
    failures: ["4-bit 文件小就称 4 倍快", "只测 tokens/s 不测 TTFT/P95", "MoE 忽略 all-to-all", "LoRA rank 越高越好", "校准集不含关键领域样本"],
    prompt: "请为目标硬件建立模型效率 Pareto。分解权重、激活、KV、带宽、计算和通信；比较 dense、量化、LoRA、MoE/云服务；在真实输入输出长度和并发下报告质量切片、TTFT、TPOT、P95、吞吐、峰值内存、功耗和费用；给出回退条件。",
    exerciseTitle: "同一模型测出三种相反结论",
    exercise: "在 batch=1 低延迟、batch 大吞吐和长上下文三种负载测 FP16/INT4；解释为何文件大小、吞吐和用户延迟的排名可能不同。",
    misconceptions: ["量化位数等于加速倍数", "激活参数少等于低延迟", "LoRA 不会改变基础能力", "tokens/s 足以描述服务", "参数量决定全部显存"],
    quiz: { question: "4-bit 模型未提速最可能还需检查什么？", options: ["模型名字", "硬件内核、反量化、内存带宽和负载形状", "训练集标签颜色"], answer: 1, explanation: "压缩只有被实际执行路径利用才转化为延迟收益。" },
    summary: ["效率是模型与系统联合属性", "LoRA 限制适配更新秩", "量化/稀疏收益依硬件实现", "服务必须同时测质量、尾延迟、容量和能耗"],
    mastery: { explain: "参数大小、FLOPs 与真实延迟为何不同", apply: "一个目标硬件端到端 Pareto 对照", boundary: "量化或 MoE 不带来速度收益的条件" },
    sources: [u("LoRA", "https://arxiv.org/abs/2106.09685"), u("DeepSeek-V3", "https://arxiv.org/abs/2412.19437"), u("MoE Flow Matching", "https://arxiv.org/abs/2604.15009")],
  }),
  make({
    stage: "综合交付",
    prerequisite: "需完成训练、序列、生成与效率章节，并能设计冻结评测集和统计比较。",
    goals: ["区分模型能力、数据污染、提示和 Judge 影响", "建立跨任务/切片/成本的评测卡", "把解释、校准、攻击与模型行为写入发布门禁"],
    concepts: [
      { id: "DLF28", name: "能力评测", definition: "在版本化任务、提示、预算和环境下测量模型行为", decision: "改进来自何处且能否复现" },
      { id: "DLF29", name: "解释与审计", definition: "用干预、探针和归因描述内部/输出行为并验证忠实性", decision: "解释能否支持调试而非安慰" },
      { id: "DLF30", name: "风险门禁", definition: "把偏移、攻击、记忆、隐私和危害纳入发布", decision: "发布、限制、监控或停止" },
    ],
    thesis: "前沿模型最容易在评测上自欺：基准可能被见过，Judge 可能共享偏差，解释可能不忠实，平均成绩可能掩盖高风险失败。",
    problem: "模型版本、系统提示、采样、工具、精度和硬件都会改成绩。公开 benchmark 进入预训练后不再独立；LLM Judge 可能偏好长答案、同家族表达或参考答案措辞。神经元/attention 可视化产生故事不等于对输出有因果作用。可靠评测要包含隐藏/动态集、确定判定、人评校准与资源。",
    mechanismTitle: "版本化评测、因果解释与多层安全",
    mechanism: "评测先定义 construct：知识、推理、鲁棒、交互还是风险；再冻结样本、提示、工具、预算和 scoring。污染通过时间、相似度和 canary 检查；Judge 用人工 gold 估计精确/召回和偏差。解释方法需通过删除/替换/激活干预检验忠实性。安全门禁覆盖正常任务、对抗输入、越权、隐私与最坏切片，并持续监控。",
    formula: String.raw`有限样本成功率 $\hat p=k/n$ 应报告不确定区间；模型差异可用配对样本变量

$$
d_i=s_A(x_i)-s_B(x_i),\quad \bar d\pm t\frac{s_d}{\sqrt n}.
$$

Judge 与人类 gold 的一致性应报告 confusion matrix/F1，而不只是相关。多次选择后的最大分数还需考虑选择偏差。`,
    formulaNotes: ["样本是否代表目标 construct 与用户分布", "模型是否可能在训练中见过题/答案", "Judge 独立性、顺序和长度偏差", "差异是否超过随机采样、环境和版本噪声"],
    evidence: [
      ev("2023-08-28", "Holistic Evaluation of Language Models", "https://arxiv.org/abs/2211.09110", "怎样把准确、校准、鲁棒、公平、毒性、效率等维度放入透明场景评测？", "HELM 将 scenario、adaptation、metric 与模型组合，记录标准化运行并跨多个维度报告，避免只用一个排行榜。", "论文执行大规模多模型评测并展示不同指标的权衡与信息缺口。", "贡献是评测透明度、场景化和多指标报告框架。", "场景与模型会过时；统一适配也可能不等于每个模型的最佳使用方式。"),
      ev("2025-07-27", "Verify with Caution", "https://aclanthology.org/2025.findings-acl.1175/", "自动事实性评价器是否足够稳定地替代人类验证？", "研究在摘要、RAG 和 QA 的 11 个数据集重新评估五种事实指标，比较彼此和人工标签，并分析改写/远距证据偏差。", "作者发现评价器互不一致且会误估系统事实性，对大幅改写和远处证据存在偏差。", "贡献是把评价器可靠性本身变成必须本地验证的对象。", "事实性只是模型质量一维；结论也随新 Judge 发展而需更新。"),
      ev("2026-02-11", "Selective Underfitting in Diffusion Models", "https://openreview.net/forum?id=yqTajvdkjv", "扩散模型泛化能否用输入空间中区域性拟合差异解释？", "论文提出 selective underfitting 并以干预实验识别更准确/欠拟合的 score 区域。", "结果支持生成模型不是均匀拟合或均匀欠拟合经验分布。", "贡献是给泛化解释提出可干预、可证伪机制。", "解释仍是特定模型/数据证据，不应扩张成所有生成模型的普遍内部真相。"),
    ],
    diagram: "flowchart LR\n  C[目标 construct] --> D[隐藏/动态任务集]\n  D --> R[固定提示/预算/环境]\n  R --> S[确定评分+Judge+人评]\n  S --> J[Judge 校准/偏差]\n  S --> X[解释干预/鲁棒攻击]\n  J --> G[能力/成本/风险门禁]\n  X --> G\n  G --> V[版本化发布与监控]",
    caseTitle: "多模态模型季度发布评审",
    case: "新模型必须在冻结内部集、上季度真实失败、动态新题和红队集运行；所有提示、图片预处理、采样与精度固定。客观任务用程序判定，开放答案 Judge 先在人标子集校准并交换答案顺序。报告能力、校准、拒绝、关键人群/语言、攻击、隐私记忆、TTFT/费用。任何高风险红线不可用平均收益抵消。",
    protocol: ["建立 100 项小型隐藏评测，记录版本与来源时间", "比较确定 scorer、两个 Judge 和人工 gold", "对答案顺序、长度、措辞做 Judge 偏差实验", "对一个解释结论做激活/输入干预验证其忠实性"],
    decisions: ["评测数据与训练数据权利/时间隔离", "发布报告绑定完整运行配置和原始输出", "Judge 需要 gold 校准和分任务误差", "高风险失败设不可加权红线与回滚"],
    failures: ["用公开榜单当唯一发布门禁", "同模型生成并唯一评分", "多次调提示只报最好", "attention 热图当因果解释", "用平均分抵消严重安全失败"],
    prompt: "请设计前沿模型发布评测。先定义 construct 与目标用户；组合冻结内部、时间外、动态、失败回放和红队集；固定提示、工具、预算、采样和精度；客观任务用确定 scorer，主观 Judge 用人类 gold 校准并测顺序/长度/家族偏差；报告置信区间、成本和不可加权安全红线。",
    exerciseTitle: "审判一个 Judge",
    exercise: "准备 50 个有人类标签的成对答案，交换顺序、匹配长度、改变措辞，测 Judge confusion matrix；写出它能评分和必须人工复核的边界。",
    misconceptions: ["benchmark 分数等于通用智能", "LLM Judge 比人稳定就无需校准", "可视化等于解释", "更多维度可简单加权成总分", "安全是模型训练后最后一项"],
    quiz: { question: "Judge 与总体人工相关很高，仍需看什么？", options: ["只看相关即可", "任务/切片 confusion、顺序长度偏差和严重错误", "模型参数量"], answer: 1, explanation: "总体相关会掩盖关键切片和系统偏差。" },
    summary: ["评测必须绑定 construct 和运行配置", "污染与选择偏差会制造虚假进步", "Judge 是待校准模型", "解释需通过干预，安全红线不能被平均"],
    mastery: { explain: "模型能力、评测配置和 Judge 误差的分层", apply: "一份含 Judge 校准的发布评测", boundary: "平均 benchmark 无法支持的安全结论" },
    sources: [u("HELM", "https://arxiv.org/abs/2211.09110"), u("Verify with Caution", "https://aclanthology.org/2025.findings-acl.1175/"), u("Selective Underfitting", "https://openreview.net/forum?id=yqTajvdkjv")],
  }),
];

export default {
  active: [
    { name: "张量合同", action: "标注一段模型前向的 shape、dtype、device", evidence: "一张维度与内存表" },
    { name: "计算图", action: "画出局部算子依赖和保存的激活", evidence: "可解释的前后向图" },
    { name: "梯度验证", action: "手算并数值检查一个小网络", evidence: "gradcheck 与错误复盘" },
  ],
  frontierSignals: [
    "Transformer 仍是主干，但 Mamba/混合 SSM、FlashAttention 和 MLA 表明架构竞争越来越由内容记忆与硬件共同决定。",
    "后训练从 SFT/偏好优化扩展到大规模可验证 RL；奖励可测不等于推理忠实，checkpoint 消融与 reward hacking 测试更重要。",
    "扩散、flow、连续自回归正在融合；采样步数、覆盖和任务 utility 比单一视觉分数更能决定产品价值。",
    "稀疏、量化和低秩适配的理论计算收益必须在目标硬件、真实长度和并发下兑现。",
    "2026 年世界模型与生成泛化研究更强调几何/物理一致和可干预解释，而非只追求更逼真的输出。",
  ],
  projectCriteria: [
    "完整数据与训练卡：来源、许可、去重、切分、token、FLOPs、硬件与随机性",
    "至少包含简单模型、现代骨干和一项高效/压缩方案的同预算消融",
    "报告训练稳定性、质量切片、校准、偏移、推理延迟/内存/能耗",
    "多模态或生成部分包含 grounding、覆盖、复制和物理/任务一致性",
    "发布评测含隐藏任务、Judge 人工校准、红线风险和可回滚工件",
  ],
  branchRules: [
    "做一般模型训练时按 01→02→对应骨干推进，不先跳后训练。",
    "做 LLM/NLP 时，序列、预训练缩放、后训练与效率构成最短主线。",
    "做图像/视频生成时，视觉骨干、生成模型、多模态与评测形成闭环。",
    "任何计划进入真实用户或物理系统的模型，效率和安全评测均为阻塞前置。",
  ],
  sourceRules: [
    "经典机制使用原论文；现代能力使用近三年技术报告、正式会议与公开模型卡。",
    "厂商报告的参数、token、GPU 小时和领先成绩保留其自报属性与硬件口径。",
    "不同模型必须尽量归一化数据、训练 token/FLOPs、采样预算、精度和硬件。",
    "生成样本与演示视频不作为物理、因果或通用能力的充分证据。",
    "评测/解释方法必须有独立 gold、干预或反例，不只展示相关与可视化。",
  ],
  ledger: [
    { date: "2023-12-01", label: "Mamba", url: "https://arxiv.org/abs/2312.00752", supports: "选择性 SSM 的线性序列建模", limit: "现代架构/硬件与精确回忆需重测" },
    { date: "2024-07-23", label: "Llama 3", url: "https://arxiv.org/abs/2407.21783", supports: "大规模 dense 模型的数据与后训练技术报告", limit: "数据和基础设施未完全开放" },
    { date: "2024-12-27", label: "DeepSeek-V3", url: "https://arxiv.org/abs/2412.19437", supports: "MoE/MLA/FP8 联合训练证据", limit: "厂商自报与特定集群口径" },
    { date: "2025-01-22", label: "DeepSeek-R1", url: "https://arxiv.org/abs/2501.12948", supports: "可验证 RL 与 reasoning 行为", limit: "不证明思维忠实或所有开放任务泛化" },
    { date: "2026-02-11", label: "Selective Underfitting", url: "https://openreview.net/forum?id=yqTajvdkjv", supports: "扩散泛化的区域性拟合解释", limit: "特定设置，非普遍完整机制" },
    { date: "2026-06-16", label: "PAIWorld", url: "https://arxiv.org/abs/2606.18375", supports: "多视角 3D 一致世界模型", limit: "预印本与排行榜需真实闭环复现" },
  ],
  conflicts: [
    { title: "Attention vs 线性序列模型", body: "Mamba 支持长序列吞吐和选择性状态，注意力支持直接内容寻址。课程不预判替代关系，而是用精确回忆、聚合、长度与硬件联合评测。" },
    { title: "生成逼真 vs 世界正确", body: "DiT/flow 的视觉质量进展与机器人世界模型的物理、几何批评同时保留；前者支持生成能力，后者限制其用于控制和规划。" },
  ],
  updateTriggers: [
    "新架构在同数据/计算/硬件下稳定改变 Transformer、SSM 或生成范式的主要权衡",
    "公开训练报告修订关键 token、FLOPs、数据或评测数字",
    "新量化/推理方法在目标硬件和真实并发下改变 Pareto 前沿",
    "基准污染、Judge 偏差或模型安全事件改变现有发布门禁",
  ],
  overviewSources: [u("Mamba", "https://arxiv.org/abs/2312.00752"), u("DeepSeek-R1", "https://arxiv.org/abs/2501.12948"), u("World Model Survey 2026", "https://arxiv.org/abs/2605.00080")],
  details,
};
