const list = (items) => items.map((item) => `- ${item}`).join("\n");
const numbered = (items) => items.map((item, index) => `${index + 1}. ${item}`).join("\n");
const table = (rows) => rows.map((row) => `| ${row.join(" | ")} |`).join("\n");

const plans = {
  "machine-learning": ["concept", "case", "mechanism", "decision", "guided", "mechanism", "decision", "case", "frontier", "synthesis"],
  "deep-learning": ["guided", "mechanism", "concept", "decision", "synthesis", "case", "mechanism", "frontier", "decision", "synthesis"],
  nlp: ["concept", "guided", "mechanism", "decision", "synthesis", "guided", "case", "frontier", "decision", "synthesis"],
  "ai-product": ["case", "guided", "decision", "guided", "case", "concept", "decision", "case", "synthesis", "frontier"],
  "low-altitude": ["decision", "mechanism", "decision", "case", "guided", "mechanism", "case", "guided", "frontier", "synthesis"],
  robotics: ["guided", "mechanism", "guided", "case", "guided", "case", "mechanism", "frontier", "case", "synthesis"],
};

const layouts = {
  concept: ["opening", "concepts", "mechanism", "formal", "evidence", "case", "practice", "boundaries"],
  mechanism: ["opening", "concepts", "mechanism", "formal", "case", "evidence", "practice", "metrics", "decisions", "boundaries"],
  guided: ["opening", "case", "mechanism", "practice", "metrics", "formal", "evidence", "transfer", "decisions", "boundaries"],
  decision: ["opening", "concepts", "mechanism", "formal", "metrics", "evidence", "case", "practice", "boundaries", "decisions"],
  case: ["opening", "mechanism", "concepts", "formal", "evidence", "practice", "metrics", "decisions", "boundaries", "transfer"],
  frontier: ["opening", "concepts", "mechanism", "evidence", "formal", "case", "decisions", "boundaries", "practice", "metrics"],
  synthesis: ["opening", "concepts", "mechanism", "case", "formal", "evidence", "practice", "metrics", "decisions", "boundaries", "transfer"],
};

const labels = {
  concept: {
    opening: "从一个容易答错的问题开始",
    concepts: "先把三个角色认清",
    formal: "公式真正暴露了哪些假设",
    evidence: "真实研究怎样修正这个直觉",
    practice: "跟做一遍",
  },
  mechanism: {
    opening: "表面现象背后，究竟是谁在起作用",
    concepts: "三个变量，不是三个并列名词",
    formal: "从直觉走到形式化",
    evidence: "两份证据把边界画在哪里",
    practice: "用小实验拆开因果链",
  },
  guided: {
    opening: "这次只练一件事",
    formal: "为什么这些步骤能够解释结果",
    evidence: "拿公开证据校准你的实验",
    practice: "跟我走一遍",
    transfer: "轮到你：换一组条件再做",
  },
  decision: {
    opening: "先别问谁最好，先问你在优化什么",
    concepts: "把选择拆成三条判断轴",
    formal: "不要让一个分数替你做决定",
    evidence: "不要只看宣传：两份可核验依据",
    practice: "做一次公平对照",
  },
  case: {
    opening: "先还原现场",
    concepts: "三个关键判断点",
    formal: "用形式化检查隐藏假设",
    evidence: "外部证据能排除哪些误判",
    practice: "如果由你接手，先做哪四步",
    transfer: "把复盘迁移到新场景",
  },
  frontier: {
    opening: "旧办法卡在了哪里",
    concepts: "现在真正汇合的是哪三件事",
    formal: "稳定机制与新近结论的分界",
    evidence: "截至当前，证据能说到哪一步",
    practice: "建立自己的更新实验",
  },
  synthesis: {
    opening: "把问题放回完整系统",
    concepts: "局部能力怎样接成闭环",
    formal: "哪些量必须持续被测量",
    evidence: "真实系统为什么比一次演示更难",
    practice: "把运行方式写成可恢复的流程",
    transfer: "最后的迁移任务",
  },
};

function header(field, chapter, detail, cutoff) {
  return `# ${chapter.text}

> ${detail.thesis}

<div class="lesson-meta"><span>${chapter.ids.join("—")}</span><span>${detail.stage}</span><span>预计 ${detail.duration}</span><span>更新至 ${cutoff}</span></div>

<div class="learning-brief">
  <p><strong>现在学它，需要什么：</strong>${detail.prerequisite}</p>
  <p><strong>学完要能做到：</strong>${detail.goals.join("；")}。</p>
</div>`;
}

function sourceNote(sources, cutoff) {
  return `<div class="source-note">资料核验至 ${cutoff}：${sources.map(({ label, url }) => `<a href="${url}">${label}</a>`).join("、")}。涉及新模型、法规或标准时，请按链接中的版本和适用范围复核。</div>`;
}

function conceptsAsProse(detail) {
  return detail.concepts.map((item, index) => `### ${index + 1}. ${item.name}

${item.definition}。这里真正要支持的判断是：**${item.decision}**。

- **先排除的误解：** ${detail.misconceptions[index % detail.misconceptions.length]}
- **用反例检查：** ${detail.failures[index % detail.failures.length]}
- **理解检查：** 不看定义，用自己的项目举一个例子，再说明哪条观察会让这个例子不成立。`).join("\n\n");
}

function conceptsAsTable(detail, finalHeading) {
  return `| 知识节点 | 先用一句话说清 | ${finalHeading} | 先排除的误解 |
|---|---|---|---|
${table(detail.concepts.map((item, index) => [`${item.id} · ${item.name}`, item.definition, item.decision, detail.misconceptions[index % detail.misconceptions.length]]))}

读表时不要横向背三行。任选一行，把“定义—决定—反例”连成一句因果解释；然后把本章案例中的一个输入替换掉，检查原判断是否仍成立。`;
}

function conceptSection(type, detail) {
  const proseTypes = new Set(["concept", "case", "frontier"]);
  const body = proseTypes.has(type)
    ? conceptsAsProse(detail)
    : conceptsAsTable(detail, type === "decision" ? "什么时候值得选择它" : "它支持哪项决定");
  const title = type === "synthesis"
    ? `把 ${detail.concepts.map((item) => item.name).join("、")} 放在同一张图里`
    : labels[type].concepts;
  return `## ${title}\n\n${body}`;
}

function openingSection(type, chapter, detail) {
  if (type === "case") {
    return `## ${labels[type].opening}：${detail.caseTitle}

${detail.case}

先不要急着把结果归因给“模型不够强”。问自己：**${chapter.question}**

${detail.problem}`;
  }
  if (type === "guided") {
    return `## ${labels[type].opening}：${detail.exerciseTitle}

${detail.problem}

不要急着把整套系统做完。本章先用一个可重放的小任务回答：**${chapter.question}**`;
  }
  return `## ${labels[type].opening}

> ${chapter.question}

${detail.problem}`;
}

function mechanismSection(type, detail) {
  const title = type === "decision"
    ? `判断树：${detail.mechanismTitle}`
    : type === "frontier"
      ? `把变化连起来：${detail.mechanismTitle}`
      : detail.mechanismTitle;
  const lead = type === "case"
    ? `先沿数据流或控制流追一次。很多故障的最后一步很醒目，第一步却可能只是一个时间点、单位、权限或责任边界没有写清。\n\n`
    : "";
  return `## ${title}

${lead}${detail.mechanism}

~~~~mermaid
${detail.diagram}
~~~~`;
}

function formalSection(type, detail) {
  return `## ${labels[type].formal}

${detail.formula}

把每个符号放回真实系统。下面任何一项说不清，计算正确也不能保证结论正确：

${list(detail.formulaNotes)}`;
}

function evidenceSection(type, detail) {
  const leads = {
    concept: "这些来源不是让你记论文名，而是帮助区分哪些判断已有证据，哪些仍只是合理猜测。",
    mechanism: "好证据不仅告诉你某种方法有效，还会暴露比较基线、资源条件和不能迁移的部分。",
    guided: "不必复述整篇论文，但要检查自己的任务单位、基线、预算和运行边界是否与来源一致。",
    decision: "公开结果可以帮助设置基线，却不能替代你自己的数据、预算和失败代价。",
    case: "案例告诉我们发生了什么，研究与标准帮助判断哪些解释可迁移、哪些控制本应存在。",
    frontier: "发布日期较新不自动意味着证据等级更高。下面逐项看机制、结果和限制。",
    synthesis: "这些来源分别照亮闭环中的一段；拼在一起时，仍要保留各自的适用范围。",
  };
  const stories = detail.evidence.map((item, index) => `### ${item.title}（${item.date}）

${index === 0 ? "先看" : index === detail.evidence.length - 1 ? "最后看" : "接着看"}这份来源时，要带着一个具体问题：${item.question}

${item.mechanism} ${item.result} 因此，本章采用它来支持这样的判断：${item.contribution}

但它没有替我们回答所有问题。${item.limit}`).join("\n\n");
  return `## ${labels[type].evidence}\n\n${leads[type]}\n\n${stories}`;
}

function caseSection(type, detail) {
  if (type === "case") return "";
  const prefixes = {
    concept: "回到",
    mechanism: "把机制放进",
    guided: "示范任务",
    decision: "一次有约束的选择",
    frontier: "把前沿能力放回真实约束",
    synthesis: "从这里看完整闭环",
  };
  return `## ${prefixes[type]}：${detail.caseTitle}

${detail.case}

### 读案例时做三次停顿

1. 到 ${detail.concepts[0].name} 时停一次：${detail.concepts[0].decision}？
2. 到 ${detail.concepts[1].name} 时再停一次：哪条数据流、状态变化或约束能证明机制真的发生？
3. 到 ${detail.concepts[2].name} 时最后停一次：如果出现“${detail.failures[0]}”，系统应继续、拒绝还是交给人？`;
}

function aiWorkbench(detail, type) {
  const summaries = {
    concept: "让 AI 帮你审查问题，而不是替你宣布答案",
    mechanism: "用 AI 做机制反驳与实验审查",
    guided: "让 AI 扮演挑错的实验搭档",
    decision: "让 AI 生成候选，不让它跳过取舍",
    case: "让 AI 做一次无责复盘",
    frontier: "让 AI 同时寻找支持证据和反证",
    synthesis: "让 AI 检查闭环中缺失的责任和证据",
  };
  return `<details class="ai-workbench">
<summary>${summaries[type]}</summary>

~~~~text
${detail.prompt}
~~~~

先让 AI 复述任务、证据和禁止外推的范围，再接受它生成的方案。
</details>`;
}

function practiceSection(type, detail, hasTransfer) {
  const suffix = hasTransfer ? "" : `\n\n完成示范后再做一次变式：${detail.exercise}`;
  const walkthrough = detail.protocol.map((step, index) => {
    const concept = detail.concepts[index % detail.concepts.length];
    const metric = detail.metrics[index % detail.metrics.length];
    const failure = detail.failures[index % detail.failures.length];
    return `### 第 ${index + 1} 步：${step}

- **这一步在验证：** ${concept.name}能否支持“${concept.decision}”这项判断。
- **至少留下：** ${metric[1]}。
- **先停下来而不是继续调参的信号：** ${failure}。`;
  }).join("\n\n");
  return `## ${labels[type].practice}：${detail.exerciseTitle}

${walkthrough}${suffix}

${aiWorkbench(detail, type)}`;
}

function metricSection(detail) {
  const rows = detail.metrics.map((metric, index) => {
    const concept = detail.concepts[index % detail.concepts.length];
    return [`${metric[0]} · ${concept.name}`, metric[1], `${metric[2]}；本章还要据此判断：${concept.decision}`];
  });
  return `## 做到什么，才算结果可信

| 观察维度 | 要留下的记录 | 它防止你误判什么 |
|---|---|---|
${table(rows)}`;
}

function decisionSection(type, detail) {
  const titles = {
    mechanism: "实验结果怎样进入系统",
    guided: "验证通过后，项目要改变什么",
    decision: "证据改变时怎样重选",
    case: "防止下一次以同样方式发生",
    frontier: "今天可以采取的动作",
    synthesis: "哪些改变应沉淀为长期资产",
  };
  const decisions = detail.decisions.map((decision, index) => {
    const metric = detail.metrics[index % detail.metrics.length];
    const failure = detail.failures[index % detail.failures.length];
    return `### ${index + 1}. ${decision}

验收时查看 **${metric[0]}**，至少保存${metric[1]}。如果观察到“${failure}”，这项决定必须重新评审，不能因为已经实现就默认保留。`;
  }).join("\n\n");
  return `## ${titles[type]}\n\n${decisions}`;
}

function boundarySection(type, detail) {
  const titles = {
    concept: `别把“${detail.misconceptions[0]}”当成结论`,
    mechanism: "当假设被破坏，会先出现什么",
    guided: "卡住时先查这几处",
    decision: "什么信号会推翻当前选择",
    case: "仍需保留的残余风险",
    frontier: "仍然不能这样外推",
    synthesis: "系统最可能在哪些接缝处失效",
  };
  const misconceptions = type === "concept"
    ? `常见误区还包括：${detail.misconceptions.slice(1).join("；")}。\n\n`
    : `先排除这些误解：${detail.misconceptions.join("；")}。\n\n`;
  const failureClinic = detail.failures.map((failure, index) => {
    const metric = detail.metrics[index % detail.metrics.length];
    const decision = detail.decisions[index % detail.decisions.length];
    return `### ${failure}

- **先看什么：** ${metric[1]}
- **回到哪项控制：** ${decision}
- **怎样留下证据：** 保存触发条件、原始输入、系统响应和人工处置；修复后把同一样本加入“${detail.exerciseTitle}”的回归记录。`;
  }).join("\n\n");
  return `## ${titles[type]}

${misconceptions}${failureClinic}`;
}

function transferSection(type, detail) {
  return `## ${labels[type].transfer}：${detail.exerciseTitle}

${detail.exercise}

提交时一并回答：

- 你能否不看正文解释${detail.mastery.explain}；
- 产物是否真的包含${detail.mastery.apply}；
- 哪个失败样本暴露了${detail.mastery.boundary}；
- 如果换一个数据、人群、环境或本体，最先需要重测哪项指标。

提交物不能只有成功截图。附上一个失败样本，并说明它推翻了什么假设、哪些残余风险还不能消除。`;
}

function ending(field, chapter, detail, cutoff) {
  return `## 🎯 随堂检验

<Quiz question="${detail.quiz.question}" :options='${JSON.stringify(detail.quiz.options)}' :answer="${detail.quiz.answer}" explanation="${detail.quiz.explanation}" />

## 本章小结

${list(detail.summary)}

<div class="learning-brief">
  <p><strong>基础掌握：</strong>不看正文解释${detail.mastery.explain}，并完成${detail.mastery.apply}。</p>
  <p><strong>真正会用：</strong>换一个场景仍能指出${detail.mastery.boundary}，同时保留失败样本或拒绝条件。</p>
</div>

<EvidenceTracker lesson="field-${field.slug}-${chapter.link.split("/").at(-1)}" />

${sourceNote(detail.sources, cutoff)}`;
}

const sectionRenderers = {
  opening: ({ type, chapter, detail }) => openingSection(type, chapter, detail),
  concepts: ({ type, detail }) => conceptSection(type, detail),
  mechanism: ({ type, detail }) => mechanismSection(type, detail),
  formal: ({ type, detail }) => formalSection(type, detail),
  evidence: ({ type, detail }) => evidenceSection(type, detail),
  case: ({ type, detail }) => caseSection(type, detail),
  practice: ({ type, detail, hasTransfer }) => practiceSection(type, detail, hasTransfer),
  metrics: ({ detail }) => metricSection(detail),
  decisions: ({ type, detail }) => decisionSection(type, detail),
  boundaries: ({ type, detail }) => boundarySection(type, detail),
  transfer: ({ type, detail }) => transferSection(type, detail),
};

export function renderLearningChapter(field, chapter, detail, cutoff, index) {
  const type = plans[field.slug]?.[index] ?? "concept";
  const layout = layouts[type];
  const context = { type, chapter, detail, hasTransfer: layout.includes("transfer") };
  const body = layout.map((section) => sectionRenderers[section](context)).filter(Boolean).join("\n\n");
  return `${header(field, chapter, detail, cutoff)}\n\n${body}\n\n${ending(field, chapter, detail, cutoff)}\n`;
}
