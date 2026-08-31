const list = (items) => items.map((item) => `- ${item}`).join("\n");
const table = (rows) => rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
const firstSentence = (text) => text.split(/(?<=[。！？])/)[0] || text;

const lensNames = {
  orientation: "问题建立课", concept: "概念辨析课", mechanism: "机制拆解课", derivation: "原理推导课",
  guided: "跟做实验课", case: "案例复盘课", decision: "约束选型课", frontier: "前沿证据课", synthesis: "系统综合课",
};

function header(field, chapter, detail, cutoff) {
  return `# ${chapter.text}

> ${chapter.question}

<div class="lesson-meta"><span>${chapter.ids[0]}</span><span>${chapter.stage}</span><span>${lensNames[chapter.lens]}</span><span>证据更新至 ${cutoff}</span></div>

<div class="draft-status">
  <strong>内容状态：待原稿驱动重写。</strong> 当前页保留旧资料簇生成稿，只用于展示 40 主题路线和暴露待修问题；它尚未通过“原稿已获取—具体章节已读—观点已登记—教学文章人工组织”的正式章门禁，请不要把它当成完成的学习文章。
</div>

<div class="learning-brief">
  <p><strong>本章不是要记住：</strong>一串术语或某个工具的默认参数。</p>
  <p><strong>本章完成时要交付：</strong>${chapter.outcome}。</p>
  <p><strong>最低前置：</strong>${detail.prerequisite}</p>
</div>`;
}

function sourceNote(detail, cutoff) {
  return `<div class="source-note">资料核验至 ${cutoff}：${detail.sources.map(({ label, url }) => `<a href="${url}">${label}</a>`).join("、")}。本章只采用来源能够支持的机制和边界；模型、法规、标准或产业状态变化后必须重新核验。</div>`;
}

function context(field, chapter, detail, index) {
  const slot = index % 4;
  const focus = detail.concepts[slot % detail.concepts.length];
  const before = detail.concepts[(slot + detail.concepts.length - 1) % detail.concepts.length];
  const after = detail.concepts[(slot + 1) % detail.concepts.length];
  const previousChapter = field.chapters[index - 1] ?? null;
  const nextChapter = field.chapters[index + 1] ?? null;
  return { field, chapter, detail, index, slot, focus, before, after, previousChapter, nextChapter };
}

function opening(ctx) {
  const { chapter, detail, slot, focus } = ctx;
  const lead = {
    orientation: `先暂时忘掉模型名称。${detail.problem}`,
    concept: `很多误判并非算错，而是把两个相近词当成同一件事。围绕 **${focus.name}**，本章先建立可反驳的定义。`,
    mechanism: `你看到的是输出变化，真正需要追的是状态、信息和约束怎样传递。${slot === 1 ? detail.mechanism : firstSentence(detail.problem)}`,
    derivation: `公式不是装饰。它的价值是迫使我们写清对象、假设和优化目标，再检查现实是否满足。`,
    guided: `这是一章可以重放的实验。先冻结输入、基线和停止条件，再让结果回答问题，而不是边跑边改结论。`,
    case: `先还原现场：${slot === 2 ? detail.case : firstSentence(detail.case)}`,
    decision: `先别问“谁最好”。${chapter.question} 只有把约束、失败代价和退出条件放在同一张表里，选择才有意义。`,
    frontier: `前沿方法通常是在旧边界上交换了新的成本。我们要分清稳定机制、近期证据和仍未解决的问题。`,
    synthesis: `这不是结课摘要，而是把分散能力接成一个能运行、能失败、能恢复的闭环。`,
  }[chapter.lens];
  return `## 为什么现在要学“${chapter.title}”

${lead}

**本章核心判断：** ${chapter.insight}

本章只追一个判断：**${chapter.question}** 最后必须用“${chapter.outcome}”来回答；如果产物不能暴露失败样本，就还不能算学会。`;
}

function conceptSection(ctx) {
  const { chapter, focus, before, after, detail } = ctx;
  return `## 给“${chapter.title}”一个可操作定义

${chapter.insight}

可操作定义必须允许你回答三件事：输入或条件是什么，发生了哪条机制，最后观察什么才算支持结论。本章的观察出口是 **${chapter.outcome}**。

### 三个支撑概念，而不是本章的替代标题

| 位置 | 概念 | 在本章中的作用 | 一旦误用会怎样 |
|---|---|---|---|
${table([
  ["前置", before.name, before.definition, detail.failures[0]],
  ["当前支点", focus.name, focus.decision, detail.misconceptions[ctx.slot % detail.misconceptions.length]],
  ["下游", after.name, after.definition, detail.failures[1]],
])}

现在不用背表。请把三行连成一句因果解释，再用 **${chapter.title}** 的场景举一个反例：哪些观测出现时，原解释必须被推翻？`;
}

function relationSection(ctx) {
  const { focus, before, chapter, detail, slot, previousChapter, nextChapter } = ctx;
  if (slot === 1) {
    return `## ${before.name} 怎样经过 ${focus.name} 影响结果

${detail.mechanism}

~~~~mermaid
${detail.diagram}
~~~~

读图时从结果逆向追问：哪一步能够观察，哪一步只是假设，哪一步失效后必须让系统拒绝或降级。`;
  }
  const previous = previousChapter?.title ?? "真实任务与约束";
  const next = nextChapter?.title ?? "持续更新与新的问题";
  return `## 把“${chapter.title}”放回 40 章依赖链

~~~~mermaid
flowchart LR
  A[上一主题：${previous}] -->|提供前置| B[当前：${chapter.title}]
  B -->|留下：${chapter.outcome}| C[下一主题：${next}]
  C --> D{能否支持：${chapter.outcome}}
  D -->|不能| E[回到假设与数据]
  D -->|能够| F[进入下一主题]
~~~~

这张图不是通用真理，而是本章的待验证模型。${firstSentence(detail.thesis)} 如果输入、环境或责任边界改变，箭头也要重新检查。`;
}

function formalSection(ctx) {
  const { detail, slot, chapter, focus } = ctx;
  if (slot === 1 || chapter.lens === "derivation") {
    return `## 用公式审查“${chapter.title}”

${detail.formula}

逐个把符号放回真实任务，并检查：

${list(detail.formulaNotes)}

推导完成不代表结论成立。至少改变一次关键条件，观察 **${focus.name}** 的结论是否保持；若不保持，把条件写入“${chapter.outcome}”而不是藏在代码默认值里。`;
  }
  const rows = detail.formulaNotes.map((note, i) => [String(i + 1), `${note}；在“${chapter.title}”中必须显式核对`, detail.decisions[i % detail.decisions.length]]);
  return `## “${chapter.question}”依赖哪些前提

本章暂时不展开整套推导，但必须把判断拆成可以检查的前提：

| 顺序 | 必须成立的前提 | 对应控制 |
|---|---|---|
${table(rows)}

这四项共同约束“${chapter.question}”。任何一项只能靠猜测回答时，都应降低结论强度或补实验。`;
}

function evidenceSection(ctx) {
  const { detail, slot, chapter } = ctx;
  const fullIndex = slot === 0 ? 0 : slot === 2 ? 1 : -1;
  const summaries = detail.evidence.map((item, index) => {
    if (index === fullIndex) {
      return `### ${item.title}（${item.date}）

这项工作追问：${item.question}

${item.mechanism} ${item.result}

本章据此采用的判断是：**${item.contribution}** 但不能外推到：${item.limit}`;
    }
    return `### ${item.title}（${item.date}）

本章用它校准“${chapter.title}”的边界：${item.contribution}。**不要越过的边界：**${item.limit}`;
  }).join("\n\n");
  return `## 两份证据把“${chapter.title}”的边界画在哪里

${summaries}

两份来源若结论看似冲突，先比较任务定义、数据分布、资源预算和评价方法；不能只用发布日期或排行榜高低裁决。`;
}

function workedSection(ctx) {
  const { chapter, detail, slot, focus } = ctx;
  if (slot === 2 || chapter.lens === "case") {
    return `## 在“${detail.caseTitle}”中定位关键判断

${detail.case}

| 检查点 | 应留下的证据 | 不能接受的替代品 |
|---|---|---|
${table(detail.metrics.slice(0, 3).map((metric, i) => [detail.concepts[i % 3].name, `${metric[1]}，并写入${chapter.outcome}`, metric[2]]))}

案例不是为了模仿结论，而是为了练习定位：如果“${detail.failures[slot % detail.failures.length]}”发生，先查哪条数据或控制链，再决定继续、拒绝或交给人。`;
  }
  const selectedProtocol = detail.protocol[ctx.slot % detail.protocol.length];
  const selectedFailure = detail.failures[ctx.slot % detail.failures.length];
  const selectedMetric = detail.metrics[ctx.slot % detail.metrics.length];
  const steps = [
    ["冻结问题和验收", `把“${chapter.question}”写成输入、条件、基线和通过阈值，禁止实验后改题。`, "问题卡、数据/环境版本和预期失败"],
    ["执行本章关键动作", selectedProtocol, selectedMetric[1]],
    ["主动注入反例", `构造“${selectedFailure}”，验证评价或安全控制是否真的能发现。`, "触发输入、完整过程和系统响应"],
    ["比较并做决定", "把结果与两份来源的任务和边界对齐，决定继续、降级、拒绝或补证据。", `${chapter.outcome}及其适用范围`],
  ].map((step, i) => `### ${i + 1}. ${step[0]}

${step[1]}

- **必须保存：** ${step[2]}。
- **停止信号：** ${detail.failures[(ctx.slot + i) % detail.failures.length]}。`).join("\n\n");
  return `## 把“${chapter.title}”做成可重放实验

实验标题：**${chapter.outcome}**。不要同时追求完整系统，只要求输入可重放、判断可观测、失败可解释。

${steps}`;
}

function decisionSection(ctx) {
  const { detail, chapter } = ctx;
  const decisionIndexes = [ctx.slot, ctx.slot + 1].map((value) => value % detail.decisions.length);
  return `## “${chapter.outcome}”怎样进入真实系统

| 决定 | 验收依据 | 重新评审的信号 |
|---|---|---|
${table(decisionIndexes.map((i) => [detail.decisions[i], detail.metrics[i % detail.metrics.length][1], detail.failures[i % detail.failures.length]]))}

这些不是永久最佳实践，而是当前证据下的可逆决定。把决定、理由、适用范围和退出信号一起写进“${chapter.outcome}”，否则下一次改动只能重新争论。`;
}

function failureSection(ctx) {
  const { detail, focus } = ctx;
  const failureIndexes = [ctx.slot, ctx.slot + 2].map((value) => value % detail.failures.length);
  const clinics = failureIndexes.map((i) => `### ${detail.failures[i]}

先查看 **${detail.metrics[i % detail.metrics.length][0]}**：${detail.metrics[i % detail.metrics.length][1]}。如果证据确认失败，回到“${detail.decisions[i % detail.decisions.length]}”，保存触发输入、系统响应和人工处置，再把样本加入回归集。`).join("\n\n");
  return `## 当 ${focus.name} 失效，先查哪里

先排除这些看似合理的误解：${detail.misconceptions.join("；")}。

${clinics}

本章的边界不是一句“视情况而定”，而是能写进测试、监测或人工审核条件的触发器。`;
}

function transferSection(ctx) {
  const { detail, chapter } = ctx;
  return `## 把“${chapter.title}”迁移到新条件

围绕“${chapter.title}”完成如下变式：${detail.exercise}

提交“${chapter.outcome}”时同时附上：

1. 一个成功样本和一个失败样本；
2. 失败推翻了哪条假设，而不只是报错信息；
3. 哪项结论来自公开来源，哪项只来自你的本地实验；
4. 如果换数据、人群、环境或本体，最先需要重测什么；
5. 当前仍无法消除的残余风险。

<details class="ai-workbench">
<summary>让 AI 做反方审稿人</summary>

~~~~text
本次只审查“${chapter.title}”：${chapter.question} 预期产物是${chapter.outcome}。
${detail.prompt}

请额外指出：我的结论依赖哪些隐藏前提？给出一个最小反例和一个能推翻结论的实验。不要替我伪造实验结果或来源。
~~~~
</details>`;
}

function reasoningSection(ctx) {
  const { chapter, detail, focus, previousChapter, nextChapter } = ctx;
  return `## 沿着一条完整推理链走到底

### 第一步：固定要解释或改变的对象

不要用“整体效果更好”代替对象。把“${chapter.question}”改写为：在明确输入、时间点和约束下，观察什么量，比较什么基线，最后据此采取什么动作。

### 第二步：写出中间机制

${previousChapter ? `上一主题“${previousChapter.title}”提供前置条件` : "真实任务和边界提供前置条件"}，本章用 **${focus.name}** 解释关键机制，并把结果留在“${chapter.outcome}”中。${nextChapter ? `下一主题“${nextChapter.title}”只在这些证据成立后继续。` : "后续变化只在这些证据成立后继续。"} 只要中间任一环只能凭主观解释，结论就应降级为假设。

### 第三步：主动寻找反例

先尝试制造“${detail.failures[(ctx.slot + 2) % detail.failures.length]}”。如果当前方法仍给出看似正常的平均分，说明评价没有覆盖真正风险，需要补切片、过程指标或拒绝条件。

### 第四步：把结论写成可撤回决定

当前决定是“${detail.decisions[ctx.slot % detail.decisions.length]}”。同时写下适用条件、责任人和重新评审信号；这样新证据出现时能更新，而不是把旧结论当永久规则。

这条推理链最终必须落到 **${chapter.outcome}**。只有定义、机制、观察和决定互相对得上，文章内容才真正进入工作系统。`;
}

function readingSection(ctx) {
  const { chapter, detail } = ctx;
  const selected = detail.evidence[ctx.slot % detail.evidence.length];
  const rows = [[selected.title, `带着“${chapter.question}”阅读：${selected.mechanism}`, selected.limit]];
  return `## 怎样读本章来源，而不是收藏链接

| 阅读对象 | 带着什么问题读 | 读完不能声称什么 |
|---|---|---|
${table(rows)}

建议先读教材或标准中与 **${chapter.title}** 对应的定义和假设，再读论文的方法、比较基线与限制，最后回到自己的产物重做一次。阅读笔记只保留三类信息：改变了哪个判断、补了哪项实验、增加了哪条边界。不能改变这三项的摘抄暂不进入知识库。

本章的来源名称还包括：${chapter.sources.join("、")}。它们构成继续深挖的入口，不代表每一项都已被同等强度地验证。`;
}

function ending(ctx, cutoff) {
  const { field, chapter, detail } = ctx;
  const checks = [
    detail.quiz,
    { question: `学习“${chapter.title}”时，哪种做法最不可信？`, options: [detail.misconceptions[ctx.slot % detail.misconceptions.length], `完成${chapter.outcome}并保留反例`, "先冻结任务和评价口径"], answer: 0, explanation: `“${detail.misconceptions[ctx.slot % detail.misconceptions.length]}”忽略了本章的机制或边界。` },
    { question: `在“${chapter.title}”中观察到“${detail.failures[ctx.slot % detail.failures.length]}”，下一步是什么？`, options: ["只增加模型规模", `检查${detail.metrics[ctx.slot % detail.metrics.length][1]}并回到失败链`, "删除失败样本"], answer: 1, explanation: "失败必须沿可观测链归因，并沉淀为回归证据。" },
    { question: `什么最能证明你完成了“${chapter.title}”？`, options: ["收藏三篇论文", `交付${chapter.outcome}并说明适用条件与失败样本`, "得到一次成功截图"], answer: 1, explanation: "可检查产物、边界和失败样本共同构成掌握证据。" },
  ];
  const check = checks[ctx.slot];
  return `## 🎯 随堂检验

<Quiz question="${check.question}" :options='${JSON.stringify(check.options)}' :answer="${check.answer}" explanation="${check.explanation}" />

## 本章小结

- **问题：** ${chapter.question}
- **机制：** ${firstSentence(detail.thesis)}
- **产物：** ${chapter.outcome}
- **边界：** ${detail.mastery.boundary}

<div class="learning-brief">
  <p><strong>基础掌握：</strong>不看正文解释${detail.mastery.explain}，并能指出它与本章主题的关系。</p>
  <p><strong>真正会用：</strong>独立完成${chapter.outcome}，保留失败样本，并说明${detail.mastery.boundary}。</p>
</div>

<EvidenceTracker lesson="field-${field.slug}-${chapter.link.split("/").at(-1)}" />

${sourceNote(detail, cutoff)}`;
}

const orders = {
  orientation: [opening, conceptSection, relationSection, reasoningSection, formalSection, workedSection, evidenceSection, readingSection, decisionSection, failureSection, transferSection],
  concept: [opening, conceptSection, formalSection, reasoningSection, relationSection, evidenceSection, readingSection, workedSection, failureSection, decisionSection, transferSection],
  mechanism: [opening, relationSection, conceptSection, formalSection, reasoningSection, workedSection, evidenceSection, readingSection, failureSection, decisionSection, transferSection],
  derivation: [opening, formalSection, conceptSection, reasoningSection, relationSection, workedSection, evidenceSection, readingSection, failureSection, decisionSection, transferSection],
  guided: [opening, workedSection, conceptSection, reasoningSection, relationSection, formalSection, evidenceSection, readingSection, decisionSection, failureSection, transferSection],
  case: [opening, workedSection, relationSection, conceptSection, evidenceSection, reasoningSection, formalSection, readingSection, failureSection, decisionSection, transferSection],
  decision: [opening, decisionSection, conceptSection, formalSection, reasoningSection, workedSection, evidenceSection, readingSection, failureSection, relationSection, transferSection],
  frontier: [opening, evidenceSection, readingSection, conceptSection, relationSection, formalSection, reasoningSection, workedSection, decisionSection, failureSection, transferSection],
  synthesis: [opening, relationSection, workedSection, reasoningSection, conceptSection, decisionSection, evidenceSection, readingSection, formalSection, failureSection, transferSection],
};

export function renderCourseChapter(field, chapter, detail, cutoff, index) {
  const ctx = context(field, chapter, detail, index);
  const body = orders[chapter.lens].map((renderer) => renderer(ctx)).join("\n\n");
  return `${header(field, chapter, detail, cutoff)}\n\n${body}\n\n${ending(ctx, cutoff)}\n`;
}
