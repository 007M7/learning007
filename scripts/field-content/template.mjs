import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve("docs", "fields");

const list = (items) => items.map((item) => `- ${item}`).join("\n");
const numbered = (items) => items.map((item, index) => `${index + 1}. ${item}`).join("\n");
const table = (rows) => rows.map((row) => `| ${row.join(" | ")} |`).join("\n");

function sourceNote(sources, cutoff) {
  return `<div class="source-note">主要来源（证据截止 ${cutoff}）：${sources.map(({ label, url }) => `<a href="${url}">${label}</a>`).join("、")}。数字只描述来源中的实验设置；标准、法规与产品能力均按页面版本和适用范围解释。</div>`;
}

export function renderChapter(field, chapter, detail, cutoff) {
  const ids = chapter.ids.join("—");
  const concepts = table(detail.concepts.map((item) => [item.id, item.name, item.definition, item.decision]));
  const auditRows = table(detail.evidence.map((item) => [item.date, item.title, item.question, item.limit]));
  const evidence = detail.evidence.map((item, index) => `## 证据拆解${index + 1}：${item.title}

### 研究问题

${item.question}

### 核心机制、实验与指标

${item.mechanism}

${item.result}

### 真正贡献、局限与适用边界

${item.contribution} ${item.limit}
`).join("\n");

  return `# ${chapter.text}

> 一句话点题：${detail.thesis}

<div class="lesson-meta"><span>${ids}</span><span>${detail.stage}</span><span>预计 ${detail.duration}</span><span>证据截止 ${cutoff}</span></div>

## 解锁与跳过

${detail.prerequisite} 即使你使用 AI 完成实现，也不能跳过本章的变量定义、反例和评测设计；这些部分决定你是否有能力发现一个“运行正常但结论错误”的系统。

## 本章可观察目标

完成后你能：${detail.goals.join("；")}。阅读完成不计掌握；至少需要一次不看答案的解释、一次实际应用和一次边界判断。

## 研究问题：${chapter.question}

${detail.problem}

问题必须被写成“输入、状态、动作/输出、损失、约束、证据和停止条件”的组合。只写“提升效果”会把数据、算法、交互与业务结果混在一起，也无法设计反事实或消融。

## 三个知识节点怎样连接

| 节点 | 核心对象 | 最小充分解释 | 必须支持的决策 |
|---|---|---|---|
${concepts}

三者不是并列名词：第一个节点通常建立对象和假设，第二个节点解释机制，第三个节点把机制放进测量或交付边界。缺任何一层，都容易把局部指标误当成系统结论。

## 核心机制：${detail.mechanismTitle}

${detail.mechanism}

理解机制时要区分三种量：**被设计者直接控制的变量**、**环境或数据生成过程决定的变量**、**只能通过代理指标观测的潜变量**。可靠实验一次只改变主要因子，其余配置进入版本化运行记录。

## 关键公式、假设与推导

${detail.formula}

公式不是装饰。逐项检查：

${list(detail.formulaNotes)}

若假设不成立，正确做法不是继续套公式，而是换估计量、改采样/实验设计、缩小结论或明确拒绝自动决策。

${evidence}
## 从论文或标准到产品主张：证据审计

| 日期 | 一手来源 | 它真正回答的问题 | 不能据此外推什么 |
|---|---|---|---|
${auditRows}

阅读来源时按四步记录：先抄下研究对象、比较基线、数据/场景和预算，再定位结果表或正式条文；随后区分作者直接观察、由结果支持的解释和你准备迁移到项目的推论；最后为推论写一个能推翻它的反例。**来源新并不等于证据强**：预印本、公司技术报告、正式标准、法规和独立复现承担的证明责任不同。数字必须连同分母、置信区间、硬件/本体、语言/人群与失败样本一起保存。

如果来源只证明组件指标改善，不得自动升级成端到端任务、真实用户价值、物理安全或合规结论。迁移到自己的项目时至少保留一个原方法基线、一个更简单基线和一个不使用该能力的基线；结果冲突时，优先检查任务定义、样本污染、资源预算、评价器偏差和运行边界，而不是挑选最符合预期的一项。

## 机制图：从输入到可验证结果

\`\`\`mermaid
${detail.diagram}
\`\`\`

图中每条边都应能对应日志、数据版本、物理状态或人工记录；无法观测的边必须标为假设，不允许用模型的一段解释代替真实状态。

## 贯穿案例：${detail.caseTitle}

${detail.case}

案例的重点不是跑出最高分，而是保存“为什么选择这条路径”的证据：基线是什么、哪个假设最危险、失败怎样分层、什么条件触发降级或人工接管。

## 复现任务：最小因果链

${numbered(detail.protocol)}

复现不是成功运行作者代码。你必须固定数据/环境、预算和评价器，至少重复三次，报告均值、离散程度、失败样本和资源消耗；若只能跑一次，要把结论降级为演示证据。

## 三轮实验与消融路线

**第一轮：测量链校准。** 只运行最简单基线，检查输入单位、时间/坐标/权限、随机种子、日志和评价器。抽取成功与失败样本人工复核；若真值或测量本身不稳定，停止模型比较。输出必须能回答“同一次运行能否被另一人重放”。

**第二轮：机制消融。** 在同一数据、预算、硬件或运行条件下，一次只加入一个关键机制；对每次变化写预期影响、未变化项和失败阈值。除了主指标，还要检查最坏切片、过程约束、P95/P99、资源与人工成本。若提升只在一个方便切片出现，应缩小能力声明。

**第三轮：边界与迁移。** 有计划地改变本章公式假设或 ODD：时间、人群、语言、对象、气象、本体、延迟、权限或供应商至少选择两项；注入缺失、冲突和失效。记录系统是正确拒绝/降级/接管，还是带着错误自信继续。最终产物不是“最佳分数”，而是一个可复核的能力范围、反例集和下一次变更会触发的回归集合。

## 实验与指标

| 维度 | 至少记录什么 | 为什么 |
|---|---|---|
${table(detail.metrics)}

同时保留一个简单基线和一个“什么都不做/人工流程”基线。复杂方案只有在质量、成本、时延、风险或可扩展性至少一个维度形成可重复净收益时才晋级。

## 对产品、系统或研究架构的影响

${list(detail.decisions)}

这些决策应进入 PRD、实验卡、接口契约、安全案例或 ADR，而不只留在学习笔记。模型、数据、提示、硬件、环境与评价器任何一个升级，都要能触发有范围的回归测试。

## 会死在哪里

${list(detail.failures)}

失败分析要写“触发条件—可观测信号—影响—检测—缓解—残余风险”。只写“模型可能出错”没有工程价值。

## 与 AI 协作模板

\`\`\`text
${detail.prompt}
\`\`\`

使用模板后仍需检查 AI 是否虚构来源、混用时间口径、悄悄改变任务定义，或把模拟结果外推到真实系统。

## 练习：${detail.exerciseTitle}

${detail.exercise}

提交物必须包含一个反例或失败样本。只有成功案例会让你误以为已经掌握；边界证据才能说明你知道方法何时不该用。

## 常见误区

${detail.misconceptions.join("；")}。共同根因是把一个条件成立时的局部结论，扩张成不带条件的能力判断。

## 自测

<Quiz question="${detail.quiz.question}" :options='${JSON.stringify(detail.quiz.options)}' :answer="${detail.quiz.answer}" explanation="${detail.quiz.explanation}" />

## 本章小结

${list(detail.summary)}

<EvidenceTracker lesson="field-${field.slug}-${chapter.link.split("/").at(-1)}" />

## 本章完成标准

不看正文解释 ${detail.mastery.explain}；完成 ${detail.mastery.apply}；能指出 ${detail.mastery.boundary}。最近相关题平均至少 7/10 才标记为 basic；跨日期完成变式任务并达到 8.5/10，才标记为 proficient。

${sourceNote(detail.sources, cutoff)}
`;
}

export function renderIndex(field, domain, cutoff) {
  const active = field.chapters[0];
  return `# ${field.title}深研路线

> 证据截止：**${cutoff}**。稳定基础不按年份淘汰；涉及模型能力、基准、标准、法规和产业状态的结论优先使用近三年一手来源，并保留发布日期与适用边界。

<div class="lesson-meta"><span>${field.prefix}01—${field.prefix}30</span><span>领域深研</span><span>10 章 / 30 节点</span><span>机制＋实验＋作品证据</span></div>

${field.promise}

## 知识地图

<FieldMap domain="${field.slug}" />

## 近期只激活 3 个节点

| 节点 | 可观察动作 | 完成证据 |
|---|---|---|
${active.ids.map((id, index) => `| ${id} ${domain.active[index].name} | ${domain.active[index].action} | ${domain.active[index].evidence} |`).join("\n")}

其余 27 个节点保持 locked/later。只有首章达到 basic，才按真实项目暴露的阻塞选择下一章；路线图是导航，不是同时展开的待办清单。

## 本领域的五条当前判断

${numbered(domain.frontierSignals)}

## 每章怎样学

每章都遵守同一个闭环：问题定义 → 机制与公式 → 一手证据拆解 → 贯穿案例 → 最小复现 → 失败边界 → 练习 → 自测 → 作品证据。论文摘要、视频演示、运行截图和“我懂了”都不能单独证明掌握。

## 贯穿项目

${field.project}

最终验收至少包括：

${list(domain.projectCriteria)}

## 开始方式

先看 [学习路线与知识图谱](./roadmap)，再进入 [${active.text}](${active.link})。若前置不足，只补阻塞当前实验的最小知识，不把学习变成无限准备。

${sourceNote(domain.overviewSources, cutoff)}
`;
}

export function renderRoadmap(field, domain, cutoff) {
  const rows = field.chapters.map((item, index) => `| ${index + 1}—${index + 2} | ${item.ids.join("—")} | ${item.text.replace(/^\d+ · /, "")} | ${item.outcome} |`).join("\n");
  const graph = field.chapters.map((item, index) => {
    const node = `C${index + 1}[${item.ids.join("—")} ${item.text.replace(/^\d+ · /, "")}]`;
    return index ? `C${index} --> ${node}` : node;
  }).join("\n  ");
  return `# ${field.title}学习路线与知识图谱

> 默认 20 周，每周三次、每次 45—60 分钟。时间不足时缩小实验，不删除解释、应用和边界证据。

## 依赖图

\`\`\`mermaid
flowchart TD
  ${graph}
\`\`\`

顺序表达的是阻塞前置，不是职业等级。你可以围绕项目跳到后续章，但需要先完成它依赖的概念检查和风险说明。

## 20 周主路线

| 周 | 节点 | 主题 | 最小产物 |
|---|---|---|---|
${rows}

## 三层掌握目标

- **认识**：能辨认术语、对象和输入输出，不计为完成。
- **basic**：不看答案解释机制，完成基础应用，最近证据平均至少 7/10。
- **proficient**：跨日期解决变式，说明适用条件与失败边界，最近证据平均至少 8.5/10。

## 项目驱动的分支规则

${list(domain.branchRules)}

## 复习节奏

新学或低分 1 天后复习；首次稳定通过 3 天；第二次 7 天；连续稳定 14 天；能迁移后 30 天。复习以主动回忆、反例和小型变式为主，不重读整章。

## 证据边界

路线版本的资料截止为 ${cutoff}。基础公式可能早于三年窗口；新近能力主张、法规与标准必须进入 [证据账本](./evidence)，并在更新时保留旧结论和冲突原因。
`;
}

export function renderEvidence(field, domain, cutoff) {
  const all = [...domain.ledger, ...domain.details.flatMap((detail) => detail.evidence.map((item) => ({
    date: item.date,
    label: item.title,
    url: item.url,
    supports: item.contribution,
    limit: item.limit,
  })))];
  const unique = [...new Map(all.map((item) => [item.url, item])).values()].sort((a, b) => a.date.localeCompare(b.date));
  return `# ${field.title}证据账本

> 当前版本核验日：**${cutoff}**。本页记录一手来源支持什么、不能推出什么，以及什么变化会触发课程更新。

## 来源准入规则

${list(domain.sourceRules)}

## 核心证据

| 日期 | 来源 | 本课程采用的证据 | 不外推到 |
|---|---|---|---|
${unique.map((item) => `| ${item.date} | [${item.label}](${item.url}) | ${item.supports} | ${item.limit} |`).join("\n")}

## 冲突证据

${domain.conflicts.map((item) => `### ${item.title}\n\n${item.body}`).join("\n\n")}

## 更新触发器

${list(domain.updateTriggers)}

## 版本解释

“新鲜”不等于只保留新论文。基础定理、经典算法和稳定标准作为机制前置；近三年材料负责修正能力边界、真实基准、实现条件与监管状态。预印本与厂商报告会明确标注，不能获得与独立复现、正式标准相同的证据权重。
`;
}

export function writeDomain(field, domain, cutoff) {
  const dir = resolve(root, field.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.md"), renderIndex(field, domain, cutoff));
  writeFileSync(resolve(dir, "roadmap.md"), renderRoadmap(field, domain, cutoff));
  writeFileSync(resolve(dir, "evidence.md"), renderEvidence(field, domain, cutoff));
  field.chapters.forEach((chapter, index) => {
    writeFileSync(resolve(root, `${chapter.link.replace("/fields/", "")}.md`), renderChapter(field, chapter, domain.details[index], cutoff));
  });
}

export function writeOverview(fields, cutoff) {
  mkdirSync(root, { recursive: true });
  writeFileSync(resolve(root, "index.md"), `# 领域深研学习库

> 当前证据截止：**${cutoff}**。这里新增的不是六份书单，而是六套可以长期维护、逐章学习、用作品验证的知识系统。

<div class="lesson-meta"><span>6 个领域</span><span>60 个完整章节</span><span>180 个知识节点</span><span>一手来源与持续更新</span></div>

## 六个领域

| 领域 | 学习承诺 | 贯穿项目 |
|---|---|---|
${fields.map((field) => `| [${field.title}](/fields/${field.slug}/) | ${field.promise} | ${field.project} |`).join("\n")}

## 共同课程合同

每个领域固定 10 章、30 节点；每章均包含可观察目标、机制、公式/形式化、至少两份一手证据拆解、实验指标、贯穿案例、复现任务、工程影响、失败边界、AI 协作模板、练习、自测与掌握标准。正文长度只是最低防偷懒门槛，不能替代内容特异性。

## 防止再次陷入“接触很多但不深入”

完整地图允许一次看全，但每个领域只激活首章 3 个节点；六个领域也不建议同时开学。当前最合理的用法是选一个与真实项目最接近的领域，完成首章作品后再决定继续、暂停或切换。暂停会保留恢复点，不视为失败。

## 跨领域关系

\`\`\`mermaid
flowchart LR
  ML[机器学习] --> DL[深度学习]
  DL --> NLP[NLP]
  ML --> PM[AI 产品经理]
  NLP --> PM
  DL --> LA[低空智能]
  DL --> RB[机器人]
  LA --> PA[物理 AI 安全与运行]
  RB --> PA
  PM --> PA
\`\`\`

机器学习提供数据、泛化和因果基础；深度学习提供表示与基础模型；NLP 研究语言特有的数据与评价；AI 产品经理把能力转化为价值和治理；低空与机器人把推断带入不可随意回滚的物理世界。
`);
}
