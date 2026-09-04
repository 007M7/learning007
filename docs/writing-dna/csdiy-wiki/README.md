# CSDIY 写作 DNA 语料说明

本目录记录对 [CS 自学指南](https://csdiy.wiki/) 的全站内容分析与代表界面审读。分析聚焦它怎样帮助学习者选择课程、预估成本并真正开始实践。Learning 007 只吸收教学方法，原句、案例和课程卡片结构不进入正文。

## 分析范围

- 来源仓库为 [PKUFlyingPig/cs-self-learning](https://github.com/PKUFlyingPig/cs-self-learning)，快照固定在提交 `adce8e13789dc16aa6d1fbe163e9541736defae4`。
- 全量统计覆盖 136 个中文页面，共 195,249 个原始 Markdown 字符。脚本每次运行都会读取缓存仓库实际 `HEAD`、提交时间与 `docs` 跟踪文件状态；提交不匹配或跟踪文件有改动就拒绝生成。
- 完整深读 31 个页面，共 95,317 个原始字符；逐页的 hook、骨架、来源类型、认知信号和备注见 [_meta/review-evidence.json](./_meta/review-evidence.json)。保守判断至少 28 页形成独立内容闭环，超过 20 个完整页面的下限。
- 14 个代表页面由现存 `site-dna` 构建在 1440 × 1000 视口重新渲染并逐页查看；工作流页另做一次 390 × 844 检查。它们覆盖主要页面类型，不声称穷举暗色、搜索、滚动和所有响应式状态。DOM 统计、截图哈希与观察见 [_meta/interface-samples.json](./_meta/interface-samples.json)。
- 全站只有 3 个中文页面使用图片，共 18 张。两张本地图、15 张工作流外链图和 1 张教材封面均按 URL、alt、功能、承重关系和核验方式逐张登记在 [_meta/image-audit.json](./_meta/image-audit.json)。GIF 只检查了解码预览帧，并未伪称逐帧看完。

原始仓库快照保存在被 Git 忽略的 `knowledge-base/cache/reference/cs-self-learning`。结构化统计保存在 [_meta/corpus-statistics.json](./_meta/corpus-statistics.json)，逐页记录保存在 [_meta/corpus.json](./_meta/corpus.json)。语料表对 136 页都记录 skill 要求的 11 个字段；正文未明示的作者和发布日期写 `unknown`，另存仓库最后变更时间，绝不把 Git 时间冒充发布日期。当前只有 2 页作者可由正文确认，只有 1 页日期可由正文确认。

运行 `node scripts/analyze-csdiy-writing-dna.mjs` 可以重新生成语料与统计。运行时需要允许 Node 启动只读 Git 子进程；受限沙箱若禁止子进程，会得到 `spawn EPERM`，不能把这种失败写成已复现。

```powershell
git clone https://github.com/PKUFlyingPig/cs-self-learning knowledge-base/cache/reference/cs-self-learning
git -C knowledge-base/cache/reference/cs-self-learning checkout adce8e13789dc16aa6d1fbe163e9541736defae4
npm run analyze:writing-dna:csdiy
```

## 六层产物

- [语言 DNA](./语言DNA.md) 记录句子、语气、判断和术语怎样组织。
- [文章结构模板](./文章结构模板.md) 提炼不同内容类型的推进方式。
- [写作视角与认知框架](./写作视角与认知框架.md) 说明它怎样选课、筛来源和判断学习价值。
- [视觉风格指南](./视觉风格指南.md) 记录导航、正文、目录和图片的真实用法。
- [Writing DNA](./Writing-DNA.md) 是后续写作可直接调用的短版原则。
- [复刻样稿与盲评](./复刻样稿与盲评.md) 保留“全套工件”和“只读短版 DNA”两轮冻结样稿，公开 10 分 rubric、隔离条件、逐项评分与不能外推的结论。
- Learning 007 的可执行规则已经并入[教学文章写作指南](../../TEACHING-WRITING-GUIDE.md)和[学习文章改写 SOP](../awesome-architecture/学习文章改写SOP.md)。

## 最重要的边界

CSDIY 的强项是导航型教学。它会替读者判断一门课值不值得学、先修是什么、作业能练出什么、会在哪里卡住以及下一步去哪。它不是高密度知识讲义。136 个页面中有 115 个课程介绍页，30 个课程页少于 700 字，整站只有 3 个围栏代码块。

因此，Learning 007 吸收它的学习决策、路线分流、真实成本和资源可执行性，不降低现有章节的机制深度、案例完整度与练习要求。

视觉证据还有一个不能抹去的边界：`site-dna` 是缓存仓库里现存但未被该提交跟踪的构建目录。本次确实重新渲染并查看了页面，却没有重建依赖，因此只主张“这些 HTML/CSS 当时呈现了什么”，不主张构建产物可以由固定提交逐字节复现。
