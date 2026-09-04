import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { domains as curriculumDomains } from "../docs/.vitepress/curriculum.ts";
import { advancedDomains as advancedCurriculumDomains } from "../docs/.vitepress/advanced-curriculum.ts";
import { agentFrontierChapters } from "../docs/.vitepress/agent-frontier.ts";
import {
  aiLearningNodeChapters,
  aiLearningNodes,
} from "../docs/.vitepress/ai-learning-nodes.ts";

const root = resolve("docs");
const core = {
  software: ["01-programming", "02-runtime", "03-web-api", "04-data", "05-design", "06-architecture"],
  quality: ["01-strategy", "02-testing", "03-build", "04-delivery", "05-operations", "06-production"],
  ai: ["01-models", "02-context", "03-rag", "04-tools-mcp", "05-agent-runtime", "06-evals-safety", "07-safety-governance"],
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
const formalLearningRequired = [
  "<KnowledgeFlow", "🎯 随堂检验", "<Quiz", "<EvidenceTracker", "## 参考资料",
];
const legacyCoreRequired = [
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
const formalLearningPages = [];

function hasChapterSummary(source) {
  return /^##\s+本章小结(?:\s*$|[：: ·—-]\s*\S.+$)/m.test(source);
}

const aiLearningSupplements = [
  ["domains/ai", "stage-1-review", 5200],
  ["domains/ai", "stage-2-review", 5200],
  ["domains/ai", "stage-3-review", 5200],
  ["domains/ai", "summary", 6000],
  ["advanced/ai", "stage-1-review", 5200],
  ["advanced/ai", "stage-2-review", 5200],
  ["advanced/ai", "stage-3-review", 5200],
  ["advanced/ai", "summary", 6000],
  ["frontier/agents", "stage-1-review", 5200],
  ["frontier/agents", "stage-2-review", 5200],
  ["frontier/agents", "stage-3-review", 5200],
  ["frontier/agents", "stage-4-review", 5200],
  ["frontier/agents", "stage-5-review", 5200],
  ["frontier/agents", "summary", 6000],
];

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
  const usesFormalLearningContract = kind === "field" || domain === "ai" || kind === "frontier";
  const required = kind === "field" && isFieldDraft
    ? draftFieldRequired
    : kind === "field"
      ? formalFieldRequired
      : usesFormalLearningContract
        ? formalLearningRequired
        : legacyCoreRequired;
  for (const marker of required) {
    if (!source.includes(marker)) failures.push(`${relative} 缺少 ${marker}`);
  }
  const isFormalAiChapter = !isFieldDraft && (domain === "ai" || kind === "frontier");
  if (isFormalAiChapter && !hasChapterSummary(source)) {
    failures.push(`${relative} 缺少可识别的二级标题“本章小结”`);
  }
  if (kind === "field" || domain === "ai" || kind === "frontier") {
    for (const heading of forbiddenFieldHeadings) {
      if (new RegExp(`^## ${heading}(?:$|：)`, "m").test(source)) failures.push(`${relative} 仍在使用旧报告标题：${heading}`);
    }
    if ((isFieldDraft || domain === "ai" || kind === "frontier") && detailHasInsufficientEvidence(source)) {
      failures.push(`${relative} 至少需要两份可追溯来源，并在正文中说明适用边界`);
    }
  }

  if (!isFieldDraft && usesFormalLearningContract) {
    formalLearningPages.push({ relative, source, group: `${kind}/${domain}` });
  }

  const h2Count = (source.match(/^## /gm) ?? []).length;
  const hanCount = (source.match(/\p{Script=Han}/gu) ?? []).length;
  const minChars = usesFormalLearningContract
    ? kind === "field" && isFieldDraft ? 4200 : 4800
    : kind === "core" ? 3200 : 2700;
  // Heading count is only a readability guard. It must not stand in for a
  // chapter's reasoning structure: different topics need different shapes.
  const minH2 = 4;
  if (source.length < minChars) failures.push(`${relative} 正文过薄：${source.length} < ${minChars} 字符预警线`);
  if (kind === "frontier" && hanCount < 6000) failures.push(`${relative} 前沿正文密度不足：${hanCount} < 6000 个汉字`);
  if (h2Count < minH2) failures.push(`${relative} 缺少基本的长文导航：${h2Count} < ${minH2} 个二级部分`);
  if (!isFieldDraft && usesFormalLearningContract && h2Count > 15) {
    failures.push(`${relative} 二级部分过多：${h2Count} > 15，疑似重新堆叠报告目录`);
  }
}

function detailHasInsufficientEvidence(source) {
  const urls = new Set(source.match(/https?:\/\/[^\s)"]+/g) ?? []);
  const datedClaims = source.match(/20\d{2}(?:-\d{2}-\d{2}| 年| 年\d{1,2}月)/g) ?? [];
  const hasBoundary = /不能|不等于|不适用|适用边界|仅适用于|不得外推|不能直接照搬/.test(source);
  return urls.size < 2 || datedClaims.length < 2 || !hasBoundary;
}

function checkLearningSupplement(directory, page, minChars) {
  const file = resolve(root, directory, `${page}.md`);
  const relative = `${directory}/${page}`;
  if (!existsSync(file)) {
    failures.push(`缺少阶段复盘或板块总结 ${file}`);
    return;
  }
  const source = readFileSync(file, "utf8");
  for (const marker of formalLearningRequired) {
    if (!source.includes(marker)) failures.push(`${relative} 缺少 ${marker}`);
  }
  for (const heading of forbiddenFieldHeadings) {
    if (new RegExp(`^## ${heading}(?:$|：)`, "m").test(source)) failures.push(`${relative} 仍在使用旧报告标题：${heading}`);
  }
  if (detailHasInsufficientEvidence(source)) failures.push(`${relative} 至少需要两份可追溯来源，并说明采用与外推边界`);
  const h2Count = (source.match(/^## /gm) ?? []).length;
  const hanCount = (source.match(/\p{Script=Han}/gu) ?? []).length;
  if (source.length < minChars) failures.push(`${relative} 内容过薄：${source.length} < ${minChars} 字符预警线`);
  if (directory === "frontier/agents") {
    const minHan = page === "summary" ? 6000 : 5500;
    if (hanCount < minHan) failures.push(`${relative} 前沿复盘密度不足：${hanCount} < ${minHan} 个汉字`);
  }
  if (h2Count < 4 || h2Count > 15) failures.push(`${relative} 二级部分应保持 4—15 个，实际 ${h2Count}`);
}

for (const [domain, pages] of Object.entries(core)) for (const page of pages) checkChapter("core", domain, page);
for (const [domain, pages] of Object.entries(advanced)) for (const page of pages) checkChapter("advanced", domain, page);
for (const page of frontierAgents) checkChapter("frontier", "agents", page);
for (const [directory, page, minChars] of aiLearningSupplements) checkLearningSupplement(directory, page, minChars);
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
for (const page of formalLearningPages) {
  const headings = [...page.source.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  const signature = headings.join(" → ");
  if (!headingSignatures.has(signature)) headingSignatures.set(signature, []);
  headingSignatures.get(signature).push(page.relative);

  if (!openingStyles.has(page.group)) openingStyles.set(page.group, new Set());
  openingStyles.get(page.group).add(headings[0]);

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
for (const [group, styles] of openingStyles) {
  const pageCount = formalLearningPages.filter((page) => page.group === group).length;
  const expected = Math.min(4, pageCount);
  if (styles.size < expected) failures.push(`${group} 的开篇方式只有 ${styles.size} 种，至少需要 ${expected} 种教学文体`);
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
for (const [prefix, expected] of [["SW", 16], ["Q", 16]]) {
  const ids = new Set([...coreCurriculum.matchAll(new RegExp(`"(${prefix}\\d{2})"`, "g"))].map((match) => match[1]));
  if (ids.size !== expected) failures.push(`${prefix} 核心节点应为 ${expected}，实际 ${ids.size}`);
}

const advancedCurriculum = readFileSync(resolve(root, ".vitepress", "advanced-curriculum.ts"), "utf8");
for (const [prefix, expected] of [["ASW", 18], ["AQ", 18]]) {
  const ids = new Set([...advancedCurriculum.matchAll(new RegExp(`"(${prefix}\\d{2})"`, "g"))].map((match) => match[1]));
  if (ids.size !== expected) failures.push(`${prefix} 进阶节点应为 ${expected}，实际 ${ids.size}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizedContractValue(value) {
  return value.toLowerCase().replace(/[\s，。、“”‘’：:；;·—\-_/（）()]+/g, "");
}

function expectedNodeIds(prefix, count) {
  return Array.from({ length: count }, (_, index) => `${prefix}${String(index + 1).padStart(2, "0")}`);
}

function markdownFileForLink(link) {
  return resolve(root, `${link.replace(/^\//, "")}.md`);
}

const coreAiDomain = curriculumDomains.find((domain) => domain.key === "ai");
const advancedAiDomain = advancedCurriculumDomains.find((domain) => domain.key === "ai");
const aiRoutes = [
  {
    track: "core",
    expectedIds: expectedNodeIds("AI", 19),
    chapters: coreAiDomain?.chapters ?? [],
    declaredCount: coreAiDomain?.count ?? 0,
    indexFile: resolve(root, "domains", "ai", "index.md"),
  },
  {
    track: "advanced",
    expectedIds: expectedNodeIds("AAI", 18),
    chapters: advancedAiDomain?.chapters ?? [],
    declaredCount: advancedAiDomain?.count ?? 0,
    indexFile: resolve(root, "advanced", "ai", "index.md"),
  },
  {
    track: "frontier",
    expectedIds: expectedNodeIds("AGF", 30),
    chapters: agentFrontierChapters,
    declaredCount: agentFrontierChapters.reduce((sum, chapter) => sum + chapter.ids.length, 0),
    indexFile: resolve(root, "frontier", "agents", "index.md"),
  },
];

const allAiPageSources = new Map();
for (const chapter of aiLearningNodeChapters) {
  const file = markdownFileForLink(chapter.link);
  if (!existsSync(file)) {
    failures.push(`AI 节点契约映射到不存在的正文：${chapter.link}`);
    continue;
  }
  allAiPageSources.set(chapter.link, readFileSync(file, "utf8"));
}

const seenNodeIds = new Map();
const uniqueContractFields = new Map([
  ["title", new Map()],
  ["judgment", new Map()],
  ["artifact", new Map()],
]);

for (const route of aiRoutes) {
  const contractChapters = aiLearningNodeChapters.filter((chapter) => chapter.track === route.track);
  const contractNodes = aiLearningNodes.filter((node) => node.track === route.track);
  const routeIds = contractNodes.map((node) => node.id);
  const expectedSorted = [...route.expectedIds].sort();
  const actualSorted = [...new Set(routeIds)].sort();

  if (routeIds.length !== route.expectedIds.length || actualSorted.join("|") !== expectedSorted.join("|")) {
    failures.push(`${route.track} 节点契约应完整覆盖 ${route.expectedIds.join("、")}，实际为 ${actualSorted.join("、")}`);
  }
  if (route.declaredCount !== route.expectedIds.length) {
    failures.push(`${route.track} 导航声明 ${route.declaredCount} 个节点，应为 ${route.expectedIds.length}`);
  }

  const curriculumByLink = new Map(route.chapters.map((chapter) => [chapter.link, chapter]));
  const contractByLink = new Map(contractChapters.map((chapter) => [chapter.link, chapter]));
  if (curriculumByLink.size !== route.chapters.length) failures.push(`${route.track} curriculum 存在重复页面映射`);
  if (contractByLink.size !== contractChapters.length) failures.push(`${route.track} 节点契约存在重复页面映射`);
  const curriculumLinks = [...curriculumByLink.keys()].sort();
  const contractLinks = [...contractByLink.keys()].sort();
  if (curriculumLinks.join("|") !== contractLinks.join("|")) {
    failures.push(`${route.track} curriculum 与节点契约的页面集合不一致`);
  }

  for (const chapter of contractChapters) {
    if (chapter.nodes.length < 2 || chapter.nodes.length > 4) {
      failures.push(`${chapter.link} 应承接 2—4 个语义节点，实际 ${chapter.nodes.length}`);
    }
    const curriculumChapter = curriculumByLink.get(chapter.link);
    if (!curriculumChapter) continue;
    const contractIds = chapter.nodes.map((node) => node.id);
    if (curriculumChapter.ids.join("|") !== contractIds.join("|")) {
      failures.push(`${chapter.link} 的 curriculum ID 顺序与语义契约不一致`);
    }
    if (curriculumChapter.text !== chapter.chapterTitle) {
      failures.push(`${chapter.link} 的章节标题与语义契约不一致`);
    }

    const source = allAiPageSources.get(chapter.link);
    if (!source) continue;
    let previousMarkerPosition = -1;
    for (const node of chapter.nodes) {
      seenNodeIds.set(node.id, (seenNodeIds.get(node.id) ?? 0) + 1);
      const fields = [
        ["title", node.title, 4],
        ["judgment", node.judgment, 18],
        ["artifact", node.artifact, 12],
      ];
      for (const [fieldName, value, minimum] of fields) {
        if (!value.trim() || value.trim().length < minimum) {
          failures.push(`${node.id} 的 ${fieldName} 为空或过短，尚未形成教学含义`);
        }
        const normalized = normalizedContractValue(value);
        const fieldValues = uniqueContractFields.get(fieldName);
        if (fieldValues.has(normalized)) {
          failures.push(`${node.id} 与 ${fieldValues.get(normalized)} 的 ${fieldName} 重复`);
        } else {
          fieldValues.set(normalized, node.id);
        }
      }

      const marker = `<span id="${node.id.toLowerCase()}"></span>`;
      const markerCount = source.split(marker).length - 1;
      if (markerCount !== 1) failures.push(`${node.id} 在 ${chapter.link} 应有一个稳定锚点，实际 ${markerCount}`);
      const markerPosition = source.indexOf(marker);
      if (markerPosition <= previousMarkerPosition) failures.push(`${chapter.link} 的 ${node.id} 锚点顺序与学习节点顺序不一致`);
      previousMarkerPosition = markerPosition;

      const tracedHeading = new RegExp(`${escapeRegExp(marker)}\\s*##\\s+${escapeRegExp(node.section)}(?:\\r?\\n|$)`);
      if (!tracedHeading.test(source)) {
        failures.push(`${node.id} 锚点没有紧邻契约小节“${node.section}”`);
      }
      const heading = `## ${node.section}`;
      const headingCount = source.split(heading).length - 1;
      if (headingCount !== 1) failures.push(`${node.id} 的正文小节“${node.section}”应唯一，实际 ${headingCount}`);
      const headingPosition = source.indexOf(heading);
      if (headingPosition >= 0) {
        const nextHeadingPosition = source.indexOf("\n## ", headingPosition + heading.length);
        const sectionBody = source.slice(headingPosition + heading.length, nextHeadingPosition < 0 ? source.length : nextHeadingPosition);
        const sectionHanCount = (sectionBody.match(/\p{Script=Han}/gu) ?? []).length;
        if (sectionHanCount < 80) failures.push(`${node.id} 对应正文小节过薄：${sectionHanCount} < 80 个汉字`);
      }

      for (const [otherLink, otherSource] of allAiPageSources) {
        if (otherLink !== chapter.link && otherSource.includes(marker)) {
          failures.push(`${node.id} 锚点错误出现在 ${otherLink}`);
        }
      }
    }
  }

  const indexSource = existsSync(route.indexFile) ? readFileSync(route.indexFile, "utf8") : "";
  if (!indexSource.includes(`<LearningNodeCatalog track="${route.track}" />`)) {
    failures.push(`${route.track} 入口页缺少用户可见的节点契约目录`);
  }
}

for (const [id, count] of seenNodeIds) {
  if (count !== 1) failures.push(`${id} 在语义契约中应且只能出现一次，实际 ${count}`);
}
if (seenNodeIds.size !== 67) failures.push(`AI 三路线语义契约应为 67 个唯一节点，实际 ${seenNodeIds.size}`);

const allAnchorIds = [...allAiPageSources.values()]
  .flatMap((source) => [...source.matchAll(/<span id="((?:ai|aai|agf)\d{2})"><\/span>/g)].map((match) => match[1].toUpperCase()));
if (allAnchorIds.length !== 67 || new Set(allAnchorIds).size !== 67) {
  failures.push(`AI 三路线正文应有 67 个唯一节点锚点，实际 ${allAnchorIds.length} 个锚点 / ${new Set(allAnchorIds).size} 个唯一`);
}

const frontierEvidence = readFileSync(resolve(root, "frontier", "agents", "evidence.md"), "utf8");
for (const marker of ["2026-09-03", "2023-09-04", "AgentJudgeBench", "2608.26623", "冲突证据", "更新触发器"]) {
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
const fieldPageCount = formalLearningPages.filter((page) => page.relative.startsWith("field/")).length;
console.log(`内容契约通过：19 个核心章 / 51 节点，18 个进阶章 / 54 节点，10 个 Agent 前沿章 / 30 节点，14 个 AI 阶段复盘/板块总结，${fieldPageCount} 个领域独立主题，6 个案例；AI 三路线 67 个节点均具有唯一的标题、核心判断、可验证产物、页面映射与正文锚点，并通过文体多样性、标题签名、证据和重复长段落检查。` );
