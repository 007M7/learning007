import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve("docs");
const core = {
  software: ["01-programming", "02-runtime", "03-web-api", "04-data", "05-design", "06-architecture"],
  quality: ["01-strategy", "02-testing", "03-build", "04-delivery", "05-operations", "06-production"],
  ai: ["01-models", "02-context", "03-rag", "04-tools-mcp", "05-agent-runtime", "06-evals-safety"],
};
const advanced = {
  software: ["01-performance", "02-runtime-compiler", "03-kernel-ebpf", "04-distributed-consensus", "05-storage-streaming", "06-architecture-evolution"],
  quality: ["01-kubernetes-core", "02-kubernetes-operations", "03-iac-gitops", "04-performance-capacity", "05-chaos-sre", "06-platform-resilience"],
  ai: ["01-math-optimization", "02-transformer-training", "03-finetuning", "04-inference", "05-advanced-rag", "06-multi-agent"],
};
const frontierAgents = [
  "01-paradigm", "02-reasoning-planning", "03-tools-protocols", "04-memory-context", "05-computer-use",
  "06-coding-agents", "07-research-multi-agent", "08-agent-learning", "09-evaluation", "10-safety-governance",
];
const fieldDomains = ["machine-learning", "deep-learning", "nlp", "ai-product", "low-altitude", "robotics"];
const commonRequired = [
  "本章可观察目标", "会死在哪里", "与 AI 协作", "练习", "常见误区",
  "本章小结", "本章完成标准", "<EvidenceTracker", "source-note", "```mermaid",
];
const draftFieldRequired = [
  "🎯 随堂检验", "本章小结", "<Quiz", "<EvidenceTracker", "source-note",
  "learning-brief",
];
const formalFieldRequired = ["🎯 随堂检验", "<Quiz", "<EvidenceTracker", "## 参考资料"];
const forbiddenFieldHeadings = [
  "解锁与跳过", "本章可观察目标", "研究问题", "三个知识节点怎样连接",
  "证据拆解", "从论文或标准到产品主张：证据审计", "三轮实验与消融路线",
  "对产品、系统或研究架构的影响", "会死在哪里", "本章完成标准",
];
const failures = [];
const fieldPages = [];

function checkChapter(kind, domain, page) {
  const file = kind === "frontier"
    ? resolve(root, "frontier", "agents", `${page}.md`)
    : kind === "field"
      ? resolve(root, "fields", domain, `${page}.md`)
      : resolve(root, kind === "core" ? "domains" : "advanced", domain, `${page}.md`);
  if (!existsSync(file)) {
    failures.push(`缺少章节 ${file}`);
    return;
  }
  const source = readFileSync(file, "utf8");
  const relative = `${kind}/${domain}/${page}`;
  const isFieldDraft = kind === "field" && source.includes('class="draft-status"');
  const required = kind === "field"
    ? isFieldDraft ? draftFieldRequired : formalFieldRequired
    : commonRequired;
  for (const marker of required) {
    if (!source.includes(marker)) failures.push(`${relative} 缺少 ${marker}`);
  }
  if ((kind === "advanced" || kind === "frontier") && !source.includes("解锁与跳过")) failures.push(`${relative} 缺少解锁与跳过`);
  if (kind !== "field" && !source.includes("贯穿")) failures.push(`${relative} 缺少贯穿案例/故障`);

  if (kind === "frontier") {
    for (const marker of ["研究问题", "核心机制", "关键公式", "实验与指标", "真正贡献", "局限", "复现任务", "对产品架构的影响"]) {
      if (!source.includes(marker)) failures.push(`${relative} 论文拆解缺少 ${marker}`);
    }
  }
  if (kind === "field") {
    for (const heading of forbiddenFieldHeadings) {
      if (new RegExp(`^## ${heading}(?:$|：)`, "m").test(source)) failures.push(`${relative} 仍在使用旧报告标题：${heading}`);
    }
    if (isFieldDraft && detailHasInsufficientEvidence(source)) failures.push(`${relative} 至少需要两份可追溯来源，并在正文中说明适用边界`);
    fieldPages.push({ relative, source });
  }

  const h2Count = (source.match(/^## /gm) ?? []).length;
  const minChars = kind === "core" ? 3200 : kind === "frontier" ? 4700 : kind === "field" ? 4800 : 2700;
  // Heading count is only a readability guard. It must not stand in for a
  // chapter's reasoning structure: different topics need different shapes.
  const minH2 = kind === "field" ? 4 : kind === "frontier" ? 16 : kind === "core" ? 10 : 12;
  if (source.length < minChars) failures.push(`${relative} 正文过薄：${source.length} < ${minChars} 字符预警线`);
  if (h2Count < minH2) failures.push(`${relative} 缺少基本的长文导航：${h2Count} < ${minH2} 个二级部分`);
  if (kind === "field" && h2Count > 15) failures.push(`${relative} 二级部分过多：${h2Count} > 15，疑似重新堆叠报告目录`);
}

function detailHasInsufficientEvidence(source) {
  const urls = new Set(source.match(/https?:\/\/[^\s)"]+/g) ?? []);
  const datedClaims = source.match(/20\d{2}(?:-\d{2}-\d{2}| 年| 年\d{1,2}月)/g) ?? [];
  const hasBoundary = /不能|不等于|不适用|适用边界|仅适用于|不得外推|不能直接照搬/.test(source);
  return urls.size < 2 || datedClaims.length < 2 || !hasBoundary;
}

for (const [domain, pages] of Object.entries(core)) for (const page of pages) checkChapter("core", domain, page);
for (const [domain, pages] of Object.entries(advanced)) for (const page of pages) checkChapter("advanced", domain, page);
for (const page of frontierAgents) checkChapter("frontier", "agents", page);
for (const domain of fieldDomains) {
  const pages = readdirSync(resolve(root, "fields", domain))
    .filter((filename) => /^\d{2}-.*\.md$/.test(filename))
    .map((filename) => filename.replace(/\.md$/, ""))
    .sort();
  if (!pages.length) failures.push(`${domain} 至少需要一个独立主题章节`);
  for (const page of pages) checkChapter("field", domain, page);
}

const headingSignatures = new Map();
const openingStyles = new Map();
const repeatedParagraphs = new Map();
for (const page of fieldPages) {
  const headings = [...page.source.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  const signature = headings.join(" → ");
  if (!headingSignatures.has(signature)) headingSignatures.set(signature, []);
  headingSignatures.get(signature).push(page.relative);

  const domain = page.relative.split("/")[1];
  if (!openingStyles.has(domain)) openingStyles.set(domain, new Set());
  openingStyles.get(domain).add(headings[0]);

  for (const paragraph of page.source.split(/(?:\r?\n){2,}/)) {
    const normalized = paragraph.replace(/\s+/g, " ").trim();
    if (normalized.length < 140 || normalized.startsWith("<div class=\"")) continue;
    if (!repeatedParagraphs.has(normalized)) repeatedParagraphs.set(normalized, new Set());
    repeatedParagraphs.get(normalized).add(page.relative);
  }
}
for (const [signature, pages] of headingSignatures) {
  if (pages.length > 1) failures.push(`领域文章复用了完整标题模板：${pages.join("、")}；${signature}`);
}
for (const [domain, styles] of openingStyles) {
  if (styles.size < 4) failures.push(`${domain} 的开篇方式只有 ${styles.size} 种，至少需要 4 种教学文体`);
}
for (const [paragraph, pages] of repeatedParagraphs) {
  if (pages.size >= 3) failures.push(`领域文章重复长段落（${pages.size} 篇）：${paragraph.slice(0, 100)}…`);
}

for (let index = 1; index <= 6; index += 1) {
  const prefix = String(index).padStart(2, "0");
  const found = ["task-board", "task-runner", "rag-assistant", "tool-agent", "code-review", "learning-system"]
    .some((name) => existsSync(resolve(root, "cases", `${prefix}-${name}.md`)));
  if (!found) failures.push(`缺少案例 ${prefix}`);
}

const coreCurriculum = readFileSync(resolve(root, ".vitepress", "curriculum.ts"), "utf8");
for (const [prefix, expected] of [["SW", 16], ["Q", 16], ["AI", 19]]) {
  const ids = new Set([...coreCurriculum.matchAll(new RegExp(`"(${prefix}\\d{2})"`, "g"))].map((match) => match[1]));
  if (ids.size !== expected) failures.push(`${prefix} 核心节点应为 ${expected}，实际 ${ids.size}`);
}

const advancedCurriculum = readFileSync(resolve(root, ".vitepress", "advanced-curriculum.ts"), "utf8");
for (const [prefix, expected] of [["ASW", 18], ["AQ", 18], ["AAI", 18]]) {
  const ids = new Set([...advancedCurriculum.matchAll(new RegExp(`"(${prefix}\\d{2})"`, "g"))].map((match) => match[1]));
  if (ids.size !== expected) failures.push(`${prefix} 进阶节点应为 ${expected}，实际 ${ids.size}`);
}

const frontierCurriculum = readFileSync(resolve(root, ".vitepress", "agent-frontier.ts"), "utf8");
const frontierIds = new Set([...frontierCurriculum.matchAll(/"(AGF\d{2})"/g)].map((match) => match[1]));
if (frontierIds.size !== 30) failures.push(`AGF 强化节点应为 30，实际 ${frontierIds.size}`);
const frontierEvidence = readFileSync(resolve(root, "frontier", "agents", "evidence.md"), "utf8");
for (const marker of ["2026-08-30", "2023-08-31", "AgentJudgeBench", "2608.26623", "冲突证据", "更新触发器"]) {
  if (!frontierEvidence.includes(marker)) failures.push(`Agent 前沿证据库缺少 ${marker}`);
}

for (const domain of fieldDomains) {
  const evidence = readFileSync(resolve(root, "fields", domain, "evidence.md"), "utf8");
  for (const marker of ["2026-08-30", "冲突证据", "更新触发器", "来源准入规则"]) {
    if (!evidence.includes(marker)) failures.push(`${domain} 证据账本缺少 ${marker}`);
  }
}

if (failures.length) {
  console.error(`内容契约失败:\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(`内容契约通过：18 个核心章 / 51 节点，18 个进阶章 / 54 节点，10 个 Agent 前沿章 / 30 节点，${fieldPages.length} 个领域独立主题，6 个案例；领域文章至少 4800 字符，并通过文体多样性、标题签名、证据和重复长段落检查。` );
