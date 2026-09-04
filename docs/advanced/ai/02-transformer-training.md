# 02 · 打开编码器，再核算一次训练

> 第一章留下了一个看似合格的 `E-small`：它在假设的本地表中满足延迟预算，也有明确的支持判断与拒答规则。现在要追问更难的问题——这个模型究竟怎样把“年假不可以结转”中的“不”传给最终表示，真实政策文本会被切成多少 Token，而一次小规模训练是否在数据、显存和恢复能力上站得住。

<div class="lesson-meta"><span>AAI04—AAI06</span><span>阶段一 · 读懂模型机制与训练约束</span><span>8 个标准回合（每回合 45 分钟）</span><span>前置：AAI01—03、AI01—04</span></div>

<KnowledgeFlow
  title="本章让模型结构与实验预算对账"
  intro="读完以后，你应当能手算并代码验证一层 attention，审计候选 tokenizer 与训练数据，再用实测 pilot 而非参数传说决定是否扩大训练。"
  what="Transformer 把 Token 表示经过 attention、前馈网络、残差与归一化反复更新；训练系统把同一目标分配到数据、计算、显存与设备通信上。"
  why="模型名相同不代表输入边界、数据版本或训练实现相同。忽略 tokenizer、padding、优化器状态和通信，会让质量解释与成本估算同时失真。"
  how="接过政策助手的困难负例，从三个 Token 的矩阵计算开始，依次建立 tokenizer 审计、数据谱系、显存账和可中断恢复的小规模训练记录。"
  terms="self-attention | encoder mask | tokenizer | 数据谱系 | activation | checkpoint | 扩展效率"
/>

## 第一章的分数还缺一条机制解释

第一章没有把高相似度错引归罪于“注意力不好”。它先确认召回分数不等于支持概率，并为困难负例、校准与阈值留下了证据。第二章保持任务不变：仍然是同一个可引用政策知识助手，仍然比较 `E-small` 与备选编码器，仍然使用文档版本隔离的测试集。

变化的是观察层级。我们要打开 `E-small` 的三个盒子。

- **模型盒子：**一个 Token 怎样读取同一序列中的其他位置，哪些 mask 决定它能够看见什么。
- **数据盒子：**原始文本怎样被切分、截断、配对与分片，文档许可和版本怎样留下追踪线索。
- **系统盒子：**参数、梯度、优化器状态与 activation 各占多少空间，增加设备时通信是否抵消并行收益。

这三层最后要回到第一章的指标。如果 tokenizer 让否定词频繁落在截断区，attention 公式写得再正确也不会降低矛盾误接受率。如果训练吞吐翻倍但隐藏集退化，系统优化没有购买到产品价值。

<span id="aai04"></span>

## 三个 Token 足以看见 attention 的数据流

先把输入抽象为三个 Token：`年假 / 不 / 结转`。经过 embedding 与位置信息后得到矩阵 $H\in\mathbb{R}^{n\times d}$。一层 self-attention 用三组权重产生

$$
Q=HW_Q,\qquad K=HW_K,\qquad V=HW_V,
$$

再计算

$$
A=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}+M\right),\qquad Z=AV.
$$

$QK^\top$ 的形状是 `[n, n]`。第 `i` 行描述第 `i` 个位置怎样给所有位置分配权重，$Z_i$ 则把相应的 value 加权汇总。这个分数矩阵有 $n^2$ 项：朴素 full attention 的序列长度翻倍，分数项会变成四倍；实际峰值还取决于内核是否物化中间量。除以 $\sqrt{d_k}$ 是为了在维度增大时控制点积尺度，避免 softmax 过早饱和。Mask $M$ 不是装饰：双向编码器通常允许当前位置读取两侧上下文；自回归解码器使用因果 mask，禁止读取未来 Token。把两者混用会改变任务本身。

多头 attention 让不同投影子空间并行形成多个 $Z$，拼接后再线性变换。随后前馈网络逐位置变换，残差路径保留旧表示，归一化帮助数值稳定。真正的模型会堆叠多层，并使用已经训练出的权重。下面为隔离 attention 数据流，故意使用手工向量与单位投影，也没有另加位置向量；交换行只会使结果相应置换，这个失败恰好说明模型还需要位置机制。

```python
import numpy as np

H = np.array([[1.0, 0.0],   # 年假
              [0.0, 1.0],   # 不
              [1.0, 1.0]])  # 结转

Q = K = V = H.copy()        # 只用于手算；真实 Wq/Wk/Wv 由训练得到
scores = Q @ K.T / np.sqrt(H.shape[1])
scores -= scores.max(axis=-1, keepdims=True)
A = np.exp(scores) / np.exp(scores).sum(axis=-1, keepdims=True)
Z = A @ V

assert scores.shape == (3, 3)
assert np.allclose(A.sum(axis=-1), 1.0)
print(A.round(3))
print(Z.round(3))
```

运行时三行 attention 权重应各自和为 1。把第二个 Token 的 value 置零，`Z` 会变化；这说明信息路径被改动，却不能证明该头在真实模型中“理解了否定”。Attention 权重是内部计算的一部分，不自动等于因果解释。要证明“不”影响支持判断，需要在保持其他输入不变时做遮盖、替换或反事实测试，并观察最终任务指标。

原论文 2017 年在机器翻译任务中展示了 Transformer 的质量与并行优势。这一结果奠定结构，却不能直接证明我们的 110M 级编码器在中文政策检索上优于其他架构；任务、训练数据、mask 与输出头都不同。

<span id="aai05"></span>

## Tokenizer 决定一次实验的最小单位

模型看到的不是字符或“词”，而是 tokenizer 输出的离散 ID。BPE、WordPiece、Unigram 与字节级方案使用不同规则建立词表和切分。SentencePiece 的原始工作展示了可以直接从原始句子训练语言无关的子词模型，但“语言无关”不等于各种语言的切分成本与质量相同。

对政策助手，平均 Token 数远远不够。至少要分四类审计：普通中文条款、中英混合术语、表格转写、编号与版本字符串。还要专门查看否定词、日期、金额和条款号是否容易被拆散，以及在最大长度下哪一端被截断。

```python
from transformers import AutoTokenizer

samples = {
    "zh_policy": "未休年假不可以结转，次年一月一日清零。",
    "mixed": "VPN_Timeout 连续 3 次后执行 MFA 复核。",
    "table": "适用人群|试用期员工；生效版本|v2.1",
}
candidates = [
    "google-bert/bert-base-chinese",
    "FacebookAI/xlm-roberta-base",
]

for repo in candidates:
    tok = AutoTokenizer.from_pretrained(repo)
    print("\n", repo, tok.init_kwargs.get("_commit_hash", "record-revision-manually"))
    for kind, text in samples.items():
        ids = tok(text, add_special_tokens=True, truncation=False)["input_ids"]
        restored = tok.decode(ids, skip_special_tokens=True)
        print(kind, len(text), len(ids), tok.convert_ids_to_tokens(ids), restored)
```

这段代码需要首次下载模型文件；正式实验应锁定仓库 revision、库版本和缓存摘要。输出没有预设答案，因为不同 revision 可能变化。验证时先检查 Token 数、关键片段和往返解码，再用相同字符样本比较两个候选。变式是加入真实最长表格、繁体文本和员工常用缩写，并分别施加左截断与右截断。反馈记录要指出“哪类输入丢了哪项证据”，不能只写“Tokenizer B 更碎”。

Token 数同时进入成本。相同一千字文档在两个 tokenizer 下可能产生不同序列长度；padding 到批次最长样本还会继续放大计算。更少 Token 也不自动更好：一个极大词表可能增加 embedding 参数，粗切分也可能损害罕见编号的组合能力。最终仍要回到支持召回、矛盾误接受率、延迟和显存。

## 训练数据必须能追到一条生效条款

第一章的两个样本要扩成训练集，不能简单抓取“网上政策文本”。对每个 query—passage 对，至少保存下面这些字段。

| 字段 | 为什么需要 |
|---|---|
| `query_id`、`document_id`、`paragraph_id` | 重放具体判断，并防止近似段落跨切分 |
| `document_version`、`effective_at` | 区分现行、过期与未来政策 |
| `label` 与标注理由 | 区分支持、矛盾、信息不足，而非只给 0/1 |
| `source`、许可与隐私状态 | 确认文本是否能用于训练及是否需要删除 |
| `language`、格式、长度切片 | 发现 tokenizer 和人群覆盖差异 |
| `created_by`、`reviewed_by` | 区分合成负例、业务标注与复核结果 |

双编码器可用对比目标拉近 query 与支持段落、推远负例；交叉编码器可继续使用第一章的分类交叉熵。困难负例应来自同主题矛盾句、过期版本和缺少例外条件的段落，不能全部用随机不相关文章。合成样本可以补覆盖，但必须单独标记并由真实隐藏集检验，不能既生成题目又生成答案再宣布泛化。

切分单位应是文档族或政策版本，而不是打散后的句子。否则同一模板的一处改字可能同时出现在训练与测试，模型只要识别版式就能得到虚高成绩。预处理、去重、tokenizer 统计和困难负例挖掘都只能在训练/开发数据上拟合；封存测试集只在预先约定的里程碑打开。

数据说明还应记录采集目的、组成、人群与语言、清洗、已知缺口和允许用途。2018 年 Data Statements 工作提出这类文档化实践，是为了让语言技术的覆盖和外推边界可见。它不能替团队完成许可审查，也不能因为填完表格就证明数据无偏。

<span id="aai06"></span>

## 110M 参数不是显存账的总数

团队说“模型只有 110M 参数，半精度权重大约 220 MB，所以一张小卡肯定够”，漏掉了训练状态。下面仍是估算示例，不是某个框架的实测承诺。假设每个参数保存 FP16 权重 2 字节、FP16 梯度 2 字节、FP32 主权重 4 字节，以及 Adam 的两个 FP32 moment 共 8 字节，静态状态约为每参数 16 字节：

$$
110\times 10^6\times16\approx1.76\text{ GB}\approx1.64\text{ GiB}.
$$

这还没有包含 activation、临时 buffer、通信 bucket、数据批次、CUDA 上下文与分配器碎片。具体优化器、混合精度实现和是否保留主权重会改变账目，所以公式只能作为分项清单，不能替代 `max_memory_allocated` 等实测。

Activation 又取决于批量、序列长度、隐藏维、层数和保存策略。假设一次试运行把 32 条样本统一 padding 到 256 Token，而非 padding 部分平均只有 142 Token，那么约 `(256-142)/256 = 44.5%` 的位置是填充；这是教学假设值。按长度分桶或动态 padding 可能提升有效 tokens/s，但必须同时核对样本顺序、梯度累积与质量，不能只看 GPU 利用率。

Gradient accumulation 用多个小批次累积一次更新，降低单步 activation 峰值，却延长一次优化步的墙钟时间。Activation checkpointing 通过反向时重算部分前向换显存。Mixed precision 节省空间和计算，也需要监控溢出与数值变化。这些方法都在资源之间转移成本，没有一种是免费的“打开即可加速”。

## 先让单卡 pilot 可恢复，再讨论分布式扩展

对 110M 级编码器，第一问不是选择哪一种并行，而是单卡能否完成一个有代表性的 pilot。最小记录包括：实际 Token 分布、有效 tokens/s、峰值显存、数据加载等待、每步时间、训练/隐藏损失、四类风险切片、随机种子，以及中断后能否从 checkpoint 恢复到相同趋势。

只有当单卡确实受限，扩展方案才有具体对象。

- 数据并行让每个设备持有模型副本、处理不同批次，再同步梯度。总 batch 与学习率策略会一起变化，设备翻倍不保证训练时间减半。
- 参数状态分片减少单设备持有的参数、梯度或优化器状态，却在前向或反向引入 all-gather、reduce-scatter 等通信。PyTorch FSDP 的不同策略采用不同分片时机，版本与 state-dict 行为必须按当前官方文档核验。
- 张量并行把一次矩阵运算拆到多个设备，通信落在层内；它与 FSDP 解决的内存位置不同，不能只按“都切模型”混为一谈。
- 流水线并行把层分到不同设备，会有 stage 不均与 bubble。对能在单卡放下的小编码器，复杂并行很可能比模型计算更贵。

一张扩展表至少同时报告总 tokens/s、每设备 tokens/s、有效非 padding tokens/s、峰值显存和收敛到同一质量所需时间。若 1 卡是每秒 8,000 个有效 Token，2 卡是 13,000，扩展效率是 `13,000/(2×8,000)=81.25%`；这些仍是示例计算，不是硬件基准。若两卡改变了总 batch 导致质量不同，吞吐不能直接比较。

Hoffmann 等人在 2022 年研究的是特定范围内自回归语言模型的计算最优参数—Token 配置。他们的大规模经验关系不能直接拿来估算我们的 110M 编码器微调，也不能从一个短 pilot 线性推出百倍规模。Pilot 的职责是校准本地实现、发现瓶颈和验证恢复；真正扩大范围仍需要新的阶段门禁。

## 做一份能够被别人复核的训练约束包

这一章的练习不是“训练出更低 loss”，而是让另一个人能够复现为何继续或停止。

1. **最小复现：**运行三 Token attention 代码，手算第一行 softmax，再核对矩阵形状与行和。运行两个 tokenizer 的审计脚本，保存 revision 与三类输入的实际输出。
2. **变式：**对 attention 分别遮掉“不”、交换“年假/结转”位置；对 tokenizer 加入真实最长表格、繁体与代码混合文本；对训练预算把序列长度从 128 改为 256。一次只改一个变量。
3. **验证：**attention 层检查 mask 后的禁看位置权重为零；tokenizer 检查关键日期和否定词没有在截断后消失；训练 pilot 检查隐藏切片、峰值显存、有效 tokens/s 和 checkpoint 恢复，不用单一平均 loss 放行。
4. **反馈：**提交四件产物：attention 对照表、tokenizer 审计、数据谱系、训练/恢复记录。若 attention 变化却任务输出不变，继续追踪后续层；若 padding 很高，先修 batching；若训练降低损失但矛盾误接受率上升，退回负例与目标设计。

训练约束包的建议表头如下。

| 决策 | 证据 | 适用边界 | 失败时退回 |
|---|---|---|---|
| 保留 `E-small` tokenizer | 真实政策四类切片的长度、截断与任务指标 | 当前语言和格式 | 换 tokenizer/候选模型并重做基线 |
| 允许扩大到完整训练集 | pilot 可恢复，隐藏切片未退化，资源仍在预算内 | 当前数据版本与硬件 | 修数据、batch 或优化器配置 |
| 暂不启用多卡 | 单卡可完成且通信收益未测得 | 当前 110M 规模 | 单卡越过时间/显存门槛再做消融 |

请让评审者从记录重算至少一个比例和一笔显存账。若他只能看到“GPU 利用率 95%”却无法知道多少计算花在 padding 上，证据还不完整。

## 🎯 随堂检验

<Quiz question="一个 110M 编码器的 FP16 权重约 220 MB，能否据此判断 2 GB 显存足够训练？" :options='["能，训练只保存权重","不能，还要核算梯度、优化器状态、activation、临时 buffer 与具体精度实现，并用代表性 pilot 实测","只要开启多头 attention 就能"]' :answer="1" explanation="参数文件只是显存账的一部分。训练状态和随 batch、序列长度变化的 activation 往往决定峰值，估算必须由实测校准。" />

## 本章小结：Transformer 训练必须同时解释机制、数据与资源边界

一个 Transformer 实验只有把 attention 的信息传递、tokenizer 的输入边界、可追溯训练数据，以及测得的显存与吞吐放在同一记录中，结果才可复核。本章在第一章的模型判断表上补齐三 Token attention 计算、tokenizer 切片、数据版本谱系、显存分项和可恢复 pilot。我们因此既能解释某个分数怎样算出，也能说明这次训练在什么输入、数据和资源边界内成立。

仍然不能外推的内容要明确留在交接单上：三 Token 计算不证明真实 attention 的语义；小样本 tokenizer 审计不代表全部员工语言；单卡短跑不预测大规模预训练；原始 Transformer 的机器翻译结果也不替代政策助手测试。[第一阶段总结](/advanced/ai/stage-1-review)会把两章产物换到一个陌生的设备手册助手，检查我们是否真正掌握了判断链，而不是只记住了当前例子。

<EvidenceTracker lesson="advanced-ai-02-transformer-training" />

## 参考资料

- Ashish Vaswani 等，[Attention Is All You Need](https://arxiv.org/abs/1706.03762)，NeurIPS 2017，arXiv v7 修订于 2023。用于原始 Transformer 与 scaled dot-product attention；机器翻译实验不能直接外推到政策检索。
- Taku Kudo、John Richardson，[SentencePiece: A simple and language independent subword tokenizer and detokenizer for Neural Text Processing](https://aclanthology.org/D18-2012/)，EMNLP 2018。用于从原始文本训练子词模型的机制；其英日机器翻译实验不证明所有语言切分等价。
- Emily M. Bender、Batya Friedman，[Data Statements for Natural Language Processing](https://aclanthology.org/Q18-1041/)，TACL 2018。用于记录语言数据组成、覆盖与外推边界；文档化本身不能替代许可、隐私与偏差审查。
- PyTorch，[FullyShardedDataParallel 官方文档](https://docs.pytorch.org/docs/stable/fsdp.html)，本课程核验于 2026-09-04。用于核对当前分片语义和 state-dict 行为；接口会随版本变化，实践时必须锁定环境。
- Jordan Hoffmann 等，[Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)，2022。用于理解特定实验范围内参数、数据与计算预算的关系；不能直接套算小编码器微调。
