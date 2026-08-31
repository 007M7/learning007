import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderLearningChapter } from "./article-renderers.mjs";

const root = resolve("docs", "fields");
const list = (items) => items.map((item) => `- ${item}`).join("\n");
const numbered = (items) => items.map((item, index) => `${index + 1}. ${item}`).join("\n");

function sourceNote(sources, cutoff) {
  return `<div class="source-note">资料核验至 ${cutoff}：${sources.map(({ label, url }) => `<a href="${url}">${label}</a>`).join("、")}。涉及新模型、法规或标准时，请按链接中的版本和适用范围复核。</div>`;
}

function renderIndex(field, domain, cutoff) {
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

每章根据主题选择不同文体：入门概念从误解或故事进入，机制章节逐步推演，实战章节带你跟做，选型章节组织约束和比较，事故章节沿时间线复盘，前沿章节区分稳定机制与最新证据。它们都要完成“理解—应用—边界”闭环，但不共享一套正文目录。论文摘要、视频演示、运行截图和“我懂了”都不能单独证明掌握。

## 贯穿项目

${field.project}

最终验收至少包括：

${list(domain.projectCriteria)}

## 开始方式

先看 [学习路线与知识图谱](./roadmap)，再进入 [${active.text}](${active.link})。若前置不足，只补阻塞当前实验的最小知识，不把学习变成无限准备。

${sourceNote(domain.overviewSources, cutoff)}
`;
}

function renderRoadmap(field, domain, cutoff) {
  const rows = field.chapters.map((item, index) => `| ${index + 1}—${index + 2} | ${item.ids.join("—")} | ${item.text.replace(/^\d+ · /, "")} | ${item.outcome} |`).join("\n");
  const graph = field.chapters.map((item, index) => {
    const node = `C${index + 1}[${item.ids.join("—")} ${item.text.replace(/^\d+ · /, "")}]`;
    return index ? `C${index} --> ${node}` : node;
  }).join("\n  ");
  return `# ${field.title}学习路线与知识图谱

> 默认 20 周，每周三次、每次 45—60 分钟。时间不足时缩小实验，不删除解释、应用和边界证据。

## 依赖图

~~~~mermaid
flowchart TD
  ${graph}
~~~~

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

function renderEvidence(field, domain, cutoff) {
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
    writeFileSync(resolve(root, `${chapter.link.replace("/fields/", "")}.md`), renderLearningChapter(field, chapter, domain.details[index], cutoff, index));
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

每个领域固定 10 章、30 节点。文章会在概念启蒙、原理深挖、跟做实战、决策选型、案例复盘和前沿综合六种文体间切换；共同保留的是可观察目标、可靠来源、动手应用、失败边界、自测和掌握证据，而不是一组机械重复的标题。写作规则见 [教学文章写作指南](/TEACHING-WRITING-GUIDE)。

## 防止再次陷入“接触很多但不深入”

完整地图允许一次看全，但每个领域只激活首章 3 个节点；六个领域也不建议同时开学。当前最合理的用法是选一个与真实项目最接近的领域，完成首章作品后再决定继续、暂停或切换。暂停会保留恢复点，不视为失败。

## 跨领域关系

~~~~mermaid
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
~~~~

机器学习提供数据、泛化和因果基础；深度学习提供表示与基础模型；NLP 研究语言特有的数据与评价；AI 产品经理把能力转化为价值和治理；低空与机器人把推断带入不可随意回滚的物理世界。
`);
}
