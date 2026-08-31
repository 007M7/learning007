# Learning 007

面向非计算机专业学习者的 AI 编码与系统工程可视化学习站。目标不是背完技术名词，而是能够向 AI 写清需求与约束、审查实现、验证结果，并把一次工作沉淀为可复用 SOP。

## 已包含

- 3 个工程通识大类＋6 个领域深研方向，共 106 个完整章节：51 个核心节点＋54 个可选进阶节点＋30 个 Agent 前沿节点＋180 个领域深研节点；
- 软件与系统工程、软件质量与生产交付、AI 应用与 Agent 的核心/进阶双层地图；
- 15 题起点诊断、12 周最小路线、每周复盘与中断恢复；
- 6 个端到端案例和 6 套可复制架构/交付模板；
- 版本化权威来源目录，统一核验日 2026-08-31；
- 独立 Agent 前沿路线：严格覆盖 2023-08-31—2026-08-30，一手论文逐篇拆解研究问题、机制、实验、局限、复现与架构影响；
- 机器学习、深度学习、NLP、AI 产品经理、低空智能、机器人六条深研路线：每条 40 个独立主题 / 40 章，证据截止 2026-08-30；
- 60 篇深研章节统一包含公式假设、至少两层一手证据、三轮实验消融、失败边界、自测与作品验收，自动门槛为正文不少于 4,700 字符、20 个二级部分；
- 本地全文搜索、交互决策卡、测验与设备本地证据记录；
- GitHub Pages 自动构建工作流。

> “已读/勾选”不会被自动当成掌握。基础掌握需要解释、应用和近期评估证据；熟练还需要变化任务、失败边界与跨日期证据。

## 本地运行

需要 Node.js 22.13 或更高版本（推荐当前 Node 24 LTS）和 npm。

```bash
git clone https://github.com/007M7/learning007.git
cd learning007
npm ci
npm run dev
```

打开终端显示的本地地址。构建静态 HTML：

```bash
npm run verify
```

它会检查内部链接、课程内容契约并构建站点。结果位于 `docs/.vitepress/dist/`；可运行 `npm run preview` 本地预览构建结果。

## 技术栈说明

站点运行时仍是 **VitePress + Vue 3 + TypeScript + CSS**：交互组件位于 `docs/.vitepress/theme/components/*.vue`，课程/侧栏数据与配置使用 `.ts/.mts`，主题使用 `custom.css`。`scripts/*.mjs` 只是 Node.js 构建期的课程生成、链接和内容契约检查，不参与浏览器 UI，也没有把 Vue/TypeScript 前端改写成 JavaScript。

## 建议入口

1. 先做 `docs/guide/diagnostic.md`，只激活 3—5 个近期节点；
2. 选择一个正在做的项目，或从个人任务板/任务运行器案例开始；
3. 每章完成解释、练习、边界与项目证据；
4. 使用模板向 AI 描述需求、契约、测试、发布和安全边界；
5. 每周复盘，保留提交、测试、ADR、评测集和故障记录。

## 内容结构

```text
docs/
├── guide/                 诊断、路线、AI 协作、掌握与复盘
├── domains/
│   ├── software/          16 节点：代码执行 → 架构决策
│   ├── quality/           16 节点：验收 → 生产恢复
│   └── ai/                19 节点：模型调用 → 可治理 Agent
├── advanced/
│   ├── software/          18 节点：性能 → 分布式架构演进
│   ├── quality/           18 节点：Kubernetes → 平台与多区域
│   └── ai/                18 节点：数学/训练 → 多 Agent 治理
├── frontier/agents/       30 节点：Agent 论文、复现、评测与安全
├── fields/                180 节点：ML、DL、NLP、AI 产品、低空、机器人
├── templates/             需求、C4、契约、交付、ADR、安全边界
├── cases/                 6 个跨领域端到端案例
├── sources/               来源、版本、时效与适用边界
└── CONTENT-STANDARD.md    章节完整度与可读性契约
```

核心/进阶/Agent 前沿/领域深研侧栏分别由 `curriculum.ts`、`advanced-curriculum.ts`、`agent-frontier.ts` 与 `field-curriculum.ts` 统一生成；每章必须遵守 `docs/CONTENT-STANDARD.md` 的机制、图示、案例、权衡、失败、实验、证据与来源要求。领域正文由 `scripts/field-content/*.mjs` 的结构化源稿生成，修改后运行 `npm run generate:fields`，再运行 `npm run verify`。

## 参考与许可

信息架构受 [Awesome Architecture](https://github.com/study8677/awesome-architecture) 的“教程/地图—模板—案例”方式启发。本站内容为面向三大领域重新拆解的原创课程，详细说明见 [ATTRIBUTION.md](./ATTRIBUTION.md)。代码和本站原创内容按 [MIT License](./LICENSE) 提供；外部资料仍遵循各自许可。
