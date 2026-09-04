# 短样稿复刻盲评

## 隔离与量表

本评审先完整阅读固定 CSDIY 缓存的中文原页，再读取指定样稿。未读取 `Writing-DNA.md`、任何 README、旧复刻评分或生成任务历史；未修改样稿。

评分量表在读取样稿前冻结：五项均为 0–2 分，分别是：

1. **决策价值**：能否帮读者判断是否值得投入、此刻是否适合。
2. **依据与产物**：是否给出可核验的依据、明确的练习产物或验证证据。
3. **成本与分流**：是否诚实说明前置、时间/难度成本，并给出不适合时的去向。
4. **结构与可执行入口**：是否能从页面结构迅速开始，并知道完成条件。
5. **声音与边界**：是否有鲜明而克制的作者判断，且明确适用边界而不过度承诺。

`0` 表示缺失或无实际帮助，`1` 表示可用但不稳定/不完整，`2` 表示清楚、具体且可直接支持行动。

“原稿”下的分数是对本次所读 CSDIY 原页群的参照评分，并非将它们误当作同一篇文章；样稿按同一量表评分。

## 逐项评分

| 维度 | 原稿证据与分数 | 样稿证据与分数 | 评语 |
| --- | --- | --- | --- |
| 决策价值 | **2**。`使用指南.md` 先按“初入校园 / 删繁就简 / 心有所属”分流；`CS学习规划.md` 以先修和兴趣而非统一顺序选课；课程页还写明先修、难度、预计学时。 | **2**。开头以“后端删字段、前端白屏”的工作情境定位；明确“会基本 HTTP/JSON、写过或调用过 API”才适合，并让读者在最小/完整路线间选择。 | 样稿已把“该不该学”放在内容讲解之前，复现了原稿先帮读者作选择的效用。 |
| 依据与产物 | **2**。如 `CS61B.md` 把 14 个 lab、10 个 homework、3 个 project 与课程资源并列；`MIT6.S081.md` 说明 11 个 lab、测试框架及教材；多页给出可访问的课程/仓库入口。 | **1**。有很清晰的可验证产物 `contract-cases.yaml`、三类破坏和“重复到可复现”的要求；但它声明为虚构微课程，没有真实材料、工具或可访问入口来承托这些建议。 | 产物导向很像原稿的 project/lab 语言；主要缺口是外部依据与资源锚点，读者不能自行核查或续学。 |
| 成本与分流 | **2**。`Git.md` 明说不宜一知半解就贸然使用；`CSAPP.md` 提醒自学需要毅力和代码功底；路线页持续以先修、难度和替代课分流。 | **2**。用“前两项硬先修”“停止计时”“先做一次旧接口请求”“第三项可边做边补”把风险变成行动分支；3 小时与 8 小时的成本也明确。 | 样稿没有把门槛藏在后文，且保留了低成本回退路径。 |
| 结构与可执行入口 | **2**。原页常用“课程简介 → 资源 → 作业/汇总”的稳定骨架，路线页再把课程放进全局地图；`Scoop.md` 还给出安装命令与 Q&A。 | **2**。从判断、两分钟检查、路线表、逐次破坏、交付验收顺序展开；每个路线都有结束条件，且首小时的动作和字段例子具体。 | 样稿的启动门槛低，交付标准也比普通说明文更可操作。 |
| 声音与边界 | **2**。`index.md` 和 `CS学习规划.md` 有明确的个人经验与偏好，但多次写“仅供参考”“按兴趣自取所需”；工具页也会提示误用风险或条件。 | **1**。边界相当清楚：虚构课程、非零基础 API 入门、不得只理解描述而不验证；但语气较像通用训练手册，缺少原稿常见的个人判断、具体体验与带有温度的取舍理由。 | 样稿克制合格，但复现的是原稿的任务设计，尚未复现其叙述人格。 |

## 汇总

- 原稿参照：**10/10**
- 样稿：**8/10**

主要偏差：

1. 样稿有“产物—验证—验收”的闭环，却没有真实的课程、文档、仓库或工具入口；在原站语境中，这会削弱“拿来就能继续”的资源导航价值。
2. 样稿的结构更像精心设计的微型作业说明，原稿则常把个人踩坑、课程建设质量、资源选择理由与行动建议交织在一起。前者更规整，后者更有作者判断。
3. 样稿的边界表达足够严谨，但缺少原稿中“为什么这条路线值得偏爱、作者实际从何处受益”的可感知证据，因此声音项只给 1 分。

## 实际读取文件清单

定位缓存/确认范围（不作为样稿内容依据）：

- `D:\deep\learning007\.gitignore`
- `D:\deep\learning007\scripts\analyze-csdiy-writing-dna.mjs`（仅检索缓存位置与固定提交校验代码）
- `D:\deep\learning007\docs\writing-dna\csdiy-wiki\_meta\corpus.json`（缓存页目录/元数据）

固定 CSDIY 缓存中完整读取的中文页面（23 篇）：

- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\index.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\CS学习规划.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\使用指南.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\必学工具\信息检索.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\必学工具\Git.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\必学工具\GitHub.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\必学工具\Docker.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\必学工具\workflow.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\必学工具\tools.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\必学工具\Scoop.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\必学工具\Vim.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\编程入门\Python\CS61A.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\编程入门\MIT-Missing-Semester.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\数据结构与算法\CS61B.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\数据结构与算法\Algo.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\数据结构与算法\6.006.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\软件工程\6031.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\计算机系统基础\CSAPP.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\操作系统\MIT6.S081.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\计算机网络\CS144.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\数据库系统\15445.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\机器学习\CS229.md`
- `D:\deep\learning007\knowledge-base\cache\reference\cs-self-learning\docs\深度学习\CS231.md`

指定样稿（在上述页面后读取）：

- `D:\deep\learning007\docs\writing-dna\csdiy-wiki\_meta\short-dna-reproduction-sample.md`

未读取：`Writing-DNA.md`、任何 README、旧复刻评分，以及生成任务历史。
