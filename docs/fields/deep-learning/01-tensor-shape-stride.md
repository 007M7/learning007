# 01 · 先确认每个数在和谁计算

> 神经网络收到一批图片以后，只会按照张量规则搬运和计算数字。它不知道第一行代表第一张图片，也不知道一份样本权重只该作用于对应图片的损失。把这些关系写清楚，是训练开始前的第一项工作。

<div class="lesson-meta"><span>DLF01</span><span>阶段一 · 张量、梯度与稳定训练</span><span>张量契约课</span></div>

<KnowledgeFlow
  title="本章从错误损失倒查两张图片"
  intro="读完以后，你应当能沿一个样本倒查损失，再顺着模型走回去，并在计算以前发现形状合法、对象关系却已经错误的运算。"
  what="张量用多个轴组织数字。shape 记录各轴长度，轴语义说明每个位置代表谁，stride 说明索引怎样找到存储中的数字。"
  why="框架能够检查运算规则，却不了解样本、类别和通道之间的业务关系。一次静默广播足以让模型优化错误的目标。"
  how="先手算一个最小批次，再沿着其中一个样本追踪每层输出；遇到广播和视图变换时，核对对象关系与读取顺序，最后把事故变成回归测试。"
  terms="张量 | 轴语义 | shape | 广播 | stride | view | dtype | device"
/>

## 一份样本权重为什么管到了两张图片

这一阶段使用一个小型手写数字分类器。每次训练会取出一批灰度图片，模型判断图片里的数字属于 0 到 9 中的哪一类。

先看一个只有两张图片的批次。第一张是数字 3，第二张是数字 7。数据审计发现第二张来自一次重复导入，本轮训练不应再统计它。两张图片都有 0 到 9 之间的合法类别标签，数据团队另外使用 1 和 0 标记是否计入损失。

本章里的 `sample_weight` 是二值有效掩码。1 表示计入，0 表示排除。它不承担连续加权或类别加权等其他用途。

模型完成一次前向计算后，两张图片各自产生一个交叉熵损失。

```text
第 0 张图片    真实数字 3    损失 0.1    权重 1
第 1 张图片    真实数字 7    损失 1.5    权重 0
```

人工计算很简单。有效样本的加权损失应当是 0.1，第二张图片自己的损失不再进入这个标量。

当前分类器只含逐样本执行的线性层与激活函数，两个样本在损失归约以前不会交换信息，二值掩码因此能够排除一项损失。若真实要求是把重复数据完全移出训练，或者模型中的算子会混合不同样本，就应在模型前向以前筛掉对应的图片与标签。损失乘零无法替代这种数据过滤。

程序里却出现了一个很隐蔽的变化。逐样本损失 `loss_each` 的形状是 `[2]`，样本权重从数据表读出以后多保留了一层，形状成了 `[2, 1]`。

```python
loss_each = torch.tensor([0.1, 1.5])       # [2]
sample_weight = torch.tensor([[1.0],       # [2, 1]
                              [0.0]])

weighted = loss_each * sample_weight
loss = weighted.sum() / sample_weight.sum()
```

代码没有因为形状不同而停止。`weighted` 的结果也没有两个数，而是四个。

```text
                 第 0 张的损失    第 1 张的损失
第 0 张的权重          0.1              1.5
第 1 张的权重          0.0              0.0
```

最后得到的标量是 1.6。那张权重为 0 的重复图片，仍然通过右上角的 1.5 进入了结果。训练曲线可以正常下降，梯度也会正常传播，模型只是一直在优化团队没有定义过的目标。

这次故障给出了本章最重要的判断。

> shape 合法只说明一组数字可以计算。训练是否正确，还要看每个轴代表什么对象，以及两个张量的轴是否按预期配对。

要知道这四个数从哪里来，需要先理解框架怎样处理不同形状的张量。

## 广播只比较对齐后的轴长度

PyTorch 做逐元素运算时，会从最右侧开始对齐两个张量的轴。对齐位置上的长度相同，或者其中一个长度为 1，运算就可以继续。缺少的左侧轴也会按长度 1 处理。

把刚才的两个形状写在右边对齐的位置，问题便能看见。

```text
逐样本损失参与对齐时           [1, 2]
样本权重                       [2, 1]
广播后的计算结果               [2, 2]
```

`loss_each` 的真实 shape 仍是 `[2]`。左侧补 1 只是它参与对齐时的等效写法。权重的第二个轴长度也是 1，两个位置分别向外扩展，最终形成一个二乘二的结果。

样本权重的关系不同。第 0 个权重只该乘第 0 个损失，第 1 个权重只该乘第 1 个损失。两个张量都应写成 `[B]`，同一位置自然一一对应。

```python
# 数据进入模型以前完成规范化
B = images.shape[0]
assert sample_weight.ndim == 2
assert sample_weight.shape == (B, 1)
assert torch.all((sample_weight == 0) | (sample_weight == 1))

sample_weight = sample_weight.squeeze(-1)

total_weight = sample_weight.sum()
if total_weight.item() == 0:
    raise ValueError("this batch has no valid samples")

# 交叉熵计算完成以后再做逐样本配对
assert loss_each.shape == sample_weight.shape
weighted = loss_each * sample_weight
loss = weighted.sum() / total_weight
```

这里使用 `squeeze(-1)`，明确删除最后一个长度为 1 的轴。直接调用不带轴号的 `squeeze()` 会删除所有长度为 1 的轴。当批量大小碰巧等于 1 时，样本轴也会一起消失，新的故障便会被带进来。

广播解释了事故怎样发生。接下来还要回答另一个问题。`[B]`、`[B, 10]` 和 `[B, 1, 28, 28]` 分别从哪里来，它们又怎样属于同一批图片。

## 跟着第 0 张图片穿过整个网络

回到那两张图片。它们刚从数据加载器取出时，输入形状是 `[2, 1, 28, 28]`。

```text
[2, 1, 28, 28]
 │  │   │   └─ 宽度方向的 28 个像素
 │  │   └───── 高度方向的 28 个像素
 │  └───────── 灰度图片的 1 个通道
 └──────────── 这个批次里的 2 张图片
```

四个长度常写作 `[B, C, H, W]`。这些字母是对刚才具体对象的简称。`B` 是批量中的图片数量，`C` 是每张图片的通道数量，`H` 与 `W` 是像素网格的高和宽。

网络的第一步会把每张图片的像素展开。第 0 张图片原来的 `1 × 28 × 28` 个数变成一行 784 个数，第 1 张图片也单独变成一行。批次轴始终留在最前面。最初的数据布局连续，下面这行 `view` 可以直接使用。

```python
flat = images.view(images.shape[0], -1)  # [2, 784]
```

随后，两层线性变换把每行 784 个像素先变成 128 个隐藏特征，再变成 10 个类别分数。

```text
输入图片         [2, 1, 28, 28]
逐张展开         [2, 784]
隐藏表示         [2, 128]
类别分数         [2, 10]
逐样本损失       [2]
加权并归约       []
```

沿着第 0 行看，关系始终没有变化。输入的第 0 张图片变成 `flat[0]`，再变成 `hidden[0]` 和 `logits[0]`。真实标签 `target[0]` 也属于这张图片。交叉熵读取这一行的十个类别分数和对应标签，产出 `loss_each[0]`。

这一层也出现了一次有意使用的广播。隐藏表示是 `[B, 128]`，偏置是 `[128]`。同一组 128 个偏置会加到每个样本的对应特征上。每一行仍然属于原来的图片，每一列共享同一个模型参数，这正是全连接层需要的关系。

```python
logits = model(images)  # [B, 10]

assert logits.ndim == 2
assert logits.shape[0] == target.shape[0]
assert logits.shape[1] == 10

loss_each = F.cross_entropy(logits, target, reduction="none")  # [B]
```

这里的 `[B, 10]` 不能只读成一个二维数组。第一轴枚举样本，第二轴枚举候选类别。若误把两轴交换成 `[10, B]`，数字总量没有改变，某些批次甚至会碰巧得到同样的方形 shape，轴所代表的关系仍然已经错了。

团队沿着这条路径重放代码时，又遇到两次明确报错。标签从 CSV 读取后成了浮点数，交叉熵要求类别索引使用 `torch.int64`。改好类型以后，图片和模型已经移到 GPU，标签却还留在 CPU，计算再次停止。

这两次报错把契约补全了。`target` 保存 0 到 9 之间的整数类别，并与 `logits` 位于同一设备。当前基线让图片、模型参数和 logits 使用 `float32`。dtype 决定一段数据按浮点数还是整数解释，device 决定参与同一次运算的数据放在哪里。

此时可以给张量下一个够用的定义。

> 张量是一组由多个轴组织的数字。shape 记录各轴有多长，轴语义说明这些位置分别代表什么，dtype 与 device 说明数字怎样存放和在哪里计算。

从图片到损失的对象关系已经恢复，模型可以继续向前运行。后来，数据源把图片的高轴和宽轴写反，预处理增加了一次转置。图片仍然显示为 `[B, 1, 28, 28]`，原先的展平代码却停了下来。

## 转置后的图片为什么不能直接 view

预处理使用 `transpose(-1, -2)` 调换高宽两轴。由于图片恰好是正方形，转置前后的 shape 完全相同，像素的读取顺序却已经变化。第一层原来的 `view(B, -1)` 无法继续解释这块存储。

一个二乘三的小张量可以复现同一件事。

```python
x = torch.tensor([[0, 1, 2],
                  [3, 4, 5]])  # shape [2, 3]

y = x.transpose(0, 1)          # shape [3, 2]
z = y.view(-1)                 # RuntimeError
```

`x` 的逻辑表格和底层存储顺序一致。

```text
逻辑表格          底层连续存储
0  1  2           0  1  2  3  4  5
3  4  5
```

从 `x[0, 0]` 移到 `x[1, 0]`，要跨过三个存储位置；从 `x[0, 0]` 移到 `x[0, 1]`，只跨过一个位置。因此 `x` 的 stride 是 `[3, 1]`。

转置得到 `y` 时，PyTorch 没有搬动六个数字。它只把 shape 改成 `[3, 2]`，把 stride 改成 `[1, 3]`。现在相邻的逻辑位置要以不同步长访问原来的存储。

```text
y 看到的逻辑表格       仍然使用原来的底层存储
0  3                   0  1  2  3  4  5
1  4
2  5
```

`view(-1)` 只允许用新的 shape 解释同一段兼容的存储。当前顺序无法仅靠改 shape 表达，所以它选择报错。这个错误阻止了本次不兼容的存储重解释。

分类器需要按照转置后的逻辑顺序逐行展开像素，可以使用 `reshape`。它会在布局兼容时返回视图，不兼容时创建一份连续副本。若代码确实要求先复制成连续布局，可以把这件事写出来。

```python
flat_a = y.reshape(-1)
flat_b = y.contiguous().view(-1)

assert torch.equal(flat_a, torch.tensor([0, 3, 1, 4, 2, 5]))
assert torch.equal(flat_a, flat_b)
```

团队允许预处理返回非连续张量，于是把真实模型的展平操作也改成 `reshape`。它按照转置后的逻辑顺序生成 `[B, 784]`，需要复制时由框架完成复制。

```python
images = images.transpose(-1, -2)             # 纠正高宽方向
flat = images.reshape(images.shape[0], -1)    # [B, 784]
```

这次报错和前面的静默广播形成了鲜明对照。广播允许计算继续，关系错误要靠我们发现；不兼容的 `view` 会直接停止，因为现有 stride 无法表达请求的读取顺序。

现在可以补全张量定义中的最后一项。stride 记录每个轴前进一步时，需要在底层存储中跨过多少位置。shape 描述看见的网格，stride 描述怎样走到网格里的数字。

## 把两次故障收进一张张量契约

团队修完广播和视图问题以后，没有把结论留在聊天记录里。他们为模型入口、出口和损失函数写下一张张量契约。每一行都对应刚才亲手追踪过的对象。

| 名称 | shape | 轴语义 | dtype | 设备与布局约定 |
|---|---|---|---|---|
| `images` | `[B, 1, 28, 28]` | 样本、灰度通道、高、宽 | `float32` | 与模型同设备，纠正高宽后可以非连续 |
| `target` | `[B]` | 每张图片的类别编号，取值为 0 到 9 | `int64` | 与 logits 同设备 |
| `flat` | `[B, 784]` | 样本、展开后的像素 | `float32` | 转置后的输入按逻辑顺序 reshape |
| `hidden` | `[B, 128]` | 样本、隐藏特征 | `float32` | 第 i 行始终属于第 i 张图片 |
| `logits` | `[B, 10]` | 样本、候选类别 | `float32` | 每行保存十个类别分数 |
| `loss_each` | `[B]` | 每张图片一个损失 | `float32` | `reduction="none"` |
| `sample_weight` | `[B]` | 每张图片一个二值有效标记 | `float32` | 与 loss_each 同形、同设备，取值只能为 0 或 1 |
| `loss` | `[]` | 整个批次的标量目标 | `float32` | 由有效权重归约得到 |

契约不要求给每个中间变量写长篇文档。它只固定一旦混淆就会改变计算意义的边界。模型结构改变以后，隐藏宽度可以从 128 改成 256；样本轴仍然要贯穿整条链，类别轴仍然代表 0 到 9，权重仍然要和逐样本损失一一对应。

这张表随后变成三道真实门禁。

第一道门禁放在接口边界。输入检查先核对数据加载器的输出，模型前向完成后再核对类别分数与逐样本损失。

```python
B = images.shape[0]
assert images.shape[1:] == (1, 28, 28)
assert images.dtype == torch.float32
assert target.shape == (B,)
assert target.dtype == torch.int64
assert torch.all((0 <= target) & (target < 10))
assert sample_weight.shape == (B,)
assert sample_weight.dtype == torch.float32
assert torch.all((sample_weight == 0) | (sample_weight == 1))
assert images.device == target.device == sample_weight.device
assert torch.isfinite(images).all()

logits = model(images)
loss_each = F.cross_entropy(logits, target, reduction="none")

assert logits.shape == (B, 10)
assert logits.dtype == images.dtype
assert logits.device == target.device
assert loss_each.shape == sample_weight.shape
assert loss_each.device == sample_weight.device
assert torch.isfinite(logits).all() and torch.isfinite(loss_each).all()
```

第二道门禁检查对象关系。团队保留刚才两张图片的手算案例。只要样本权重又变成 `[B, 1]`，预期值就会立刻失配。

```python
loss_each = torch.tensor([0.1, 1.5])
sample_weight = torch.tensor([1.0, 0.0])

actual = (loss_each * sample_weight).sum() / sample_weight.sum()
expected = torch.tensor(0.1)

torch.testing.assert_close(actual, expected)
```

第三道门禁重放两类容易隐藏的问题。权重测试分别使用批量大小 1 和 3，并覆盖全有效、部分无效和全部无效。批量大小 1 检查轴会不会被无意删除，大小 3 让错误广播产生明显的方阵。当前实现遇到全无效批次会在前向以前抛出明确异常，测试也要核对这项约定。

布局测试使用正方形图片。高宽转置前后的 shape 相同，转置后的张量却不连续。测试随后核对 `reshape` 得到的像素顺序，防止代码又退回不兼容的 `view`。

```python
probe = torch.arange(18).reshape(2, 1, 3, 3)
transposed = probe.transpose(-1, -2)

assert transposed.shape == probe.shape
assert not transposed.is_contiguous()

flat = transposed.reshape(2, -1)
expected_first = torch.tensor([0, 3, 6, 1, 4, 7, 2, 5, 8])
assert torch.equal(flat[0], expected_first)
```

完成这三道门禁以后，团队把零散术语变成了一条可以执行的工程判断。

> 框架负责判断运算能否进行，张量契约负责判断运算是否仍然对应原来的任务。

拿自己的模型练习时，可以选一批最小输入，从第 0 个样本开始追踪。每经过一个算子，就写下它变成了哪个位置，随后检查标签、掩码或权重是否仍与它一一对应。遇到 `transpose`、`view` 或 `reshape`，再写下逻辑顺序是否变化，是否发生了复制。

当你能在不运行完整训练的情况下，解释每个关键轴代表什么、一次广播扩展了哪种共享关系、一次视图变换按什么顺序读取数据，这一章的能力就已经建立起来。

<details class="ai-workbench">
<summary>让 AI 审查一段张量流</summary>

~~~~text
下面是一段图像分类训练代码和一组真实输入 shape。请沿着第 0 个样本追踪每一步，不要只复述 API。

先列出每个关键张量的 shape、轴语义、dtype 和 device。随后逐个检查逐元素运算是否触发广播，说明扩展后每个位置究竟在和谁计算。遇到 transpose、view 或 reshape 时，说明逻辑顺序、stride 和潜在复制。最后给出一个可以手算的最小反例，以及应该加入测试的精确断言。

如果代码里没有提供轴含义或期望关系，把它列为待确认，不要替我猜测。
~~~~
</details>

## 🎯 随堂检验

<Quiz question="逐样本损失的 shape 是 [8]，样本权重的 shape 是 [8, 1]。两者直接相乘会得到什么？" :options='["[8]，每个权重对应一个损失","[8, 1]，损失会自动变成列向量","[8, 8]，两个轴从右侧对齐后分别发生扩展"]' :answer="2" explanation="长度为 1 的轴会扩展。[8] 会按 [1, 8] 参与对齐，与 [8, 1] 一起得到 [8, 8]，样本间的一一对应关系因此被破坏。" />

## 下一章让张量连成一段程序

本章已经确定一批图片怎样变成类别分数与标量损失，也看见框架如何依据 shape 和 stride 执行计算。下一章会把这些操作连接成计算图，继续追踪某个中间结果由哪些上游张量产生，又会影响哪些下游结果。

<EvidenceTracker lesson="field-deep-learning-01-tensor-shape-stride" />

## 参考资料

- Aston Zhang、Zachary C. Lipton、Mu Li、Alexander J. Smola，[动手学深度学习中的数据操作](https://d2l.ai/chapter_preliminaries/ndarray.html)，持续更新版。
- Ian Goodfellow、Yoshua Bengio、Aaron Courville，[深度学习教材第 4 章](https://www.deeplearningbook.org/contents/numerical.html)，2016。
- Adam Paszke 等，[PyTorch 命令式风格高性能深度学习库](https://papers.neurips.cc/paper_files/paper/2019/hash/bdbca288fee7f92f2bfa9f7012727740-Abstract.html)，NeurIPS 2019。
- PyTorch 官方文档，[张量视图](https://docs.pytorch.org/docs/stable/tensor_view.html) 与 [广播语义](https://docs.pytorch.org/docs/stable/notes/broadcasting.html)。
- PyTorch 官方文档，[交叉熵损失](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html) 与 [squeeze](https://docs.pytorch.org/docs/stable/generated/torch.squeeze.html)。
